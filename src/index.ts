import * as Discord from 'discord.js'
import { DISCORD_TOKEN } from './settings'
import * as commands from './commands'
import storage from './storage'

const client = new Discord.Client()
const context = new commands.Context(client)
context.init()

client.once('ready', async () => {
    console.log(`Logged in as ${client.user?.tag ?? 'undefined'}`)
})

client.on('guildCreate', async guild => {
    try {
        const guildData = await storage.getGuildData(guild.id)
        if (guildData) {
            return
        }
        await storage.createGuildData({
            id: guild.id,
            admins: {},
        })
    } catch {
        console.error('There was an error on guildCreate')
    }
})

client.on('guildDelete', async guild => {
    try {
        await storage.deleteGuildData(guild.id)
    } catch {
        console.error('There was an error on guildDelete')
    }
})

function isCommand(message: Discord.Message, command: string): boolean {
    return message.content.toLowerCase().startsWith(command)
}

client.on('message', async message => {
    try {
        const ctx = context.withMessage(message)
        // Ignore bot messages
        if (message.author.id === client.user?.id) return

        if (message.channel.type === 'dm') {
            // Direct messages are votes
            return await commands.submitBallot(ctx, message)
        }

        if (message.channel.type !== 'text') return
        // Public channel commands
        if (!isCommand(message, commands.POLLBOT_PREFIX)) {
            return
        }
        if (isCommand(message, commands.CREATE_POLL_COMMAND)) {
            return await commands.createPoll(ctx, message)
        }
        if (isCommand(message, commands.CLOSE_POLL_COMMAND)) {
            return await commands.closePoll(ctx, message)
        }
        if (isCommand(message, commands.POLL_RESULTS_COMMAND)) {
            return await commands.pollResults(ctx, message)
        }
        if (isCommand(message, commands.AUDIT_POLL_COMMAND)) {
            return await commands.auditPoll(ctx, message)
        }
        return await commands.help(ctx, message)
    } catch(e) {
        console.error(e)
        return await message.channel.send('There was an unknown error with your command. Sorry about that.')
    }
})

client.on('messageReactionAdd', async (reaction, user) => {
    const ctx = context.withMessageReaction(reaction, user)
    try {
        if (!client.user?.id) {
            return
        }
        if (user.id === client.user.id) {
            return
        }
        if (reaction.message.author.id !== client.user.id) {
            return
        }
        if (!user) {
            return
        }
        if (reaction.message.content.startsWith(commands.POLL_ID_PREFIX)) {
            await commands.createBallot(ctx, reaction, user)
        }
    } catch {
        console.log('There was an error on reaction')
    }
})

client.login(DISCORD_TOKEN)
