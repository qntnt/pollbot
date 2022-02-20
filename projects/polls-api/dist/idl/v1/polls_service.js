"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PollsServiceClientImpl = exports.DeletePollResponse = exports.DeletePollRequest = exports.UpdatePollResponse = exports.UpdatePollRequest = exports.CreatePollResponse = exports.CreatePollRequest = exports.ReadPollResponse = exports.ReadPollRequest = exports.protobufPackage = void 0;
const long_1 = __importDefault(require("long"));
const minimal_1 = __importDefault(require("protobufjs/minimal"));
const polls_1 = require("../v1/polls");
exports.protobufPackage = "polls_service";
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
            polls_1.PollDTO.encode(message.poll, writer.uint32(10).fork()).ldelim();
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
                    message.poll = polls_1.PollDTO.decode(reader, reader.uint32());
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
            poll: isSet(object.poll) ? polls_1.PollDTO.fromJSON(object.poll) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        message.poll !== undefined &&
            (obj.poll = message.poll ? polls_1.PollDTO.toJSON(message.poll) : undefined);
        return obj;
    },
    fromPartial(object) {
        const message = createBaseReadPollResponse();
        message.poll =
            object.poll !== undefined && object.poll !== null
                ? polls_1.PollDTO.fromPartial(object.poll)
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
            polls_1.PollRequestDTO.encode(message.pollRequest, writer.uint32(10).fork()).ldelim();
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
                    message.pollRequest = polls_1.PollRequestDTO.decode(reader, reader.uint32());
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
                ? polls_1.PollRequestDTO.fromJSON(object.pollRequest)
                : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        message.pollRequest !== undefined &&
            (obj.pollRequest = message.pollRequest
                ? polls_1.PollRequestDTO.toJSON(message.pollRequest)
                : undefined);
        return obj;
    },
    fromPartial(object) {
        const message = createBaseCreatePollRequest();
        message.pollRequest =
            object.pollRequest !== undefined && object.pollRequest !== null
                ? polls_1.PollRequestDTO.fromPartial(object.pollRequest)
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
            polls_1.PollDTO.encode(message.poll, writer.uint32(10).fork()).ldelim();
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
                    message.poll = polls_1.PollDTO.decode(reader, reader.uint32());
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
            poll: isSet(object.poll) ? polls_1.PollDTO.fromJSON(object.poll) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        message.poll !== undefined &&
            (obj.poll = message.poll ? polls_1.PollDTO.toJSON(message.poll) : undefined);
        return obj;
    },
    fromPartial(object) {
        const message = createBaseCreatePollResponse();
        message.poll =
            object.poll !== undefined && object.poll !== null
                ? polls_1.PollDTO.fromPartial(object.poll)
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
            polls_1.PollRequestDTO.encode(message.pollRequest, writer.uint32(10).fork()).ldelim();
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
                    message.pollRequest = polls_1.PollRequestDTO.decode(reader, reader.uint32());
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
                ? polls_1.PollRequestDTO.fromJSON(object.pollRequest)
                : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        message.pollRequest !== undefined &&
            (obj.pollRequest = message.pollRequest
                ? polls_1.PollRequestDTO.toJSON(message.pollRequest)
                : undefined);
        return obj;
    },
    fromPartial(object) {
        const message = createBaseUpdatePollRequest();
        message.pollRequest =
            object.pollRequest !== undefined && object.pollRequest !== null
                ? polls_1.PollRequestDTO.fromPartial(object.pollRequest)
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
            polls_1.PollDTO.encode(message.poll, writer.uint32(10).fork()).ldelim();
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
                    message.poll = polls_1.PollDTO.decode(reader, reader.uint32());
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
            poll: isSet(object.poll) ? polls_1.PollDTO.fromJSON(object.poll) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        message.poll !== undefined &&
            (obj.poll = message.poll ? polls_1.PollDTO.toJSON(message.poll) : undefined);
        return obj;
    },
    fromPartial(object) {
        const message = createBaseUpdatePollResponse();
        message.poll =
            object.poll !== undefined && object.poll !== null
                ? polls_1.PollDTO.fromPartial(object.poll)
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
            polls_1.PollDTO.encode(message.poll, writer.uint32(10).fork()).ldelim();
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
                    message.poll = polls_1.PollDTO.decode(reader, reader.uint32());
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
            poll: isSet(object.poll) ? polls_1.PollDTO.fromJSON(object.poll) : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        message.poll !== undefined &&
            (obj.poll = message.poll ? polls_1.PollDTO.toJSON(message.poll) : undefined);
        return obj;
    },
    fromPartial(object) {
        const message = createBaseDeletePollResponse();
        message.poll =
            object.poll !== undefined && object.poll !== null
                ? polls_1.PollDTO.fromPartial(object.poll)
                : undefined;
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
        const promise = this.rpc.request("polls_service.PollsService", "CreatePoll", data);
        return promise.then((data) => exports.CreatePollResponse.decode(new minimal_1.default.Reader(data)));
    }
    ReadPoll(request) {
        const data = exports.ReadPollRequest.encode(request).finish();
        const promise = this.rpc.request("polls_service.PollsService", "ReadPoll", data);
        return promise.then((data) => exports.ReadPollResponse.decode(new minimal_1.default.Reader(data)));
    }
    UpdatePoll(request) {
        const data = exports.UpdatePollRequest.encode(request).finish();
        const promise = this.rpc.request("polls_service.PollsService", "UpdatePoll", data);
        return promise.then((data) => exports.UpdatePollResponse.decode(new minimal_1.default.Reader(data)));
    }
    DeletePoll(request) {
        const data = exports.DeletePollRequest.encode(request).finish();
        const promise = this.rpc.request("polls_service.PollsService", "DeletePoll", data);
        return promise.then((data) => exports.DeletePollResponse.decode(new minimal_1.default.Reader(data)));
    }
}
exports.PollsServiceClientImpl = PollsServiceClientImpl;
if (minimal_1.default.util.Long !== long_1.default) {
    minimal_1.default.util.Long = long_1.default;
    minimal_1.default.configure();
}
function isSet(value) {
    return value !== null && value !== undefined;
}
//# sourceMappingURL=polls_service.js.map