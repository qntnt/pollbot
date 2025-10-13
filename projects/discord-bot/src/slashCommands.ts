import { SlashCommandBuilder } from "@discordjs/builders"
import { REST } from "@discordjs/rest"
import { Routes } from "discord-api-types/v9"
import { DISCORD_CLIENT_ID, DISCORD_TOKEN } from "./settings"

export const pollResultsCommand = new SlashCommandBuilder()
    .setName('poll_results')
    .setDescription('View poll results')
    .addStringOption(option =>
        option
            .setName('poll_id')
            .setDescription('The poll id to view results for')
            .setRequired(true)
    )
    .addBooleanOption(option =>
        option
            .setName('private')
            .setDescription('Makes the command response private. (default: False)')
            .setRequired(false)
    )

export const pollCloseCommand = new SlashCommandBuilder()
    .setName('poll_close')
    .setDescription('Close a poll')
    .addStringOption(option =>
        option
            .setName('poll_id')
            .setDescription('The poll id to close')
            .setRequired(true)
    )

export const pollAuditCommand = new SlashCommandBuilder()
    .setName('poll_audit')
    .setDescription('Audit a poll. Only the poll owner, admins, or pollbotAdmins can audit a poll.')
    .addStringOption(option =>
        option
            .setName('poll_id')
            .setDescription('The poll id to audit')
            .setRequired(true)
    )

export const deleteMyUserDataCommand = new SlashCommandBuilder()
    .setName('unsafe_delete_my_user_data')
    .setDescription(`Deletes all of your polls and ballots. This is cannot be reversed.`)
    .addUserOption(option =>
        option
            .setName('confirm_user')
            .setDescription('Confirm your account')
            .setRequired(true)
    )

const nonHelpCommands = [
    pollResultsCommand,
    pollCloseCommand,
    pollAuditCommand,
    deleteMyUserDataCommand,
]

export const helpCommand = new SlashCommandBuilder()
    .setName('help')
    .setDescription(`View information about pollbot commands`)
    .addBooleanOption(option =>
        option
            .setName('public')
            .setDescription('Help message is visible to other users')
            .setRequired(false)
    )
    .addStringOption(option =>
        option
            .setName('command')
            .setDescription('Prints detailed help information for a command')
            .setRequired(false)
            .setChoices(nonHelpCommands.map(c => [c.name, c.name] as [name: string, value: string]))
    )

const okCommands = [
    ...nonHelpCommands,
    helpCommand,
]

const commands = [
    ...okCommands,
]

export function matchCommand(commandName: string): Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup"> | undefined {
    return okCommands.find(c => c.name === commandName)
}

const clientId = DISCORD_CLIENT_ID

const rest = new REST({ version: '9' }).setToken(DISCORD_TOKEN)

export async function registerCommands(): Promise<void> {
    try {
        console.log('Started refreshing application (/) commands.')
        await rest.put(
            Routes.applicationCommands(clientId),
            { body: commands },
        )

        console.log('Successfully reloaded application (/) commands.')
    } catch (error) {
        console.error(error)
    }
}