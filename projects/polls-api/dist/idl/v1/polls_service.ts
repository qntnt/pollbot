/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";
import { PollDTO, PollRequestDTO } from "../v1/polls";

export const protobufPackage = "polls_service";

export interface ReadPollRequest {
  id: string;
}

export interface ReadPollResponse {
  poll: PollDTO | undefined;
}

export interface CreatePollRequest {
  pollRequest: PollRequestDTO | undefined;
}

export interface CreatePollResponse {
  poll: PollDTO | undefined;
}

export interface UpdatePollRequest {
  pollRequest: PollRequestDTO | undefined;
}

export interface UpdatePollResponse {
  poll: PollDTO | undefined;
}

export interface DeletePollRequest {
  pollId: string;
}

export interface DeletePollResponse {
  poll: PollDTO | undefined;
}

function createBaseReadPollRequest(): ReadPollRequest {
  return { id: "" };
}

export const ReadPollRequest = {
  encode(
    message: ReadPollRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ReadPollRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
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

  fromJSON(object: any): ReadPollRequest {
    return {
      id: isSet(object.id) ? String(object.id) : "",
    };
  },

  toJSON(message: ReadPollRequest): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<ReadPollRequest>, I>>(
    object: I
  ): ReadPollRequest {
    const message = createBaseReadPollRequest();
    message.id = object.id ?? "";
    return message;
  },
};

function createBaseReadPollResponse(): ReadPollResponse {
  return { poll: undefined };
}

export const ReadPollResponse = {
  encode(
    message: ReadPollResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.poll !== undefined) {
      PollDTO.encode(message.poll, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ReadPollResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseReadPollResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.poll = PollDTO.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ReadPollResponse {
    return {
      poll: isSet(object.poll) ? PollDTO.fromJSON(object.poll) : undefined,
    };
  },

  toJSON(message: ReadPollResponse): unknown {
    const obj: any = {};
    message.poll !== undefined &&
      (obj.poll = message.poll ? PollDTO.toJSON(message.poll) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<ReadPollResponse>, I>>(
    object: I
  ): ReadPollResponse {
    const message = createBaseReadPollResponse();
    message.poll =
      object.poll !== undefined && object.poll !== null
        ? PollDTO.fromPartial(object.poll)
        : undefined;
    return message;
  },
};

function createBaseCreatePollRequest(): CreatePollRequest {
  return { pollRequest: undefined };
}

export const CreatePollRequest = {
  encode(
    message: CreatePollRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.pollRequest !== undefined) {
      PollRequestDTO.encode(
        message.pollRequest,
        writer.uint32(10).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CreatePollRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCreatePollRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.pollRequest = PollRequestDTO.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): CreatePollRequest {
    return {
      pollRequest: isSet(object.pollRequest)
        ? PollRequestDTO.fromJSON(object.pollRequest)
        : undefined,
    };
  },

  toJSON(message: CreatePollRequest): unknown {
    const obj: any = {};
    message.pollRequest !== undefined &&
      (obj.pollRequest = message.pollRequest
        ? PollRequestDTO.toJSON(message.pollRequest)
        : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<CreatePollRequest>, I>>(
    object: I
  ): CreatePollRequest {
    const message = createBaseCreatePollRequest();
    message.pollRequest =
      object.pollRequest !== undefined && object.pollRequest !== null
        ? PollRequestDTO.fromPartial(object.pollRequest)
        : undefined;
    return message;
  },
};

function createBaseCreatePollResponse(): CreatePollResponse {
  return { poll: undefined };
}

export const CreatePollResponse = {
  encode(
    message: CreatePollResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.poll !== undefined) {
      PollDTO.encode(message.poll, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CreatePollResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCreatePollResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.poll = PollDTO.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): CreatePollResponse {
    return {
      poll: isSet(object.poll) ? PollDTO.fromJSON(object.poll) : undefined,
    };
  },

  toJSON(message: CreatePollResponse): unknown {
    const obj: any = {};
    message.poll !== undefined &&
      (obj.poll = message.poll ? PollDTO.toJSON(message.poll) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<CreatePollResponse>, I>>(
    object: I
  ): CreatePollResponse {
    const message = createBaseCreatePollResponse();
    message.poll =
      object.poll !== undefined && object.poll !== null
        ? PollDTO.fromPartial(object.poll)
        : undefined;
    return message;
  },
};

function createBaseUpdatePollRequest(): UpdatePollRequest {
  return { pollRequest: undefined };
}

export const UpdatePollRequest = {
  encode(
    message: UpdatePollRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.pollRequest !== undefined) {
      PollRequestDTO.encode(
        message.pollRequest,
        writer.uint32(10).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): UpdatePollRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUpdatePollRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.pollRequest = PollRequestDTO.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): UpdatePollRequest {
    return {
      pollRequest: isSet(object.pollRequest)
        ? PollRequestDTO.fromJSON(object.pollRequest)
        : undefined,
    };
  },

  toJSON(message: UpdatePollRequest): unknown {
    const obj: any = {};
    message.pollRequest !== undefined &&
      (obj.pollRequest = message.pollRequest
        ? PollRequestDTO.toJSON(message.pollRequest)
        : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<UpdatePollRequest>, I>>(
    object: I
  ): UpdatePollRequest {
    const message = createBaseUpdatePollRequest();
    message.pollRequest =
      object.pollRequest !== undefined && object.pollRequest !== null
        ? PollRequestDTO.fromPartial(object.pollRequest)
        : undefined;
    return message;
  },
};

function createBaseUpdatePollResponse(): UpdatePollResponse {
  return { poll: undefined };
}

export const UpdatePollResponse = {
  encode(
    message: UpdatePollResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.poll !== undefined) {
      PollDTO.encode(message.poll, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): UpdatePollResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUpdatePollResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.poll = PollDTO.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): UpdatePollResponse {
    return {
      poll: isSet(object.poll) ? PollDTO.fromJSON(object.poll) : undefined,
    };
  },

  toJSON(message: UpdatePollResponse): unknown {
    const obj: any = {};
    message.poll !== undefined &&
      (obj.poll = message.poll ? PollDTO.toJSON(message.poll) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<UpdatePollResponse>, I>>(
    object: I
  ): UpdatePollResponse {
    const message = createBaseUpdatePollResponse();
    message.poll =
      object.poll !== undefined && object.poll !== null
        ? PollDTO.fromPartial(object.poll)
        : undefined;
    return message;
  },
};

function createBaseDeletePollRequest(): DeletePollRequest {
  return { pollId: "" };
}

export const DeletePollRequest = {
  encode(
    message: DeletePollRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.pollId !== "") {
      writer.uint32(10).string(message.pollId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DeletePollRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
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

  fromJSON(object: any): DeletePollRequest {
    return {
      pollId: isSet(object.pollId) ? String(object.pollId) : "",
    };
  },

  toJSON(message: DeletePollRequest): unknown {
    const obj: any = {};
    message.pollId !== undefined && (obj.pollId = message.pollId);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<DeletePollRequest>, I>>(
    object: I
  ): DeletePollRequest {
    const message = createBaseDeletePollRequest();
    message.pollId = object.pollId ?? "";
    return message;
  },
};

function createBaseDeletePollResponse(): DeletePollResponse {
  return { poll: undefined };
}

export const DeletePollResponse = {
  encode(
    message: DeletePollResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.poll !== undefined) {
      PollDTO.encode(message.poll, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DeletePollResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDeletePollResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.poll = PollDTO.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): DeletePollResponse {
    return {
      poll: isSet(object.poll) ? PollDTO.fromJSON(object.poll) : undefined,
    };
  },

  toJSON(message: DeletePollResponse): unknown {
    const obj: any = {};
    message.poll !== undefined &&
      (obj.poll = message.poll ? PollDTO.toJSON(message.poll) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<DeletePollResponse>, I>>(
    object: I
  ): DeletePollResponse {
    const message = createBaseDeletePollResponse();
    message.poll =
      object.poll !== undefined && object.poll !== null
        ? PollDTO.fromPartial(object.poll)
        : undefined;
    return message;
  },
};

export interface PollsService {
  CreatePoll(request: CreatePollRequest): Promise<CreatePollResponse>;
  ReadPoll(request: ReadPollRequest): Promise<ReadPollResponse>;
  UpdatePoll(request: UpdatePollRequest): Promise<UpdatePollResponse>;
  DeletePoll(request: DeletePollRequest): Promise<DeletePollResponse>;
}

export class PollsServiceClientImpl implements PollsService {
  private readonly rpc: Rpc;
  constructor(rpc: Rpc) {
    this.rpc = rpc;
    this.CreatePoll = this.CreatePoll.bind(this);
    this.ReadPoll = this.ReadPoll.bind(this);
    this.UpdatePoll = this.UpdatePoll.bind(this);
    this.DeletePoll = this.DeletePoll.bind(this);
  }
  CreatePoll(request: CreatePollRequest): Promise<CreatePollResponse> {
    const data = CreatePollRequest.encode(request).finish();
    const promise = this.rpc.request(
      "polls_service.PollsService",
      "CreatePoll",
      data
    );
    return promise.then((data) =>
      CreatePollResponse.decode(new _m0.Reader(data))
    );
  }

  ReadPoll(request: ReadPollRequest): Promise<ReadPollResponse> {
    const data = ReadPollRequest.encode(request).finish();
    const promise = this.rpc.request(
      "polls_service.PollsService",
      "ReadPoll",
      data
    );
    return promise.then((data) =>
      ReadPollResponse.decode(new _m0.Reader(data))
    );
  }

  UpdatePoll(request: UpdatePollRequest): Promise<UpdatePollResponse> {
    const data = UpdatePollRequest.encode(request).finish();
    const promise = this.rpc.request(
      "polls_service.PollsService",
      "UpdatePoll",
      data
    );
    return promise.then((data) =>
      UpdatePollResponse.decode(new _m0.Reader(data))
    );
  }

  DeletePoll(request: DeletePollRequest): Promise<DeletePollResponse> {
    const data = DeletePollRequest.encode(request).finish();
    const promise = this.rpc.request(
      "polls_service.PollsService",
      "DeletePoll",
      data
    );
    return promise.then((data) =>
      DeletePollResponse.decode(new _m0.Reader(data))
    );
  }
}

interface Rpc {
  request(
    service: string,
    method: string,
    data: Uint8Array
  ): Promise<Uint8Array>;
}

type Builtin =
  | Date
  | Function
  | Uint8Array
  | string
  | number
  | boolean
  | undefined;

export type DeepPartial<T> = T extends Builtin
  ? T
  : T extends Long
  ? string | number | Long
  : T extends Array<infer U>
  ? Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U>
  ? ReadonlyArray<DeepPartial<U>>
  : T extends { $case: string }
  ? { [K in keyof Omit<T, "$case">]?: DeepPartial<T[K]> } & {
      $case: T["$case"];
    }
  : T extends {}
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin
  ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & Record<
        Exclude<keyof I, KeysOfUnion<P>>,
        never
      >;

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any;
  _m0.configure();
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
