/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";

export const protobufPackage = "discord";

export interface GuildDataDTO {
  id: string;
  admins: { [key: string]: boolean };
}

export interface GuildDataDTO_AdminsEntry {
  key: string;
  value: boolean;
}

export interface MessageRefDTO {
  id: string;
  channelId: string;
}

function createBaseGuildDataDTO(): GuildDataDTO {
  return { id: "", admins: {} };
}

export const GuildDataDTO = {
  encode(
    message: GuildDataDTO,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    Object.entries(message.admins).forEach(([key, value]) => {
      GuildDataDTO_AdminsEntry.encode(
        { key: key as any, value },
        writer.uint32(18).fork()
      ).ldelim();
    });
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GuildDataDTO {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGuildDataDTO();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          const entry2 = GuildDataDTO_AdminsEntry.decode(
            reader,
            reader.uint32()
          );
          if (entry2.value !== undefined) {
            message.admins[entry2.key] = entry2.value;
          }
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GuildDataDTO {
    return {
      id: isSet(object.id) ? String(object.id) : "",
      admins: isObject(object.admins)
        ? Object.entries(object.admins).reduce<{ [key: string]: boolean }>(
            (acc, [key, value]) => {
              acc[key] = Boolean(value);
              return acc;
            },
            {}
          )
        : {},
    };
  },

  toJSON(message: GuildDataDTO): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    obj.admins = {};
    if (message.admins) {
      Object.entries(message.admins).forEach(([k, v]) => {
        obj.admins[k] = v;
      });
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<GuildDataDTO>, I>>(
    object: I
  ): GuildDataDTO {
    const message = createBaseGuildDataDTO();
    message.id = object.id ?? "";
    message.admins = Object.entries(object.admins ?? {}).reduce<{
      [key: string]: boolean;
    }>((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = Boolean(value);
      }
      return acc;
    }, {});
    return message;
  },
};

function createBaseGuildDataDTO_AdminsEntry(): GuildDataDTO_AdminsEntry {
  return { key: "", value: false };
}

export const GuildDataDTO_AdminsEntry = {
  encode(
    message: GuildDataDTO_AdminsEntry,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.key !== "") {
      writer.uint32(10).string(message.key);
    }
    if (message.value === true) {
      writer.uint32(16).bool(message.value);
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): GuildDataDTO_AdminsEntry {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGuildDataDTO_AdminsEntry();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.key = reader.string();
          break;
        case 2:
          message.value = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GuildDataDTO_AdminsEntry {
    return {
      key: isSet(object.key) ? String(object.key) : "",
      value: isSet(object.value) ? Boolean(object.value) : false,
    };
  },

  toJSON(message: GuildDataDTO_AdminsEntry): unknown {
    const obj: any = {};
    message.key !== undefined && (obj.key = message.key);
    message.value !== undefined && (obj.value = message.value);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<GuildDataDTO_AdminsEntry>, I>>(
    object: I
  ): GuildDataDTO_AdminsEntry {
    const message = createBaseGuildDataDTO_AdminsEntry();
    message.key = object.key ?? "";
    message.value = object.value ?? false;
    return message;
  },
};

function createBaseMessageRefDTO(): MessageRefDTO {
  return { id: "", channelId: "" };
}

export const MessageRefDTO = {
  encode(
    message: MessageRefDTO,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.channelId !== "") {
      writer.uint32(18).string(message.channelId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MessageRefDTO {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMessageRefDTO();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          message.channelId = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MessageRefDTO {
    return {
      id: isSet(object.id) ? String(object.id) : "",
      channelId: isSet(object.channelId) ? String(object.channelId) : "",
    };
  },

  toJSON(message: MessageRefDTO): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.channelId !== undefined && (obj.channelId = message.channelId);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<MessageRefDTO>, I>>(
    object: I
  ): MessageRefDTO {
    const message = createBaseMessageRefDTO();
    message.id = object.id ?? "";
    message.channelId = object.channelId ?? "";
    return message;
  },
};

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
