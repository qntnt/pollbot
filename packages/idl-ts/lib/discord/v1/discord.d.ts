import _m0 from "protobufjs/minimal";
export declare const protobufPackage = "discord";
export interface GuildDataDTO {
    id: string;
    admins: {
        [key: string]: boolean;
    };
}
export interface GuildDataDTO_AdminsEntry {
    key: string;
    value: boolean;
}
export interface MessageRefDTO {
    id: string;
    channelId: string;
}
export declare const GuildDataDTO: {
    encode(message: GuildDataDTO, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): GuildDataDTO;
    fromJSON(object: any): GuildDataDTO;
    toJSON(message: GuildDataDTO): unknown;
    fromPartial<I extends {
        id?: string | undefined;
        admins?: {
            [x: string]: boolean | undefined;
        } | undefined;
    } & {
        id?: string | undefined;
        admins?: ({
            [x: string]: boolean | undefined;
        } & {
            [x: string]: boolean | undefined;
        } & Record<Exclude<keyof I["admins"], string | number>, never>) | undefined;
    } & Record<Exclude<keyof I, keyof GuildDataDTO>, never>>(object: I): GuildDataDTO;
};
export declare const GuildDataDTO_AdminsEntry: {
    encode(message: GuildDataDTO_AdminsEntry, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): GuildDataDTO_AdminsEntry;
    fromJSON(object: any): GuildDataDTO_AdminsEntry;
    toJSON(message: GuildDataDTO_AdminsEntry): unknown;
    fromPartial<I extends {
        key?: string | undefined;
        value?: boolean | undefined;
    } & {
        key?: string | undefined;
        value?: boolean | undefined;
    } & Record<Exclude<keyof I, keyof GuildDataDTO_AdminsEntry>, never>>(object: I): GuildDataDTO_AdminsEntry;
};
export declare const MessageRefDTO: {
    encode(message: MessageRefDTO, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): MessageRefDTO;
    fromJSON(object: any): MessageRefDTO;
    toJSON(message: MessageRefDTO): unknown;
    fromPartial<I extends {
        id?: string | undefined;
        channelId?: string | undefined;
    } & {
        id?: string | undefined;
        channelId?: string | undefined;
    } & Record<Exclude<keyof I, keyof MessageRefDTO>, never>>(object: I): MessageRefDTO;
};
declare type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;
export declare type DeepPartial<T> = T extends Builtin ? T : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>> : T extends {
    $case: string;
} ? {
    [K in keyof Omit<T, "$case">]?: DeepPartial<T[K]>;
} & {
    $case: T["$case"];
} : T extends {} ? {
    [K in keyof T]?: DeepPartial<T[K]>;
} : Partial<T>;
declare type KeysOfUnion<T> = T extends T ? keyof T : never;
export declare type Exact<P, I extends P> = P extends Builtin ? P : P & {
    [K in keyof P]: Exact<P[K], I[K]>;
} & Record<Exclude<keyof I, KeysOfUnion<P>>, never>;
export {};
