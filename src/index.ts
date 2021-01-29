import * as Discord from 'discord.js'
import { DISCORD_TOKEN } from './settings'
import * as commands from './commands'
import storage from './storage'

const client = new Discord.Client()

client.on('ready', async () => {
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
        // Ignore bot messages
        if (message.author.id === client.user?.id) return

        if (message.channel.type === 'dm') {
            // Direct messages are votes
            return await commands.submitBallot(message)
        }

        if (message.channel.type !== 'text') return
        // Public channel commands
        if (!isCommand(message, commands.POLLBOT_PREFIX)) {
            return
        }
        if (isCommand(message, commands.CREATE_POLL_COMMAND)) {
            return await commands.createPoll(message)
        }
        if (isCommand(message, commands.CLOSE_POLL_COMMAND)) {
            return await commands.closePoll(message)
        }
        if (isCommand(message, commands.POLL_RESULTS_COMMAND)) {
            return await commands.pollResults(message)
        }
        if (isCommand(message, commands.AUDIT_POLL_COMMAND)) {
            return await commands.auditPoll(message)
        }
        return await commands.help(message)
    } catch {
        console.log('There was an error on message')
        return await message.channel.send('There was an unknown error with your command. Sorry about that.')
    }
})

client.on('messageReactionAdd', async (reaction, user) => {
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
            await commands.createBallot(reaction, user)
        }
    } catch {
        console.log('There was an error on reaction')
    }
})

client.login(DISCORD_TOKEN)
