"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PollsServiceClientImpl = exports.WebPollContextDTO = exports.DiscordPollContextDTO = exports.PollDTO_BallotsEntry = exports.PollDTO_OptionsEntry = exports.PollDTO = exports.PollRequestDTO_OptionsEntry = exports.PollRequestDTO = exports.WebBallotContextDTO = exports.DiscordBallotContextDTO = exports.BallotDTO_BallotOptionMappingEntry = exports.BallotDTO_VotesEntry = exports.BallotDTO = exports.BallotRequestDTO = exports.VoteDTO = exports.DeletePollResponse = exports.DeletePollRequest = exports.UpdatePollResponse = exports.UpdatePollRequest = exports.CreatePollResponse = exports.CreatePollRequest = exports.ReadPollResponse = exports.ReadPollRequest = exports.pollFeatureDTOToJSON = exports.pollFeatureDTOFromJSON = exports.PollFeatureDTO = exports.protobufPackage = void 0;
const long_1 = __importDefault(require("long"));
const minimal_1 = __importDefault(require("protobufjs/minimal"));
const timestamp_1 = require("../google/protobuf/timestamp");
const discord_1 = require("../v1/discord");
exports.protobufPackage = "polls";
var PollFeatureDTO;
(function (PollFeatureDTO) {
    PollFeatureDTO[PollFeatureDTO["UNKNOWN"] = 0] = "UNKNOWN";
    PollFeatureDTO[PollFeatureDTO["DISABLE_RANDOMIZED_BALLOTS"] = 1] = "DISABLE_RANDOMIZED_BALLOTS";
    PollFeatureDTO[PollFeatureDTO["DISABLE_ANYTIME_RESULTS"] = 2] = "DISABLE_ANYTIME_RESULTS";
    PollFeatureDTO[PollFeatureDTO["UNRECOGNIZED"] = -1] = "UNRECOGNIZED";
})(PollFeatureDTO = exports.PollFeatureDTO || (exports.PollFeatureDTO = {}));
function pollFeatureDTOFromJSON(object) {
    switch (object) {
        case 0:
        case "UNKNOWN":
            return PollFeatureDTO.UNKNOWN;
        case 1:
        case "DISABLE_RANDOMIZED_BALLOTS":
            return PollFeatureDTO.DISABLE_RANDOMIZED_BALLOTS;
        case 2:
        case "DISABLE_ANYTIME_RESULTS":
            return PollFeatureDTO.DISABLE_ANYTIME_RESULTS;
        case -1:
        case "UNRECOGNIZED":
        default:
            return PollFeatureDTO.UNRECOGNIZED;
    }
}
exports.pollFeatureDTOFromJSON = pollFeatureDTOFromJSON;
function pollFeatureDTOToJSON(object) {
    switch (object) {
        case PollFeatureDTO.UNKNOWN:
            return "UNKNOWN";
        case PollFeatureDTO.DISABLE_RANDOMIZED_BALLOTS:
            return "DISABLE_RANDOMIZED_BALLOTS";
        case PollFeatureDTO.DISABLE_ANYTIME_RESULTS:
            return "DISABLE_ANYTIME_RESULTS";
        default:
            return "UNKNOWN";
    }
}
exports.pollFeatureDTOToJSON = pollFeatureDTOToJSON;
function createBaseReadPollRequest() {
    return { id: "" };
}
exports.ReadPollRequest = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.id !== "") {
            writer.uint32(10).string(message.id);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseReadPollRequest();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.id = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            id: isSet(object.id) ? String(object.id) : "",
        };
    },
    toJSON(message) {
        const obj = {};
        message.id !== undefined && (obj.id = message.id);
        return obj;
    },
    fromPartial(object) {
        const message = createBaseReadPollRequest();
        message.id = object.id ?? "";
        return message;
    },
};
function createBaseReadPollResponse() {
    return { poll: undefined };
}
exports.ReadPollResponse = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.poll !== undefined) {
            exports.PollDTO.encode(message.poll, writer.uint32(10).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseReadPollResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.poll = exports.PollDTO.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            poll: isSet(object.poll) ? exports.PollDTO.fromJSON(object.poll) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        message.poll !== undefined &&
            (obj.poll = message.poll ? exports.PollDTO.toJSON(message.poll) : undefined);
        return obj;
    },
    fromPartial(object) {
        const message = createBaseReadPollResponse();
        message.poll =
            object.poll !== undefined && object.poll !== null
                ? exports.PollDTO.fromPartial(object.poll)
                : undefined;
        return message;
    },
};
function createBaseCreatePollRequest() {
    return { pollRequest: undefined };
}
exports.CreatePollRequest = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.pollRequest !== undefined) {
            exports.PollRequestDTO.encode(message.pollRequest, writer.uint32(10).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseCreatePollRequest();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.pollRequest = exports.PollRequestDTO.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            pollRequest: isSet(object.pollRequest)
                ? exports.PollRequestDTO.fromJSON(object.pollRequest)
                : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        message.pollRequest !== undefined &&
            (obj.pollRequest = message.pollRequest
                ? exports.PollRequestDTO.toJSON(message.pollRequest)
                : undefined);
        return obj;
    },
    fromPartial(object) {
        const message = createBaseCreatePollRequest();
        message.pollRequest =
            object.pollRequest !== undefined && object.pollRequest !== null
                ? exports.PollRequestDTO.fromPartial(object.pollRequest)
                : undefined;
        return message;
    },
};
function createBaseCreatePollResponse() {
    return { poll: undefined };
}
exports.CreatePollResponse = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.poll !== undefined) {
            exports.PollDTO.encode(message.poll, writer.uint32(10).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseCreatePollResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.poll = exports.PollDTO.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            poll: isSet(object.poll) ? exports.PollDTO.fromJSON(object.poll) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        message.poll !== undefined &&
            (obj.poll = message.poll ? exports.PollDTO.toJSON(message.poll) : undefined);
        return obj;
    },
    fromPartial(object) {
        const message = createBaseCreatePollResponse();
        message.poll =
            object.poll !== undefined && object.poll !== null
                ? exports.PollDTO.fromPartial(object.poll)
                : undefined;
        return message;
    },
};
function createBaseUpdatePollRequest() {
    return { pollRequest: undefined };
}
exports.UpdatePollRequest = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.pollRequest !== undefined) {
            exports.PollRequestDTO.encode(message.pollRequest, writer.uint32(10).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseUpdatePollRequest();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.pollRequest = exports.PollRequestDTO.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            pollRequest: isSet(object.pollRequest)
                ? exports.PollRequestDTO.fromJSON(object.pollRequest)
                : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        message.pollRequest !== undefined &&
            (obj.pollRequest = message.pollRequest
                ? exports.PollRequestDTO.toJSON(message.pollRequest)
                : undefined);
        return obj;
    },
    fromPartial(object) {
        const message = createBaseUpdatePollRequest();
        message.pollRequest =
            object.pollRequest !== undefined && object.pollRequest !== null
                ? exports.PollRequestDTO.fromPartial(object.pollRequest)
                : undefined;
        return message;
    },
};
function createBaseUpdatePollResponse() {
    return { poll: undefined };
}
exports.UpdatePollResponse = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.poll !== undefined) {
            exports.PollDTO.encode(message.poll, writer.uint32(10).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseUpdatePollResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.poll = exports.PollDTO.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            poll: isSet(object.poll) ? exports.PollDTO.fromJSON(object.poll) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        message.poll !== undefined &&
            (obj.poll = message.poll ? exports.PollDTO.toJSON(message.poll) : undefined);
        return obj;
    },
    fromPartial(object) {
        const message = createBaseUpdatePollResponse();
        message.poll =
            object.poll !== undefined && object.poll !== null
                ? exports.PollDTO.fromPartial(object.poll)
                : undefined;
        return message;
    },
};
function createBaseDeletePollRequest() {
    return { pollId: "" };
}
exports.DeletePollRequest = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.pollId !== "") {
            writer.uint32(10).string(message.pollId);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseDeletePollRequest();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.pollId = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            pollId: isSet(object.pollId) ? String(object.pollId) : "",
        };
    },
    toJSON(message) {
        const obj = {};
        message.pollId !== undefined && (obj.pollId = message.pollId);
        return obj;
    },
    fromPartial(object) {
        const message = createBaseDeletePollRequest();
        message.pollId = object.pollId ?? "";
        return message;
    },
};
function createBaseDeletePollResponse() {
    return { poll: undefined };
}
exports.DeletePollResponse = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.poll !== undefined) {
            exports.PollDTO.encode(message.poll, writer.uint32(10).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseDeletePollResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.poll = exports.PollDTO.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            poll: isSet(object.poll) ? exports.PollDTO.fromJSON(object.poll) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        message.poll !== undefined &&
            (obj.poll = message.poll ? exports.PollDTO.toJSON(message.poll) : undefined);
        return obj;
    },
    fromPartial(object) {
        const message = createBaseDeletePollResponse();
        message.poll =
            object.poll !== undefined && object.poll !== null
                ? exports.PollDTO.fromPartial(object.poll)
                : undefined;
        return message;
    },
};
function createBaseVoteDTO() {
    return { option: "", rank: undefined };
}
exports.VoteDTO = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.option !== "") {
            writer.uint32(10).string(message.option);
        }
        if (message.rank !== undefined) {
            writer.uint32(16).int32(message.rank);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseVoteDTO();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.option = reader.string();
                    break;
                case 2:
                    message.rank = reader.int32();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            option: isSet(object.option) ? String(object.option) : "",
            rank: isSet(object.rank) ? Number(object.rank) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        message.option !== undefined && (obj.option = message.option);
        message.rank !== undefined && (obj.rank = Math.round(message.rank));
        return obj;
    },
    fromPartial(object) {
        const message = createBaseVoteDTO();
        message.option = object.option ?? "";
        message.rank = object.rank ?? undefined;
        return message;
    },
};
function createBaseBallotRequestDTO() {
    return { pollId: "", context: undefined };
}
exports.BallotRequestDTO = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.pollId !== "") {
            writer.uint32(10).string(message.pollId);
        }
        if (message.context?.$case === "discord") {
            exports.DiscordBallotContextDTO.encode(message.context.discord, writer.uint32(18).fork()).ldelim();
        }
        if (message.context?.$case === "web") {
            exports.WebBallotContextDTO.encode(message.context.web, writer.uint32(26).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseBallotRequestDTO();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.pollId = reader.string();
                    break;
                case 2:
                    message.context = {
                        $case: "discord",
                        discord: exports.DiscordBallotContextDTO.decode(reader, reader.uint32()),
                    };
                    break;
                case 3:
                    message.context = {
                        $case: "web",
                        web: exports.WebBallotContextDTO.decode(reader, reader.uint32()),
                    };
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            pollId: isSet(object.pollId) ? String(object.pollId) : "",
            context: isSet(object.discord)
                ? {
                    $case: "discord",
                    discord: exports.DiscordBallotContextDTO.fromJSON(object.discord),
                }
                : isSet(object.web)
                    ? { $case: "web", web: exports.WebBallotContextDTO.fromJSON(object.web) }
                    : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        message.pollId !== undefined && (obj.pollId = message.pollId);
        message.context?.$case === "discord" &&
            (obj.discord = message.context?.discord
                ? exports.DiscordBallotContextDTO.toJSON(message.context?.discord)
                : undefined);
        message.context?.$case === "web" &&
            (obj.web = message.context?.web
                ? exports.WebBallotContextDTO.toJSON(message.context?.web)
                : undefined);
        return obj;
    },
    fromPartial(object) {
        const message = createBaseBallotRequestDTO();
        message.pollId = object.pollId ?? "";
        if (object.context?.$case === "discord" &&
            object.context?.discord !== undefined &&
            object.context?.discord !== null) {
            message.context = {
                $case: "discord",
                discord: exports.DiscordBallotContextDTO.fromPartial(object.context.discord),
            };
        }
        if (object.context?.$case === "web" &&
            object.context?.web !== undefined &&
            object.context?.web !== null) {
            message.context = {
                $case: "web",
                web: exports.WebBallotContextDTO.fromPartial(object.context.web),
            };
        }
        return message;
    },
};
function createBaseBallotDTO() {
    return {
        id: "",
        pollId: "",
        userId: undefined,
        userName: undefined,
        createdAt: undefined,
        updatedAt: undefined,
        votes: {},
        ballotOptionMapping: {},
        context: undefined,
    };
}
exports.BallotDTO = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.id !== "") {
            writer.uint32(10).string(message.id);
        }
        if (message.pollId !== "") {
            writer.uint32(18).string(message.pollId);
        }
        if (message.userId !== undefined) {
            writer.uint32(26).string(message.userId);
        }
        if (message.userName !== undefined) {
            writer.uint32(34).string(message.userName);
        }
        if (message.createdAt !== undefined) {
            timestamp_1.Timestamp.encode(toTimestamp(message.createdAt), writer.uint32(42).fork()).ldelim();
        }
        if (message.updatedAt !== undefined) {
            timestamp_1.Timestamp.encode(toTimestamp(message.updatedAt), writer.uint32(50).fork()).ldelim();
        }
        Object.entries(message.votes).forEach(([key, value]) => {
            exports.BallotDTO_VotesEntry.encode({ key: key, value }, writer.uint32(58).fork()).ldelim();
        });
        Object.entries(message.ballotOptionMapping).forEach(([key, value]) => {
            exports.BallotDTO_BallotOptionMappingEntry.encode({ key: key, value }, writer.uint32(66).fork()).ldelim();
        });
        if (message.context?.$case === "discord") {
            exports.DiscordBallotContextDTO.encode(message.context.discord, writer.uint32(74).fork()).ldelim();
        }
        if (message.context?.$case === "web") {
            exports.WebBallotContextDTO.encode(message.context.web, writer.uint32(82).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseBallotDTO();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.id = reader.string();
                    break;
                case 2:
                    message.pollId = reader.string();
                    break;
                case 3:
                    message.userId = reader.string();
                    break;
                case 4:
                    message.userName = reader.string();
                    break;
                case 5:
                    message.createdAt = fromTimestamp(timestamp_1.Timestamp.decode(reader, reader.uint32()));
                    break;
                case 6:
                    message.updatedAt = fromTimestamp(timestamp_1.Timestamp.decode(reader, reader.uint32()));
                    break;
                case 7:
                    const entry7 = exports.BallotDTO_VotesEntry.decode(reader, reader.uint32());
                    if (entry7.value !== undefined) {
                        message.votes[entry7.key] = entry7.value;
                    }
                    break;
                case 8:
                    const entry8 = exports.BallotDTO_BallotOptionMappingEntry.decode(reader, reader.uint32());
                    if (entry8.value !== undefined) {
                        message.ballotOptionMapping[entry8.key] = entry8.value;
                    }
                    break;
                case 9:
                    message.context = {
                        $case: "discord",
                        discord: exports.DiscordBallotContextDTO.decode(reader, reader.uint32()),
                    };
                    break;
                case 10:
                    message.context = {
                        $case: "web",
                        web: exports.WebBallotContextDTO.decode(reader, reader.uint32()),
                    };
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            id: isSet(object.id) ? String(object.id) : "",
            pollId: isSet(object.pollId) ? String(object.pollId) : "",
            userId: isSet(object.userId) ? String(object.userId) : undefined,
            userName: isSet(object.userName) ? String(object.userName) : undefined,
            createdAt: isSet(object.createdAt)
                ? fromJsonTimestamp(object.createdAt)
                : undefined,
            updatedAt: isSet(object.updatedAt)
                ? fromJsonTimestamp(object.updatedAt)
                : undefined,
            votes: isObject(object.votes)
                ? Object.entries(object.votes).reduce((acc, [key, value]) => {
                    acc[key] = exports.VoteDTO.fromJSON(value);
                    return acc;
                }, {})
                : {},
            ballotOptionMapping: isObject(object.ballotOptionMapping)
                ? Object.entries(object.ballotOptionMapping).reduce((acc, [key, value]) => {
                    acc[key] = String(value);
                    return acc;
                }, {})
                : {},
            context: isSet(object.discord)
                ? {
                    $case: "discord",
                    discord: exports.DiscordBallotContextDTO.fromJSON(object.discord),
                }
                : isSet(object.web)
                    ? { $case: "web", web: exports.WebBallotContextDTO.fromJSON(object.web) }
                    : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        message.id !== undefined && (obj.id = message.id);
        message.pollId !== undefined && (obj.pollId = message.pollId);
        message.userId !== undefined && (obj.userId = message.userId);
        message.userName !== undefined && (obj.userName = message.userName);
        message.createdAt !== undefined &&
            (obj.createdAt = message.createdAt.toISOString());
        message.updatedAt !== undefined &&
            (obj.updatedAt = message.updatedAt.toISOString());
        obj.votes = {};
        if (message.votes) {
            Object.entries(message.votes).forEach(([k, v]) => {
                obj.votes[k] = exports.VoteDTO.toJSON(v);
            });
        }
        obj.ballotOptionMapping = {};
        if (message.ballotOptionMapping) {
            Object.entries(message.ballotOptionMapping).forEach(([k, v]) => {
                obj.ballotOptionMapping[k] = v;
            });
        }
        message.context?.$case === "discord" &&
            (obj.discord = message.context?.discord
                ? exports.DiscordBallotContextDTO.toJSON(message.context?.discord)
                : undefined);
        message.context?.$case === "web" &&
            (obj.web = message.context?.web
                ? exports.WebBallotContextDTO.toJSON(message.context?.web)
                : undefined);
        return obj;
    },
    fromPartial(object) {
        const message = createBaseBallotDTO();
        message.id = object.id ?? "";
        message.pollId = object.pollId ?? "";
        message.userId = object.userId ?? undefined;
        message.userName = object.userName ?? undefined;
        message.createdAt = object.createdAt ?? undefined;
        message.updatedAt = object.updatedAt ?? undefined;
        message.votes = Object.entries(object.votes ?? {}).reduce((acc, [key, value]) => {
            if (value !== undefined) {
                acc[key] = exports.VoteDTO.fromPartial(value);
            }
            return acc;
        }, {});
        message.ballotOptionMapping = Object.entries(object.ballotOptionMapping ?? {}).reduce((acc, [key, value]) => {
            if (value !== undefined) {
                acc[key] = String(value);
            }
            return acc;
        }, {});
        if (object.context?.$case === "discord" &&
            object.context?.discord !== undefined &&
            object.context?.discord !== null) {
            message.context = {
                $case: "discord",
                discord: exports.DiscordBallotContextDTO.fromPartial(object.context.discord),
            };
        }
        if (object.context?.$case === "web" &&
            object.context?.web !== undefined &&
            object.context?.web !== null) {
            message.context = {
                $case: "web",
                web: exports.WebBallotContextDTO.fromPartial(object.context.web),
            };
        }
        return message;
    },
};
function createBaseBallotDTO_VotesEntry() {
    return { key: "", value: undefined };
}
exports.BallotDTO_VotesEntry = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.key !== "") {
            writer.uint32(10).string(message.key);
        }
        if (message.value !== undefined) {
            exports.VoteDTO.encode(message.value, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseBallotDTO_VotesEntry();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.key = reader.string();
                    break;
                case 2:
                    message.value = exports.VoteDTO.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            key: isSet(object.key) ? String(object.key) : "",
            value: isSet(object.value) ? exports.VoteDTO.fromJSON(object.value) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        message.key !== undefined && (obj.key = message.key);
        message.value !== undefined &&
            (obj.value = message.value ? exports.VoteDTO.toJSON(message.value) : undefined);
        return obj;
    },
    fromPartial(object) {
        const message = createBaseBallotDTO_VotesEntry();
        message.key = object.key ?? "";
        message.value =
            object.value !== undefined && object.value !== null
                ? exports.VoteDTO.fromPartial(object.value)
                : undefined;
        return message;
    },
};
function createBaseBallotDTO_BallotOptionMappingEntry() {
    return { key: "", value: "" };
}
exports.BallotDTO_BallotOptionMappingEntry = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.key !== "") {
            writer.uint32(10).string(message.key);
        }
        if (message.value !== "") {
            writer.uint32(18).string(message.value);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseBallotDTO_BallotOptionMappingEntry();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.key = reader.string();
                    break;
                case 2:
                    message.value = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            key: isSet(object.key) ? String(object.key) : "",
            value: isSet(object.value) ? String(object.value) : "",
        };
    },
    toJSON(message) {
        const obj = {};
        message.key !== undefined && (obj.key = message.key);
        message.value !== undefined && (obj.value = message.value);
        return obj;
    },
    fromPartial(object) {
        const message = createBaseBallotDTO_BallotOptionMappingEntry();
        message.key = object.key ?? "";
        message.value = object.value ?? "";
        return message;
    },
};
function createBaseDiscordBallotContextDTO() {
    return { userId: "", userName: "" };
}
exports.DiscordBallotContextDTO = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.userId !== "") {
            writer.uint32(10).string(message.userId);
        }
        if (message.userName !== "") {
            writer.uint32(18).string(message.userName);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseDiscordBallotContextDTO();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.userId = reader.string();
                    break;
                case 2:
                    message.userName = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            userId: isSet(object.userId) ? String(object.userId) : "",
            userName: isSet(object.userName) ? String(object.userName) : "",
        };
    },
    toJSON(message) {
        const obj = {};
        message.userId !== undefined && (obj.userId = message.userId);
        message.userName !== undefined && (obj.userName = message.userName);
        return obj;
    },
    fromPartial(object) {
        const message = createBaseDiscordBallotContextDTO();
        message.userId = object.userId ?? "";
        message.userName = object.userName ?? "";
        return message;
    },
};
function createBaseWebBallotContextDTO() {
    return { userId: "", userName: "" };
}
exports.WebBallotContextDTO = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.userId !== "") {
            writer.uint32(10).string(message.userId);
        }
        if (message.userName !== "") {
            writer.uint32(18).string(message.userName);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseWebBallotContextDTO();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.userId = reader.string();
                    break;
                case 2:
                    message.userName = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            userId: isSet(object.userId) ? String(object.userId) : "",
            userName: isSet(object.userName) ? String(object.userName) : "",
        };
    },
    toJSON(message) {
        const obj = {};
        message.userId !== undefined && (obj.userId = message.userId);
        message.userName !== undefined && (obj.userName = message.userName);
        return obj;
    },
    fromPartial(object) {
        const message = createBaseWebBallotContextDTO();
        message.userId = object.userId ?? "";
        message.userName = object.userName ?? "";
        return message;
    },
};
function createBasePollRequestDTO() {
    return { topic: "", options: {}, features: [], context: undefined };
}
exports.PollRequestDTO = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.topic !== "") {
            writer.uint32(10).string(message.topic);
        }
        Object.entries(message.options).forEach(([key, value]) => {
            exports.PollRequestDTO_OptionsEntry.encode({ key: key, value }, writer.uint32(18).fork()).ldelim();
        });
        writer.uint32(26).fork();
        for (const v of message.features) {
            writer.int32(v);
        }
        writer.ldelim();
        if (message.context?.$case === "discord") {
            exports.DiscordPollContextDTO.encode(message.context.discord, writer.uint32(34).fork()).ldelim();
        }
        if (message.context?.$case === "web") {
            exports.WebPollContextDTO.encode(message.context.web, writer.uint32(42).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBasePollRequestDTO();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.topic = reader.string();
                    break;
                case 2:
                    const entry2 = exports.PollRequestDTO_OptionsEntry.decode(reader, reader.uint32());
                    if (entry2.value !== undefined) {
                        message.options[entry2.key] = entry2.value;
                    }
                    break;
                case 3:
                    if ((tag & 7) === 2) {
                        const end2 = reader.uint32() + reader.pos;
                        while (reader.pos < end2) {
                            message.features.push(reader.int32());
                        }
                    }
                    else {
                        message.features.push(reader.int32());
                    }
                    break;
                case 4:
                    message.context = {
                        $case: "discord",
                        discord: exports.DiscordPollContextDTO.decode(reader, reader.uint32()),
                    };
                    break;
                case 5:
                    message.context = {
                        $case: "web",
                        web: exports.WebPollContextDTO.decode(reader, reader.uint32()),
                    };
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            topic: isSet(object.topic) ? String(object.topic) : "",
            options: isObject(object.options)
                ? Object.entries(object.options).reduce((acc, [key, value]) => {
                    acc[key] = String(value);
                    return acc;
                }, {})
                : {},
            features: Array.isArray(object?.features)
                ? object.features.map((e) => pollFeatureDTOFromJSON(e))
                : [],
            context: isSet(object.discord)
                ? {
                    $case: "discord",
                    discord: exports.DiscordPollContextDTO.fromJSON(object.discord),
                }
                : isSet(object.web)
                    ? { $case: "web", web: exports.WebPollContextDTO.fromJSON(object.web) }
                    : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        message.topic !== undefined && (obj.topic = message.topic);
        obj.options = {};
        if (message.options) {
            Object.entries(message.options).forEach(([k, v]) => {
                obj.options[k] = v;
            });
        }
        if (message.features) {
            obj.features = message.features.map((e) => pollFeatureDTOToJSON(e));
        }
        else {
            obj.features = [];
        }
        message.context?.$case === "discord" &&
            (obj.discord = message.context?.discord
                ? exports.DiscordPollContextDTO.toJSON(message.context?.discord)
                : undefined);
        message.context?.$case === "web" &&
            (obj.web = message.context?.web
                ? exports.WebPollContextDTO.toJSON(message.context?.web)
                : undefined);
        return obj;
    },
    fromPartial(object) {
        const message = createBasePollRequestDTO();
        message.topic = object.topic ?? "";
        message.options = Object.entries(object.options ?? {}).reduce((acc, [key, value]) => {
            if (value !== undefined) {
                acc[key] = String(value);
            }
            return acc;
        }, {});
        message.features = object.features?.map((e) => e) || [];
        if (object.context?.$case === "discord" &&
            object.context?.discord !== undefined &&
            object.context?.discord !== null) {
            message.context = {
                $case: "discord",
                discord: exports.DiscordPollContextDTO.fromPartial(object.context.discord),
            };
        }
        if (object.context?.$case === "web" &&
            object.context?.web !== undefined &&
            object.context?.web !== null) {
            message.context = {
                $case: "web",
                web: exports.WebPollContextDTO.fromPartial(object.context.web),
            };
        }
        return message;
    },
};
function createBasePollRequestDTO_OptionsEntry() {
    return { key: "", value: "" };
}
exports.PollRequestDTO_OptionsEntry = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.key !== "") {
            writer.uint32(10).string(message.key);
        }
        if (message.value !== "") {
            writer.uint32(18).string(message.value);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBasePollRequestDTO_OptionsEntry();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.key = reader.string();
                    break;
                case 2:
                    message.value = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            key: isSet(object.key) ? String(object.key) : "",
            value: isSet(object.value) ? String(object.value) : "",
        };
    },
    toJSON(message) {
        const obj = {};
        message.key !== undefined && (obj.key = message.key);
        message.value !== undefined && (obj.value = message.value);
        return obj;
    },
    fromPartial(object) {
        const message = createBasePollRequestDTO_OptionsEntry();
        message.key = object.key ?? "";
        message.value = object.value ?? "";
        return message;
    },
};
function createBasePollDTO() {
    return {
        id: "",
        guildId: undefined,
        ownerId: undefined,
        createdAt: undefined,
        closesAt: undefined,
        topic: "",
        options: {},
        ballots: {},
        features: [],
        messageRef: undefined,
        context: undefined,
    };
}
exports.PollDTO = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.id !== "") {
            writer.uint32(10).string(message.id);
        }
        if (message.guildId !== undefined) {
            writer.uint32(18).string(message.guildId);
        }
        if (message.ownerId !== undefined) {
            writer.uint32(26).string(message.ownerId);
        }
        if (message.createdAt !== undefined) {
            timestamp_1.Timestamp.encode(toTimestamp(message.createdAt), writer.uint32(34).fork()).ldelim();
        }
        if (message.closesAt !== undefined) {
            timestamp_1.Timestamp.encode(toTimestamp(message.closesAt), writer.uint32(42).fork()).ldelim();
        }
        if (message.topic !== "") {
            writer.uint32(50).string(message.topic);
        }
        Object.entries(message.options).forEach(([key, value]) => {
            exports.PollDTO_OptionsEntry.encode({ key: key, value }, writer.uint32(58).fork()).ldelim();
        });
        Object.entries(message.ballots).forEach(([key, value]) => {
            exports.PollDTO_BallotsEntry.encode({ key: key, value }, writer.uint32(66).fork()).ldelim();
        });
        writer.uint32(74).fork();
        for (const v of message.features) {
            writer.int32(v);
        }
        writer.ldelim();
        if (message.messageRef !== undefined) {
            discord_1.MessageRefDTO.encode(message.messageRef, writer.uint32(82).fork()).ldelim();
        }
        if (message.context?.$case === "discord") {
            exports.DiscordPollContextDTO.encode(message.context.discord, writer.uint32(90).fork()).ldelim();
        }
        if (message.context?.$case === "web") {
            exports.WebPollContextDTO.encode(message.context.web, writer.uint32(98).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBasePollDTO();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.id = reader.string();
                    break;
                case 2:
                    message.guildId = reader.string();
                    break;
                case 3:
                    message.ownerId = reader.string();
                    break;
                case 4:
                    message.createdAt = fromTimestamp(timestamp_1.Timestamp.decode(reader, reader.uint32()));
                    break;
                case 5:
                    message.closesAt = fromTimestamp(timestamp_1.Timestamp.decode(reader, reader.uint32()));
                    break;
                case 6:
                    message.topic = reader.string();
                    break;
                case 7:
                    const entry7 = exports.PollDTO_OptionsEntry.decode(reader, reader.uint32());
                    if (entry7.value !== undefined) {
                        message.options[entry7.key] = entry7.value;
                    }
                    break;
                case 8:
                    const entry8 = exports.PollDTO_BallotsEntry.decode(reader, reader.uint32());
                    if (entry8.value !== undefined) {
                        message.ballots[entry8.key] = entry8.value;
                    }
                    break;
                case 9:
                    if ((tag & 7) === 2) {
                        const end2 = reader.uint32() + reader.pos;
                        while (reader.pos < end2) {
                            message.features.push(reader.int32());
                        }
                    }
                    else {
                        message.features.push(reader.int32());
                    }
                    break;
                case 10:
                    message.messageRef = discord_1.MessageRefDTO.decode(reader, reader.uint32());
                    break;
                case 11:
                    message.context = {
                        $case: "discord",
                        discord: exports.DiscordPollContextDTO.decode(reader, reader.uint32()),
                    };
                    break;
                case 12:
                    message.context = {
                        $case: "web",
                        web: exports.WebPollContextDTO.decode(reader, reader.uint32()),
                    };
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            id: isSet(object.id) ? String(object.id) : "",
            guildId: isSet(object.guildId) ? String(object.guildId) : undefined,
            ownerId: isSet(object.ownerId) ? String(object.ownerId) : undefined,
            createdAt: isSet(object.createdAt)
                ? fromJsonTimestamp(object.createdAt)
                : undefined,
            closesAt: isSet(object.closesAt)
                ? fromJsonTimestamp(object.closesAt)
                : undefined,
            topic: isSet(object.topic) ? String(object.topic) : "",
            options: isObject(object.options)
                ? Object.entries(object.options).reduce((acc, [key, value]) => {
                    acc[key] = String(value);
                    return acc;
                }, {})
                : {},
            ballots: isObject(object.ballots)
                ? Object.entries(object.ballots).reduce((acc, [key, value]) => {
                    acc[key] = exports.BallotDTO.fromJSON(value);
                    return acc;
                }, {})
                : {},
            features: Array.isArray(object?.features)
                ? object.features.map((e) => pollFeatureDTOFromJSON(e))
                : [],
            messageRef: isSet(object.messageRef)
                ? discord_1.MessageRefDTO.fromJSON(object.messageRef)
                : undefined,
            context: isSet(object.discord)
                ? {
                    $case: "discord",
                    discord: exports.DiscordPollContextDTO.fromJSON(object.discord),
                }
                : isSet(object.web)
                    ? { $case: "web", web: exports.WebPollContextDTO.fromJSON(object.web) }
                    : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        message.id !== undefined && (obj.id = message.id);
        message.guildId !== undefined && (obj.guildId = message.guildId);
        message.ownerId !== undefined && (obj.ownerId = message.ownerId);
        message.createdAt !== undefined &&
            (obj.createdAt = message.createdAt.toISOString());
        message.closesAt !== undefined &&
            (obj.closesAt = message.closesAt.toISOString());
        message.topic !== undefined && (obj.topic = message.topic);
        obj.options = {};
        if (message.options) {
            Object.entries(message.options).forEach(([k, v]) => {
                obj.options[k] = v;
            });
        }
        obj.ballots = {};
        if (message.ballots) {
            Object.entries(message.ballots).forEach(([k, v]) => {
                obj.ballots[k] = exports.BallotDTO.toJSON(v);
            });
        }
        if (message.features) {
            obj.features = message.features.map((e) => pollFeatureDTOToJSON(e));
        }
        else {
            obj.features = [];
        }
        message.messageRef !== undefined &&
            (obj.messageRef = message.messageRef
                ? discord_1.MessageRefDTO.toJSON(message.messageRef)
                : undefined);
        message.context?.$case === "discord" &&
            (obj.discord = message.context?.discord
                ? exports.DiscordPollContextDTO.toJSON(message.context?.discord)
                : undefined);
        message.context?.$case === "web" &&
            (obj.web = message.context?.web
                ? exports.WebPollContextDTO.toJSON(message.context?.web)
                : undefined);
        return obj;
    },
    fromPartial(object) {
        const message = createBasePollDTO();
        message.id = object.id ?? "";
        message.guildId = object.guildId ?? undefined;
        message.ownerId = object.ownerId ?? undefined;
        message.createdAt = object.createdAt ?? undefined;
        message.closesAt = object.closesAt ?? undefined;
        message.topic = object.topic ?? "";
        message.options = Object.entries(object.options ?? {}).reduce((acc, [key, value]) => {
            if (value !== undefined) {
                acc[key] = String(value);
            }
            return acc;
        }, {});
        message.ballots = Object.entries(object.ballots ?? {}).reduce((acc, [key, value]) => {
            if (value !== undefined) {
                acc[key] = exports.BallotDTO.fromPartial(value);
            }
            return acc;
        }, {});
        message.features = object.features?.map((e) => e) || [];
        message.messageRef =
            object.messageRef !== undefined && object.messageRef !== null
                ? discord_1.MessageRefDTO.fromPartial(object.messageRef)
                : undefined;
        if (object.context?.$case === "discord" &&
            object.context?.discord !== undefined &&
            object.context?.discord !== null) {
            message.context = {
                $case: "discord",
                discord: exports.DiscordPollContextDTO.fromPartial(object.context.discord),
            };
        }
        if (object.context?.$case === "web" &&
            object.context?.web !== undefined &&
            object.context?.web !== null) {
            message.context = {
                $case: "web",
                web: exports.WebPollContextDTO.fromPartial(object.context.web),
            };
        }
        return message;
    },
};
function createBasePollDTO_OptionsEntry() {
    return { key: "", value: "" };
}
exports.PollDTO_OptionsEntry = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.key !== "") {
            writer.uint32(10).string(message.key);
        }
        if (message.value !== "") {
            writer.uint32(18).string(message.value);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBasePollDTO_OptionsEntry();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.key = reader.string();
                    break;
                case 2:
                    message.value = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            key: isSet(object.key) ? String(object.key) : "",
            value: isSet(object.value) ? String(object.value) : "",
        };
    },
    toJSON(message) {
        const obj = {};
        message.key !== undefined && (obj.key = message.key);
        message.value !== undefined && (obj.value = message.value);
        return obj;
    },
    fromPartial(object) {
        const message = createBasePollDTO_OptionsEntry();
        message.key = object.key ?? "";
        message.value = object.value ?? "";
        return message;
    },
};
function createBasePollDTO_BallotsEntry() {
    return { key: "", value: undefined };
}
exports.PollDTO_BallotsEntry = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.key !== "") {
            writer.uint32(10).string(message.key);
        }
        if (message.value !== undefined) {
            exports.BallotDTO.encode(message.value, writer.uint32(18).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBasePollDTO_BallotsEntry();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.key = reader.string();
                    break;
                case 2:
                    message.value = exports.BallotDTO.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            key: isSet(object.key) ? String(object.key) : "",
            value: isSet(object.value) ? exports.BallotDTO.fromJSON(object.value) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        message.key !== undefined && (obj.key = message.key);
        message.value !== undefined &&
            (obj.value = message.value ? exports.BallotDTO.toJSON(message.value) : undefined);
        return obj;
    },
    fromPartial(object) {
        const message = createBasePollDTO_BallotsEntry();
        message.key = object.key ?? "";
        message.value =
            object.value !== undefined && object.value !== null
                ? exports.BallotDTO.fromPartial(object.value)
                : undefined;
        return message;
    },
};
function createBaseDiscordPollContextDTO() {
    return { guildId: "", ownerId: "", messageRef: undefined };
}
exports.DiscordPollContextDTO = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.guildId !== "") {
            writer.uint32(10).string(message.guildId);
        }
        if (message.ownerId !== "") {
            writer.uint32(18).string(message.ownerId);
        }
        if (message.messageRef !== undefined) {
            discord_1.MessageRefDTO.encode(message.messageRef, writer.uint32(26).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseDiscordPollContextDTO();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.guildId = reader.string();
                    break;
                case 2:
                    message.ownerId = reader.string();
                    break;
                case 3:
                    message.messageRef = discord_1.MessageRefDTO.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            guildId: isSet(object.guildId) ? String(object.guildId) : "",
            ownerId: isSet(object.ownerId) ? String(object.ownerId) : "",
            messageRef: isSet(object.messageRef)
                ? discord_1.MessageRefDTO.fromJSON(object.messageRef)
                : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        message.guildId !== undefined && (obj.guildId = message.guildId);
        message.ownerId !== undefined && (obj.ownerId = message.ownerId);
        message.messageRef !== undefined &&
            (obj.messageRef = message.messageRef
                ? discord_1.MessageRefDTO.toJSON(message.messageRef)
                : undefined);
        return obj;
    },
    fromPartial(object) {
        const message = createBaseDiscordPollContextDTO();
        message.guildId = object.guildId ?? "";
        message.ownerId = object.ownerId ?? "";
        message.messageRef =
            object.messageRef !== undefined && object.messageRef !== null
                ? discord_1.MessageRefDTO.fromPartial(object.messageRef)
                : undefined;
        return message;
    },
};
function createBaseWebPollContextDTO() {
    return { ownerId: "" };
}
exports.WebPollContextDTO = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.ownerId !== "") {
            writer.uint32(10).string(message.ownerId);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseWebPollContextDTO();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.ownerId = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            ownerId: isSet(object.ownerId) ? String(object.ownerId) : "",
        };
    },
    toJSON(message) {
        const obj = {};
        message.ownerId !== undefined && (obj.ownerId = message.ownerId);
        return obj;
    },
    fromPartial(object) {
        const message = createBaseWebPollContextDTO();
        message.ownerId = object.ownerId ?? "";
        return message;
    },
};
class PollsServiceClientImpl {
    constructor(rpc) {
        this.rpc = rpc;
        this.CreatePoll = this.CreatePoll.bind(this);
        this.ReadPoll = this.ReadPoll.bind(this);
        this.UpdatePoll = this.UpdatePoll.bind(this);
        this.DeletePoll = this.DeletePoll.bind(this);
    }
    CreatePoll(request) {
        const data = exports.CreatePollRequest.encode(request).finish();
        const promise = this.rpc.request("polls.PollsService", "CreatePoll", data);
        return promise.then((data) => exports.CreatePollResponse.decode(new minimal_1.default.Reader(data)));
    }
    ReadPoll(request) {
        const data = exports.ReadPollRequest.encode(request).finish();
        const promise = this.rpc.request("polls.PollsService", "ReadPoll", data);
        return promise.then((data) => exports.ReadPollResponse.decode(new minimal_1.default.Reader(data)));
    }
    UpdatePoll(request) {
        const data = exports.UpdatePollRequest.encode(request).finish();
        const promise = this.rpc.request("polls.PollsService", "UpdatePoll", data);
        return promise.then((data) => exports.UpdatePollResponse.decode(new minimal_1.default.Reader(data)));
    }
    DeletePoll(request) {
        const data = exports.DeletePollRequest.encode(request).finish();
        const promise = this.rpc.request("polls.PollsService", "DeletePoll", data);
        return promise.then((data) => exports.DeletePollResponse.decode(new minimal_1.default.Reader(data)));
    }
}
exports.PollsServiceClientImpl = PollsServiceClientImpl;
function toTimestamp(date) {
    const seconds = numberToLong(date.getTime() / 1000);
    const nanos = (date.getTime() % 1000) * 1000000;
    return { seconds, nanos };
}
function fromTimestamp(t) {
    let millis = t.seconds.toNumber() * 1000;
    millis += t.nanos / 1000000;
    return new Date(millis);
}
function fromJsonTimestamp(o) {
    if (o instanceof Date) {
        return o;
    }
    else if (typeof o === "string") {
        return new Date(o);
    }
    else {
        return fromTimestamp(timestamp_1.Timestamp.fromJSON(o));
    }
}
function numberToLong(number) {
    return long_1.default.fromNumber(number);
}
if (minimal_1.default.util.Long !== long_1.default) {
    minimal_1.default.util.Long = long_1.default;
    minimal_1.default.configure();
}
function isObject(value) {
    return typeof value === "object" && value !== null;
}
function isSet(value) {
    return value !== null && value !== undefined;
}
//# sourceMappingURL=polls.js.map