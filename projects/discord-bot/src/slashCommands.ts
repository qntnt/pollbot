import { SlashCommandBuilder } from "@discordjs/builders";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { DISCORD_CLIENT_ID, DISCORD_TOKEN } from "./settings";

const pollCommand =  new SlashCommandBuilder()
    .setName('poll')
    .setDescription('Poll command')
    .addSubcommand((subcommand) => 
        subcommand
            .setName('create')
            .setDescription('Create a poll')
            .addStringOption(option => 
                option
                    .setName('topic') 
                    .setDescription('The topic of the poll')
                    .setRequired(true)   
            )
            .addStringOption(option =>
                option 
                    .setName('options')
                    .setDescription('Comma-separated poll options')
                    .setRequired(true)
            )
            .addBooleanOption(option => 
                option
                    .setName('randomized_ballots')
                    .setDescription('Enables randomized ballot option ordering if true. (default: True)')
                    .setRequired(false)
            )
            .addBooleanOption(option => 
                option
                    .setName('anytime_results')
                    .setDescription('Allows users to view results before the poll is closed. (default: True)')
                    .setRequired(false)
            )
    )
    .addSubcommand((subcommand) => 
        subcommand
            .setName('results')
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
    )
    .addSubcommand((subcommand) => 
        subcommand
            .setName('close')
            .setDescription('Close a poll')
            .addStringOption(option =>
                option
                    .setName('poll_id')
                    .setDescription('The poll id to close')
                    .setRequired(true)    
            )
    )
    .addSubcommand((subcommand) => 
        subcommand
            .setName('audit')
            .setDescription('Audit a poll')
            .addStringOption(option =>
                option
                    .setName('poll_id')
                    .setDescription('The poll id to audit')
                    .setRequired(true)    
            )
    )
    .addSubcommand((subcommand) => 
        subcommand
            .setName('update')
            .setDescription('Update a poll')
            .addStringOption(option =>
                option
                    .setName('poll_id')
                    .setDescription('The poll id to update')
                    .setRequired(true)    
            )
            .addStringOption(option =>
                option
                    .setName('topic')
                    .setDescription('Update the poll\'s topic')    
            )
            .addStringOption(option =>
                option
                    .setName('closes_at')
                    .setDescription('Update the poll\'s closing time. ISO-format')    
            )
            .addBooleanOption(option => 
                option
                    .setName('randomized_ballots')
                    .setDescription('Enables randomized ballot option ordering if true. (default: True)')
                    .setRequired(false)
            )
            .addBooleanOption(option => 
                option
                    .setName('anytime_results')
                    .setDescription('Allows users to view results before the poll is closed. (default: True)')
                    .setRequired(false)
            )
    )

const deleteMyUserDataCommand = new SlashCommandBuilder()
    .setName('unsafe_delete_my_user_data')
    .setDescription(`Deletes all of your polls and ballots. This is cannot be reversed.`)
    .addUserOption(option => 
        option
            .setName('confirm_user')
            .setDescription('Confirm your account')
            .setRequired(true)
    )

const commands = [
    pollCommand,
    deleteMyUserDataCommand,
];

const clientId = DISCORD_CLIENT_ID;

const rest = new REST({ version: '9' }).setToken(DISCORD_TOKEN);

export async function registerCommands()  {
	try {
		console.log('Started refreshing application (/) commands.');

		await rest.put(
			Routes.applicationCommands(clientId),
			{ body: commands },
		);

		console.log('Successfully reloaded application (/) commands.');
	} catch (error) {
		console.error(error);
	}
}