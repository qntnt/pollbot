import _m0 from "protobufjs/minimal";
export declare const protobufPackage = "google.protobuf";
export interface Timestamp {
    seconds: number;
    nanos: number;
}
export declare const Timestamp: {
    encode(message: Timestamp, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): Timestamp;
    fromJSON(object: any): Timestamp;
    toJSON(message: Timestamp): unknown;
    fromPartial<I extends {
        seconds?: number | undefined;
        nanos?: number | undefined;
    } & {
        seconds?: number | undefined;
        nanos?: number | undefined;
    } & Record<Exclude<keyof I, keyof Timestamp>, never>>(object: I): Timestamp;
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
