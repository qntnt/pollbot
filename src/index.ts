import * as Discord from 'discord.js'
import { DISCORD_TOKEN } from './settings'
import * as commands from './commands'
import storage from './storage'

const client = new Discord.Client()

storage.listGuildData().then((guildIds) => {
    client.guilds.cache.forEach(async g => {
        if (g.id! in guildIds) {
            await storage.createGuildData({
                id: g.id,
                admins: {},
            })
        }
    })
})

client.on('ready', async () => {
    console.log(`Logged in as ${client.user?.tag ?? 'undefined'}`)
})

client.on('guildCreate', async guild => {
    const guildData = await storage.getGuildData(guild.id)
    if (guildData) {
        return
    }
    await storage.createGuildData({
        id: guild.id,
        admins: {},
    })
})

client.on('guildDelete', async guild => {
    await storage.deleteGuildData(guild.id)
})

function isCommand(message: Discord.Message, command: string): boolean {
    return message.content.toLowerCase().startsWith(command)
}

client.on('message', async message => {
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
    return await commands.help(message)
})

client.on('messageReactionAdd', async (reaction, user) => {
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
})

client.login(DISCORD_TOKEN)
