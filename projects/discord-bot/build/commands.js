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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMyUserData = exports.auditPoll = exports.isGuildMember = exports.help = exports.submitBallot = exports.createBallot = exports.createBallotFromButton = exports.pollResults = exports.closePoll = exports.updatePoll = exports.createPoll = exports.isTeam = exports.POLL_ID_PREFIX = exports.DELETE_MY_USER_DATA_COMMAND = exports.SET_POLL_PROPERTIES_COMMAND = exports.REMOVE_POLL_FEATURES_COMMAND = exports.ADD_POLL_FEATURES_COMMAND = exports.AUDIT_POLL_COMMAND = exports.POLL_RESULTS_COMMAND = exports.CLOSE_POLL_COMMAND = exports.CREATE_POLL_COMMAND = exports.POLLBOT_PREFIX = void 0;
const discord_js_1 = require("discord.js");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const models_1 = require("./models");
const storage_1 = __importDefault(require("./storage"));
const voting_1 = require("./voting");
const condorcet_1 = require("./voting/condorcet");
const settings_1 = require("./settings");
const record_1 = require("./util/record");
const luxon_1 = require("luxon");
exports.POLLBOT_PREFIX = settings_1.PREFIX;
exports.CREATE_POLL_COMMAND = `${exports.POLLBOT_PREFIX} poll`;
exports.CLOSE_POLL_COMMAND = `${exports.POLLBOT_PREFIX} close`;
exports.POLL_RESULTS_COMMAND = `${exports.POLLBOT_PREFIX} results`;
exports.AUDIT_POLL_COMMAND = `${exports.POLLBOT_PREFIX} audit`;
exports.ADD_POLL_FEATURES_COMMAND = `${exports.POLLBOT_PREFIX} addFeatures`;
exports.REMOVE_POLL_FEATURES_COMMAND = `${exports.POLLBOT_PREFIX} removeFeatures`;
exports.SET_POLL_PROPERTIES_COMMAND = `${exports.POLLBOT_PREFIX} set`;
exports.DELETE_MY_USER_DATA_COMMAND = `${exports.POLLBOT_PREFIX} deleteMyUserData`;
exports.POLL_ID_PREFIX = 'poll#';
function isTeam(userTeam) {
    return userTeam !== undefined && userTeam.ownerId !== null;
}
exports.isTeam = isTeam;
function simpleEmbed(title, description) {
    return new discord_js_1.MessageEmbed({
        title,
        description,
    });
}
function simpleSendable(title, description) {
    return {
        embeds: [
            simpleEmbed(title, description)
        ],
    };
}
function embedSendable(embed) {
    return {
        embeds: [embed]
    };
}
function createPoll(_ctx, topic, optionsString, randomizedBallots, anytimeResults) {
    return __awaiter(this, void 0, void 0, function* () {
        const ctx = yield _ctx.defer();
        const optionsList = optionsString
            .split(',')
            .map(o => o.trim())
            .filter(o => o !== '');
        if (optionsList.length < 2) {
            return yield ctx.editReply(simpleSendable('You must specify at least two options in a poll.'));
        }
        const options = {};
        optionsList.forEach((o, i) => {
            const key = String.fromCharCode(97 + i);
            options[key] = o;
        });
        if (!ctx.guild) {
            yield ctx.editReply('Couldn\'t determine your server...');
            throw new Error('Couldn\'t determine guild...');
        }
        const features = [];
        if (!randomizedBallots) {
            features.push(models_1.PollFeature.DISABLE_RANDOMIZED_BALLOTS);
        }
        if (!anytimeResults) {
            features.push(models_1.PollFeature.DISABLE_ANYTIME_RESULTS);
        }
        const pollConfig = {
            guildId: ctx.guild.id,
            ownerId: ctx.user.id,
            topic,
            options,
            features,
        };
        const poll = yield storage_1.default.createPoll(pollConfig);
        if (!poll) {
            return yield ctx.editReply(simpleSendable('I couldn\'t make this poll. Something went wrong.'));
        }
        const pollMsgEmbed = createPollEmbed(poll);
        const pollMessage = yield ctx.editReply({
            embeds: [pollMsgEmbed],
            components: [
                new discord_js_1.MessageActionRow()
                    .addComponents(new discord_js_1.MessageButton()
                    .setCustomId('request_ballot')
                    .setLabel('Request Ballot')
                    .setStyle('PRIMARY'))
            ]
        });
        poll.messageRef = {
            channelId: pollMessage.channelId,
            id: pollMessage.id
        };
        yield storage_1.default.updatePoll(poll.id, poll);
    });
}
exports.createPoll = createPoll;
function createPollEmbed(poll) {
    const closesAt = (0, moment_timezone_1.default)(poll.closesAt).tz('America/Los_Angeles').format('dddd, MMMM Do YYYY, h:mm zz');
    const optionText = Object.values(poll === null || poll === void 0 ? void 0 : poll.options).map(o => `\`${o}\``).join(', ');
    return new discord_js_1.MessageEmbed({
        title: `${exports.POLL_ID_PREFIX}${poll.id}`,
        description: `React to this message for me to DM you a ballot`,
    })
        .addField(poll.topic, optionText)
        .setFooter(`This poll closes at ${closesAt}`);
}
function updatePoll(_ctx, pollId, topic, closesAt, randomizedBallots, anytimeResults) {
    return __awaiter(this, void 0, void 0, function* () {
        const ctx = yield _ctx.defer({ ephemeral: true });
        const poll = yield storage_1.default.getPoll(pollId);
        if (!poll) {
            return yield ctx.editReply(Object.assign(Object.assign({}, simpleSendable(`I couldn't find poll ${pollId}`)), { ephemeral: true }));
        }
        try {
            yield ctx.checkPermissions(['botOwner', 'guildAdmin', 'pollOwner'], poll);
        }
        catch (_a) {
            return yield ctx.editReply(Object.assign(Object.assign({}, simpleSendable(`You don't have permission to edit this poll`)), { ephemeral: true }));
        }
        let embed = new discord_js_1.MessageEmbed({ description: `Poll#${poll.id} updated!` });
        if (topic) {
            poll.topic = topic;
            embed = embed.addField('topic', topic);
        }
        if (closesAt) {
            const date = luxon_1.DateTime.fromISO(closesAt);
            poll.closesAt = date.toJSDate();
            embed = embed
                .setFooter('closes_at')
                .setTimestamp(date.toMillis());
        }
        if (randomizedBallots !== undefined) {
            if (!randomizedBallots) {
                addPollFeature(poll, 'disableRandomizedBallots');
                embed = embed.addField('randomized_ballots', 'disabled');
            }
            else {
                removePollFeature(poll, 'disableRandomizedBallots');
                embed = embed.addField('randomized_ballots', 'enabled');
            }
        }
        if (anytimeResults !== undefined) {
            if (anytimeResults) {
                removePollFeature(poll, 'disableAnytimeResults');
                embed = embed.addField('anytime_results', 'enabled');
            }
            else {
                addPollFeature(poll, 'disableAnytimeResults');
                embed = embed.addField('anytime_results', 'disabled');
            }
        }
        yield storage_1.default.updatePoll(poll.id, poll);
        yield updatePollMessage(ctx, poll, {
            embeds: [
                createPollEmbed(poll)
            ]
        });
        return ctx.editReply({
            embeds: [
                embed
            ],
            ephemeral: true,
        });
    });
}
exports.updatePoll = updatePoll;
function addPollFeature(poll, featureOrName) {
    let feature = models_1.PollFeature.UNKNOWN;
    if (typeof (featureOrName) === 'string') {
        feature = models_1.POLL_FEATURES_MAPPER[featureOrName];
    }
    else {
        feature = featureOrName;
    }
    if (!poll.features) {
        poll.features = [feature];
    }
    else {
        if (poll.features.indexOf(feature) === -1) {
            poll.features.push(feature);
        }
    }
}
function removePollFeature(poll, featureOrName) {
    let feature = models_1.PollFeature.UNKNOWN;
    if (typeof (featureOrName) === 'string') {
        feature = models_1.POLL_FEATURES_MAPPER[featureOrName];
    }
    else {
        feature = featureOrName;
    }
    if (poll.features) {
        const i = poll.features.indexOf(feature);
        if (i !== -1) {
            poll.features.splice(i, 1);
        }
    }
}
function updatePollMessage(ctx, poll, options) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!ctx.guild || !poll.messageRef)
            return;
        const channel = yield ctx.guild.channels.fetch(poll.messageRef.channelId);
        if (!(channel === null || channel === void 0 ? void 0 : channel.isText()))
            return;
        const message = yield channel.messages.fetch(poll.messageRef.id);
        yield message.edit(options);
    });
}
function closePoll(_ctx, pollId) {
    return __awaiter(this, void 0, void 0, function* () {
        const ctx = yield _ctx.defer();
        const poll = yield storage_1.default.getPoll(pollId);
        if (!poll) {
            return yield ctx.editReply(simpleSendable(`I couldn't find poll ${pollId}`));
        }
        try {
            yield ctx.checkPermissions(['botOwner', 'guildAdmin', 'pollOwner'], poll);
        }
        catch (_a) {
            return yield ctx.editReply(simpleSendable(`You don't have permission to close this poll`));
        }
        poll.closesAt = (0, moment_timezone_1.default)().toDate();
        yield storage_1.default.updatePoll(poll.id, {
            closesAt: poll.closesAt
        });
        yield updatePollMessage(ctx, poll, {
            embeds: [createPollEmbed(poll)]
        });
        try {
            const ballots = yield storage_1.default.listBallots(poll.id);
            const results = (0, voting_1.computeResults)(poll, ballots);
            if (!results) {
                return yield ctx.editReply(simpleSendable(`${exports.POLL_ID_PREFIX}${poll.id} is now closed. There are no results...`));
            }
            const summary = (0, voting_1.resultsSummary)(poll, results);
            summary.setTitle(`${exports.POLL_ID_PREFIX}${poll.id} is now closed.`);
            return yield ctx.editReply({
                embeds: [summary]
            });
        }
        catch (e) {
            settings_1.L.d(e);
            return yield ctx.editReply(`There was an issue computing results for poll ${poll.id}`);
        }
    });
}
exports.closePoll = closePoll;
function pollResults(_ctx, pollId, ephemeral) {
    return __awaiter(this, void 0, void 0, function* () {
        const ctx = yield _ctx.defer({ ephemeral });
        const poll = yield storage_1.default.getPoll(pollId);
        if (!poll) {
            return yield ctx.editReply(Object.assign(Object.assign({}, simpleSendable(`Poll ${pollId} not found.`)), { ephemeral: true }));
        }
        try {
            yield ctx.checkPermissions([
                'botOwner',
                'pollOwner',
                'pollGuild',
                'guildAdmin',
            ], poll);
        }
        catch (_a) {
            return yield ctx.editReply(Object.assign(Object.assign({}, simpleSendable(`You can't view results for poll ${pollId} in this channel.`)), { ephemeral: true }));
        }
        if (poll.features && poll.features.indexOf(models_1.PollFeature.DISABLE_ANYTIME_RESULTS) !== -1) {
            if (poll.closesAt && poll.closesAt > (0, moment_timezone_1.default)().toDate()) {
                return yield ctx.editReply(Object.assign(Object.assign({}, simpleSendable(`${exports.POLL_ID_PREFIX}${pollId} has disabled anytime results and is not closed`)), { ephemeral: true }));
            }
        }
        const ballots = yield storage_1.default.listBallots(poll.id);
        const results = (0, voting_1.computeResults)(poll, ballots);
        if (!results) {
            return yield ctx.editReply(Object.assign(Object.assign({}, simpleSendable('There are no results yet')), { ephemeral }));
        }
        const summary = (0, voting_1.resultsSummary)(poll, results);
        return yield ctx.editReply({
            embeds: [summary],
            ephemeral,
        });
    });
}
exports.pollResults = pollResults;
const POLL_EXPR = new RegExp(`^>?\\s?${exports.POLL_ID_PREFIX}(.+)`);
function extractPollId(text) {
    const m = text === null || text === void 0 ? void 0 : text.match(POLL_EXPR);
    if (!m || m.length < 2)
        return;
    return m[1];
}
function findPollId(message) {
    var _a, _b, _c;
    let pollId = extractPollId((_a = message.content) !== null && _a !== void 0 ? _a : '');
    if (pollId)
        return pollId;
    pollId = extractPollId((_c = (_b = message.embeds[0]) === null || _b === void 0 ? void 0 : _b.title) !== null && _c !== void 0 ? _c : undefined);
    return pollId;
}
function createBallotFromButton(ctx) {
    var _a, _b, _c, _d;
    return __awaiter(this, void 0, void 0, function* () {
        const user = ctx.interaction.user;
        const message = yield ctx.resolveMessage(ctx.interaction.message);
        const pollId = findPollId(message);
        if (!pollId) {
            settings_1.L.d(`Couldn't find poll for new ballot: ${(_a = message.content) === null || _a === void 0 ? void 0 : _a.substring(0, exports.POLL_ID_PREFIX.length)}`);
            return yield user.send(simpleSendable('There was an issue creating your ballot', 'Couldn\'t parse pollId'));
        }
        const poll = yield storage_1.default.getPoll(pollId);
        if (!poll)
            return yield user.send(simpleSendable('There was an issue creating your ballot', 'Couldn\'t find the poll'));
        if (poll.closesAt && poll.closesAt < (0, moment_timezone_1.default)().toDate()) {
            return yield user.send(simpleSendable(`Poll ${poll.id} is closed.`));
        }
        let ballot = yield storage_1.default.findBallot(poll.id, user.id);
        if (!ballot) {
            ballot = yield storage_1.default.createBallot({
                poll,
                userId: user.id,
                userName: (_b = user.username) !== null && _b !== void 0 ? _b : '',
            });
        }
        if (!ballot) {
            return yield user.send(simpleSendable('There was an issue creating your ballot.'));
        }
        let optionText = '';
        const disableRandomizedBallots = (_d = (_c = poll.features) === null || _c === void 0 ? void 0 : _c.includes(models_1.PollFeature.DISABLE_RANDOMIZED_BALLOTS)) !== null && _d !== void 0 ? _d : false;
        const ballotOptionMapping = ballot.ballotOptionMapping;
        if (ballotOptionMapping && !disableRandomizedBallots) {
            optionText = Object.keys(ballotOptionMapping).sort().map(ballotKey => {
                var _a;
                const pollOptionKey = (_a = ballotOptionMapping[ballotKey]) !== null && _a !== void 0 ? _a : '';
                const pollOption = poll.options[pollOptionKey];
                return `${ballotKey}| ${pollOption}`;
            }).join('\n');
        }
        else {
            optionText = Object.keys(poll.options).sort().map(key => `${key}| ${poll.options[key]}`).join('\n');
        }
        const responseEmbed = new discord_js_1.MessageEmbed({
            title: `${exports.POLL_ID_PREFIX}${poll.id}`,
            description: `Here's your ballot.`,
        })
            .setURL(message.url)
            .addField('Instructions', `To vote, order the options from best to worst in a comma-separated list e.g. \`C,b,a,d\`\n` +
            `_Invalid options will be ignored_\n`)
            .addField(poll.topic, `\`\`\`\n${optionText}\n\`\`\``)
            .setFooter(`Privacy notice: Your user id and current user name is linked to your ballot. Your ballot is viewable by you and bot admins.\n\nballot#${ballot.id}`);
        const dm = yield user.send({
            embeds: [responseEmbed]
        });
        yield ctx.interaction.reply({
            embeds: [
                new discord_js_1.MessageEmbed({
                    title: "Here's your new ballot",
                    url: dm.url,
                })
            ],
            ephemeral: true,
        });
    });
}
exports.createBallotFromButton = createBallotFromButton;
function createBallot(ctx, reaction, user) {
    var _a, _b, _c, _d;
    return __awaiter(this, void 0, void 0, function* () {
        const pollId = findPollId(reaction.message);
        if (!pollId) {
            settings_1.L.d(`Couldn't find poll for new ballot: ${(_a = reaction.message.content) === null || _a === void 0 ? void 0 : _a.substring(0, exports.POLL_ID_PREFIX.length)}`);
            return yield user.send(simpleSendable('There was an issue creating your ballot', 'Couldn\'t parse pollId'));
        }
        const poll = yield storage_1.default.getPoll(pollId);
        if (!poll)
            return yield user.send(simpleSendable('There was an issue creating your ballot', 'Couldn\'t find the poll'));
        if (poll.closesAt && poll.closesAt < (0, moment_timezone_1.default)().toDate()) {
            return yield user.send(simpleSendable(`Poll ${poll.id} is closed.`));
        }
        let ballot = yield storage_1.default.findBallot(poll.id, user.id);
        if (!ballot) {
            ballot = yield storage_1.default.createBallot({
                poll,
                userId: user.id,
                userName: (_b = user.username) !== null && _b !== void 0 ? _b : '',
            });
        }
        if (!ballot) {
            return yield user.send(simpleSendable('There was an issue creating your ballot.'));
        }
        let optionText = '';
        const disableRandomizedBallots = (_d = (_c = poll.features) === null || _c === void 0 ? void 0 : _c.includes(models_1.PollFeature.DISABLE_RANDOMIZED_BALLOTS)) !== null && _d !== void 0 ? _d : false;
        const ballotOptionMapping = ballot.ballotOptionMapping;
        if (ballotOptionMapping && !disableRandomizedBallots) {
            optionText = Object.keys(ballotOptionMapping).sort().map(ballotKey => {
                var _a;
                const pollOptionKey = (_a = ballotOptionMapping[ballotKey]) !== null && _a !== void 0 ? _a : '';
                const pollOption = poll.options[pollOptionKey];
                return `${ballotKey}| ${pollOption}`;
            }).join('\n');
        }
        else {
            optionText = Object.keys(poll.options).sort().map(key => `${key}| ${poll.options[key]}`).join('\n');
        }
        const responseEmbed = new discord_js_1.MessageEmbed({
            title: `${exports.POLL_ID_PREFIX}${poll.id}`,
            description: `Here's your ballot.`,
        })
            .setURL(reaction.message.url)
            .addField('Instructions', `To vote, order the options from best to worst in a comma-separated list e.g. \`C,b,a,d\`\n` +
            `_Invalid options will be ignored_\n`)
            .addField(poll.topic, `\`\`\`\n${optionText}\n\`\`\``)
            .setFooter(`Privacy notice: Your user id and current user name is linked to your ballot. Your ballot is viewable by you and bot admins.\n\nballot#${ballot.id}`);
        user.send({
            embeds: [responseEmbed]
        });
    });
}
exports.createBallot = createBallot;
function submitBallot(ctx, message) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        const limit = 50;
        const history = yield message.channel.messages.fetch({ limit });
        const lastBallotText = history.find(m => findPollId(m) !== undefined);
        if (!lastBallotText) {
            return yield message.channel.send(simpleSendable(`Could not find a pollId in the last ${limit} messages`));
        }
        const messageContent = message.content.toLowerCase();
        if (messageContent.startsWith(exports.POLLBOT_PREFIX)) {
            return yield message.channel.send(simpleSendable('DMs are for submitting ballots. Manage polls in public channels.'));
        }
        const pollId = findPollId(lastBallotText);
        if (!pollId) {
            return yield message.channel.send(simpleSendable(`Could not find a pollId in the last ${limit} messages`));
        }
        const poll = yield storage_1.default.getPoll(pollId);
        if (!poll) {
            return yield message.channel.send(simpleSendable(`Could not find a poll with id ${pollId}`));
        }
        if (poll.closesAt && poll.closesAt < (0, moment_timezone_1.default)().toDate()) {
            return yield message.channel.send(simpleSendable(`Poll ${poll.id} is closed.`));
        }
        const ballot = yield storage_1.default.findBallot(pollId, message.author.id);
        if (!ballot) {
            return yield message.channel.send(simpleSendable(`I couldn't find a ballot for you on poll ${pollId}`));
        }
        const validOptionKeys = Object.keys(poll.options).sort();
        const voteKeys = messageContent.trim().split(',')
            .map(key => key.trim());
        const validVoteKeys = voteKeys.filter(key => validOptionKeys.find((ok) => ok === key));
        let votes = {};
        const disableRandomizedBallot = (_b = (_a = poll.features) === null || _a === void 0 ? void 0 : _a.includes(models_1.PollFeature.DISABLE_RANDOMIZED_BALLOTS)) !== null && _b !== void 0 ? _b : false;
        const ballotOptionMapping = ballot.ballotOptionMapping;
        if (ballotOptionMapping && !disableRandomizedBallot) {
            votes = validVoteKeys
                .reduce((acc, ballotKey, i) => {
                const pollOptionKey = ballotOptionMapping[ballotKey];
                if (pollOptionKey) {
                    acc[pollOptionKey] = {
                        option: poll.options[pollOptionKey],
                        rank: i + 1
                    };
                }
                return acc;
            }, {});
        }
        else {
            votes = validVoteKeys
                .reduce((acc, pollOptionKey, i) => {
                acc[pollOptionKey] = {
                    option: poll.options[pollOptionKey],
                    rank: i + 1
                };
                return acc;
            }, {});
        }
        const updatedBallot = yield storage_1.default.updateBallot(ballot.id, {
            updatedAt: (0, moment_timezone_1.default)().toDate(),
            votes,
        });
        if (!updatedBallot) {
            return yield message.channel.send(simpleSendable('There was a problem recording your ballot.'));
        }
        let summaryLines = [];
        if (ballotOptionMapping && !disableRandomizedBallot) {
            summaryLines = validOptionKeys.map(key => ` ${votes[key] ? votes[key].rank : '_'}    | ${(0, record_1.reverseLookup)(ballotOptionMapping, key)}   | ${poll.options[key]}`);
        }
        else {
            summaryLines = validOptionKeys.map(key => ` ${votes[key] ? votes[key].rank : '_'}    | ${key}   | ${poll.options[key]}`);
        }
        summaryLines.sort();
        const responseEmbed = new discord_js_1.MessageEmbed({
            description: `I've recorded your ballot.`
        })
            .addField('Vote summary', `\`\`\`` +
            ' rank | key | option\n' +
            '====================\n' +
            summaryLines.join('\n') +
            `\`\`\``)
            .setFooter(`${exports.POLL_ID_PREFIX}${poll.id}\nballot#${ballot.id}`)
            .setTimestamp();
        return message.channel.send({
            embeds: [responseEmbed]
        });
    });
}
exports.submitBallot = submitBallot;
function help(ctx, message) {
    return __awaiter(this, void 0, void 0, function* () {
        message.channel.send({
            embeds: [
                new discord_js_1.MessageEmbed({
                    title: 'Pollbot help',
                    description: `Type \`${exports.POLLBOT_PREFIX} <command>\` to see detailed help information for each command.`
                })
                    .addField('Example', `\`${exports.CREATE_POLL_COMMAND}\` will give you information about how to create a poll.`)
                    .addField('General Commands', '`poll` - Create a poll\n'
                    + '`results` - View current poll results\n'
                    + '`help` - View this help information')
                    .addField('Restricted Commands', '_These are privileged commands for poll owners, admins, and bot owners_\n'
                    + '`close` - Close a poll\n'
                    + '`audit` - Audit poll result and receive ballot information\n'
                    + '`set` - Update poll properties like the closing time and topic\n'
                    + '`addFeatures` - Add features to a poll\n'
                    + '`removeFeatures` - Remove features from a poll')
                    .addField('Destructive Commands', '`deleteMyUserData` - Deletes **all** of your polls and ballots. This will affect polls that you\'ve voted on.')
            ]
        });
    });
}
exports.help = help;
function toCSVRow(columns, record) {
    return columns.map(col => record[col]).join(',');
}
function toCSVRows(columns, records) {
    return records.map(rec => toCSVRow(columns, rec)).join('\n');
}
function toCSV(columns, records) {
    const header = columns.join(',');
    return [header, toCSVRows(columns, records)].join('\n');
}
function isGuildMember(user) {
    if (user) {
        return user.guild !== undefined;
    }
    return false;
}
exports.isGuildMember = isGuildMember;
function belongsToGuild(ctx, poll, bypassForBotOwner = true) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        if (bypassForBotOwner && (yield ctx.checkPermissions(['botOwner'])))
            return true;
        return poll.guildId === ((_a = ctx.guild) === null || _a === void 0 ? void 0 : _a.id);
    });
}
function auditPoll(_ctx, pollId) {
    return __awaiter(this, void 0, void 0, function* () {
        const ctx = yield _ctx.defer({ ephemeral: true });
        const poll = yield storage_1.default.getPoll(pollId);
        if (!poll) {
            return ctx.editReply(Object.assign(Object.assign({}, simpleSendable(`Poll ${pollId} not found.`)), { ephemeral: true }));
        }
        if (!(yield belongsToGuild(ctx, poll))) {
            return ctx.editReply(Object.assign(Object.assign({}, simpleSendable(`Poll ${pollId} does not belong to this server.`)), { ephemeral: true }));
        }
        try {
            yield ctx.checkPermissions(['botOwner', 'guildAdmin'], poll);
        }
        catch (_a) {
            return ctx.editReply(Object.assign(Object.assign({}, simpleSendable(`You are not an admin for this bot instance.`, `Only admins may audit poll results and export ballot data.`)), { ephemeral: true }));
        }
        const ballots = yield storage_1.default.listBallots(poll.id);
        const results = (0, voting_1.computeResults)(poll, ballots);
        if (!results) {
            return ctx.editReply(Object.assign(Object.assign({}, simpleSendable(`There was an issue computing results`)), { ephemeral: true }));
        }
        const summary = (0, voting_1.resultsSummary)(poll, results);
        const matrixSummary = (0, condorcet_1.showMatrix)(results.matrix);
        yield ctx.editReply({
            embeds: [summary],
            ephemeral: true,
        });
        const matrixEmbed = new discord_js_1.MessageEmbed({
            title: 'Pairwise Comparison Matrix',
            description: 'To read this, each value in a row shows who wins a matchup between candidates\n' +
                '```' +
                matrixSummary +
                '```'
        });
        if (matrixEmbed.length <= 2000) {
            yield ctx.followUp({
                embeds: [matrixEmbed],
                ephemeral: true,
            });
        }
        else {
            yield ctx.followUp(Object.assign(Object.assign({}, simpleSendable('Your poll has too many options to render a pairwise comparison matrix.')), { ephemeral: true }));
        }
        const options = Object.values(poll.options).sort();
        const columns = ['ballotId', 'createdAt', 'updatedAt', 'userId', 'userName', ...options];
        const csvText = toCSV(columns, ballots.map(b => {
            const votes = {};
            Object.values(b.votes).forEach(v => {
                votes[v.option] = v.rank;
            });
            return Object.assign({ ballotId: b.id, createdAt: (0, moment_timezone_1.default)(b.createdAt).toISOString(), updatedAt: (0, moment_timezone_1.default)(b.updatedAt).toISOString(), userId: b.userId, userName: b.userName }, votes);
        }));
        const csvBuffer = Buffer.from(csvText);
        const attachment = new discord_js_1.MessageAttachment(csvBuffer, `poll_${poll.id}_votes.csv`);
        yield ctx.directMessage({
            embeds: [new discord_js_1.MessageEmbed({ description: `Here's a file containing all ballot data for \`${exports.POLL_ID_PREFIX}${poll.id}\`` })],
            files: [attachment]
        });
        yield ctx.followUp({
            embeds: [
                new discord_js_1.MessageEmbed({
                    description: `I sent you a direct message with a \`.csv\` file that contains all ballot data for \`${exports.POLL_ID_PREFIX}${poll.id}\`.`
                })
            ],
            ephemeral: true,
        });
    });
}
exports.auditPoll = auditPoll;
function deleteMyUserData(_ctx, user) {
    return __awaiter(this, void 0, void 0, function* () {
        const ctx = yield _ctx.defer({ ephemeral: true });
        if (ctx.user.id !== user.id) {
            return yield ctx.editReply('The user does not match your account.');
        }
        yield ctx.editReply({
            embeds: [
                new discord_js_1.MessageEmbed({
                    color: 'RED',
                    description: 'Deleting your data...'
                })
            ],
        });
        try {
            const metrics = yield storage_1.default.deleteUserData(ctx.user.id);
            yield ctx.interaction.editReply({
                embeds: [
                    new discord_js_1.MessageEmbed({
                        color: 'RED',
                        description: `${metrics.numPolls} polls and ${metrics.numBallots} ballots were deleted.`
                    })
                ],
            });
        }
        catch (e) {
            yield ctx.interaction.editReply({
                embeds: [
                    new discord_js_1.MessageEmbed({
                        color: 'RED',
                        description: 'There was an issue while deleting your data. Please contact Pollbot support.'
                    })
                ]
            });
        }
    });
}
exports.deleteMyUserData = deleteMyUserData;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbWFuZHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvY29tbWFuZHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsMkNBQTRRO0FBQzVRLHNFQUFvQztBQUNwQyxxQ0FBbUg7QUFDbkgsd0RBQStCO0FBQy9CLHFDQUF5RDtBQUN6RCxrREFBK0M7QUFDL0MseUNBQXNDO0FBQ3RDLDBDQUE2QztBQUM3QyxpQ0FBZ0M7QUFJbkIsUUFBQSxjQUFjLEdBQUcsaUJBQU0sQ0FBQTtBQUN2QixRQUFBLG1CQUFtQixHQUFHLEdBQUcsc0JBQWMsT0FBTyxDQUFBO0FBQzlDLFFBQUEsa0JBQWtCLEdBQUcsR0FBRyxzQkFBYyxRQUFRLENBQUE7QUFDOUMsUUFBQSxvQkFBb0IsR0FBRyxHQUFHLHNCQUFjLFVBQVUsQ0FBQTtBQUNsRCxRQUFBLGtCQUFrQixHQUFHLEdBQUcsc0JBQWMsUUFBUSxDQUFBO0FBQzlDLFFBQUEseUJBQXlCLEdBQUcsR0FBRyxzQkFBYyxjQUFjLENBQUE7QUFDM0QsUUFBQSw0QkFBNEIsR0FBRyxHQUFHLHNCQUFjLGlCQUFpQixDQUFBO0FBQ2pFLFFBQUEsMkJBQTJCLEdBQUcsR0FBRyxzQkFBYyxNQUFNLENBQUE7QUFDckQsUUFBQSwyQkFBMkIsR0FBRyxHQUFHLHNCQUFjLG1CQUFtQixDQUFBO0FBRWxFLFFBQUEsY0FBYyxHQUFHLE9BQU8sQ0FBQTtBQUdyQyxTQUFnQixNQUFNLENBQUMsUUFBd0M7SUFDdkQsT0FBTyxRQUFRLEtBQUssU0FBUyxJQUFLLFFBQWlCLENBQUMsT0FBTyxLQUFLLElBQUksQ0FBQTtBQUM1RSxDQUFDO0FBRkQsd0JBRUM7QUFFRCxTQUFTLFdBQVcsQ0FBQyxLQUFhLEVBQUUsV0FBb0I7SUFDcEQsT0FBTyxJQUFJLHlCQUFZLENBQUM7UUFDcEIsS0FBSztRQUNMLFdBQVc7S0FDZCxDQUFDLENBQUE7QUFDTixDQUFDO0FBRUQsU0FBUyxjQUFjLENBQUMsS0FB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