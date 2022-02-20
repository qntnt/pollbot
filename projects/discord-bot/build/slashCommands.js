"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerCommands = void 0;
const builders_1 = require("@discordjs/builders");
const rest_1 = require("@discordjs/rest");
const v9_1 = require("discord-api-types/v9");
const settings_1 = require("./settings");
const pollCommand = new builders_1.SlashCommandBuilder()
    .setName('poll')
    .setDescription('Poll command')
    .addSubcommand((subcommand) => subcommand
    .setName('create')
    .setDescription('Create a poll')
    .addStringOption(option => option
    .setName('topic')
    .setDescription('The topic of the poll')
    .setRequired(true))
    .addStringOption(option => option
    .setName('options')
    .setDescription('Comma-separated poll options')
    .setRequired(true))
    .addBooleanOption(option => option
    .setName('randomized_ballots')
    .setDescription('Enables randomized ballot option ordering if true. (default: True)')
    .setRequired(false))
    .addBooleanOption(option => option
    .setName('anytime_results')
    .setDescription('Allows users to view results before the poll is closed. (default: True)')
    .setRequired(false)))
    .addSubcommand((subcommand) => subcommand
    .setName('results')
    .setDescription('View poll results')
    .addStringOption(option => option
    .setName('poll_id')
    .setDescription('The poll id to view results for')
    .setRequired(true))
    .addBooleanOption(option => option
    .setName('private')
    .setDescription('Makes the command response private. (default: False)')
    .setRequired(false)))
    .addSubcommand((subcommand) => subcommand
    .setName('close')
    .setDescription('Close a poll')
    .addStringOption(option => option
    .setName('poll_id')
    .setDescription('The poll id to close')
    .setRequired(true)))
    .addSubcommand((subcommand) => subcommand
    .setName('audit')
    .setDescription('Audit a poll')
    .addStringOption(option => option
    .setName('poll_id')
    .setDescription('The poll id to audit')
    .setRequired(true)))
    .addSubcommand((subcommand) => subcommand
    .setName('update')
    .setDescription('Update a poll')
    .addStringOption(option => option
    .setName('poll_id')
    .setDescription('The poll id to update')
    .setRequired(true))
    .addStringOption(option => option
    .setName('topic')
    .setDescription('Update the poll\'s topic'))
    .addStringOption(option => option
    .setName('closes_at')
    .setDescription('Update the poll\'s closing time. ISO-format'))
    .addBooleanOption(option => option
    .setName('randomized_ballots')
    .setDescription('Enables randomized ballot option ordering if true. (default: True)')
    .setRequired(false))
    .addBooleanOption(option => option
    .setName('anytime_results')
    .setDescription('Allows users to view results before the poll is closed. (default: True)')
    .setRequired(false)));
const deleteMyUserDataCommand = new builders_1.SlashCommandBuilder()
    .setName('unsafe_delete_my_user_data')
    .setDescription(`Deletes all of your polls and ballots. This is cannot be reversed.`)
    .addUserOption(option => option
    .setName('confirm_user')
    .setDescription('Confirm your account')
    .setRequired(true));
const commands = [
    pollCommand,
    deleteMyUserDataCommand,
];
const clientId = settings_1.DISCORD_CLIENT_ID;
const rest = new rest_1.REST({ version: '9' }).setToken(settings_1.DISCORD_TOKEN);
function registerCommands() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log('Started refreshing application (/) commands.');
            yield rest.put(v9_1.Routes.applicationCommands(clientId), { body: commands });
            console.log('Successfully reloaded application (/) commands.');
        }
        catch (error) {
            console.error(error);
        }
    });
}
exports.registerCommands = registerCommands;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2xhc2hDb21tYW5kcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9zbGFzaENvbW1hbmRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLGtEQUEwRDtBQUMxRCwwQ0FBdUM7QUFDdkMsNkNBQThDO0FBQzlDLHlDQUE4RDtBQUU5RCxNQUFNLFdBQVcsR0FBSSxJQUFJLDhCQUFtQixFQUFFO0tBQ3pDLE9BQU8sQ0FBQyxNQUFNLENBQUM7S0FDZixjQUFjLENBQUMsY0FBYyxDQUFDO0tBQzlCLGFBQWEsQ0FBQyxDQUFDLFVBQVUsRUFBRSxFQUFFLENBQzFCLFVBQVU7S0FDTCxPQUFPLENBQUMsUUFBUSxDQUFDO0tBQ2pCLGNBQWMsQ0FBQyxlQUFlLENBQUM7S0FDL0IsZUFBZSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQ3RCLE1BQU07S0FDRCxPQUFPLENBQUMsT0FBTyxDQUFDO0tBQ2hCLGNBQWMsQ0FBQyx1QkFBdUIsQ0FBQztLQUN2QyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQ3pCO0tBQ0EsZUFBZSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQ3RCLE1BQU07S0FDRCxPQUFPLENBQUMsU0FBUyxDQUFDO0tBQ2xCLGNBQWMsQ0FBQyw4QkFBOEIsQ0FBQztLQUM5QyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQ3pCO0tBQ0EsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FDdkIsTUFBTTtLQUNELE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQztLQUM3QixjQUFjLENBQUMsb0VBQW9FLENBQUM7S0FDcEYsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUMxQjtLQUNBLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQ3ZCLE1BQU07S0FDRCxPQUFPLENBQUMsaUJBQWlCLENBQUM7S0FDMUIsY0FBYyxDQUFDLHlFQUF5RSxDQUFDO0tBQ3pGLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FDMUIsQ0FDUjtLQUNBLGFBQWEsQ0FBQyxD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