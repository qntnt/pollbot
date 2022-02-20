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
                case 'unsafe_delete_my_user_data':
                    const user = interaction.options.getUser('confirm_user', true);
                    yield commands.deleteMyUserData(ctx, user);
                    break;
            }
        }
        catch (e) {
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
client.on('message', (message) => __awaiter(void 0, void 0, void 0, function* () {
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