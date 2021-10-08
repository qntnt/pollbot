import * as Discord from 'discord.js'
import { DISCORD_TOKEN, L } from './settings'
import * as commands from './commands'
import storage from './storage'

const client = new Discord.Client({
    intents: [
        'DIRECT_MESSAGES',
        'DIRECT_MESSAGE_REACTIONS',
        'GUILDS',
        'GUILD_MESSAGES',
        'GUILD_MESSAGE_REACTIONS',
    ]
})
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
    return message.content.toLowerCase().startsWith(command.toLowerCase())
}

client.on('message', async message => {
    try {
        const ctx = context.withMessage(message)
        // Ignore bot messages
        if (message.author.id === client.user?.id) return

        if (message.channel.type === 'DM') {
            // Direct messages are votes
            await commands.submitBallot(ctx, message)
            return
        }

        if (message.channel.type !== 'GUILD_TEXT') return
        // Public channel commands
        if (!isCommand(message, commands.POLLBOT_PREFIX)) {
            return
        }
        if (isCommand(message, commands.CREATE_POLL_COMMAND)) {
            await commands.createPoll(ctx, message)
            return
        }
        if (isCommand(message, commands.CLOSE_POLL_COMMAND)) {
            await commands.closePoll(ctx, message)
            return
        }
        if (isCommand(message, commands.POLL_RESULTS_COMMAND)) {
            await commands.pollResults(ctx, message)
            return
        }
        if (isCommand(message, commands.AUDIT_POLL_COMMAND)) {
            await commands.auditPoll(ctx, message)
            return
        }
        if (isCommand(message, commands.SET_POLL_PROPERTIES_COMMAND)) {
            await commands.setPollProperties(ctx, message)
            return
        }
        if (isCommand(message, commands.ADD_POLL_FEATURES_COMMAND)) {
            await commands.addPollFeatures(ctx, message)
            return
        }
        if (isCommand(message, commands.REMOVE_POLL_FEATURES_COMMAND)) {
            await commands.removePollFeatures(ctx, message)
            return
        }
        if (isCommand(message, commands.DELETE_MY_USER_DATA_COMMAND)) {
            await commands.deleteMyUserData(ctx, message)
            return
        }
        await commands.help(ctx, message)
        return
    } catch(e) {
        console.error(e)
        await message.channel.send('There was an unknown error with your command. Sorry about that.')
    }
},)

client.on('raw', async packet => {
    if (!['MESSAGE_REACTION_ADD'].includes(packet.t)) return
    // Grab the channel to check the message from
    const channel = (await client.channels.fetch(packet.d.channel_id)) as Discord.TextChannel
    // There's no need to emit if the message is cached, because the event will fire anyway for that
    if (channel.messages.cache.has(packet.d.message_id)) return
    // Since we have confirmed the message is not cached, let's fetch it
    const message = await channel.messages.fetch(packet.d.message_id)
    // Emojis can have identifiers of name:id format, so we have to account for that case as well
    const emoji = packet.d.emoji.id ? `${packet.d.emoji.name}:${packet.d.emoji.id}` : packet.d.emoji.name
    // This gives us the reaction we need to emit the event properly, in top of the message object
    const reaction = message.reactions.resolve(emoji)
    if (!reaction) return
    const user = await client.users.fetch(packet.d.user_id)
    // Adds the currently reacting user to the reaction's users collection.
    reaction.users.cache.set(packet.d.user_id, user)
    reaction.message = message
    // Check which type of event it is before emitting
    if (packet.t === 'MESSAGE_REACTION_ADD') {
        client.emit('messageReactionAdd', reaction, user)
    }
})

client.on('messageReactionAdd', async (reaction, user) => {
    const ctx = context.withMessageReaction(reaction as Discord.MessageReaction, user)
    try {
        if (!client.user?.id) {
            return
        }
        // DO NOT HANDLE POLLBOT REACTIONS
        if (user.id === client.user.id) {
            return
        }
        // ONLY HANDLE REACTIONS TO POLLBOT MESSAGES
        if (reaction.message?.author?.id !== client.user.id) {
            return
        }
        if (!user) {
            return
        }
        L.d(reaction.message.embeds[0]?.title)
        if (reaction.message.embeds[0]?.title?.startsWith(commands.POLL_ID_PREFIX) === true) {
            L.d('Creating ballot...')
            await commands.createBallot(ctx, reaction as Discord.MessageReaction, user)
            return
        }
        if (reaction.message.embeds[0]?.title === commands.DELETE_USER_DATA_CONFIRM_TITLE) {
            await commands.deleteMyUserDataConfirm(ctx, reaction as Discord.MessageReaction, user)
            return
        }
        L.d(`Couldn't find poll from reaction: ${reaction.emoji} on message ${reaction.message.id}...`)
    } catch {
        L.d('There was an error on reaction')
    }
})

client.login(DISCORD_TOKEN)
