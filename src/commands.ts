import { Client, ClientApplication, GuildMember, Message, MessageAttachment, MessageEmbed, MessageReaction, PartialUser, Team, TeamMember, User } from 'discord.js'
import moment from 'moment-timezone'
import { Option, OptionKey, Poll, PollConfig, PollId, Vote } from './models'
import storage from './storage'
import { computeResults, resultsSummary } from './voting'
import { showMatrix } from './voting/condorcet'
import { L, PREFIX } from './settings'

export const POLLBOT_PREFIX = PREFIX
export const CREATE_POLL_COMMAND = `${POLLBOT_PREFIX} poll`
export const CLOSE_POLL_COMMAND = `${POLLBOT_PREFIX} close`
export const POLL_RESULTS_COMMAND = `${POLLBOT_PREFIX} results`
export const AUDIT_POLL_COMMAND = `${POLLBOT_PREFIX} audit`

export const POLL_ID_PREFIX = 'poll#'


function isTeam(userTeam: User | Team | null | undefined): userTeam is Team {
        return userTeam !== undefined && (userTeam as Team).ownerID !== null
}

function isMessage(interaction: Interaction | undefined): interaction is Message {
    return interaction !== undefined && (interaction as Message).content !== undefined
}

type Interaction = Message | MessageReaction
type AnyUser = User | GuildMember | TeamMember | PartialUser
type BotOwner = User | Team
export class Context {
    private _client: Client
    private _application?: ClientApplication
    private _botOwner?: BotOwner
    private _interaction?: Interaction
    private _user?: AnyUser
    private _isInitialized: boolean

    constructor(
        client: Client,
        application?: ClientApplication,
        botOwner?: BotOwner,
        interaction?: Interaction,
        user?: AnyUser,
        isInitialized: boolean = false
    ) {
        this._client = client
        this._application = application
        this._botOwner = botOwner
        this._interaction = interaction
        this._user = user
        this._isInitialized = false
        if (isInitialized) this.init()
    }

    async init() {
        this._application = await this.fetchApplication()
        this._botOwner = await this.fetchOwner()
        this._isInitialized = true
    }

    withMessage(message: Message): Context {
        const user = message.channel.type === 'dm' ? message.author : message.member ?? message.author
        return new Context(
            this._client,
            this._application,
            this._botOwner,
            message,
            user,
            this._isInitialized,
        )
    }

    withMessageReaction(reaction: MessageReaction, user: AnyUser): Context {
        return new Context(
            this._client,
            this._application,
            this._botOwner,
            reaction,
            user,
            this._isInitialized,
        )
    }

    clone(
        interaction?: Interaction,
        user?: AnyUser,
        isInitialized: boolean = false
    ): Context {
        return new Context(
            this._client,
            this._application,
            this._botOwner,
            interaction,
            user,
            isInitialized,
        )
    }

    async client(): Promise<Client> {
        return this._client
    }

    async application(): Promise<ClientApplication> {
        return await this.fetchApplication()
    }

    get user(): AnyUser {
        if (this._user === undefined) throw 'Context user not defined'
        return this._user
    }

    async isBotOwner(user?: AnyUser | null): Promise<boolean>  {
        if (!user) return false
        const owner = await this.fetchOwner()
        if (owner) {
            if (isTeam(owner) && owner.members?.has(user.id) === true) {
                return true
            } else {
                return owner.id === user.id
            }
        } else {
            return false
        }
    }
    
    async checkPermissions(permissions: PollbotPermission[], poll?: Poll) {
        const hasPerm = (p: PollbotPermission) => permissions.indexOf(p) !== -1
        
        if (hasPerm('pollOwner') && poll?.ownerId === this.user.id) {
            return true
        }
        if (hasPerm('guildAdmin') && isGuildMember(this.user) && poll) {
            return this.user.hasPermission('ADMINISTRATOR') === true && this.user.guild.id === poll.guildId
        }
        if (hasPerm('botOwner') && this.isBotOwner(this.user)) {
            return true
        }
        if (hasPerm('pollGuild')) {
            isMessage(this._interaction)
            return poll?.guildId
        }
        throw `Missing permissions ${permissions}`
    }

    private async fetchApplication(): Promise<ClientApplication> {
        if (this._application === undefined) {
            const client = await this.client()
            this._application = await client.fetchApplication()
        }
        return this._application
    }

    private async fetchOwner(): Promise<BotOwner | undefined> {
        if (this._botOwner) {
            return this._botOwner
        }
        const app = await this.application()
        this._botOwner = app.owner ?? undefined
        return this._botOwner
    }
}

export async function createPoll(ctx: Context, message: Message) {
    const command = message.content.substring(
        CREATE_POLL_COMMAND.length,
        message.content.length
    ).trim()
    const topicEnd = command.indexOf('?') + 1
    if (!topicEnd) {
        return await createPollHelp(message)
    }
    const topic = command.substring(0, topicEnd)
    if (topic === '?') {
        return message.channel.send(`You must specify a topic. Example: \`${CREATE_POLL_COMMAND} What is the best icecream flavor? chocolate, vanilla, mint chip\``)
    }
    const optionsList = command.substring(topicEnd, command.length)
        .split(',')
        .map(o => o.trim())
        .filter(o => o !== '')
    if (optionsList.length < 2) {
        return message.channel.send('You must specify at least two options in a poll.')
    }
    const options: Record<OptionKey, Option> = {}
    optionsList.forEach((o, i) => {
        const key = String.fromCharCode(97 + i)
        options[key] = o
    })
    if (!message.guild) {
        return
    }
    const pollConfig: PollConfig = {
        guildId: message.guild.id,
        ownerId: message.author.id,
        topic,
        options,
    }
    const poll = await storage.createPoll(pollConfig)
    if (!poll) {
        return await message.channel.send('I couldn\'t make this poll. Something went wrong.')
    }
    const closesAt = moment(poll.closesAt).tz('America/Los_Angeles').format('dddd, MMMM Do YYYY, h:mm zz')
    const optionText = Object.values(poll?.options).map(o => `\`${o}\``).join(', ')
    const pollMsgEmbed = new MessageEmbed({
        title: `${POLL_ID_PREFIX}${poll.id}`,
        description: `React to this message for me to DM you a ballot`,
    })
    .addField(poll.topic, optionText)
    .setFooter(`This poll closes at ${closesAt}`)
    const pollMessage = await message.channel.send(pollMsgEmbed)
    await pollMessage.react('👋')
}

async function createPollHelp(message: Message) {
    return await message.channel.send(
        `Create polls with this command format:\n` +
        `\`${CREATE_POLL_COMMAND} <topic>? <comma-separated options>\`\n\n` +
        `Example:\n` +
        `\`${CREATE_POLL_COMMAND} Best food? pizza, pasta, beets\``
    )
}

export async function closePoll(ctx: Context,  message: Message) {
    const pollId = message.content.substring(
        CLOSE_POLL_COMMAND.length,
        message.content.length
    ).trim()
    if (pollId === '') {
        return await closePollHelp(message)
    }
    const poll = await storage.getPoll(pollId)
    if (!poll) {
        return await message.channel.send(`I couldn't find poll ${pollId}`)
    }

    try {
        await ctx.checkPermissions(['botOwner', 'guildAdmin', 'pollOwner'], poll)
    } catch {
        return await message.channel.send(`You don't have permission to close this poll`)
    }
    const newPoll = storage.updatePoll(poll.id, {
        closesAt: moment().toDate()
    })
    const resultMessage = await message.channel.send(new MessageEmbed({
        description: 'Computing results...'
    }))
    try {
        const ballots = await storage.listBallots(poll.id)
        const results = computeResults(poll, ballots)
        if (!results) {
            return await message.channel.send('There was an issue tabulating results')
        }
        const summary = resultsSummary(poll, results)
        summary.setTitle(`${POLL_ID_PREFIX}${poll.id} is now closed.`)
        return await resultMessage.edit(summary)
    } catch {
        return await resultMessage.edit(`There was an issue computing results for poll ${poll.id}`)
    }
}

async function closePollHelp(message: Message) {
    return await message.channel.send(`Close polls with this command format:\n\`${CLOSE_POLL_COMMAND} <pollId>\``)
}

export async function pollResults(ctx: Context, message: Message) {
    const pollId = message.content.substring(
        POLL_RESULTS_COMMAND.length,
        message.content.length
    ).trim()

    if (pollId === '') {
        return await pollResultsHelp(message)
    }

    const poll = await storage.getPoll(pollId)
    if (!poll) {
        return await message.channel.send(`Poll ${pollId} not found.`)
    }
    try {
        ctx.checkPermissions([
            'botOwner', 
            'pollOwner', 
            'pollGuild', 
            'guildAdmin',
        ], poll)
    } catch {
        return await message.channel.send(`You can't view results for poll ${pollId} in this channel.`)
    }
    const ballots = await storage.listBallots(poll.id)
    const results = computeResults(poll, ballots)
    if (!results) {
        return await message.channel.send('There are no results yet')
    }

    const summary = resultsSummary(poll, results)
    return await message.channel.send(summary)
}

async function pollResultsHelp(message: Message) {
    return await message.channel.send(`View poll results with this command format:\n\`${POLL_RESULTS_COMMAND} <pollId>\``)
}

const POLL_EXPR = new RegExp(`^>?\s?${POLL_ID_PREFIX}(.+)`)

function extractPollId(text: string | undefined): PollId | undefined {
    const m = text?.match(POLL_EXPR)
    if (!m || m.length < 2) return
    return m[1]
}

function findPollId(message: Message): string | undefined {
    let pollId = extractPollId(message.content)
    if (pollId) return pollId
    pollId = extractPollId(message.embeds[0]?.title ?? undefined)
    return pollId
}

export async function createBallot(ctx: Context, reaction: MessageReaction, user: User | PartialUser) {
    const pollId = findPollId(reaction.message)
    if (!pollId) {
        L.d(`Couldn't find poll for new ballot: ${reaction.message.content.substring(0, POLL_ID_PREFIX.length)}`)
        return await user.send('There was an issue creating your ballot. Couldn\'t parse pollId')
    }
    const poll = await storage.getPoll(pollId)
    if (!poll) return await user.send('There was an issue creating your ballot. Couldn\'t find the poll')
    const ballot = await storage.createBallot({
        poll,
        userId: user.id,
        userName: user.username ?? '',
    })

    if (!ballot) {
        return await user.send('There was an issue creating your ballot.')
    }

    const optionText = Object.keys(poll.options).sort().map(key => `${key}| ${poll.options[key]}`).join('\n')
    const responseEmbed = new MessageEmbed({
        title: `${POLL_ID_PREFIX}${poll.id}`,
        description: `Here's your ballot.`,
    })
        .addField('Instructions', 
            `To vote, order the options from best to worst in a comma-separated list e.g. \`C,b,a,d\`\n` +
            `_Invalid options will be ignored_\n`)
        .addField(poll.topic, `\`\`\`\n${optionText}\n\`\`\``)
        .setFooter(`Privacy notice: Your user id and current user name is linked to your ballot. Your ballot is viewable by you and bot admins.\n\nballot#${ballot.id}`)
    user.send(responseEmbed)
}

export async function submitBallot(ctx: Context,  message: Message) {
    const limit = 50
    const history = await message.channel.messages.fetch({ limit })
    const lastBallotText = history.find(m => findPollId(m) !== undefined)
    if (!lastBallotText) {
        return await message.channel.send(`Could not find a pollId in the last ${limit} messages`)
    }

    if (message.content.toLowerCase().startsWith(POLLBOT_PREFIX)) {
        return await message.channel.send('DMs are for submitting ballots. Manage polls in public channels.')
    }

    const pollId = findPollId(lastBallotText)
    if (!pollId) {
        return await message.channel.send(`Could not find a pollId in the last ${limit} messages`)
    }

    const poll = await storage.getPoll(pollId)
    if (!poll) {
        return await message.channel.send(`Could not find a poll with id ${pollId}`)
    }

    if (poll.closesAt < moment().toDate()) {
        return await message.channel.send(`Poll ${poll.id} is closed.`)
    }

    const ballot = await storage.findBallot(pollId, message.author.id)
    if (!ballot) {
        return await message.channel.send(`I couldn't find a ballot for you on poll ${pollId}`)
    }

    const validOptionKeys = Object.keys(poll.options).sort()
    const voteKeys = message.content.trim().split(',')
        .map(key => key.trim())
    const validVoteKeys = voteKeys.filter(key => validOptionKeys.find((ok) => ok === key))
    const votes = validVoteKeys
        .reduce((acc, key, i) => {
            acc[key] = {
                option: poll.options[key],
                rank: i + 1
            }
            return acc
        }, {} as Record<OptionKey, Vote>)

    const updatedBallot = await storage.updateBallot(ballot.id, {
        updatedAt: moment().toDate(),
        votes,
    })
    if (!updatedBallot) {
        return await message.channel.send('There was a problem recording your ballot.')
    }

    const summaryLines = validOptionKeys.map(key => ` ${votes[key] ? votes[key].rank : '_'}    | ${key}   | ${poll.options[key]}`)
    summaryLines.sort()

    const responseEmbed = new MessageEmbed({
        description: `I've recorded your ballot.`
    })
    .addField('Vote summary', `\`\`\``+
        ' rank | key | option\n' +
        '====================\n' +
        summaryLines.join('\n') +
        `\`\`\``)
        .setFooter(`${POLL_ID_PREFIX}${poll.id}\nballot#${ballot.id}`)
        .setTimestamp()

    return message.channel.send(responseEmbed)
}

export async function help(ctx: Context,  message: Message) {
    message.channel.send('Commands: `poll`, `close`, `results`, `audit`')
}

function toCSVRow(columns: string[], record: Record<string, string | number | undefined>): string {
    return columns.map(col => record[col]).join(',')
}

function toCSVRows(columns: string[], records: Record<string, string | number | undefined>[]) {
    return records.map(rec => toCSVRow(columns, rec)).join('\n')
}

function toCSV(columns: string[], records: Record<string, string | number | undefined>[]) {
    const header = columns.join(',')
    return [header, toCSVRows(columns, records)].join('\n')
}

type PollbotPermission = 'pollOwner'
    | 'botOwner'
    | 'guildAdmin'
    | 'pollGuild'

function isGuildMember(user?: AnyUser | null): user is GuildMember {
    if (user) {
        return (user as GuildMember).guild !== undefined
    }
    return false
}

function belongsToGuild(ctx: Context, poll: Poll, message: Message, bypassForBotOwner: boolean = true) {
    if (bypassForBotOwner && ctx.checkPermissions(['botOwner'])) return true
    return poll.guildId === message.guild?.id
}

export async function auditPoll(ctx: Context, message: Message) {
    const pollId = message.content.substring(
        AUDIT_POLL_COMMAND.length,
        message.content.length
    ).trim()

    if (pollId === '') {
        return await auditPollHelp(message)
    }

    const poll = await storage.getPoll(pollId)
    if (!poll) {
        return message.channel.send(`Poll ${pollId} not found.`)
    }
    if (!belongsToGuild(ctx, poll, message)) {
        return message.channel.send(`Poll ${pollId} does not belong to this server.`)
    }

    try {
        await ctx.checkPermissions(['botOwner', 'guildAdmin'], poll)
    } catch {
        return message.channel.send(`You are not an admin for this bot instance. Only admins may audit poll results and export ballot data.`)
    }

    const ballots = await storage.listBallots(poll.id)

    const results = computeResults(poll, ballots)
    if (!results) {
        return message.channel.send(`There was an issue computing results`)
    }
    const summary = resultsSummary(poll, results)
    const matrixSummary = showMatrix(results.matrix)
    await message.channel.send(summary)
    const matrixEmbed = new MessageEmbed()
        .addField('Pairwise Comparison Matrix', 
        'To read this, each value in a row shows who wins a matchup between candidates\n' +
        '```' +
        matrixSummary +
        '```')
    if (matrixEmbed.length <= 2000) {
        await message.channel.send(matrixEmbed)
    } else {
        await message.channel.send('Your poll has too many options to render a pairwise comparison matrix.')
    }

    const options = Object.values(poll.options).sort()
    const columns = ['ballotId', 'createdAt', 'updatedAt', 'userId', 'userName', ...options]
    const csvText = toCSV(columns, ballots.map(b => {
        const votes: Record<string, number | undefined> = {}
        Object.values(b.votes).forEach(v => {
            votes[v.option] = v.rank
        })
        return {
            ballotId: b.id,
            createdAt: moment(b.createdAt).toISOString(),
            updatedAt: moment(b.updatedAt).toISOString(),
            userId: b.userId,
            userName: b.userName,
            ...votes,
        }
    }))
    const csvBuffer = Buffer.from(csvText)
    const attachment = new MessageAttachment(csvBuffer, `poll_${poll.id}_votes.csv`)
    await message.author.send(attachment)
    await message.channel.send(new MessageEmbed({
        description: `I sent you a direct message with a \`.csv\` file that contains all ballot data for \`${POLL_ID_PREFIX}${poll.id}\`.`
    }))
}

async function auditPollHelp(message: Message) {
    return await message.channel.send(`Audit poll results with this command format:\n\`${AUDIT_POLL_COMMAND} <pollId>\``)
}
