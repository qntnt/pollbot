"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POLL_FEATURES_REVERSE_MAPPER = exports.POLL_FEATURES_MAPPER = exports.MessageRef = exports.GuildData = exports.BallotConfig = exports.PollConfig = exports.Ballot = exports.Vote = exports.PollFeature = exports.Poll = void 0;
const polls_1 = require("idl/lib/polls/v1/polls");
var polls_2 = require("idl/lib/polls/v1/polls");
Object.defineProperty(exports, "Poll", { enumerable: true, get: function () { return polls_2.PollDTO; } });
Object.defineProperty(exports, "PollFeature", { enumerable: true, get: function () { return polls_2.PollFeatureDTO; } });
Object.defineProperty(exports, "Vote", { enumerable: true, get: function () { return polls_2.VoteDTO; } });
Object.defineProperty(exports, "Ballot", { enumerable: true, get: function () { return polls_2.BallotDTO; } });
Object.defineProperty(exports, "PollConfig", { enumerable: true, get: function () { return polls_2.PollRequestDTO; } });
Object.defineProperty(exports, "BallotConfig", { enumerable: true, get: function () { return polls_2.BallotRequestDTO; } });
var discord_1 = require("idl/lib/discord/v1/discord");
Object.defineProperty(exports, "GuildData", { enumerable: true, get: function () { return discord_1.GuildDataDTO; } });
Object.defineProperty(exports, "MessageRef", { enumerable: true, get: function () { return discord_1.MessageRefDTO; } });
exports.POLL_FEATURES_MAPPER = {
    disableRandomizedBallots: polls_1.PollFeatureDTO.DISABLE_RANDOMIZED_BALLOTS,
    DISABLE_RANDOMIZED_BALLOTS: polls_1.PollFeatureDTO.DISABLE_RANDOMIZED_BALLOTS,
    disableAnytimeResults: polls_1.PollFeatureDTO.DISABLE_ANYTIME_RESULTS,
    DISABLE_ANYTIME_RESULTS: polls_1.PollFeatureDTO.DISABLE_ANYTIME_RESULTS,
};
function keys(obj) {
    return Object.keys(obj);
}
exports.POLL_FEATURES_REVERSE_MAPPER = Object.assign({}, keys(exports.POLL_FEATURES_MAPPER)
    .map(k => ({ k, v: exports.POLL_FEATURES_MAPPER[k] }))
    .reduce((prev, current) => {
    prev[current.v] = current.k;
    return prev;
}, {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kZWxzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL21vZGVscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxrREFFK0I7QUFHL0IsZ0RBTytCO0FBTjNCLDZGQUFBLE9BQU8sT0FBUTtBQUNmLG9HQUFBLGNBQWMsT0FBZTtBQUM3Qiw2RkFBQSxPQUFPLE9BQVE7QUFDZiwrRkFBQSxTQUFTLE9BQVU7QUFDbkIsbUdBQUEsY0FBYyxPQUFjO0FBQzVCLHFHQUFBLGdCQUFnQixPQUFnQjtBQUVwQyxzREFHbUM7QUFGL0Isb0dBQUEsWUFBWSxPQUFhO0FBQ3pCLHFHQUFBLGFBQWEsT0FBYztBQVdsQixRQUFBLG9CQUFvQixHQUFHO0lBQ2hDLHdCQUF3QixFQUFFLHNCQUFjLENBQUMsMEJBQTBCO0lBQ25FLDBCQUEwQixFQUFFLHNCQUFjLENBQUMsMEJBQTBCO0lBQ3JFLHFCQUFxQixFQUFFLHNCQUFjLENBQUMsdUJBQXVCO0lBQzdELHVCQUF1QixFQUFFLHNCQUFjLENBQUMsdUJBQXVCO0NBQ2xFLENBQUE7QUFNRCxTQUFTLElBQUksQ0FBc0IsR0FBdUI7SUFDdEQsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBUSxDQUFBO0FBQ2xDLENBQUM7QUFFWSxRQUFBLDRCQUE0QixxQkFDbEMsSUFBSSxDQUFDLDRCQUFvQixDQUFDO0tBQ3hCLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLDRCQUFvQixDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztLQUM3QyxNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLEVBQUU7SUFDdEIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFBO0lBQzNCLE9BQU8sSUFBSSxDQUFBO0FBQ2YsQ0FBQyxFQUFFLEVBQTBDLENBQUMsRUFDckQifQ==