import { ButtonInteraction, CommandInteraction, GuildMember, Message, MessageActionRow, MessageAttachment, MessageButton, MessageEditOptions, MessageEmbed, MessageEmbedImage, MessageReaction, PartialMessage, PartialUser, Team, User } from 'discord.js'
import moment from 'moment-timezone'
import { Option, PollOptionKey, Poll, PollConfig, PollId, Vote, PollFeature,  } from './models'
import storage from './storage'
import { computeResults, resultsSummary } from './voting'
import { showMatrix } from './voting/condorcet'
import { L, PREFIX } from './settings'
import { reverseLookup } from './util/record'
import { DateTime } from 'luxon'
import { AnyUser, Context, Interaction } from './Context'

export const POLLBOT_PREFIX = PREFIX
export const CREATE_POLL_COMMAND = `${POLLBOT_PREFIX} poll`
export const CLOSE_POLL_COMMAND = `${POLLBOT_PREFIX} close`
export const POLL_RESULTS_COMMAND = `${POLLBOT_PREFIX} results`
export const AUDIT_POLL_COMMAND = `${POLLBOT_PREFIX} audit`
export const ADD_POLL_FEATURES_COMMAND = `${POLLBOT_PREFIX} addFeatures`
export const REMOVE_POLL_FEATURES_COMMAND = `${POLLBOT_PREFIX} removeFeatures`
export const SET_POLL_PROPERTIES_COMMAND = `${POLLBOT_PREFIX} set`
export const DELETE_MY_USER_DATA_COMMAND = `${POLLBOT_PREFIX} deleteMyUserData`

export const POLL_ID_PREFIX = 'poll#'


export function isTeam(userTeam: User | Team | null | undefined): userTeam is Team {
        return userTeam !== undefined && (userTeam as Team).ownerId !== null
}

function simpleEmbed(title: string, description?: string) {
    return new MessageEmbed({
        title,
        description,
    })
}

function simpleSendable(title: string, description?: string) {
    return {
        embeds: [
            simpleEmbed(title, description)
        ],
    }
}

function embedSendable(embed: MessageEmbed) {
    return {
        embeds: [ embed ]
    }
}

export async function createPoll(
    _ctx: Context<CommandInteraction>, 
    topic: string, 
    optionsString: string,
    randomizedBallots: boolean,
    anytimeResults: boolean,
) {
    const ctx = await _ctx.defer()
    const optionsList = optionsString
        .split(',')
        .map(o => o.trim())
        .filter(o => o !== '')
    if (optionsList.length < 2) {
        return await ctx.editReply(simpleSendable(
            'You must specify at least two options in a poll.'
        ))
    }
    const options: Record<PollOptionKey, Option> = {}
    optionsList.forEach((o, i) => {
        const key = String.fromCharCode(97 + i)
        options[key] = o
    })
    if (!ctx.guild) {
        await ctx.editReply('Couldn\'t determine your server...')
        throw new Error('Couldn\'t determine guild...')
    }
    const features: PollFeature[] = []
    if (!randomizedBallots) {
        features.push('disableRandomizedBallots')
    }
    if (!anytimeResults) {
        features.push('disableAnytimeResults')
    }

    const pollConfig: PollConfig = {
        guildId: ctx.guild.id,
        ownerId: ctx.user.id,
        topic,
        options,
        features,
    }
    const poll = await storage.createPoll(pollConfig)
    if (!poll) {
        return await ctx.editReply(simpleSendable(
            'I couldn\'t make this poll. Something went wrong.'
        ))
    }
    const pollMsgEmbed = createPollEmbed(poll)
    const pollMessage = await ctx.editReply({
        embeds: [pollMsgEmbed],
        components: [
            new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId('request_ballot')
                        .setLabel('Request Ballot')
                        .setStyle('PRIMARY')
                )
        ]
    })
    poll.messageRef = {
        channelId: pollMessage.channelId,
        id: pollMessage.id
    }
    await storage.updatePoll(poll.id, poll)
}

function createPollEmbed(poll: Poll): MessageEmbed {
    const closesAt = moment(poll.closesAt).tz('America/Los_Angeles').format('dddd, MMMM Do YYYY, h:mm zz')
    const optionText = Object.values(poll?.options).map(o => `\`${o}\``).join(', ')
    return new MessageEmbed({
            title: `${POLL_ID_PREFIX}${poll.id}`,
            description: `React to this message for me to DM you a ballot`,
        })
        .addField(poll.topic, optionText)
        .setFooter(`This poll closes at ${closesAt}`)
}

export async function updatePoll(
    _ctx: Context<CommandInteraction>, 
    pollId: string, 
    topic?: string, 
    closesAt?: string, 
    randomizedBallots?: boolean,
    anytimeResults?: boolean,
) {
    const ctx = await _ctx.defer({ ephemeral: true })
    const poll = await storage.getPoll(pollId)
    if (!poll) {
        return await ctx.editReply({
            ...simpleSendable(`I couldn't find poll ${pollId}`),
            ephemeral: true,
        })
    }

    try {
        await ctx.checkPermissions(['botOwner', 'guildAdmin', 'pollOwner'], poll)
    } catch {
        return await ctx.editReply({...simpleSendable(`You don't have permission to edit this poll`), ephemeral: true})
    }

    let embed = new MessageEmbed({ description: `Poll#${poll.id} updated!`})
    if (topic) {
        poll.topic = topic
        embed = embed.addField('topic', topic)
    }
    if (closesAt) {
        const date = DateTime.fromISO(closesAt)
        poll.closesAt = date.toJSDate()
        embed = embed
            .setFooter('closes_at')
            .setTimestamp(date.toMillis())
    }
    if (randomizedBallots !== undefined) {
        if (!randomizedBallots) {
            addPollFeature(poll, 'disableRandomizedBallots')
            embed = embed.addField('randomized_ballots', 'disabled')
        } else {
            removePollFeature(poll, 'disableRandomizedBallots')
            embed = embed.addField('randomized_ballots', 'enabled')
        }
    }
    if (anytimeResults !== undefined) {
        if (anytimeResults) {
            removePollFeature(poll, 'disableAnytimeResults')
            embed = embed.addField('anytime_results', 'enabled')
        } else {
            addPollFeature(poll, 'disableAnytimeResults')
            embed = embed.addField('anytime_results', 'disabled')
        }
    }
    await storage.updatePoll(poll.id, poll)
    await updatePollMessage(ctx, poll, {
        embeds: [
            createPollEmbed(poll)
        ]
    })
    return ctx.editReply({
        embeds: [
            embed
        ],
        ephemeral: true,
    })
}

function addPollFeature(poll: Poll, feature: PollFeature) {
    if (!poll.features) {
        poll.features = [ feature ]
    } else {
        if (poll.features.indexOf(feature) === -1) {
            poll.features.push(feature)
        }
    }
}
function removePollFeature(poll: Poll, feature: PollFeature) {
    if (poll.features) {
        const i = poll.features.indexOf(feature)
        if (i !== -1) {
            poll.features.splice(i, 1)
        }
    }
}

async function updatePollMessage(ctx: Context, poll: Poll, options: MessageEditOptions) {
    if (!ctx.guild || !poll.messageRef) return
    const channel = await ctx.guild.channels.fetch(poll.messageRef.channelId)
    if (!channel?.isText()) return
    const message = await channel.messages.fetch(poll.messageRef.id)
    await message.edit(options)
}

export async function closePoll(_ctx: Context<Interaction>, pollId: string) {
    const ctx = await _ctx.defer()
    const poll = await storage.getPoll(pollId)
    if (!poll) {
        return await ctx.editReply(simpleSendable(`I couldn't find poll ${pollId}`))
    }

    try {
        await ctx.checkPermissions(['botOwner', 'guildAdmin', 'pollOwner'], poll)
    } catch {
        return await ctx.editReply(simpleSendable(`You don't have permission to close this poll`))
    }
    // Update poll closing time in background
    poll.closesAt = moment().toDate()
    await storage.updatePoll(poll.id, {
        closesAt: poll.closesAt
    })
    await updatePollMessage(ctx, poll, {
        embeds: [ createPollEmbed(poll) ]
    })
    try {
        const ballots = await storage.listBallots(poll.id)
        const results = computeResults(poll, ballots)
        if (!results) {
            return await ctx.editReply(simpleSendable(
                `${POLL_ID_PREFIX}${poll.id} is now closed. There are no results...`
            ))
        }
        const summary = resultsSummary(poll, results)
        summary.setTitle(`${POLL_ID_PREFIX}${poll.id} is now closed.`)
        return await ctx.editReply({
            embeds: [summary]
        })
    } catch(e) {
        L.d(e)
        return await ctx.editReply(`There was an issue computing results for poll ${poll.id}`)
    }
}

export async function pollResults(_ctx: Context<CommandInteraction>, pollId: string, ephemeral: boolean) {
    const ctx = await _ctx.defer({ ephemeral })
    const poll = await storage.getPoll(pollId)
    if (!poll) {
        return await ctx.editReply({
            ...simpleSendable(`Poll ${pollId} not found.`),
            ephemeral: true,
        })
    }
    try {
        await ctx.checkPermissions([
            'botOwner', 
            'pollOwner', 
            'pollGuild', 
            'guildAdmin',
        ], poll)
    } catch {
        return await ctx.editReply({
            ...simpleSendable(`You can't view results for poll ${pollId} in this channel.`),
            ephemeral: true,
        })
    }
    if (poll.features && poll.features.indexOf('disableAnytimeResults') !== -1) {
        if (poll.closesAt > moment().toDate()) {
            return await ctx.editReply({
                ...simpleSendable(`${POLL_ID_PREFIX}${pollId} has disabled anytime results and is not closed`),
                ephemeral: true,
            })
        }
    }
    const ballots = await storage.listBallots(poll.id)
    const results = computeResults(poll, ballots)
    if (!results) {
        return await ctx.editReply({
            ...simpleSendable(
                'There are no results yet'
            ),
            ephemeral,
        })
    }

    const summary = resultsSummary(poll, results)
    return await ctx.editReply({
        embeds: [summary],
        ephemeral,
    })
}

const POLL_EXPR = new RegExp(`^>?\\s?${POLL_ID_PREFIX}(.+)`)

function extractPollId(text: string | undefined): PollId | undefined {
    const m = text?.match(POLL_EXPR)
    if (!m || m.length < 2) return
    return m[1]
}

function findPollId(message: Message | PartialMessage): string | undefined {
    let pollId = extractPollId(message.content ?? '')
    if (pollId) return pollId
    pollId = extractPollId(message.embeds[0]?.title ?? undefined)
    return pollId
}

export async function createBallotFromButton(ctx: Context<ButtonInteraction>) {
    const user = ctx.interaction.user
    const message = await ctx.resolveMessage(ctx.interaction.message)
    const pollId = findPollId(message)
    if (!pollId) {
        L.d(`Couldn't find poll for new ballot: ${message.content?.substring(0, POLL_ID_PREFIX.length)}`)
        return await user.send(simpleSendable(
            'There was an issue creating your ballot',
            'Couldn\'t parse pollId'
        ))
    }
    const poll = await storage.getPoll(pollId)
    if (!poll) return await user.send(simpleSendable(
        'There was an issue creating your ballot',
        'Couldn\'t find the poll'
    ))

    if (poll.closesAt < moment().toDate()) {
        return await user.send(simpleSendable(`Poll ${poll.id} is closed.`))
    }

    let ballot = await storage.findBallot(poll.id, user.id)
    if (!ballot) {
        ballot = await storage.createBallot({
            poll,
            userId: user.id,
            userName: user.username ?? '',
        })
    }

    if (!ballot) {
        return await user.send(simpleSendable(
            'There was an issue creating your ballot.'
        ))
    }

    let optionText = ''
    const disableRandomizedBallots = poll.features?.includes('disableRandomizedBallots') ?? false
    const ballotOptionMapping = ballot.ballotOptionMapping
    if (ballotOptionMapping && !disableRandomizedBallots) {
        optionText = Object.keys(ballotOptionMapping).sort().map(ballotKey => {
            const pollOptionKey = ballotOptionMapping[ballotKey] ?? ''
            const pollOption = poll.options[pollOptionKey]
            return `${ballotKey}| ${pollOption}`
        }).join('\n')
    } else {
        optionText = Object.keys(poll.options).sort().map(key => `${key}| ${poll.options[key]}`).join('\n')
    }
    const responseEmbed = new MessageEmbed({
        title: `${POLL_ID_PREFIX}${poll.id}`,
        description: `Here's your ballot.`,
    })
        .setURL(message.url)
        .addField('Instructions', 
            `To vote, order the options from best to worst in a comma-separated list e.g. \`C,b,a,d\`\n` +
            `_Invalid options will be ignored_\n`)
        .addField(poll.topic, `\`\`\`\n${optionText}\n\`\`\``)
        .setFooter(`Privacy notice: Your user id and current user name is linked to your ballot. Your ballot is viewable by you and bot admins.\n\nballot#${ballot.id}`)
    const dm = await user.send({
        embeds: [responseEmbed]
    })
    await ctx.interaction.reply({
        embeds: [
            new MessageEmbed({
                title: "Here's your new ballot",
                url: dm.url,
            })
        ],
        ephemeral: true,
    })
}

export async function createBallot(ctx: Context<MessageReaction>, reaction: MessageReaction, user: User | PartialUser) {
    const pollId = findPollId(reaction.message)
    if (!pollId) {
        L.d(`Couldn't find poll for new ballot: ${reaction.message.content?.substring(0, POLL_ID_PREFIX.length)}`)
        return await user.send(simpleSendable(
            'There was an issue creating your ballot',
            'Couldn\'t parse pollId'
        ))
    }
    const poll = await storage.getPoll(pollId)
    if (!poll) return await user.send(simpleSendable(
        'There was an issue creating your ballot',
        'Couldn\'t find the poll'
    ))

    if (poll.closesAt < moment().toDate()) {
        return await user.send(simpleSendable(`Poll ${poll.id} is closed.`))
    }

    let ballot = await storage.findBallot(poll.id, user.id)
    if (!ballot) {
        ballot = await storage.createBallot({
            poll,
            userId: user.id,
            userName: user.username ?? '',
        })
    }

    if (!ballot) {
        return await user.send(simpleSendable(
            'There was an issue creating your ballot.'
        ))
    }

    let optionText = ''
    const disableRandomizedBallots = poll.features?.includes('disableRandomizedBallots') ?? false
    const ballotOptionMapping = ballot.ballotOptionMapping
    if (ballotOptionMapping && !disableRandomizedBallots) {
        optionText = Object.keys(ballotOptionMapping).sort().map(ballotKey => {
            const pollOptionKey = ballotOptionMapping[ballotKey] ?? ''
            const pollOption = poll.options[pollOptionKey]
            return `${ballotKey}| ${pollOption}`
        }).join('\n')
    } else {
        optionText = Object.keys(poll.options).sort().map(key => `${key}| ${poll.options[key]}`).join('\n')
    }
    const responseEmbed = new MessageEmbed({
        title: `${POLL_ID_PREFIX}${poll.id}`,
        description: `Here's your ballot.`,
    })
        .setURL(reaction.message.url)
        .addField('Instructions', 
            `To vote, order the options from best to worst in a comma-separated list e.g. \`C,b,a,d\`\n` +
            `_Invalid options will be ignored_\n`)
        .addField(poll.topic, `\`\`\`\n${optionText}\n\`\`\``)
        .setFooter(`Privacy notice: Your user id and current user name is linked to your ballot. Your ballot is viewable by you and bot admins.\n\nballot#${ballot.id}`)
    user.send({
        embeds: [responseEmbed]
    })
}

export async function submitBallot(ctx: Context<Message>,  message: Message) {
    const limit = 50
    const history = await message.channel.messages.fetch({ limit })
    const lastBallotText = history.find(m => findPollId(m) !== undefined)
    if (!lastBallotText) {
        return await message.channel.send(simpleSendable(
            `Could not find a pollId in the last ${limit} messages`
        ))
    }

    const messageContent = message.content.toLowerCase()
    if (messageContent.startsWith(POLLBOT_PREFIX)) {
        return await message.channel.send(simpleSendable(
            'DMs are for submitting ballots. Manage polls in public channels.'
        ))
    }

    const pollId = findPollId(lastBallotText)
    if (!pollId) {
        return await message.channel.send(simpleSendable(`Could not find a pollId in the last ${limit} messages`))
    }

    const poll = await storage.getPoll(pollId)
    if (!poll) {
        return await message.channel.send(simpleSendable(`Could not find a poll with id ${pollId}`))
    }

    if (poll.closesAt < moment().toDate()) {
        return await message.channel.send(simpleSendable(`Poll ${poll.id} is closed.`))
    }

    const ballot = await storage.findBallot(pollId, message.author.id)
    if (!ballot) {
        return await message.channel.send(simpleSendable(`I couldn't find a ballot for you on poll ${pollId}`))
    }

    const validOptionKeys = Object.keys(poll.options).sort()
    const voteKeys = messageContent.trim().split(',')
        .map(key => key.trim())
    const validVoteKeys = voteKeys.filter(key => validOptionKeys.find((ok) => ok === key))
    let votes: Record<PollOptionKey, Vote> = {}
    const disableRandomizedBallot = poll.features?.includes('disableRandomizedBallots') ?? false
    const ballotOptionMapping = ballot.ballotOptionMapping
    if (ballotOptionMapping && !disableRandomizedBallot) {
        votes = validVoteKeys
            .reduce((acc, ballotKey, i) => {
                const pollOptionKey = ballotOptionMapping[ballotKey]
                if (pollOptionKey) {
                    acc[pollOptionKey] = {
                        option: poll.options[pollOptionKey],
                        rank: i + 1
                    }
                }
                return acc
            }, {} as Record<PollOptionKey, Vote>)
    } else {
        votes = validVoteKeys
            .reduce((acc, pollOptionKey, i) => {
                acc[pollOptionKey] = {
                    option: poll.options[pollOptionKey],
                    rank: i + 1
                }
                return acc
            }, {} as Record<PollOptionKey, Vote>)
    }
    const updatedBallot = await storage.updateBallot(ballot.id, {
        updatedAt: moment().toDate(),
        votes,
    })
    if (!updatedBallot) {
        return await message.channel.send(simpleSendable(
            'There was a problem recording your ballot.'
        ))
    }

    let summaryLines = []
    if (ballotOptionMapping && !disableRandomizedBallot) {
        summaryLines = validOptionKeys.map(key => ` ${votes[key] ? votes[key].rank : '_'}    | ${reverseLookup(ballotOptionMapping, key)}   | ${poll.options[key]}`)
    } else {
        summaryLines = validOptionKeys.map(key => ` ${votes[key] ? votes[key].rank : '_'}    | ${key}   | ${poll.options[key]}`)
    }
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

    return message.channel.send({
        embeds: [responseEmbed]
    })
}

export async function help(ctx: Context<Message>,  message: Message) {
    message.channel.send({
        embeds: [
            new MessageEmbed({
                title: 'Pollbot help',
                description: `Type \`${POLLBOT_PREFIX} <command>\` to see detailed help information for each command.`
            })
                .addField('Example', `\`${CREATE_POLL_COMMAND}\` will give you information about how to create a poll.`)
                .addField(
                    'General Commands', 
                    '`poll` - Create a poll\n'
                    + '`results` - View current poll results\n'
                    + '`help` - View this help information'
                )
                .addField(
                    'Restricted Commands', 
                    '_These are privileged commands for poll owners, admins, and bot owners_\n'
                    + '`close` - Close a poll\n'
                    + '`audit` - Audit poll result and receive ballot information\n'
                    + '`set` - Update poll properties like the closing time and topic\n'
                    + '`addFeatures` - Add features to a poll\n'
                    + '`removeFeatures` - Remove features from a poll'
                )
                .addField(
                    'Destructive Commands',
                    '`deleteMyUserData` - Deletes **all** of your polls and ballots. This will affect polls that you\'ve voted on.'
                )
        ]
    })
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

export type PollbotPermission = 'pollOwner'
    | 'botOwner'
    | 'guildAdmin'
    | 'pollGuild'

export function isGuildMember(user?: AnyUser | null): user is GuildMember {
    if (user) {
        return (user as GuildMember).guild !== undefined
    }
    return false
}

async function belongsToGuild(ctx: Context, poll: Poll, bypassForBotOwner = true) {
    if (bypassForBotOwner && await ctx.checkPermissions(['botOwner'])) return true
    return poll.guildId === ctx.guild?.id
}

export async function auditPoll(_ctx: Context<CommandInteraction>, pollId: string) {
    const ctx = await _ctx.defer({ ephemeral: true })
    const poll = await storage.getPoll(pollId)
    if (!poll) {
        return ctx.editReply({
            ...simpleSendable(`Poll ${pollId} not found.`),
            ephemeral: true,
        })
    }
    if (!await belongsToGuild(ctx, poll)) {
        return ctx.editReply({
            ...simpleSendable(`Poll ${pollId} does not belong to this server.`),
            ephemeral: true,
        })
    }

    try {
        await ctx.checkPermissions(['botOwner', 'guildAdmin'], poll)
    } catch {
        return ctx.editReply({
            ...simpleSendable(
                `You are not an admin for this bot instance.`, 
                `Only admins may audit poll results and export ballot data.`
            ),
            ephemeral: true,
        })
    }

    const ballots = await storage.listBallots(poll.id)

    const results = computeResults(poll, ballots)
    if (!results) {
        return ctx.editReply({
            ...simpleSendable(`There was an issue computing results`),
            ephemeral: true,
        })
    }
    const summary = resultsSummary(poll, results)
    const matrixSummary = showMatrix(results.matrix)
    await ctx.editReply({
        embeds: [summary],
        ephemeral: true,
    })
    const matrixEmbed = new MessageEmbed({
        title: 'Pairwise Comparison Matrix',
        description: 
        'To read this, each value in a row shows who wins a matchup between candidates\n' +
        '```' +
        matrixSummary +
        '```'
    })
    if (matrixEmbed.length <= 2000) {
        await ctx.followUp({
            embeds: [matrixEmbed],
            ephemeral: true,
        })
    } else {
        await ctx.followUp({
            ...simpleSendable(
                'Your poll has too many options to render a pairwise comparison matrix.'
            ),
            ephemeral: true
        })
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

    await ctx.directMessage({
        embeds: [new MessageEmbed({ description: `Here's a file containing all ballot data for \`${POLL_ID_PREFIX}${poll.id}\``})],
        files: [attachment]
    })
    await ctx.followUp({
        embeds: [
            new MessageEmbed({
                description: `I sent you a direct message with a \`.csv\` file that contains all ballot data for \`${POLL_ID_PREFIX}${poll.id}\`.`
            })
        ],
        ephemeral: true,
    })
}

export async function deleteMyUserData(_ctx: Context<CommandInteraction>, user: User) {
    const ctx = await _ctx.defer({ ephemeral: true })
    if (ctx.user.id !== user.id) {
        return await ctx.editReply('The user does not match your account.')
    }

    await ctx.editReply({
        embeds: [
            new MessageEmbed({
                color: 'RED',
                description: 'Deleting your data...'
            })
        ],
    })
    try {
        const metrics = await storage.deleteUserData(ctx.user.id)
        await ctx.interaction.editReply({
            embeds: [
                new MessageEmbed({
                    color: 'RED',
                    description: `${metrics.numPolls} polls and ${metrics.numBallots} ballots were deleted.`
                })
            ],
        })
    } catch(e) {
        await ctx.interaction.editReply({
            embeds: [
                new MessageEmbed({
                    color: 'RED',
                    description: 'There was an issue while deleting your data. Please contact Pollbot support.'
                })
            ]
        })
    }
}
