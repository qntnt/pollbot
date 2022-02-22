"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Discord = __importStar(require("discord.js"));
const settings_1 = require("./settings");
const commands = __importStar(require("./commands"));
const Context_1 = require("./Context");
const storage_1 = __importDefault(require("./storage"));
const slashCommands_1 = require("./slashCommands");
const client = new Discord.Client({
    intents: [
        'DIRECT_MESSAGES',
        'DIRECT_MESSAGE_REACTIONS',
        'GUILDS',
        'GUILD_MESSAGES',
        'GUILD_MESSAGE_REACTIONS',
    ]
});
const context = new Context_1.Context(client);
context.init();
(0, slashCommands_1.registerCommands)();
client.once('ready', () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    console.log(`Logged in as ${(_b = (_a = client.user) === null || _a === void 0 ? void 0 : _a.tag) !== null && _b !== void 0 ? _b : 'undefined'}`);
}));
client.on('guildCreate', (guild) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const guildData = yield storage_1.default.getGuildData(guild.id);
        if (guildData) {
            return;
        }
        yield storage_1.default.createGuildData({
            id: guild.id,
            admins: {},
        });
    }
    catch (_c) {
        console.error('There was an error on guildCreate');
    }
}));
client.on('guildDelete', (guild) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield storage_1.default.deleteGuildData(guild.id);
    }
    catch (_d) {
        console.error('There was an error on guildDelete');
    }
}));
function isCommand(message, command) {
    return message.content.toLowerCase().startsWith(command.toLowerCase());
}
function handleCommandInteraction(interaction) {
    return __awaiter(this, void 0, void 0, function* () {
        const ctx = context.withCommandInteraction(interaction);
        try {
            switch (interaction.commandName) {
                case 'poll':
                    yield pollCommand(ctx);
                    break;
                case 'help':
                    yield helpCommand(ctx);
                    break;
                case 'unsafe_delete_my_user_data':
                    const user = interaction.options.getUser('confirm_user', true);
                    yield commands.deleteMyUserData(ctx, user);
                    break;
            }
        }
        catch (e) {
            if (e instanceof Discord.DiscordAPIError) {
                if (e.code === 50001) {
                    yield ctx.followUp({
                        embeds: [
                            new Discord.MessageEmbed({
                                color: 'RED',
                                description: 'I don\'t have access to successfully complete your command. Please make sure that I\'m invited to relevant channels and that my permissions are correct.',
                            })
                        ],
                        ephemeral: true,
                    });
                    return;
                }
            }
            console.error(e);
            const msg = {
                embeds: [
                    new Discord.MessageEmbed({
                        color: 'RED',
                        description: 'There was an unknown error with your command. Sorry about that. Please reach out to [Pollbot support](https://discord.gg/uC2rkUyDdE) if there are further problems',
                    })
                ],
                ephemeral: true,
            };
            yield ctx.followUp(msg);
        }
    });
}
function handleButtonInteraction(interaction) {
    return __awaiter(this, void 0, void 0, function* () {
        const ctx = context.withButtonInteraction(interaction);
        switch (interaction.customId) {
            case 'request_ballot':
                yield commands.createBallotFromButton(ctx);
                break;
        }
    });
}
client.on('interactionCreate', (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    if (interaction.isCommand())
        return yield handleCommandInteraction(interaction);
    if (interaction.isButton())
        return yield handleButtonInteraction(interaction);
}));
function helpCommand(ctx) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const isPublic = (_a = ctx.interaction.options.getBoolean('public', false)) !== null && _a !== void 0 ? _a : false;
        yield ctx.interaction.reply({
            embeds: [commands.helpEmbed()],
            ephemeral: !isPublic,
        });
    });
}
function pollCommand(ctx) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    return __awaiter(this, void 0, void 0, function* () {
        const interaction = ctx.interaction;
        const subcommand = interaction.options.getSubcommand();
        if (subcommand === 'create') {
            const topic = interaction.options.getString('topic', true);
            const optionsString = interaction.options.getString('options', true);
            const randomizedBallots = (_a = interaction.options.getBoolean('randomized_ballots')) !== null && _a !== void 0 ? _a : true;
            const anytimeResults = (_b = interaction.options.getBoolean('anytime_results')) !== null && _b !== void 0 ? _b : true;
            if (((_c = interaction.channel) === null || _c === void 0 ? void 0 : _c.type) !== 'GUILD_TEXT')
                return;
            yield commands.createPoll(ctx, topic, optionsString, randomizedBallots, anytimeResults);
        }
        else if (subcommand === 'close') {
            const pollId = interaction.options.getString('poll_id', true);
            yield commands.closePoll(ctx, pollId);
        }
        else if (subcommand === 'results') {
            const pollId = interaction.options.getString('poll_id', true);
            const _private = (_d = interaction.options.getBoolean('private')) !== null && _d !== void 0 ? _d : false;
            yield commands.pollResults(ctx, pollId, _private);
        }
        else if (subcommand === 'audit') {
            const pollId = interaction.options.getString('poll_id', true);
            yield commands.auditPoll(ctx, pollId);
        }
        else if (subcommand === 'update') {
            const pollId = interaction.options.getString('poll_id', true);
            const topic = (_e = interaction.options.getString('topic')) !== null && _e !== void 0 ? _e : undefined;
            const closesAt = (_f = interaction.options.getString('closes_at')) !== null && _f !== void 0 ? _f : undefined;
            const randomizedBallots = (_g = interaction.options.getBoolean('randomized_ballots')) !== null && _g !== void 0 ? _g : undefined;
            const anytimeResults = (_h = interaction.options.getBoolean('anytime_results')) !== null && _h !== void 0 ? _h : true;
            yield commands.updatePoll(ctx, pollId, topic, closesAt, randomizedBallots, anytimeResults);
        }
    });
}
client.on('messageCreate', (message) => __awaiter(void 0, void 0, void 0, function* () {
    var _e;
    try {
        const ctx = context.withMessage(message);
        if (message.author.id === ((_e = client.user) === null || _e === void 0 ? void 0 : _e.id))
            return;
        if (message.channel.type === 'DM') {
            yield commands.submitBallot(ctx, message);
            return;
        }
        if (message.channel.type !== 'GUILD_TEXT')
            return;
        if (!isCommand(message, commands.POLLBOT_PREFIX)) {
            return;
        }
        if (isCommand(message, commands.CREATE_POLL_COMMAND)) {
            yield ctx.replyOrEdit('This command is obsolete. Please use the slash command `/poll create`. If slash commands aren\'t available, have a server admin re-invite pollbot to your server.');
            return;
        }
        if (isCommand(message, commands.CLOSE_POLL_COMMAND)) {
            yield ctx.replyOrEdit('This command is obsolete. Please use the slash command `/poll close`. If slash commands aren\'t available, have a server admin re-invite pollbot to your server.');
            return;
        }
        if (isCommand(message, commands.POLL_RESULTS_COMMAND)) {
            yield ctx.replyOrEdit('This command is obsolete. Please use the slash command `/poll results`. If slash commands aren\'t available, have a server admin re-invite pollbot to your server.');
            return;
        }
        if (isCommand(message, commands.AUDIT_POLL_COMMAND)) {
            yield ctx.replyOrEdit('This command is obsolete. Please use the slash command `/poll audit`. If slash commands aren\'t available, have a server admin re-invite pollbot to your server.');
            return;
        }
        if (isCommand(message, commands.SET_POLL_PROPERTIES_COMMAND)) {
            yield ctx.replyOrEdit('This command is obsolete. Please use the slash command `/poll update`. If slash commands aren\'t available, have a server admin re-invite pollbot to your server.');
            return;
        }
        if (isCommand(message, commands.ADD_POLL_FEATURES_COMMAND)) {
            yield ctx.replyOrEdit('This command is obsolete. Please use the slash command `/poll update`. If slash commands aren\'t available, have a server admin re-invite pollbot to your server.');
            return;
        }
        if (isCommand(message, commands.REMOVE_POLL_FEATURES_COMMAND)) {
            yield ctx.replyOrEdit('This command is obsolete. Please use the slash command `/poll update`. If slash commands aren\'t available, have a server admin re-invite pollbot to your server.');
            return;
        }
        if (isCommand(message, commands.DELETE_MY_USER_DATA_COMMAND)) {
            yield ctx.replyOrEdit('This command is obsolete. Please use the slash command `/delete_my_user_data`. If slash commands aren\'t available, have a server admin re-invite pollbot to your server.');
            return;
        }
        yield commands.help(ctx, message);
        return;
    }
    catch (e) {
        console.error(e);
        yield message.channel.send('There was an unknown error with your command. Sorry about that.');
    }
}));
client.on('raw', (packet) => __awaiter(void 0, void 0, void 0, function* () {
    var _f;
    try {
        if (!['MESSAGE_REACTION_ADD'].includes(packet.t))
            return;
        if (!((_f = client.user) === null || _f === void 0 ? void 0 : _f.id)) {
            return;
        }
        if (packet.d.user_id === client.user.id) {
            return;
        }
        const cachedChannel = client.channels.cache.get(packet.d.channel_id);
        const channel = (cachedChannel ? cachedChannel : (yield client.channels.fetch(packet.d.channel_id)));
        if (channel.messages.cache.has(packet.d.message_id))
            return;
        let message;
        try {
            message = yield channel.messages.fetch(packet.d.message_id);
        }
        catch (e) {
            settings_1.L.d(e);
            return;
        }
        const emoji = packet.d.emoji.id ? `${packet.d.emoji.name}:${packet.d.emoji.id}` : packet.d.emoji.name;
        const reaction = message.reactions.resolve(emoji);
        if (!reaction)
            return;
        const cachedUser = client.users.cache.get(packet.d.user_id);
        const user = cachedUser ? cachedUser : yield client.users.fetch(packet.d.user_id);
        reaction.users.cache.set(packet.d.user_id, user);
        reaction.message = message;
        if (packet.t === 'MESSAGE_REACTION_ADD') {
            client.emit('messageReactionAdd', reaction, user);
        }
    }
    catch (e) {
        settings_1.L.d('Error in raw reaction add');
        settings_1.L.d(e);
    }
}));
client.on('messageReactionAdd', (reaction, user) => __awaiter(void 0, void 0, void 0, function* () {
    var _g, _h, _j, _k, _l, _m;
    const ctx = context.withMessageReaction(reaction, user);
    try {
        if (!((_g = client.user) === null || _g === void 0 ? void 0 : _g.id)) {
            return;
        }
        if (user.id === client.user.id) {
            return;
        }
        if (((_j = (_h = reaction.message) === null || _h === void 0 ? void 0 : _h.author) === null || _j === void 0 ? void 0 : _j.id) !== client.user.id) {
            return;
        }
        if (!user) {
            return;
        }
        settings_1.L.d((_k = reaction.message.embeds[0]) === null || _k === void 0 ? void 0 : _k.title);
        if (((_m = (_l = reaction.message.embeds[0]) === null || _l === void 0 ? void 0 : _l.title) === null || _m === void 0 ? void 0 : _m.startsWith(commands.POLL_ID_PREFIX)) === true) {
            settings_1.L.d('Creating ballot...');
            yield commands.createBallot(ctx, reaction, user);
            return;
        }
        settings_1.L.d(`Couldn't find poll from reaction: ${reaction.emoji} on message ${reaction.message.id}...`);
    }
    catch (_o) {
        settings_1.L.d('There was an error on reaction');
    }
}));
client.login(settings_1.DISCORD_TOKEN);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsb0RBQXFDO0FBQ3JDLHlDQUE2QztBQUM3QyxxREFBc0M7QUFDdEMsdUNBQW1DO0FBQ25DLHdEQUErQjtBQUMvQixtREFBa0Q7QUFFbEQsTUFBTSxNQUFNLEdBQUcsSUFBSSxPQUFPLENBQUMsTUFBTSxDQUFDO0lBQzlCLE9BQU8sRUFBRTtRQUNMLGlCQUFpQjtRQUNqQiwwQkFBMEI7UUFDMUIsUUFBUTtRQUNSLGdCQUFnQjtRQUNoQix5QkFBeUI7S0FDNUI7Q0FDSixDQUFDLENBQUE7QUFDRixNQUFNLE9BQU8sR0FBRyxJQUFJLGlCQUFPLENBQUMsTUFBTSxDQUFDLENBQUE7QUFDbkMsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFBO0FBRWQsSUFBQSxnQ0FBZ0IsR0FBRSxDQUFBO0FBRWxCLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLEdBQVMsRUFBRTs7SUFDNUIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsTUFBQSxNQUFBLE1BQU0sQ0FBQyxJQUFJLDBDQUFFLEdBQUcsbUNBQUksV0FBVyxFQUFFLENBQUMsQ0FBQTtBQUNsRSxDQUFDLENBQUEsQ0FBQyxDQUFBO0FBRUYsTUFBTSxDQUFDLEVBQUUsQ0FBQyxhQUFhLEVBQUUsQ0FBTSxLQUFLLEVBQUMsRUFBRTtJQUNuQyxJQUFJO1FBQ0EsTUFBTSxTQUFTLEdBQUcsTUFBTSxpQkFBTyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUE7UUFDdEQsSUFBSSxTQUFTLEVBQUU7WUFDWCxPQUFNO1NBQ1Q7UUFDRCxNQUFNLGlCQUFPLENBQUMsZUFBZSxDQUFDO1lBQzFCLEVBQUUsRUFBRSxLQUFLLENBQUMsRUFBRTtZQUNaLE1BQU0sRUFBRSxFQUFFO1NBQ2IsQ0FBQyxDQUFB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