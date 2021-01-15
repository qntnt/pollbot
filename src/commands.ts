import { Message, MessageReaction, PartialUser, User } from 'discord.js'
import { Option, OptionKey, PollConfig, PollId, Vote } from './models'
import storage from './storage'
import moment from 'moment-timezone'
import { rankedPairs, showMatrix } from './voting/condorcet'
import * as votingInterfaces from './voting/interfaces'
import columnify from 'columnify'
import { computeResults, resultsSummary } from './voting'

export const POLLBOT_PREFIX = "pollbot"
export const CREATE_POLL_COMMAND = `${POLLBOT_PREFIX} poll`
export const CLOSE_POLL_COMMAND = `${POLLBOT_PREFIX} close`
export const POLL_RESULTS_COMMAND = `${POLLBOT_PREFIX} results`

export const POLL_ID_PREFIX = '> poll#'

export async function createPoll(message: Message) {
    const command = message.content.substring(
        CREATE_POLL_COMMAND.length,
        message.content.length
    ).trim()
    const topicEnd = command.indexOf('?') + 1
    if (!topicEnd) {
        return await createPollHelp(message)
    }
    const topic = command.substring(0, topicEnd)
    const optionsList = command.substring(topicEnd, command.length)
        .split(',')
        .map(o => o.trim())
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
    const pollMessage = await message.channel.send(
        `${POLL_ID_PREFIX}${poll.id}\n` +
        `> This poll closes at **${closesAt}**\n` +
        `> React to this message for me to DM you a ballot\n\n` +
        `**${poll.topic}**\n` +
        `${optionText}`
    )
    await pollMessage.react('👋')
}

async function createPollHelp(message: Message) {
    return await message.channel.send(
        `Create polls with this command format:\n` +
        `\`pollbot poll <topic>? <comma-separated options>\`\n\n` +
        `Example:\n` +
        `\`pollbot poll Best food? pizza, pasta, beets\``
    )
}

export async function closePoll(message: Message) {
    const pollId = message.content.substring(
        CLOSE_POLL_COMMAND.length,
        message.content.length
    ).trim()

    const poll = await storage.getPoll(pollId)
    if (!poll) {
        return await message.channel.send(`I couldn't find poll ${pollId}`)
    }
    const guild = await storage.getGuildData(poll.guildId)
    if (!guild) {
        return await message.channel.send(`This poll is missing server data. I can't close it now.`)
    }
    if (message.author.id !== poll.ownerId && message.author.id! in guild.admins) {
        return await message.channel.send(`You don't have permission to close this poll`)
    }
    const newPoll = storage.updatePoll(poll.id, {
        closesAt: moment().toDate()
    })
    await message.channel.send(`Poll ${poll.id} is now closed.`)
    const resultMessage = await message.channel.send('Computing results...')
    try {
        const ballots = await storage.listBallots(poll.id)
        const results = computeResults(poll, ballots)
        if (!results) {
            return await message.channel.send('There was an issue tabulating results')
        }
        const summary = resultsSummary(poll, results)
        return await resultMessage.edit(
            `Here are the results for poll ${poll.id}:\n` +
            `**${poll.topic}**\n` +
            summary
        )
    } catch {
        return await resultMessage.edit(`There was an issue computing results for poll ${poll.id}`)
    }
}

async function closePollHelp(message: Message) { }

export async function pollResults(message: Message) {
    const pollId = message.content.substring(
        POLL_RESULTS_COMMAND.length,
        message.content.length
    ).trim()

    const poll = await storage.getPoll(pollId)
    if (!poll) {
        return await message.channel.send(`Poll ${pollId} not found.`)
    }
    if (poll?.guildId !== message.guild?.id) {
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

async function pollResultsHelp(message: Message) { }

const POLL_EXPR = new RegExp(`^${POLL_ID_PREFIX}(.+)\n`)

function extractPollId(text: string | undefined): PollId | undefined {
    const m = text?.match(POLL_EXPR)
    if (!m || m.length < 2) return
    return m[1]
}

export async function createBallot(reaction: MessageReaction, user: User | PartialUser) {
    const pollId = extractPollId(reaction.message.content)
    if (!pollId) {
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

    const response = `${POLL_ID_PREFIX}${poll.id}\n` +
        `> Here's your ballot\n` +
        `> To vote, order the options from best to worst in a comma-separated list e.g. \`C,b,a,d\`\n` +
        `> _Invalid options will be ignored_\n` +
        `> _**Privacy notice**: Your user id and current user name is linked to your ballot. Your ballot is viewable by you and bot admins._\n\n` +
        `**${poll.topic}**\n` +
        '```\n' +
        `${optionText}` +
        '```'
    user.send(response)
}

export async function submitBallot(message: Message) {
    const limit = 50
    const history = await message.channel.messages.fetch({ limit })
    const lastBallotText = history.find(m => m.content.startsWith(POLL_ID_PREFIX))

    const pollId = extractPollId(lastBallotText?.content)
    if (!pollId) {
        return await message.channel.send(`Could not find a pollId in the last ${limit} messages`)
    }

    const poll = await storage.getPoll(pollId)
    if (!poll) {
        return await message.channel.send(`Could not find a poll with id ${pollId}`)
    }

    console.log(poll.closesAt)
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

    return message.channel.send(
        'I\'ve recorded your ballot.\n' +
        'Here\'s a summary of your votes:\n' +
        '```\n' +
        ' rank | key | option\n' +
        '====================\n' +
        summaryLines.join('\n') +
        '```'
    )
}

export async function help(message: Message) {
    message.channel.send('Commands: `poll`, `close`, `results`')
}
