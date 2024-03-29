import * as Discord from 'discord.js'
import { DISCORD_TOKEN, L } from './settings'
import * as commands from './commands'
import { AnySlashCommandBuilder, Context } from "./Context"
import storage from './storage'
import * as slashCommands from './slashCommands'
import { SlashCommandBuilder } from "@discordjs/builders"

const client = new Discord.Client({
    intents: [
        'DIRECT_MESSAGES',
        'DIRECT_MESSAGE_REACTIONS',
        'GUILDS',
        'GUILD_MESSAGES',
        'GUILD_MESSAGE_REACTIONS',
    ]
})
const context = new Context(client)
context.init()

slashCommands.registerCommands()

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

async function handleCommandInteraction(interaction: Discord.CommandInteraction) {
    const ctx = context.withCommandInteraction(interaction)
    try {
        switch (interaction.commandName) {
            case slashCommands.pollCommand.name:
                await pollCommand(ctx)
                break
            case slashCommands.pollCreateCommand.name:
                await pollCreate(ctx)
                break
            case slashCommands.pollResultsCommand.name:
                await pollResults(ctx)
                break
            case slashCommands.pollCloseCommand.name:
                await pollClose(ctx)
                break
            case slashCommands.pollAuditCommand.name:
                await pollAudit(ctx)
                break
            case slashCommands.pollUpdateCommand.name:
                await pollUpdate(ctx)
                break
            case slashCommands.helpCommand.name:
                await helpCommand(ctx)
                break
            case slashCommands.deleteMyUserDataCommand.name:
                const user = interaction.options.getUser('confirm_user', true)
                await commands.deleteMyUserData(ctx, user)
                break
        }
    } catch (e) {
        if (e instanceof Discord.DiscordAPIError) {
            if (e.code === 50001) {
                await ctx.followUp({
                    embeds: [
                        new Discord.MessageEmbed({
                            color: 'RED',
                            description: 'I don\'t have access to successfully complete your command. Please make sure that I\'m invited to relevant channels and that my permissions are correct.',
                        })
                    ],
                    ephemeral: true,
                })
                return
            }
        }
        console.error(e)
        const msg = {
            embeds: [
                new Discord.MessageEmbed({
                    color: 'RED',
                    description: 'There was an unknown error with your command. Sorry about that. Please reach out to [Pollbot support](https://discord.gg/uC2rkUyDdE) if there are further problems',
                })
            ],
            ephemeral: true,
        }
        await ctx.followUp(msg)
    }
}

async function handleButtonInteraction(interaction: Discord.ButtonInteraction) {
    const ctx = context.withButtonInteraction(interaction)
    switch (interaction.customId) {
        case 'request_ballot':
            await commands.createBallotFromButton(ctx)
            break
    }
}

client.on('interactionCreate', async interaction => {
    if (interaction.isCommand()) return await handleCommandInteraction(interaction)
    if (interaction.isButton()) return await handleButtonInteraction(interaction)
})

async function helpCommand(ctx: Context<Discord.CommandInteraction>) {
    const isPublic = ctx.interaction.options.getBoolean('public', false) ?? false
    const commandName = ctx.interaction.options.getString('command', false) ?? undefined
    if (commandName) {
        const command = slashCommands.matchCommand(commandName)
        if (command) {
            const embed = commands.commandHelp(command)
            await ctx.interaction.reply({
                embeds: [embed],
                ephemeral: !isPublic,
            })
        } else {
            await ctx.interaction.reply({
                embeds: [new Discord.MessageEmbed({
                    title: `Couldn\'t recognize the command \`${commandName}\``,
                })],
                ephemeral: true,
            })
        }
    } else {
        await ctx.interaction.reply({
            embeds: [commands.helpEmbed()],
            ephemeral: !isPublic,
        })
    }
}

async function pollCreate(ctx: Context<Discord.CommandInteraction>) {
    const interaction = ctx.interaction
    const topic = interaction.options.getString('topic', true)
    const optionsString = interaction.options.getString('options', true)
    const randomizedBallots = interaction.options.getBoolean('randomized_ballots') ?? true
    const anytimeResults = interaction.options.getBoolean('anytime_results') ?? true
    if (interaction.channel?.type !== 'GUILD_TEXT') return
    await commands.createPoll(ctx, topic, optionsString, randomizedBallots, anytimeResults)
}

async function pollResults(ctx: Context<Discord.CommandInteraction>) {
    const interaction = ctx.interaction
    const pollId = interaction.options.getString('poll_id', true)
    const _private = interaction.options.getBoolean('private') ?? false
    await commands.pollResults(ctx, pollId, _private)
}

async function pollClose(ctx: Context<Discord.CommandInteraction>) {
    const pollId = ctx.interaction.options.getString('poll_id', true)
    await commands.closePoll(ctx, pollId)
}

async function pollAudit(ctx: Context<Discord.CommandInteraction>) {
    const pollId = ctx.interaction.options.getString('poll_id', true)
    await commands.auditPoll(ctx, pollId)
}

async function pollUpdate(ctx: Context<Discord.CommandInteraction>) {
    const interaction = ctx.interaction
    const pollId = interaction.options.getString('poll_id', true)
    const topic = interaction.options.getString('topic') ?? undefined
    const closesAt = interaction.options.getString('closes_at') ?? undefined
    const randomizedBallots = interaction.options.getBoolean('randomized_ballots') ?? undefined
    const anytimeResults = interaction.options.getBoolean('anytime_results') ?? true
    await commands.updatePoll(ctx, pollId, topic, closesAt, randomizedBallots, anytimeResults)
}

async function replyObsolete(interaction: Discord.CommandInteraction, newCommand: AnySlashCommandBuilder) {
    const subcommand = interaction.options.getSubcommand()
    await interaction.reply({
        embeds: [
            new Discord.MessageEmbed({
                title: `\`/${interaction.commandName}${subcommand ? ' ' + subcommand : ''}\` is obsolete.`,
                description: `Use \`/${newCommand.name}\` instead.`,
                color: 'YELLOW',
                footer: { text: 'This slash command will be removed after June 10th 2022.' }
            })
                .addField('Why?', 'Discord now supports slash command permissions. They don\'t support permissions for sub-commands yet, so this migration will give you more control over how you configure pollbot.')
                .addField('Do I need to do anything?', 'If you just want to use pollbot as you have before, no action is necessary. Just use the new top-level commands instead of the old sub-commands.')
                .addField('How do I update slash command permissions?', 'Go to your server settings. On the sidebar, click `Integrations`. Under "Bots and Apps", click `pollbot`. Under "Commands", modify command permissions. If the new slash commands don\'t show up for you, try reinviting pollbot to your server by clicking on it\'s profile and clicking the `Add to Server` button.')
        ],
        ephemeral: true,
    })
}

async function pollCommand(ctx: Context<Discord.CommandInteraction>) {
    const interaction = ctx.interaction
    const subcommand = interaction.options.getSubcommand()
    if (subcommand === 'create') {
        await replyObsolete(interaction, slashCommands.pollCreateCommand)
    }
    else if (subcommand === 'close') {
        await replyObsolete(interaction, slashCommands.pollCloseCommand)
    }
    else if (subcommand === 'results') {
        await replyObsolete(interaction, slashCommands.pollResultsCommand)
    }
    else if (subcommand === 'audit') {
        await replyObsolete(interaction, slashCommands.pollAuditCommand)
    }
    else if (subcommand === 'update') {
        await replyObsolete(interaction, slashCommands.pollUpdateCommand)
    }
}

client.on('messageCreate', async message => {
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
            await ctx.replyOrEdit('This command is obsolete. Please use the slash command `/poll create`. If slash commands aren\'t available, have a server admin re-invite pollbot to your server.')
            return
        }
        if (isCommand(message, commands.CLOSE_POLL_COMMAND)) {
            await ctx.replyOrEdit('This command is obsolete. Please use the slash command `/poll close`. If slash commands aren\'t available, have a server admin re-invite pollbot to your server.')
            return
        }
        if (isCommand(message, commands.POLL_RESULTS_COMMAND)) {
            await ctx.replyOrEdit('This command is obsolete. Please use the slash command `/poll results`. If slash commands aren\'t available, have a server admin re-invite pollbot to your server.')
            return
        }
        if (isCommand(message, commands.AUDIT_POLL_COMMAND)) {
            await ctx.replyOrEdit('This command is obsolete. Please use the slash command `/poll audit`. If slash commands aren\'t available, have a server admin re-invite pollbot to your server.')
            return
        }
        if (isCommand(message, commands.SET_POLL_PROPERTIES_COMMAND)) {
            await ctx.replyOrEdit('This command is obsolete. Please use the slash command `/poll update`. If slash commands aren\'t available, have a server admin re-invite pollbot to your server.')
            return
        }
        if (isCommand(message, commands.ADD_POLL_FEATURES_COMMAND)) {
            await ctx.replyOrEdit('This command is obsolete. Please use the slash command `/poll update`. If slash commands aren\'t available, have a server admin re-invite pollbot to your server.')
            return
        }
        if (isCommand(message, commands.REMOVE_POLL_FEATURES_COMMAND)) {
            await ctx.replyOrEdit('This command is obsolete. Please use the slash command `/poll update`. If slash commands aren\'t available, have a server admin re-invite pollbot to your server.')
            return
        }
        if (isCommand(message, commands.DELETE_MY_USER_DATA_COMMAND)) {
            await ctx.replyOrEdit('This command is obsolete. Please use the slash command `/delete_my_user_data`. If slash commands aren\'t available, have a server admin re-invite pollbot to your server.')
            return
        }
        await commands.help(ctx, message)
        return
    } catch (e) {
        if (e instanceof Discord.DiscordAPIError) {
            if (e.code === 50001) {
                await message.channel.send({
                    embeds: [
                        new Discord.MessageEmbed({
                            color: 'RED',
                            description: 'I don\'t have access to successfully complete your command. Please make sure that I\'m invited to relevant channels and that my permissions are correct.',
                        })
                    ],
                })
                return
            }
        }
        console.error(e)
        const msg = {
            embeds: [
                new Discord.MessageEmbed({
                    color: 'RED',
                    description: 'There was an unknown error with your command. Sorry about that. Please reach out to [Pollbot support](https://discord.gg/uC2rkUyDdE) if there are further problems',
                })
            ],
        }
        await message.channel.send(msg)
    }
})

client.on('raw', async packet => {
    try {
        if (!['MESSAGE_REACTION_ADD'].includes(packet.t)) return
        if (!client.user?.id) {
            return
        }
        // DO NOT HANDLE POLLBOT REACTIONS
        if (packet.d.user_id === client.user.id) {
            return
        }
        // Grab the channel to check the message from
        const cachedChannel = client.channels.cache.get(packet.d.channel_id)
        const channel = (cachedChannel ? cachedChannel : (await client.channels.fetch(packet.d.channel_id))) as Discord.TextChannel
        // There's no need to emit if the message is cached, because the event will fire anyway for that
        if (channel.messages.cache.has(packet.d.message_id)) return
        // Since we have confirmed the message is not cached, let's fetch it
        let message
        try {
            message = await channel.messages.fetch(packet.d.message_id)
        } catch (e: any) {
            L.d(e)
            return
        }
        // Emojis can have identifiers of name:id format, so we have to account for that case as well
        const emoji = packet.d.emoji.id ? `${packet.d.emoji.name}:${packet.d.emoji.id}` : packet.d.emoji.name
        // This gives us the reaction we need to emit the event properly, in top of the message object
        const reaction = message.reactions.resolve(emoji)
        if (!reaction) return
        const cachedUser = client.users.cache.get(packet.d.user_id)
        const user = cachedUser ? cachedUser : await client.users.fetch(packet.d.user_id)
        // Adds the currently reacting user to the reaction's users collection.
        reaction.users.cache.set(packet.d.user_id, user)
        reaction.message = message
        // Check which type of event it is before emitting
        if (packet.t === 'MESSAGE_REACTION_ADD') {
            client.emit('messageReactionAdd', reaction, user)
        }
    } catch (e: any) {
        L.d('Error in raw reaction add')
        L.d(e)
    }
})

client.on('messageReactionAdd', async (reaction, user) => {
    const ctx = context.withMessageReaction(reaction as Discord.MessageReaction, user as Discord.User)
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
        L.d(`Couldn't find poll from reaction: ${reaction.emoji} on message ${reaction.message.id}...`)
    } catch {
        L.d('There was an error on reaction')
    }
})

client.login(DISCORD_TOKEN)
