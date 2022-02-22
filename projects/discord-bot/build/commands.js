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
exports.deleteMyUserData = exports.auditPoll = exports.isGuildMember = exports.help = exports.helpEmbed = exports.submitBallot = exports.createBallot = exports.createBallotFromButton = exports.pollResults = exports.closePoll = exports.updatePoll = exports.createPoll = exports.isTeam = exports.POLL_ID_PREFIX = exports.DELETE_MY_USER_DATA_COMMAND = exports.SET_POLL_PROPERTIES_COMMAND = exports.REMOVE_POLL_FEATURES_COMMAND = exports.ADD_POLL_FEATURES_COMMAND = exports.AUDIT_POLL_COMMAND = exports.POLL_RESULTS_COMMAND = exports.CLOSE_POLL_COMMAND = exports.CREATE_POLL_COMMAND = exports.POLLBOT_PREFIX = void 0;
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
    var _a;
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
        const context = {
            $case: 'discord',
            discord: {
                guildId: ctx.guild.id,
                ownerId: ctx.user.id,
            }
        };
        const pollConfig = {
            topic,
            options,
            features,
            context,
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
        if (((_a = poll.context) === null || _a === void 0 ? void 0 : _a.$case) === 'discord') {
            poll.context.discord.messageRef = {
                channelId: pollMessage.channelId,
                id: pollMessage.id
            };
        }
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
            if (!date.isValid) {
                return yield ctx.editReply(Object.assign(Object.assign({}, simpleSendable(`The date for \`closes_at\` is invalid.`)), { ephemeral: true }));
            }
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
        yield ctx.editReply({
            embeds: [
                embed
            ],
            ephemeral: true,
        });
        try {
            yield updatePollMessage(ctx, poll, {
                embeds: [
                    createPollEmbed(poll)
                ]
            });
        }
        catch (e) {
            if (e instanceof discord_js_1.DiscordAPIError && e.code === 50001) {
                yield ctx.followUp({
                    embeds: [
                        new discord_js_1.MessageEmbed({
                            color: 'RED',
                            description: 'I couldn\'t update the poll message with your changes. Please make sure that I\'m invited to the poll channel and my permissions are correct.'
                        })
                    ]
                });
            }
        }
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
        yield storage_1.default.updatePoll(poll.id, poll);
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
    var _a, _b, _c;
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
            ballot = yield storage_1.default.createBallot(poll, {
                pollId: poll.id,
                context: {
                    $case: 'discord',
                    discord: {
                        userId: user.id,
                        userName: user.username,
                    }
                },
            });
        }
        if (!ballot) {
            return yield user.send(simpleSendable('There was an issue creating your ballot.'));
        }
        if (ballot.context === undefined) {
            ballot.context = {
                $case: 'discord',
                discord: {
                    userId: user.id,
                    userName: user.username,
                }
            };
            yield storage_1.default.updateBallot(ballot.id, ballot);
        }
        let optionText = '';
        const disableRandomizedBallots = (_c = (_b = poll.features) === null || _b === void 0 ? void 0 : _b.includes(models_1.PollFeature.DISABLE_RANDOMIZED_BALLOTS)) !== null && _c !== void 0 ? _c : false;
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
            ballot = yield storage_1.default.createBallot(poll, {
                pollId: poll.id,
                context: {
                    $case: 'discord',
                    discord: {
                        userId: user.id,
                        userName: (_b = user.username) !== null && _b !== void 0 ? _b : '',
                    }
                }
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
        const updatedBallot = yield storage_1.default.updateBallot(ballot.id, Object.assign(Object.assign({}, ballot), { updatedAt: (0, moment_timezone_1.default)().toDate(), votes }));
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
function helpEmbed() {
    return new discord_js_1.MessageEmbed({
        title: 'Pollbot help',
    })
        .addField('General Commands', '`/help` - View this help information')
        .addField('Poll Commands', '`/poll create` - Create a poll\n'
        + '`/poll results` - View poll results\n\n'
        + '_These are privileged commands for poll owners, admins, and bot owners_\n'
        + '`/poll close` - Close a poll\n'
        + '`/poll update` - Update poll properties like the closing time, topic, and features\n'
        + '`/poll audit` - Audit poll result and receive ballot information\n')
        .addField('Destructive Commands', '`/unsafe_delete_my_user_data` - Deletes **all** of your polls and ballots. This will affect polls that you\'ve voted on.');
}
exports.helpEmbed = helpEmbed;
function help(ctx, message) {
    return __awaiter(this, void 0, void 0, function* () {
        message.channel.send({
            embeds: [
                helpEmbed()
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbWFuZHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvY29tbWFuZHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsMkNBQTZSO0FBQzdSLHNFQUFvQztBQUNwQyxxQ0FBbUg7QUFDbkgsd0RBQStCO0FBQy9CLHFDQUF5RDtBQUN6RCxrREFBK0M7QUFDL0MseUNBQXNDO0FBQ3RDLDBDQUE2QztBQUM3QyxpQ0FBZ0M7QUFJbkIsUUFBQSxjQUFjLEdBQUcsaUJBQU0sQ0FBQTtBQUN2QixRQUFBLG1CQUFtQixHQUFHLEdBQUcsc0JBQWMsT0FBTyxDQUFBO0FBQzlDLFFBQUEsa0JBQWtCLEdBQUcsR0FBRyxzQkFBYyxRQUFRLENBQUE7QUFDOUMsUUFBQSxvQkFBb0IsR0FBRyxHQUFHLHNCQUFjLFVBQVUsQ0FBQTtBQUNsRCxRQUFBLGtCQUFrQixHQUFHLEdBQUcsc0JBQWMsUUFBUSxDQUFBO0FBQzlDLFFBQUEseUJBQXlCLEdBQUcsR0FBRyxzQkFBYyxjQUFjLENBQUE7QUFDM0QsUUFBQSw0QkFBNEIsR0FBRyxHQUFHLHNCQUFjLGlCQUFpQixDQUFBO0FBQ2pFLFFBQUEsMkJBQTJCLEdBQUcsR0FBRyxzQkFBYyxNQUFNLENBQUE7QUFDckQsUUFBQSwyQkFBMkIsR0FBRyxHQUFHLHNCQUFjLG1CQUFtQixDQUFBO0FBRWxFLFFBQUEsY0FBYyxHQUFHLE9BQU8sQ0FBQTtBQUdyQyxTQUFnQixNQUFNLENBQUMsUUFBd0M7SUFDdkQsT0FBTyxRQUFRLEtBQUssU0FBUyxJQUFLLFFBQWlCLENBQUMsT0FBTyxLQUFLLElBQUksQ0FBQTtBQUM1RSxDQUFDO0FBRkQsd0JBRUM7QUFFRCxTQUFTLFdBQVcsQ0FBQyxLQUFhLEVBQUUsV0FBb0I7SUFDcEQsT0FBTyxJQUFJLHlCQUFZLENBQUM7UUFDcEIsS0FBSztRQUNMLFdBQVc7S0FDZCxDQUFDLENBQUE7QUFDTixDQUFDO0FBRUQsU0FBUyxjQUFjLENBQUMsS0FB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