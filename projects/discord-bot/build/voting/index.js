"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.explainResults = exports.resultsSummary = exports.computeResults = void 0;
const columnify_1 = __importDefault(require("columnify"));
const discord_js_1 = require("discord.js");
const commands_1 = require("../commands");
const settings_1 = require("../settings");
const random_1 = require("../util/random");
const condorcet_1 = require("./condorcet");
function computeResults(poll, ballots) {
    var _a;
    const optionKeys = Object.keys((_a = poll === null || poll === void 0 ? void 0 : poll.options) !== null && _a !== void 0 ? _a : {}).sort();
    const votes = ballots.map(b => {
        const v = {};
        optionKeys.forEach(k => {
            var _a, _b;
            v[k] = optionKeys.length - ((_b = (_a = b.votes[k]) === null || _a === void 0 ? void 0 : _a.rank) !== null && _b !== void 0 ? _b : optionKeys.length);
        });
        return v;
    });
    return (0, condorcet_1.rankedPairs)((0, random_1.shuffled)(optionKeys, poll.id), votes);
}
exports.computeResults = computeResults;
function displayRankingType(rankingType) {
    switch (rankingType) {
        case 'rankedPairs':
            return '**Ranked Pairs - Tideman** (<https://en.wikipedia.org/wiki/Ranked_pairs>)';
    }
}
function resultsSummary(poll, results) {
    const footer = `Ranking Type: ${displayRankingType(results.rankingType)}\n`;
    const columns = settings_1.DEBUG ? ['rank', 'option', 'score'] : ['rank', 'option'];
    const finalRankings = (0, columnify_1.default)(results.finalRankings.map(([key, score], i) => ({ option: poll.options[key], rank: i + 1, score })), {
        columns,
        align: 'right',
        columnSplitter: ' | ',
    });
    const metrics = (`Ballot count: ${results.metrics.voteCount}\n` +
        `Time to compute: ${results.metrics.computeDuration.toFormat('S')}ms\n`);
    const embed = new discord_js_1.MessageEmbed()
        .addField(poll.topic, '```' + finalRankings + '```');
    const closeCalls = [];
    for (let i = 1; i < results.finalRankings.length; i++) {
        const [prev, prevScore] = results.finalRankings[i - 1];
        const [curr, currScore] = results.finalRankings[i];
        if (prevScore <= currScore) {
            closeCalls.push([prev, curr]);
        }
    }
    if (closeCalls.length > 0) {
        const closeCallMsg = closeCalls.map(([p, c]) => `- \`${poll.options[p]}\` beat \`${poll.options[c]}\``).join('\n');
        embed.addField('These were close calls!', closeCallMsg);
    }
    embed
        .addField('Metrics', metrics)
        .addField('Info', footer)
        .setFooter(`${commands_1.POLL_ID_PREFIX}${poll.id}`);
    return embed;
}
exports.resultsSummary = resultsSummary;
function explainResults(poll, results) {
    const summary = resultsSummary(poll, results);
    const matrixText = (0, condorcet_1.showMatrix)(results.matrix);
    return (summary +
        '\n```' +
        matrixText +
        '```');
}
exports.explainResults = explainResults;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdm90aW5nL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLDBEQUFrQztBQUNsQywyQ0FBMEM7QUFDMUMsMENBQTZDO0FBRTdDLDBDQUFvQztBQUNwQywyQ0FBMEM7QUFDMUMsMkNBQXNEO0FBR3RELFNBQWdCLGNBQWMsQ0FBQyxJQUFVLEVBQUUsT0FBaUI7O0lBQ3hELE1BQU0sVUFBVSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBQSxJQUFJLGFBQUosSUFBSSx1QkFBSixJQUFJLENBQUUsT0FBTyxtQ0FBSSxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQTtJQUMxRCxNQUFNLEtBQUssR0FBVyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFO1FBQ2xDLE1BQU0sQ0FBQyxHQUEyQixFQUFFLENBQUE7UUFDcEMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRTs7WUFDbkIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxNQUFBLE1BQUEsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsMENBQUUsSUFBSSxtQ0FBSSxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUE7UUFDdEUsQ0FBQyxDQUFDLENBQUE7UUFDRixPQUFPLENBQUMsQ0FBQTtJQUNaLENBQUMsQ0FBQyxDQUFBO0lBQ0YsT0FBTyxJQUFBLHVCQUFXLEVBQUMsSUFBQSxpQkFBUSxFQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUE7QUFDNUQsQ0FBQztBQVZELHdDQVVDO0FBRUQsU0FBUyxrQkFBa0IsQ0FBQyxXQUF3QjtJQUNoRCxRQUFRLFdBQVcsRUFBRTtRQUNqQixLQUFLLGFBQWE7WUFDZCxPQUFPLDJFQUEyRSxDQUFBO0tBQ3pGO0FBQ0wsQ0FBQztBQUVE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