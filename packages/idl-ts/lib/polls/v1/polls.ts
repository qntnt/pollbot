/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";
import { Timestamp } from "../../google/protobuf/timestamp";
import { MessageRefDTO } from "../../discord/v1/discord";

export const protobufPackage = "polls";

export enum PollFeatureDTO {
  UNKNOWN = 0,
  DISABLE_RANDOMIZED_BALLOTS = 1,
  DISABLE_ANYTIME_RESULTS = 2,
  UNRECOGNIZED = -1,
}

export function pollFeatureDTOFromJSON(object: any): PollFeatureDTO {
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

export function pollFeatureDTOToJSON(object: PollFeatureDTO): string {
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

export interface VoteDTO {
  option: string;
  rank?: number | undefined;
}

export interface BallotRequestDTO {
  pollId: string;
  context?:
    | { $case: "discord"; discord: DiscordBallotContextDTO }
    | { $case: "web"; web: WebBallotContextDTO };
}

export interface BallotDTO {
  id: string;
  pollId: string;
  /** @deprecated */
  userId?: string | undefined;
  /** @deprecated */
  userName?: string | undefined;
  createdAt: Date | undefined;
  updatedAt: Date | undefined;
  votes: { [key: string]: VoteDTO };
  ballotOptionMapping: { [key: string]: string };
  context?:
    | { $case: "discord"; discord: DiscordBallotContextDTO }
    | { $case: "web"; web: WebBallotContextDTO };
}

export interface BallotDTO_VotesEntry {
  key: string;
  value: VoteDTO | undefined;
}

export interface BallotDTO_BallotOptionMappingEntry {
  key: string;
  value: string;
}

export interface DiscordBallotContextDTO {
  userId: string;
  userName: string;
}

export interface WebBallotContextDTO {
  userId: string;
  userName: string;
}

export interface PollRequestDTO {
  topic: string;
  options: { [key: string]: string };
  features: PollFeatureDTO[];
  context?:
    | { $case: "discord"; discord: DiscordPollContextDTO }
    | { $case: "web"; web: WebPollContextDTO };
}

export interface PollRequestDTO_OptionsEntry {
  key: string;
  value: string;
}

export interface PollDTO {
  id: string;
  /** @deprecated */
  guildId?: string | undefined;
  /** @deprecated */
  ownerId?: string | undefined;
  createdAt: Date | undefined;
  closesAt: Date | undefined;
  topic: string;
  options: { [key: string]: string };
  /** @deprecated */
  ballots: { [key: string]: BallotDTO };
  features: PollFeatureDTO[];
  /** @deprecated */
  messageRef?: MessageRefDTO | undefined;
  context?:
    | { $case: "discord"; discord: DiscordPollContextDTO }
    | { $case: "web"; web: WebPollContextDTO };
}

export interface PollDTO_OptionsEntry {
  key: string;
  value: string;
}

export interface PollDTO_BallotsEntry {
  key: string;
  value: BallotDTO | undefined;
}

export interface PollMetricsDTO {
  ballotsRequested: number;
  ballotsSubmitted: number;
}

export interface DiscordPollContextDTO {
  guildId: string;
  ownerId: string;
  messageRef?: MessageRefDTO | undefined;
}

export interface WebPollContextDTO {
  ownerId: string;
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

function createBaseVoteDTO(): VoteDTO {
  return { option: "", rank: undefined };
}

export const VoteDTO = {
  encode(
    message: VoteDTO,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.option !== "") {
      writer.uint32(10).string(message.option);
    }
    if (message.rank !== undefined) {
      writer.uint32(16).int32(message.rank);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): VoteDTO {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
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

  fromJSON(object: any): VoteDTO {
    return {
      option: isSet(object.option) ? String(object.option) : "",
      rank: isSet(object.rank) ? Number(object.rank) : undefined,
    };
  },

  toJSON(message: VoteDTO): unknown {
    const obj: any = {};
    message.option !== undefined && (obj.option = message.option);
    message.rank !== undefined && (obj.rank = Math.round(message.rank));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<VoteDTO>, I>>(object: I): VoteDTO {
    const message = createBaseVoteDTO();
    message.option = object.option ?? "";
    message.rank = object.rank ?? undefined;
    return message;
  },
};

function createBaseBallotRequestDTO(): BallotRequestDTO {
  return { pollId: "", context: undefined };
}

export const BallotRequestDTO = {
  encode(
    message: BallotRequestDTO,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.pollId !== "") {
      writer.uint32(10).string(message.pollId);
    }
    if (message.context?.$case === "discord") {
      DiscordBallotContextDTO.encode(
        message.context.discord,
        writer.uint32(18).fork()
      ).ldelim();
    }
    if (message.context?.$case === "web") {
      WebBallotContextDTO.encode(
        message.context.web,
        writer.uint32(26).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): BallotRequestDTO {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
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
            discord: DiscordBallotContextDTO.decode(reader, reader.uint32()),
          };
          break;
        case 3:
          message.context = {
            $case: "web",
            web: WebBallotContextDTO.decode(reader, reader.uint32()),
          };
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): BallotRequestDTO {
    return {
      pollId: isSet(object.pollId) ? String(object.pollId) : "",
      context: isSet(object.discord)
        ? {
            $case: "discord",
            discord: DiscordBallotContextDTO.fromJSON(object.discord),
          }
        : isSet(object.web)
        ? { $case: "web", web: WebBallotContextDTO.fromJSON(object.web) }
        : undefined,
    };
  },

  toJSON(message: BallotRequestDTO): unknown {
    const obj: any = {};
    message.pollId !== undefined && (obj.pollId = message.pollId);
    message.context?.$case === "discord" &&
      (obj.discord = message.context?.discord
        ? DiscordBallotContextDTO.toJSON(message.context?.discord)
        : undefined);
    message.context?.$case === "web" &&
      (obj.web = message.context?.web
        ? WebBallotContextDTO.toJSON(message.context?.web)
        : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<BallotRequestDTO>, I>>(
    object: I
  ): BallotRequestDTO {
    const message = createBaseBallotRequestDTO();
    message.pollId = object.pollId ?? "";
    if (
      object.context?.$case === "discord" &&
      object.context?.discord !== undefined &&
      object.context?.discord !== null
    ) {
      message.context = {
        $case: "discord",
        discord: DiscordBallotContextDTO.fromPartial(object.context.discord),
      };
    }
    if (
      object.context?.$case === "web" &&
      object.context?.web !== undefined &&
      object.context?.web !== null
    ) {
      message.context = {
        $case: "web",
        web: WebBallotContextDTO.fromPartial(object.context.web),
      };
    }
    return message;
  },
};

function createBaseBallotDTO(): BallotDTO {
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

export const BallotDTO = {
  encode(
    message: BallotDTO,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
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
      Timestamp.encode(
        toTimestamp(message.createdAt),
        writer.uint32(42).fork()
      ).ldelim();
    }
    if (message.updatedAt !== undefined) {
      Timestamp.encode(
        toTimestamp(message.updatedAt),
        writer.uint32(50).fork()
      ).ldelim();
    }
    Object.entries(message.votes).forEach(([key, value]) => {
      BallotDTO_VotesEntry.encode(
        { key: key as any, value },
        writer.uint32(58).fork()
      ).ldelim();
    });
    Object.entries(message.ballotOptionMapping).forEach(([key, value]) => {
      BallotDTO_BallotOptionMappingEntry.encode(
        { key: key as any, value },
        writer.uint32(66).fork()
      ).ldelim();
    });
    if (message.context?.$case === "discord") {
      DiscordBallotContextDTO.encode(
        message.context.discord,
        writer.uint32(74).fork()
      ).ldelim();
    }
    if (message.context?.$case === "web") {
      WebBallotContextDTO.encode(
        message.context.web,
        writer.uint32(82).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): BallotDTO {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
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
          message.createdAt = fromTimestamp(
            Timestamp.decode(reader, reader.uint32())
          );
          break;
        case 6:
          message.updatedAt = fromTimestamp(
            Timestamp.decode(reader, reader.uint32())
          );
          break;
        case 7:
          const entry7 = BallotDTO_VotesEntry.decode(reader, reader.uint32());
          if (entry7.value !== undefined) {
            message.votes[entry7.key] = entry7.value;
          }
          break;
        case 8:
          const entry8 = BallotDTO_BallotOptionMappingEntry.decode(
            reader,
            reader.uint32()
          );
          if (entry8.value !== undefined) {
            message.ballotOptionMapping[entry8.key] = entry8.value;
          }
          break;
        case 9:
          message.context = {
            $case: "discord",
            discord: DiscordBallotContextDTO.decode(reader, reader.uint32()),
          };
          break;
        case 10:
          message.context = {
            $case: "web",
            web: WebBallotContextDTO.decode(reader, reader.uint32()),
          };
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): BallotDTO {
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
        ? Object.entries(object.votes).reduce<{ [key: string]: VoteDTO }>(
            (acc, [key, value]) => {
              acc[key] = VoteDTO.fromJSON(value);
              return acc;
            },
            {}
          )
        : {},
      ballotOptionMapping: isObject(object.ballotOptionMapping)
        ? Object.entries(object.ballotOptionMapping).reduce<{
            [key: string]: string;
          }>((acc, [key, value]) => {
            acc[key] = String(value);
            return acc;
          }, {})
        : {},
      context: isSet(object.discord)
        ? {
            $case: "discord",
            discord: DiscordBallotContextDTO.fromJSON(object.discord),
          }
        : isSet(object.web)
        ? { $case: "web", web: WebBallotContextDTO.fromJSON(object.web) }
        : undefined,
    };
  },

  toJSON(message: BallotDTO): unknown {
    const obj: any = {};
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
        obj.votes[k] = VoteDTO.toJSON(v);
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
        ? DiscordBallotContextDTO.toJSON(message.context?.discord)
        : undefined);
    message.context?.$case === "web" &&
      (obj.web = message.context?.web
        ? WebBallotContextDTO.toJSON(message.context?.web)
        : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<BallotDTO>, I>>(
    object: I
  ): BallotDTO {
    const message = createBaseBallotDTO();
    message.id = object.id ?? "";
    message.pollId = object.pollId ?? "";
    message.userId = object.userId ?? undefined;
    message.userName = object.userName ?? undefined;
    message.createdAt = object.createdAt ?? undefined;
    message.updatedAt = object.updatedAt ?? undefined;
    message.votes = Object.entries(object.votes ?? {}).reduce<{
      [key: string]: VoteDTO;
    }>((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = VoteDTO.fromPartial(value);
      }
      return acc;
    }, {});
    message.ballotOptionMapping = Object.entries(
      object.ballotOptionMapping ?? {}
    ).reduce<{ [key: string]: string }>((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = String(value);
      }
      return acc;
    }, {});
    if (
      object.context?.$case === "discord" &&
      object.context?.discord !== undefined &&
      object.context?.discord !== null
    ) {
      message.context = {
        $case: "discord",
        discord: DiscordBallotContextDTO.fromPartial(object.context.discord),
      };
    }
    if (
      object.context?.$case === "web" &&
      object.context?.web !== undefined &&
      object.context?.web !== null
    ) {
      message.context = {
        $case: "web",
        web: WebBallotContextDTO.fromPartial(object.context.web),
      };
    }
    return message;
  },
};

function createBaseBallotDTO_VotesEntry(): BallotDTO_VotesEntry {
  return { key: "", value: undefined };
}

export const BallotDTO_VotesEntry = {
  encode(
    message: BallotDTO_VotesEntry,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.key !== "") {
      writer.uint32(10).string(message.key);
    }
    if (message.value !== undefined) {
      VoteDTO.encode(message.value, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): BallotDTO_VotesEntry {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseBallotDTO_VotesEntry();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.key = reader.string();
          break;
        case 2:
          message.value = VoteDTO.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): BallotDTO_VotesEntry {
    return {
      key: isSet(object.key) ? String(object.key) : "",
      value: isSet(object.value) ? VoteDTO.fromJSON(object.value) : undefined,
    };
  },

  toJSON(message: BallotDTO_VotesEntry): unknown {
    const obj: any = {};
    message.key !== undefined && (obj.key = message.key);
    message.value !== undefined &&
      (obj.value = message.value ? VoteDTO.toJSON(message.value) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<BallotDTO_VotesEntry>, I>>(
    object: I
  ): BallotDTO_VotesEntry {
    const message = createBaseBallotDTO_VotesEntry();
    message.key = object.key ?? "";
    message.value =
      object.value !== undefined && object.value !== null
        ? VoteDTO.fromPartial(object.value)
        : undefined;
    return message;
  },
};

function createBaseBallotDTO_BallotOptionMappingEntry(): BallotDTO_BallotOptionMappingEntry {
  return { key: "", value: "" };
}

export const BallotDTO_BallotOptionMappingEntry = {
  encode(
    message: BallotDTO_BallotOptionMappingEntry,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.key !== "") {
      writer.uint32(10).string(message.key);
    }
    if (message.value !== "") {
      writer.uint32(18).string(message.value);
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): BallotDTO_BallotOptionMappingEntry {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
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

  fromJSON(object: any): BallotDTO_BallotOptionMappingEntry {
    return {
      key: isSet(object.key) ? String(object.key) : "",
      value: isSet(object.value) ? String(object.value) : "",
    };
  },

  toJSON(message: BallotDTO_BallotOptionMappingEntry): unknown {
    const obj: any = {};
    message.key !== undefined && (obj.key = message.key);
    message.value !== undefined && (obj.value = message.value);
    return obj;
  },

  fromPartial<
    I extends Exact<DeepPartial<BallotDTO_BallotOptionMappingEntry>, I>
  >(object: I): BallotDTO_BallotOptionMappingEntry {
    const message = createBaseBallotDTO_BallotOptionMappingEntry();
    message.key = object.key ?? "";
    message.value = object.value ?? "";
    return message;
  },
};

function createBaseDiscordBallotContextDTO(): DiscordBallotContextDTO {
  return { userId: "", userName: "" };
}

export const DiscordBallotContextDTO = {
  encode(
    message: DiscordBallotContextDTO,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.userId !== "") {
      writer.uint32(10).string(message.userId);
    }
    if (message.userName !== "") {
      writer.uint32(18).string(message.userName);
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): DiscordBallotContextDTO {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
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

  fromJSON(object: any): DiscordBallotContextDTO {
    return {
      userId: isSet(object.userId) ? String(object.userId) : "",
      userName: isSet(object.userName) ? String(object.userName) : "",
    };
  },

  toJSON(message: DiscordBallotContextDTO): unknown {
    const obj: any = {};
    message.userId !== undefined && (obj.userId = message.userId);
    message.userName !== undefined && (obj.userName = message.userName);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<DiscordBallotContextDTO>, I>>(
    object: I
  ): DiscordBallotContextDTO {
    const message = createBaseDiscordBallotContextDTO();
    message.userId = object.userId ?? "";
    message.userName = object.userName ?? "";
    return message;
  },
};

function createBaseWebBallotContextDTO(): WebBallotContextDTO {
  return { userId: "", userName: "" };
}

export const WebBallotContextDTO = {
  encode(
    message: WebBallotContextDTO,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.userId !== "") {
      writer.uint32(10).string(message.userId);
    }
    if (message.userName !== "") {
      writer.uint32(18).string(message.userName);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): WebBallotContextDTO {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
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

  fromJSON(object: any): WebBallotContextDTO {
    return {
      userId: isSet(object.userId) ? String(object.userId) : "",
      userName: isSet(object.userName) ? String(object.userName) : "",
    };
  },

  toJSON(message: WebBallotContextDTO): unknown {
    const obj: any = {};
    message.userId !== undefined && (obj.userId = message.userId);
    message.userName !== undefined && (obj.userName = message.userName);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<WebBallotContextDTO>, I>>(
    object: I
  ): WebBallotContextDTO {
    const message = createBaseWebBallotContextDTO();
    message.userId = object.userId ?? "";
    message.userName = object.userName ?? "";
    return message;
  },
};

function createBasePollRequestDTO(): PollRequestDTO {
  return { topic: "", options: {}, features: [], context: undefined };
}

export const PollRequestDTO = {
  encode(
    message: PollRequestDTO,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.topic !== "") {
      writer.uint32(10).string(message.topic);
    }
    Object.entries(message.options).forEach(([key, value]) => {
      PollRequestDTO_OptionsEntry.encode(
        { key: key as any, value },
        writer.uint32(18).fork()
      ).ldelim();
    });
    writer.uint32(26).fork();
    for (const v of message.features) {
      writer.int32(v);
    }
    writer.ldelim();
    if (message.context?.$case === "discord") {
      DiscordPollContextDTO.encode(
        message.context.discord,
        writer.uint32(34).fork()
      ).ldelim();
    }
    if (message.context?.$case === "web") {
      WebPollContextDTO.encode(
        message.context.web,
        writer.uint32(42).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): PollRequestDTO {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePollRequestDTO();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.topic = reader.string();
          break;
        case 2:
          const entry2 = PollRequestDTO_OptionsEntry.decode(
            reader,
            reader.uint32()
          );
          if (entry2.value !== undefined) {
            message.options[entry2.key] = entry2.value;
          }
          break;
        case 3:
          if ((tag & 7) === 2) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.features.push(reader.int32() as any);
            }
          } else {
            message.features.push(reader.int32() as any);
          }
          break;
        case 4:
          message.context = {
            $case: "discord",
            discord: DiscordPollContextDTO.decode(reader, reader.uint32()),
          };
          break;
        case 5:
          message.context = {
            $case: "web",
            web: WebPollContextDTO.decode(reader, reader.uint32()),
          };
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): PollRequestDTO {
    return {
      topic: isSet(object.topic) ? String(object.topic) : "",
      options: isObject(object.options)
        ? Object.entries(object.options).reduce<{ [key: string]: string }>(
            (acc, [key, value]) => {
              acc[key] = String(value);
              return acc;
            },
            {}
          )
        : {},
      features: Array.isArray(object?.features)
        ? object.features.map((e: any) => pollFeatureDTOFromJSON(e))
        : [],
      context: isSet(object.discord)
        ? {
            $case: "discord",
            discord: DiscordPollContextDTO.fromJSON(object.discord),
          }
        : isSet(object.web)
        ? { $case: "web", web: WebPollContextDTO.fromJSON(object.web) }
        : undefined,
    };
  },

  toJSON(message: PollRequestDTO): unknown {
    const obj: any = {};
    message.topic !== undefined && (obj.topic = message.topic);
    obj.options = {};
    if (message.options) {
      Object.entries(message.options).forEach(([k, v]) => {
        obj.options[k] = v;
      });
    }
    if (message.features) {
      obj.features = message.features.map((e) => pollFeatureDTOToJSON(e));
    } else {
      obj.features = [];
    }
    message.context?.$case === "discord" &&
      (obj.discord = message.context?.discord
        ? DiscordPollContextDTO.toJSON(message.context?.discord)
        : undefined);
    message.context?.$case === "web" &&
      (obj.web = message.context?.web
        ? WebPollContextDTO.toJSON(message.context?.web)
        : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<PollRequestDTO>, I>>(
    object: I
  ): PollRequestDTO {
    const message = createBasePollRequestDTO();
    message.topic = object.topic ?? "";
    message.options = Object.entries(object.options ?? {}).reduce<{
      [key: string]: string;
    }>((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = String(value);
      }
      return acc;
    }, {});
    message.features = object.features?.map((e) => e) || [];
    if (
      object.context?.$case === "discord" &&
      object.context?.discord !== undefined &&
      object.context?.discord !== null
    ) {
      message.context = {
        $case: "discord",
        discord: DiscordPollContextDTO.fromPartial(object.context.discord),
      };
    }
    if (
      object.context?.$case === "web" &&
      object.context?.web !== undefined &&
      object.context?.web !== null
    ) {
      message.context = {
        $case: "web",
        web: WebPollContextDTO.fromPartial(object.context.web),
      };
    }
    return message;
  },
};

function createBasePollRequestDTO_OptionsEntry(): PollRequestDTO_OptionsEntry {
  return { key: "", value: "" };
}

export const PollRequestDTO_OptionsEntry = {
  encode(
    message: PollRequestDTO_OptionsEntry,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.key !== "") {
      writer.uint32(10).string(message.key);
    }
    if (message.value !== "") {
      writer.uint32(18).string(message.value);
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): PollRequestDTO_OptionsEntry {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
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

  fromJSON(object: any): PollRequestDTO_OptionsEntry {
    return {
      key: isSet(object.key) ? String(object.key) : "",
      value: isSet(object.value) ? String(object.value) : "",
    };
  },

  toJSON(message: PollRequestDTO_OptionsEntry): unknown {
    const obj: any = {};
    message.key !== undefined && (obj.key = message.key);
    message.value !== undefined && (obj.value = message.value);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<PollRequestDTO_OptionsEntry>, I>>(
    object: I
  ): PollRequestDTO_OptionsEntry {
    const message = createBasePollRequestDTO_OptionsEntry();
    message.key = object.key ?? "";
    message.value = object.value ?? "";
    return message;
  },
};

function createBasePollDTO(): PollDTO {
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

export const PollDTO = {
  encode(
    message: PollDTO,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
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
      Timestamp.encode(
        toTimestamp(message.createdAt),
        writer.uint32(34).fork()
      ).ldelim();
    }
    if (message.closesAt !== undefined) {
      Timestamp.encode(
        toTimestamp(message.closesAt),
        writer.uint32(42).fork()
      ).ldelim();
    }
    if (message.topic !== "") {
      writer.uint32(50).string(message.topic);
    }
    Object.entries(message.options).forEach(([key, value]) => {
      PollDTO_OptionsEntry.encode(
        { key: key as any, value },
        writer.uint32(58).fork()
      ).ldelim();
    });
    Object.entries(message.ballots).forEach(([key, value]) => {
      PollDTO_BallotsEntry.encode(
        { key: key as any, value },
        writer.uint32(66).fork()
      ).ldelim();
    });
    writer.uint32(74).fork();
    for (const v of message.features) {
      writer.int32(v);
    }
    writer.ldelim();
    if (message.messageRef !== undefined) {
      MessageRefDTO.encode(
        message.messageRef,
        writer.uint32(82).fork()
      ).ldelim();
    }
    if (message.context?.$case === "discord") {
      DiscordPollContextDTO.encode(
        message.context.discord,
        writer.uint32(90).fork()
      ).ldelim();
    }
    if (message.context?.$case === "web") {
      WebPollContextDTO.encode(
        message.context.web,
        writer.uint32(98).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): PollDTO {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
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
          message.createdAt = fromTimestamp(
            Timestamp.decode(reader, reader.uint32())
          );
          break;
        case 5:
          message.closesAt = fromTimestamp(
            Timestamp.decode(reader, reader.uint32())
          );
          break;
        case 6:
          message.topic = reader.string();
          break;
        case 7:
          const entry7 = PollDTO_OptionsEntry.decode(reader, reader.uint32());
          if (entry7.value !== undefined) {
            message.options[entry7.key] = entry7.value;
          }
          break;
        case 8:
          const entry8 = PollDTO_BallotsEntry.decode(reader, reader.uint32());
          if (entry8.value !== undefined) {
            message.ballots[entry8.key] = entry8.value;
          }
          break;
        case 9:
          if ((tag & 7) === 2) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.features.push(reader.int32() as any);
            }
          } else {
            message.features.push(reader.int32() as any);
          }
          break;
        case 10:
          message.messageRef = MessageRefDTO.decode(reader, reader.uint32());
          break;
        case 11:
          message.context = {
            $case: "discord",
            discord: DiscordPollContextDTO.decode(reader, reader.uint32()),
          };
          break;
        case 12:
          message.context = {
            $case: "web",
            web: WebPollContextDTO.decode(reader, reader.uint32()),
          };
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): PollDTO {
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
        ? Object.entries(object.options).reduce<{ [key: string]: string }>(
            (acc, [key, value]) => {
              acc[key] = String(value);
              return acc;
            },
            {}
          )
        : {},
      ballots: isObject(object.ballots)
        ? Object.entries(object.ballots).reduce<{ [key: string]: BallotDTO }>(
            (acc, [key, value]) => {
              acc[key] = BallotDTO.fromJSON(value);
              return acc;
            },
            {}
          )
        : {},
      features: Array.isArray(object?.features)
        ? object.features.map((e: any) => pollFeatureDTOFromJSON(e))
        : [],
      messageRef: isSet(object.messageRef)
        ? MessageRefDTO.fromJSON(object.messageRef)
        : undefined,
      context: isSet(object.discord)
        ? {
            $case: "discord",
            discord: DiscordPollContextDTO.fromJSON(object.discord),
          }
        : isSet(object.web)
        ? { $case: "web", web: WebPollContextDTO.fromJSON(object.web) }
        : undefined,
    };
  },

  toJSON(message: PollDTO): unknown {
    const obj: any = {};
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
        obj.ballots[k] = BallotDTO.toJSON(v);
      });
    }
    if (message.features) {
      obj.features = message.features.map((e) => pollFeatureDTOToJSON(e));
    } else {
      obj.features = [];
    }
    message.messageRef !== undefined &&
      (obj.messageRef = message.messageRef
        ? MessageRefDTO.toJSON(message.messageRef)
        : undefined);
    message.context?.$case === "discord" &&
      (obj.discord = message.context?.discord
        ? DiscordPollContextDTO.toJSON(message.context?.discord)
        : undefined);
    message.context?.$case === "web" &&
      (obj.web = message.context?.web
        ? WebPollContextDTO.toJSON(message.context?.web)
        : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<PollDTO>, I>>(object: I): PollDTO {
    const message = createBasePollDTO();
    message.id = object.id ?? "";
    message.guildId = object.guildId ?? undefined;
    message.ownerId = object.ownerId ?? undefined;
    message.createdAt = object.createdAt ?? undefined;
    message.closesAt = object.closesAt ?? undefined;
    message.topic = object.topic ?? "";
    message.options = Object.entries(object.options ?? {}).reduce<{
      [key: string]: string;
    }>((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = String(value);
      }
      return acc;
    }, {});
    message.ballots = Object.entries(object.ballots ?? {}).reduce<{
      [key: string]: BallotDTO;
    }>((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = BallotDTO.fromPartial(value);
      }
      return acc;
    }, {});
    message.features = object.features?.map((e) => e) || [];
    message.messageRef =
      object.messageRef !== undefined && object.messageRef !== null
        ? MessageRefDTO.fromPartial(object.messageRef)
        : undefined;
    if (
      object.context?.$case === "discord" &&
      object.context?.discord !== undefined &&
      object.context?.discord !== null
    ) {
      message.context = {
        $case: "discord",
        discord: DiscordPollContextDTO.fromPartial(object.context.discord),
      };
    }
    if (
      object.context?.$case === "web" &&
      object.context?.web !== undefined &&
      object.context?.web !== null
    ) {
      message.context = {
        $case: "web",
        web: WebPollContextDTO.fromPartial(object.context.web),
      };
    }
    return message;
  },
};

function createBasePollDTO_OptionsEntry(): PollDTO_OptionsEntry {
  return { key: "", value: "" };
}

export const PollDTO_OptionsEntry = {
  encode(
    message: PollDTO_OptionsEntry,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.key !== "") {
      writer.uint32(10).string(message.key);
    }
    if (message.value !== "") {
      writer.uint32(18).string(message.value);
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): PollDTO_OptionsEntry {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
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

  fromJSON(object: any): PollDTO_OptionsEntry {
    return {
      key: isSet(object.key) ? String(object.key) : "",
      value: isSet(object.value) ? String(object.value) : "",
    };
  },

  toJSON(message: PollDTO_OptionsEntry): unknown {
    const obj: any = {};
    message.key !== undefined && (obj.key = message.key);
    message.value !== undefined && (obj.value = message.value);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<PollDTO_OptionsEntry>, I>>(
    object: I
  ): PollDTO_OptionsEntry {
    const message = createBasePollDTO_OptionsEntry();
    message.key = object.key ?? "";
    message.value = object.value ?? "";
    return message;
  },
};

function createBasePollDTO_BallotsEntry(): PollDTO_BallotsEntry {
  return { key: "", value: undefined };
}

export const PollDTO_BallotsEntry = {
  encode(
    message: PollDTO_BallotsEntry,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.key !== "") {
      writer.uint32(10).string(message.key);
    }
    if (message.value !== undefined) {
      BallotDTO.encode(message.value, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): PollDTO_BallotsEntry {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePollDTO_BallotsEntry();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.key = reader.string();
          break;
        case 2:
          message.value = BallotDTO.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): PollDTO_BallotsEntry {
    return {
      key: isSet(object.key) ? String(object.key) : "",
      value: isSet(object.value) ? BallotDTO.fromJSON(object.value) : undefined,
    };
  },

  toJSON(message: PollDTO_BallotsEntry): unknown {
    const obj: any = {};
    message.key !== undefined && (obj.key = message.key);
    message.value !== undefined &&
      (obj.value = message.value ? BallotDTO.toJSON(message.value) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<PollDTO_BallotsEntry>, I>>(
    object: I
  ): PollDTO_BallotsEntry {
    const message = createBasePollDTO_BallotsEntry();
    message.key = object.key ?? "";
    message.value =
      object.value !== undefined && object.value !== null
        ? BallotDTO.fromPartial(object.value)
        : undefined;
    return message;
  },
};

function createBasePollMetricsDTO(): PollMetricsDTO {
  return { ballotsRequested: 0, ballotsSubmitted: 0 };
}

export const PollMetricsDTO = {
  encode(
    message: PollMetricsDTO,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.ballotsRequested !== 0) {
      writer.uint32(8).int32(message.ballotsRequested);
    }
    if (message.ballotsSubmitted !== 0) {
      writer.uint32(16).int32(message.ballotsSubmitted);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): PollMetricsDTO {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePollMetricsDTO();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.ballotsRequested = reader.int32();
          break;
        case 2:
          message.ballotsSubmitted = reader.int32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): PollMetricsDTO {
    return {
      ballotsRequested: isSet(object.ballotsRequested)
        ? Number(object.ballotsRequested)
        : 0,
      ballotsSubmitted: isSet(object.ballotsSubmitted)
        ? Number(object.ballotsSubmitted)
        : 0,
    };
  },

  toJSON(message: PollMetricsDTO): unknown {
    const obj: any = {};
    message.ballotsRequested !== undefined &&
      (obj.ballotsRequested = Math.round(message.ballotsRequested));
    message.ballotsSubmitted !== undefined &&
      (obj.ballotsSubmitted = Math.round(message.ballotsSubmitted));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<PollMetricsDTO>, I>>(
    object: I
  ): PollMetricsDTO {
    const message = createBasePollMetricsDTO();
    message.ballotsRequested = object.ballotsRequested ?? 0;
    message.ballotsSubmitted = object.ballotsSubmitted ?? 0;
    return message;
  },
};

function createBaseDiscordPollContextDTO(): DiscordPollContextDTO {
  return { guildId: "", ownerId: "", messageRef: undefined };
}

export const DiscordPollContextDTO = {
  encode(
    message: DiscordPollContextDTO,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.guildId !== "") {
      writer.uint32(10).string(message.guildId);
    }
    if (message.ownerId !== "") {
      writer.uint32(18).string(message.ownerId);
    }
    if (message.messageRef !== undefined) {
      MessageRefDTO.encode(
        message.messageRef,
        writer.uint32(26).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): DiscordPollContextDTO {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
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
          message.messageRef = MessageRefDTO.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): DiscordPollContextDTO {
    return {
      guildId: isSet(object.guildId) ? String(object.guildId) : "",
      ownerId: isSet(object.ownerId) ? String(object.ownerId) : "",
      messageRef: isSet(object.messageRef)
        ? MessageRefDTO.fromJSON(object.messageRef)
        : undefined,
    };
  },

  toJSON(message: DiscordPollContextDTO): unknown {
    const obj: any = {};
    message.guildId !== undefined && (obj.guildId = message.guildId);
    message.ownerId !== undefined && (obj.ownerId = message.ownerId);
    message.messageRef !== undefined &&
      (obj.messageRef = message.messageRef
        ? MessageRefDTO.toJSON(message.messageRef)
        : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<DiscordPollContextDTO>, I>>(
    object: I
  ): DiscordPollContextDTO {
    const message = createBaseDiscordPollContextDTO();
    message.guildId = object.guildId ?? "";
    message.ownerId = object.ownerId ?? "";
    message.messageRef =
      object.messageRef !== undefined && object.messageRef !== null
        ? MessageRefDTO.fromPartial(object.messageRef)
        : undefined;
    return message;
  },
};

function createBaseWebPollContextDTO(): WebPollContextDTO {
  return { ownerId: "" };
}

export const WebPollContextDTO = {
  encode(
    message: WebPollContextDTO,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.ownerId !== "") {
      writer.uint32(10).string(message.ownerId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): WebPollContextDTO {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
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

  fromJSON(object: any): WebPollContextDTO {
    return {
      ownerId: isSet(object.ownerId) ? String(object.ownerId) : "",
    };
  },

  toJSON(message: WebPollContextDTO): unknown {
    const obj: any = {};
    message.ownerId !== undefined && (obj.ownerId = message.ownerId);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<WebPollContextDTO>, I>>(
    object: I
  ): WebPollContextDTO {
    const message = createBaseWebPollContextDTO();
    message.ownerId = object.ownerId ?? "";
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
    const promise = this.rpc.request("polls.PollsService", "CreatePoll", data);
    return promise.then((data) =>
      CreatePollResponse.decode(new _m0.Reader(data))
    );
  }

  ReadPoll(request: ReadPollRequest): Promise<ReadPollResponse> {
    const data = ReadPollRequest.encode(request).finish();
    const promise = this.rpc.request("polls.PollsService", "ReadPoll", data);
    return promise.then((data) =>
      ReadPollResponse.decode(new _m0.Reader(data))
    );
  }

  UpdatePoll(request: UpdatePollRequest): Promise<UpdatePollResponse> {
    const data = UpdatePollRequest.encode(request).finish();
    const promise = this.rpc.request("polls.PollsService", "UpdatePoll", data);
    return promise.then((data) =>
      UpdatePollResponse.decode(new _m0.Reader(data))
    );
  }

  DeletePoll(request: DeletePollRequest): Promise<DeletePollResponse> {
    const data = DeletePollRequest.encode(request).finish();
    const promise = this.rpc.request("polls.PollsService", "DeletePoll", data);
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

function toTimestamp(date: Date): Timestamp {
  const seconds = date.getTime() / 1_000;
  const nanos = (date.getTime() % 1_000) * 1_000_000;
  return { seconds, nanos };
}

function fromTimestamp(t: Timestamp): Date {
  let millis = t.seconds * 1_000;
  millis += t.nanos / 1_000_000;
  return new Date(millis);
}

function fromJsonTimestamp(o: any): Date {
  if (o instanceof Date) {
    return o;
  } else if (typeof o === "string") {
    return new Date(o);
  } else {
    return fromTimestamp(Timestamp.fromJSON(o));
  }
}

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any;
  _m0.configure();
}

function isObject(value: any): boolean {
  return typeof value === "object" && value !== null;
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
