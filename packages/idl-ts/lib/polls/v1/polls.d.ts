import _m0 from "protobufjs/minimal";
import { MessageRefDTO } from "../../discord/v1/discord";
export declare const protobufPackage = "polls";
export declare enum PollFeatureDTO {
    UNKNOWN = 0,
    DISABLE_RANDOMIZED_BALLOTS = 1,
    DISABLE_ANYTIME_RESULTS = 2,
    UNRECOGNIZED = -1
}
export declare function pollFeatureDTOFromJSON(object: any): PollFeatureDTO;
export declare function pollFeatureDTOToJSON(object: PollFeatureDTO): string;
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
    context?: {
        $case: "discord";
        discord: DiscordBallotContextDTO;
    } | {
        $case: "web";
        web: WebBallotContextDTO;
    };
}
export interface BallotDTO {
    id: string;
    pollId: string;
    userId?: string | undefined;
    userName?: string | undefined;
    createdAt: Date | undefined;
    updatedAt: Date | undefined;
    votes: {
        [key: string]: VoteDTO;
    };
    ballotOptionMapping: {
        [key: string]: string;
    };
    context?: {
        $case: "discord";
        discord: DiscordBallotContextDTO;
    } | {
        $case: "web";
        web: WebBallotContextDTO;
    };
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
    options: {
        [key: string]: string;
    };
    features: PollFeatureDTO[];
    context?: {
        $case: "discord";
        discord: DiscordPollContextDTO;
    } | {
        $case: "web";
        web: WebPollContextDTO;
    };
}
export interface PollRequestDTO_OptionsEntry {
    key: string;
    value: string;
}
export interface PollDTO {
    id: string;
    guildId?: string | undefined;
    ownerId?: string | undefined;
    createdAt: Date | undefined;
    closesAt: Date | undefined;
    topic: string;
    options: {
        [key: string]: string;
    };
    ballots: {
        [key: string]: BallotDTO;
    };
    features: PollFeatureDTO[];
    messageRef?: MessageRefDTO | undefined;
    context?: {
        $case: "discord";
        discord: DiscordPollContextDTO;
    } | {
        $case: "web";
        web: WebPollContextDTO;
    };
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
export declare const ReadPollRequest: {
    encode(message: ReadPollRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): ReadPollRequest;
    fromJSON(object: any): ReadPollRequest;
    toJSON(message: ReadPollRequest): unknown;
    fromPartial<I extends {
        id?: string | undefined;
    } & {
        id?: string | undefined;
    } & Record<Exclude<keyof I, "id">, never>>(object: I): ReadPollRequest;
};
export declare const ReadPollResponse: {
    encode(message: ReadPollResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): ReadPollResponse;
    fromJSON(object: any): ReadPollResponse;
    toJSON(message: ReadPollResponse): unknown;
    fromPartial<I extends {
        poll?: {
            id?: string | undefined;
            guildId?: string | undefined;
            ownerId?: string | undefined;
            createdAt?: Date | undefined;
            closesAt?: Date | undefined;
            topic?: string | undefined;
            options?: {
                [x: string]: string | undefined;
            } | undefined;
            ballots?: {
                [x: string]: {
                    id?: string | undefined;
                    pollId?: string | undefined;
                    userId?: string | undefined;
                    userName?: string | undefined;
                    createdAt?: Date | undefined;
                    updatedAt?: Date | undefined;
                    votes?: {
                        [x: string]: {
                            option?: string | undefined;
                            rank?: number | undefined;
                        } | undefined;
                    } | undefined;
                    ballotOptionMapping?: {
                        [x: string]: string | undefined;
                    } | undefined;
                    context?: ({
                        discord?: {
                            userId?: string | undefined;
                            userName?: string | undefined;
                        } | undefined;
                    } & {
                        $case: "discord";
                    }) | ({
                        web?: {
                            userId?: string | undefined;
                            userName?: string | undefined;
                        } | undefined;
                    } & {
                        $case: "web";
                    }) | undefined;
                } | undefined;
            } | undefined;
            features?: PollFeatureDTO[] | undefined;
            messageRef?: {
                id?: string | undefined;
                channelId?: string | undefined;
            } | undefined;
            context?: ({
                discord?: {
                    guildId?: string | undefined;
                    ownerId?: string | undefined;
                    messageRef?: {
                        id?: string | undefined;
                        channelId?: string | undefined;
                    } | undefined;
                } | undefined;
            } & {
                $case: "discord";
            }) | ({
                web?: {
                    ownerId?: string | undefined;
                } | undefined;
            } & {
                $case: "web";
            }) | undefined;
        } | undefined;
    } & {
        poll?: ({
            id?: string | undefined;
            guildId?: string | undefined;
            ownerId?: string | undefined;
            createdAt?: Date | undefined;
            closesAt?: Date | undefined;
            topic?: string | undefined;
            options?: {
                [x: string]: string | undefined;
            } | undefined;
            ballots?: {
                [x: string]: {
                    id?: string | undefined;
                    pollId?: string | undefined;
                    userId?: string | undefined;
                    userName?: string | undefined;
                    createdAt?: Date | undefined;
                    updatedAt?: Date | undefined;
                    votes?: {
                        [x: string]: {
                            option?: string | undefined;
                            rank?: number | undefined;
                        } | undefined;
                    } | undefined;
                    ballotOptionMapping?: {
                        [x: string]: string | undefined;
                    } | undefined;
                    context?: ({
                        discord?: {
                            userId?: string | undefined;
                            userName?: string | undefined;
                        } | undefined;
                    } & {
                        $case: "discord";
                    }) | ({
                        web?: {
                            userId?: string | undefined;
                            userName?: string | undefined;
                        } | undefined;
                    } & {
                        $case: "web";
                    }) | undefined;
                } | undefined;
            } | undefined;
            features?: PollFeatureDTO[] | undefined;
            messageRef?: {
                id?: string | undefined;
                channelId?: string | undefined;
            } | undefined;
            context?: ({
                discord?: {
                    guildId?: string | undefined;
                    ownerId?: string | undefined;
                    messageRef?: {
                        id?: string | undefined;
                        channelId?: string | undefined;
                    } | undefined;
                } | undefined;
            } & {
                $case: "discord";
            }) | ({
                web?: {
                    ownerId?: string | undefined;
                } | undefined;
            } & {
                $case: "web";
            }) | undefined;
        } & {
            id?: string | undefined;
            guildId?: string | undefined;
            ownerId?: string | undefined;
            createdAt?: Date | undefined;
            closesAt?: Date | undefined;
            topic?: string | undefined;
            options?: ({
                [x: string]: string | undefined;
            } & {
                [x: string]: string | undefined;
            } & Record<Exclude<keyof I["poll"]["options"], string | number>, never>) | undefined;
            ballots?: ({
                [x: string]: {
                    id?: string | undefined;
                    pollId?: string | undefined;
                    userId?: string | undefined;
                    userName?: string | undefined;
                    createdAt?: Date | undefined;
                    updatedAt?: Date | undefined;
                    votes?: {
                        [x: string]: {
                            option?: string | undefined;
                            rank?: number | undefined;
                        } | undefined;
                    } | undefined;
                    ballotOptionMapping?: {
                        [x: string]: string | undefined;
                    } | undefined;
                    context?: ({
                        discord?: {
                            userId?: string | undefined;
                            userName?: string | undefined;
                        } | undefined;
                    } & {
                        $case: "discord";
                    }) | ({
                        web?: {
                            userId?: string | undefined;
                            userName?: string | undefined;
                        } | undefined;
                    } & {
                        $case: "web";
                    }) | undefined;
                } | undefined;
            } & {
                [x: string]: ({
                    id?: string | undefined;
                    pollId?: string | undefined;
                    userId?: string | undefined;
                    userName?: string | undefined;
                    createdAt?: Date | undefined;
                    updatedAt?: Date | undefined;
                    votes?: {
                        [x: string]: {
                            option?: string | undefined;
                            rank?: number | undefined;
                        } | undefined;
                    } | undefined;
                    ballotOptionMapping?: {
                        [x: string]: string | undefined;
                    } | undefined;
                    context?: ({
                        discord?: {
                            userId?: string | undefined;
                            userName?: string | undefined;
                        } | undefined;
                    } & {
                        $case: "discord";
                    }) | ({
                        web?: {
                            userId?: string | undefined;
                            userName?: string | undefined;
                        } | undefined;
                    } & {
                        $case: "web";
                    }) | undefined;
                } & {
                    id?: string | undefined;
                    pollId?: string | undefined;
                    userId?: string | undefined;
                    userName?: string | undefined;
                    createdAt?: Date | undefined;
                    updatedAt?: Date | undefined;
                    votes?: ({
                        [x: string]: {
                            option?: string | undefined;
                            rank?: number | undefined;
                        } | undefined;
                    } & {
                        [x: string]: ({
                            option?: string | undefined;
                            rank?: number | undefined;
                        } & {
                            option?: string | undefined;
                            rank?: number | undefined;
                        } & Record<Exclude<keyof I["poll"]["ballots"][string]["votes"][string], keyof VoteDTO>, never>) | undefined;
                    } & Record<Exclude<keyof I["poll"]["ballots"][string]["votes"], string | number>, never>) | undefined;
                    ballotOptionMapping?: ({
                        [x: string]: string | undefined;
                    } & {
                        [x: string]: string | undefined;
                    } & Record<Exclude<keyof I["poll"]["ballots"][string]["ballotOptionMapping"], string | number>, never>) | undefined;
                    context?: ({
                        discord?: {
                            userId?: string | undefined;
                            userName?: string | undefined;
                        } | undefined;
                    } & {
                        $case: "discord";
                    } & {
                        discord?: ({
                            userId?: string | undefined;
                            userName?: string | undefined;
                        } & {
                            userId?: string | undefined;
                            userName?: string | undefined;
                        } & Record<Exclude<keyof I["poll"]["ballots"][string]["context"]["discord"], keyof DiscordBallotContextDTO>, never>) | undefined;
                        $case: "discord";
                    } & Record<Exclude<keyof I["poll"]["ballots"][string]["context"], "discord" | "$case">, never>) | ({
                        web?: {
                            userId?: string | undefined;
                            userName?: string | undefined;
                        } | undefined;
                    } & {
                        $case: "web";
                    } & {
                        web?: ({
                            userId?: string | undefined;
                            userName?: string | undefined;
                        } & {
                            userId?: string | undefined;
                            userName?: string | undefined;
                        } & Record<Exclude<keyof I["poll"]["ballots"][string]["context"]["web"], keyof WebBallotContextDTO>, never>) | undefined;
                        $case: "web";
                    } & Record<Exclude<keyof I["poll"]["ballots"][string]["context"], "$case" | "web">, never>) | undefined;
                } & Record<Exclude<keyof I["poll"]["ballots"][string], keyof BallotDTO>, never>) | undefined;
            } & Record<Exclude<keyof I["poll"]["ballots"], string | number>, never>) | undefined;
            features?: (PollFeatureDTO[] & PollFeatureDTO[] & Record<Exclude<keyof I["poll"]["features"], keyof PollFeatureDTO[]>, never>) | undefined;
            messageRef?: ({
                id?: string | undefined;
                channelId?: string | undefined;
            } & {
                id?: string | undefined;
                channelId?: string | undefined;
            } & Record<Exclude<keyof I["poll"]["messageRef"], keyof MessageRefDTO>, never>) | undefined;
            context?: ({
                discord?: {
                    guildId?: string | undefined;
                    ownerId?: string | undefined;
                    messageRef?: {
                        id?: string | undefined;
                        channelId?: string | undefined;
                    } | undefined;
                } | undefined;
            } & {
                $case: "discord";
            } & {
                discord?: ({
                    guildId?: string | undefined;
                    ownerId?: string | undefined;
                    messageRef?: {
                        id?: string | undefined;
                        channelId?: string | undefined;
                    } | undefined;
                } & {
                    guildId?: string | undefined;
                    ownerId?: string | undefined;
                    messageRef?: ({
                        id?: string | undefined;
                        channelId?: string | undefined;
                    } & {
                        id?: string | undefined;
                        channelId?: string | undefined;
                    } & Record<Exclude<keyof I["poll"]["context"]["discord"]["messageRef"], keyof MessageRefDTO>, never>) | undefined;
                } & Record<Exclude<keyof I["poll"]["context"]["discord"], keyof DiscordPollContextDTO>, never>) | undefined;
                $case: "discord";
            } & Record<Exclude<keyof I["poll"]["context"], "discord" | "$case">, never>) | ({
                web?: {
                    ownerId?: string | undefined;
                } | undefined;
            } & {
                $case: "web";
            } & {
                web?: ({
                    ownerId?: string | undefined;
                } & {
                    ownerId?: string | undefined;
                } & Record<Exclude<keyof I["poll"]["context"]["web"], "ownerId">, never>) | undefined;
                $case: "web";
            } & Record<Exclude<keyof I["poll"]["context"], "$case" | "web">, never>) | undefined;
        } & Record<Exclude<keyof I["poll"], keyof PollDTO>, never>) | undefined;
    } & Record<Exclude<keyof I, "poll">, never>>(object: I): ReadPollResponse;
};
export declare const CreatePollRequest: {
    encode(message: CreatePollRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): CreatePollRequest;
    fromJSON(object: any): CreatePollRequest;
    toJSON(message: CreatePollRequest): unknown;
    fromPartial<I extends {
        pollRequest?: {
            topic?: string | undefined;
            options?: {
                [x: string]: string | undefined;
            } | undefined;
            features?: PollFeatureDTO[] | undefined;
            context?: ({
                discord?: {
                    guildId?: string | undefined;
                    ownerId?: string | undefined;
                    messageRef?: {
                        id?: string | undefined;
                        channelId?: string | undefined;
                    } | undefined;
                } | undefined;
            } & {
                $case: "discord";
            }) | ({
                web?: {
                    ownerId?: string | undefined;
                } | undefined;
            } & {
                $case: "web";
            }) | undefined;
        } | undefined;
    } & {
        pollRequest?: ({
            topic?: string | undefined;
            options?: {
                [x: string]: string | undefined;
            } | undefined;
            features?: PollFeatureDTO[] | undefined;
            context?: ({
                discord?: {
                    guildId?: string | undefined;
                    ownerId?: string | undefined;
                    messageRef?: {
                        id?: string | undefined;
                        channelId?: string | undefined;
                    } | undefined;
                } | undefined;
            } & {
                $case: "discord";
            }) | ({
                web?: {
                    ownerId?: string | undefined;
                } | undefined;
            } & {
                $case: "web";
            }) | undefined;
        } & {
            topic?: string | undefined;
            options?: ({
                [x: string]: string | undefined;
            } & {
                [x: string]: string | undefined;
            } & Record<Exclude<keyof I["pollRequest"]["options"], string | number>, never>) | undefined;
            features?: (PollFeatureDTO[] & PollFeatureDTO[] & Record<Exclude<keyof I["pollRequest"]["features"], keyof PollFeatureDTO[]>, never>) | undefined;
            context?: ({
                discord?: {
                    guildId?: string | undefined;
                    ownerId?: string | undefined;
                    messageRef?: {
                        id?: string | undefined;
                        channelId?: string | undefined;
                    } | undefined;
                } | undefined;
            } & {
                $case: "discord";
            } & {
                discord?: ({
                    guildId?: string | undefined;
                    ownerId?: string | undefined;
                    messageRef?: {
                        id?: string | undefined;
                        channelId?: string | undefined;
                    } | undefined;
                } & {
                    guildId?: string | undefined;
                    ownerId?: string | undefined;
                    messageRef?: ({
                        id?: string | undefined;
                        channelId?: string | undefined;
                    } & {
                        id?: string | undefined;
                        channelId?: string | undefined;
                    } & Record<Exclude<keyof I["pollRequest"]["context"]["discord"]["messageRef"], keyof MessageRefDTO>, never>) | undefined;
                } & Record<Exclude<keyof I["pollRequest"]["context"]["discord"], keyof DiscordPollContextDTO>, never>) | undefined;
                $case: "discord";
            } & Record<Exclude<keyof I["pollRequest"]["context"], "discord" | "$case">, never>) | ({
                web?: {
                    ownerId?: string | undefined;
                } | undefined;
            } & {
                $case: "web";
            } & {
                web?: ({
                    ownerId?: string | undefined;
                } & {
                    ownerId?: string | undefined;
                } & Record<Exclude<keyof I["pollRequest"]["context"]["web"], "ownerId">, never>) | undefined;
                $case: "web";
            } & Record<Exclude<keyof I["pollRequest"]["context"], "$case" | "web">, never>) | undefined;
        } & Record<Exclude<keyof I["pollRequest"], keyof PollRequestDTO>, never>) | undefined;
    } & Record<Exclude<keyof I, "pollRequest">, never>>(object: I): CreatePollRequest;
};
export declare const CreatePollResponse: {
    encode(message: CreatePollResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): CreatePollResponse;
    fromJSON(object: any): CreatePollResponse;
    toJSON(message: CreatePollResponse): unknown;
    fromPartial<I extends {
        poll?: {
            id?: string | undefined;
            guildId?: string | undefined;
            ownerId?: string | undefined;
            createdAt?: Date | undefined;
            closesAt?: Date | undefined;
            topic?: string | undefined;
            options?: {
                [x: string]: string | undefined;
            } | undefined;
            ballots?: {
                [x: string]: {
                    id?: string | undefined;
                    pollId?: string | undefined;
                    userId?: string | undefined;
                    userName?: string | undefined;
                    createdAt?: Date | undefined;
                    updatedAt?: Date | undefined;
                    votes?: {
                        [x: string]: {
                            option?: string | undefined;
                            rank?: number | undefined;
                        } | undefined;
                    } | undefined;
                    ballotOptionMapping?: {
                        [x: string]: string | undefined;
                    } | undefined;
                    context?: ({
                        discord?: {
                            userId?: string | undefined;
                            userName?: string | undefined;
                        } | undefined;
                    } & {
                        $case: "discord";
                    }) | ({
                        web?: {
                            userId?: string | undefined;
                            userName?: string | undefined;
                        } | undefined;
                    } & {
                        $case: "web";
                    }) | undefined;
                } | undefined;
            } | undefined;
            features?: PollFeatureDTO[] | undefined;
            messageRef?: {
                id?: string | undefined;
                channelId?: string | undefined;
            } | undefined;
            context?: ({
                discord?: {
                    guildId?: string | undefined;
                    ownerId?: string | undefined;
                    messageRef?: {
                        id?: string | undefined;
                        channelId?: string | undefined;
                    } | undefined;
                } | undefined;
            } & {
                $case: "discord";
            }) | ({
                web?: {
                    ownerId?: string | undefined;
                } | undefined;
            } & {
                $case: "web";
            }) | undefined;
        } | undefined;
    } & {
        poll?: ({
            id?: string | undefined;
            guildId?: string | undefined;
            ownerId?: string | undefined;
            createdAt?: Date | undefined;
            closesAt?: Date | undefined;
            topic?: string | undefined;
            options?: {
                [x: string]: string | undefined;
            } | undefined;
            ballots?: {
                [x: string]: {
                    id?: string | undefined;
                    pollId?: string | undefined;
                    userId?: string | undefined;
                    userName?: string | undefined;
                    createdAt?: Date | undefined;
                    updatedAt?: Date | undefined;
                    votes?: {
                        [x: string]: {
                            option?: string | undefined;
                            rank?: number | undefined;
                        } | undefined;
                    } | undefined;
                    ballotOptionMapping?: {
                        [x: string]: string | undefined;
                    } | undefined;
                    context?: ({
                        discord?: {
                            userId?: string | undefined;
                            userName?: string | undefined;
                        } | undefined;
                    } & {
                        $case: "discord";
                    }) | ({
                        web?: {
                            userId?: string | undefined;
                            userName?: string | undefined;
                        } | undefined;
                    } & {
                        $case: "web";
                    }) | undefined;
                } | undefined;
            } | undefined;
            features?: PollFeatureDTO[] | undefined;
            messageRef?: {
                id?: string | undefined;
                channelId?: string | undefined;
            } | undefined;
            context?: ({
                discord?: {
                    guildId?: string | undefined;
                    ownerId?: string | undefined;
                    messageRef?: {
                        id?: string | undefined;
                        channelId?: string | undefined;
                    } | undefined;
                } | undefined;
            } & {
                $case: "discord";
            }) | ({
                web?: {
                    ownerId?: string | undefined;
                } | undefined;
            } & {
                $case: "web";
            }) | undefined;
        } & {
            id?: string | undefined;
            guildId?: string | undefined;
            ownerId?: string | undefined;
            createdAt?: Date | undefined;
            closesAt?: Date | undefined;
            topic?: string | undefined;
            options?: ({
                [x: string]: string | undefined;
            } & {
                [x: string]: string | undefined;
            } & Record<Exclude<keyof I["poll"]["options"], string | number>, never>) | undefined;
            ballots?: ({
                [x: string]: {
                    id?: string | undefined;
                    pollId?: string | undefined;
                    userId?: string | undefined;
                    userName?: string | undefined;
                    createdAt?: Date | undefined;
                    updatedAt?: Date | undefined;
                    votes?: {
                        [x: string]: {
                            option?: string | undefined;
                            rank?: number | undefined;
                        } | undefined;
                    } | undefined;
                    ballotOptionMapping?: {
                        [x: string]: string | undefined;
                    } | undefined;
                    context?: ({
                        discord?: {
                            userId?: string | undefined;
                            userName?: string | undefined;
                        } | undefined;
                    } & {
                        $case: "discord";
                    }) | ({
                        web?: {
                            userId?: string | undefined;
                            userName?: string | undefined;
                        } | undefined;
                    } & {
                        $case: "web";
                    }) | undefined;
                } | undefined;
            } & {
                [x: string]: ({
                    id?: string | undefined;
                    pollId?: string | undefined;
                    userId?: string | undefined;
                    userName?: string | undefined;
                    createdAt?: Date | undefined;
                    updatedAt?: Date | undefined;
                    votes?: {
                        [x: string]: {
                            option?: string | undefined;
                            rank?: number | undefined;
                        } | undefined;
                    } | undefined;
                    ballotOptionMapping?: {
                        [x: string]: string | undefined;
                    } | undefined;
                    context?: ({
                        discord?: {
                            userId?: string | undefined;
                            userName?: string | undefined;
                        } | undefined;
                    } & {
                        $case: "discord";
                    }) | ({
                        web?: {
                            userId?: string | undefined;
                            userName?: string | undefined;
                        } | undefined;
                    } & {
                        $case: "web";
                    }) | undefined;
                } & {
                    id?: string | undefined;
                    pollId?: string | undefined;
                    userId?: string | undefined;
                    userName?: string | undefined;
                    createdAt?: Date | undefined;
                    updatedAt?: Date | undefined;
                    votes?: ({
                        [x: string]: {
                            option?: string | undefined;
                            rank?: number | undefined;
                        } | undefined;
                    } & {
                        [x: string]: ({
                            option?: string | undefined;
                            rank?: number | undefined;
                        } & {
                            option?: string | undefined;
                            rank?: number | undefined;
                        } & Record<Exclude<keyof I["poll"]["ballots"][string]["votes"][string], keyof VoteDTO>, never>) | undefined;
                    } & Record<Exclude<keyof I["poll"]["ballots"][string]["votes"], string | number>, never>) | undefined;
                    ballotOptionMapping?: ({
                        [x: string]: string | undefined;
                    } & {
                        [x: string]: string | undefined;
                    } & Record<Exclude<keyof I["poll"]["ballots"][string]["ballotOptionMapping"], string | number>, never>) | undefined;
                    context?: ({
                        discord?: {
                            userId?: string | undefined;
                            userName?: string | undefined;
                        } | undefined;
                    } & {
                        $case: "discord";
                    } & {
                        discord?: ({
                            userId?: string | undefined;
                            userName?: string | undefined;
                        } & {
                            userId?: string | undefined;
                            userName?: string | undefined;
                        } & Record<Exclude<keyof I["poll"]["ballots"][string]["context"]["discord"], keyof DiscordBallotContextDTO>, never>) | undefined;
                        $case: "discord";
                    } & Record<Exclude<keyof I["poll"]["ballots"][string]["context"], "discord" | "$case">, never>) | ({
                        web?: {
                            userId?: string | undefined;
                            userName?: string | undefined;
                        } | undefined;
                    } & {
                        $case: "web";
                    } & {
                        web?: ({
                            userId?: string | undefined;
                            userName?: string | undefined;
                        } & {
                            userId?: string | undefined;
                            userName?: string | undefined;
                        } & Record<Exclude<keyof I["poll"]["ballots"][string]["context"]["web"], keyof WebBallotContextDTO>, never>) | undefined;
                        $case: "web";
                    } & Record<Exclude<keyof I["poll"]["ballots"][string]["context"], "$case" | "web">, never>) | undefined;
                } & Record<Exclude<keyof I["poll"]["ballots"][string], keyof BallotDTO>, never>) | undefined;
            } & Record<Exclude<keyof I["poll"]["ballots"], string | number>, never>) | undefined;
            features?: (PollFeatureDTO[] & PollFeatureDTO[] & Record<Exclude<keyof I["poll"]["features"], keyof PollFeatureDTO[]>, never>) | undefined;
            messageRef?: ({
                id?: string | undefined;
                channelId?: string | undefined;
            } & {
                id?: string | undefined;
                channelId?: string | undefined;
            } & Record<Exclude<keyof I["poll"]["messageRef"], keyof MessageRefDTO>, never>) | undefined;
            context?: ({
                discord?: {
                    guildId?: string | undefined;
                    ownerId?: string | undefined;
                    messageRef?: {
                        id?: string | undefined;
                        channelId?: string | undefined;
                    } | undefined;
                } | undefined;
            } & {
                $case: "discord";
            } & {
                discord?: ({
                    guildId?: string | undefined;
                    ownerId?: string | undefined;
                    messageRef?: {
                        id?: string | undefined;
                        channelId?: string | undefined;
                    } | undefined;
                } & {
                    guildId?: string | undefined;
                    ownerId?: string | undefined;
                    messageRef?: ({
                        id?: string | undefined;
                        channelId?: string | undefined;
                    } & {
                        id?: string | undefined;
                        channelId?: string | undefined;
                    } & Record<Exclude<keyof I["poll"]["context"]["discord"]["messageRef"], keyof MessageRefDTO>, never>) | undefined;
                } & Record<Exclude<keyof I["poll"]["context"]["discord"], keyof DiscordPollContextDTO>, never>) | undefined;
                $case: "discord";
            } & Record<Exclude<keyof I["poll"]["context"], "discord" | "$case">, never>) | ({
                web?: {
                    ownerId?: string | undefined;
                } | undefined;
            } & {
                $case: "web";
            } & {
                web?: ({
                    ownerId?: string | undefined;
                } & {
                    ownerId?: string | undefined;
                } & Record<Exclude<keyof I["poll"]["context"]["web"], "ownerId">, never>) | undefined;
                $case: "web";
            } & Record<Exclude<keyof I["poll"]["context"], "$case" | "web">, never>) | undefined;
        } & Record<Exclude<keyof I["poll"], keyof PollDTO>, never>) | undefined;
    } & Record<Exclude<keyof I, "poll">, never>>(object: I): CreatePollResponse;
};
export declare const UpdatePollRequest: {
    encode(message: UpdatePollRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): UpdatePollRequest;
    fromJSON(object: any): UpdatePollRequest;
    toJSON(message: UpdatePollRequest): unknown;
    fromPartial<I extends {
        pollRequest?: {
            topic?: string | undefined;
            options?: {
                [x: string]: string | undefined;
            } | undefined;
            features?: PollFeatureDTO[] | undefined;
            context?: ({
                discord?: {
                    guildId?: string | undefined;
                    ownerId?: string | undefined;
                    messageRef?: {
                        id?: string | undefined;
                        channelId?: string | undefined;
                    } | undefined;
                } | undefined;
            } & {
                $case: "discord";
            }) | ({
                web?: {
                    ownerId?: string | undefined;
                } | undefined;
            } & {
                $case: "web";
            }) | undefined;
        } | undefined;
    } & {
        pollRequest?: ({
            topic?: string | undefined;
            options?: {
                [x: string]: string | undefined;
            } | undefined;
            features?: PollFeatureDTO[] | undefined;
            context?: ({
                discord?: {
                    guildId?: string | undefined;
                    ownerId?: string | undefined;
                    messageRef?: {
                        id?: string | undefined;
                        channelId?: string | undefined;
                    } | undefined;
                } | undefined;
            } & {
                $case: "discord";
            }) | ({
                web?: {
                    ownerId?: string | undefined;
                } | undefined;
            } & {
                $case: "web";
            }) | undefined;
        } & {
            topic?: string | undefined;
            options?: ({
                [x: string]: string | undefined;
            } & {
                [x: string]: string | undefined;
            } & Record<Exclude<keyof I["pollRequest"]["options"], string | number>, never>) | undefined;
            features?: (PollFeatureDTO[] & PollFeatureDTO[] & Record<Exclude<keyof I["pollRequest"]["features"], keyof PollFeatureDTO[]>, never>) | undefined;
            context?: ({
                discord?: {
                    guildId?: string | undefined;
                    ownerId?: string | undefined;
                    messageRef?: {
                        id?: string | undefined;
                        channelId?: string | undefined;
                    } | undefined;
                } | undefined;
            } & {
                $case: "discord";
            } & {
                discord?: ({
                    guildId?: string | undefined;
                    ownerId?: string | undefined;
                    messageRef?: {
                        id?: string | undefined;
                        channelId?: string | undefined;
                    } | undefined;
                } & {
                    guildId?: string | undefined;
                    ownerId?: string | undefined;
                    messageRef?: ({
                        id?: string | undefined;
                        channelId?: string | undefined;
                    } & {
                        id?: string | undefined;
                        channelId?: string | undefined;
                    } & Record<Exclude<keyof I["pollRequest"]["context"]["discord"]["messageRef"], keyof MessageRefDTO>, never>) | undefined;
                } & Record<Exclude<keyof I["pollRequest"]["context"]["discord"], keyof DiscordPollContextDTO>, never>) | undefined;
                $case: "discord";
            } & Record<Exclude<keyof I["pollRequest"]["context"], "discord" | "$case">, never>) | ({
                web?: {
                    ownerId?: string | undefined;
                } | undefined;
            } & {
                $case: "web";
            } & {
                web?: ({
                    ownerId?: string | undefined;
                } & {
                    ownerId?: string | undefined;
                } & Record<Exclude<keyof I["pollRequest"]["context"]["web"], "ownerId">, never>) | undefined;
                $case: "web";
            } & Record<Exclude<keyof I["pollRequest"]["context"], "$case" | "web">, never>) | undefined;
        } & Record<Exclude<keyof I["pollRequest"], keyof PollRequestDTO>, never>) | undefined;
    } & Record<Exclude<keyof I, "pollRequest">, never>>(object: I): UpdatePollRequest;
};
export declare const UpdatePollResponse: {
    encode(message: UpdatePollResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): UpdatePollResponse;
    fromJSON(object: any): UpdatePollResponse;
    toJSON(message: UpdatePollResponse): unknown;
    fromPartial<I extends {
        poll?: {
            id?: string | undefined;
            guildId?: string | undefined;
            ownerId?: string | undefined;
            createdAt?: Date | undefined;
            closesAt?: Date | undefined;
            topic?: string | undefined;
            options?: {
                [x: string]: string | undefined;
            } | undefined;
            ballots?: {
                [x: string]: {
                    id?: string | undefined;
                    pollId?: string | undefined;
                    userId?: string | undefined;
                    userName?: string | undefined;
                    createdAt?: Date | undefined;
                    updatedAt?: Date | undefined;
                    votes?: {
                        [x: string]: {
                            option?: string | undefined;
                            rank?: number | undefined;
                        } | undefined;
                    } | undefined;
                    ballotOptionMapping?: {
                        [x: string]: string | undefined;
                    } | undefined;
                    context?: ({
                        discord?: {
                            userId?: string | undefined;
                            userName?: string | undefined;
                        } | undefined;
                    } & {
                        $case: "discord";
                    }) | ({
                        web?: {
                            userId?: string | undefined;
                            userName?: string | undefined;
                        } | undefined;
                    } & {
                        $case: "web";
                    }) | undefined;
                } | undefined;
            } | undefined;
            features?: PollFeatureDTO[] | undefined;
            messageRef?: {
                id?: string | undefined;
                channelId?: string | undefined;
            } | undefined;
            context?: ({
                discord?: {
                    guildId?: string | undefined;
                    ownerId?: string | undefined;
                    messageRef?: {
                        id?: string | undefined;
                        channelId?: string | undefined;
                    } | undefined;
                } | undefined;
            } & {
                $case: "discord";
            }) | ({
                web?: {
                    ownerId?: string | undefined;
                } | undefined;
            } & {
                $case: "web";
            }) | undefined;
        } | undefined;
    } & {
        poll?: ({
            id?: string | undefined;
            guildId?: string | undefined;
            ownerId?: string | undefined;
            createdAt?: Date | undefined;
            closesAt?: Date | undefined;
            topic?: string | undefined;
            options?: {
                [x: string]: string | undefined;
            } | undefined;
            ballots?: {
                [x: string]: {
                    id?: string | undefined;
                    pollId?: string | undefined;
                    userId?: string | undefined;
                    userName?: string | undefined;
                    createdAt?: Date | undefined;
                    updatedAt?: Date | undefined;
                    votes?: {
                        [x: string]: {
                            option?: string | undefined;
                            rank?: number | undefined;
                        } | undefined;
                    } | undefined;
                    ballotOptionMapping?: {
                        [x: string]: string | undefined;
                    } | undefined;
                    context?: ({
                        discord?: {
                            userId?: string | undefined;
                            userName?: string | undefined;
                        } | undefined;
                    } & {
                        $case: "discord";
                    }) | ({
                        web?: {
                            userId?: string | undefined;
                            userName?: string | undefined;
                        } | undefined;
                    } & {
                        $case: "web";
                    }) | undefined;
                } | undefined;
            } | undefined;
            features?: PollFeatureDTO[] | undefined;
            messageRef?: {
                id?: string | undefined;
                channelId?: string | undefined;
            } | undefined;
            context?: ({
                discord?: {
                    guildId?: string | undefined;
                    ownerId?: string | undefined;
                    messageRef?: {
                        id?: string | undefined;
                        channelId?: string | undefined;
                    } | undefined;
                } | undefined;
            } & {
                $case: "discord";
            }) | ({
                web?: {
                    ownerId?: string | undefined;
                } | undefined;
            } & {
                $case: "web";
            }) | undefined;
        } & {
            id?: string | undefined;
            guildId?: string | undefined;
            ownerId?: string | undefined;
            createdAt?: Date | undefined;
            closesAt?: Date | undefined;
            topic?: string | undefined;
            options?: ({
                [x: string]: string | undefined;
            } & {
                [x: string]: string | undefined;
            } & Record<Exclude<keyof I["poll"]["options"], string | number>, never>) | undefined;
            ballots?: ({
                [x: string]: {
                    id?: string | undefined;
                    pollId?: string | undefined;
                    userId?: string | undefined;
                    userName?: string | undefined;
                    createdAt?: Date | undefined;
                    updatedAt?: Date | undefined;
                    votes?: {
                        [x: string]: {
                            option?: string | undefined;
                            rank?: number | undefined;
                        } | undefined;
                    } | undefined;
                    ballotOptionMapping?: {
                        [x: string]: string | undefined;
                    } | undefined;
                    context?: ({
                        discord?: {
                            userId?: string | undefined;
                            userName?: string | undefined;
                        } | undefined;
                    } & {
                        $case: "discord";
                    }) | ({
                        web?: {
                            userId?: string | undefined;
                            userName?: string | undefined;
                        } | undefined;
                    } & {
                        $case: "web";
                    }) | undefined;
                } | undefined;
            } & {
                [x: string]: ({
                    id?: string | undefined;
                    pollId?: string | undefined;
                    userId?: string | undefined;
                    userName?: string | undefined;
                    createdAt?: Date | undefined;
                    updatedAt?: Date | undefined;
                    votes?: {
                        [x: string]: {
                            option?: string | undefined;
                            rank?: number | undefined;
                        } | undefined;
                    } | undefined;
                    ballotOptionMapping?: {
                        [x: string]: string | undefined;
                    } | undefined;
                    context?: ({
                        discord?: {
                            userId?: string | undefined;
                            userName?: string | undefined;
                        } | undefined;
                    } & {
                        $case: "discord";
                    }) | ({
                        web?: {
                            userId?: string | undefined;
                            userName?: string | undefined;
                        } | undefined;
                    } & {
                        $case: "web";
                    }) | undefined;
                } & {
                    id?: string | undefined;
                    pollId?: string | undefined;
                    userId?: string | undefined;
                    userName?: string | undefined;
                    createdAt?: Date | undefined;
                    updatedAt?: Date | undefined;
                    votes?: ({
                        [x: string]: {
                            option?: string | undefined;
                            rank?: number | undefined;
                        } | undefined;
                    } & {
                        [x: string]: ({
                            option?: string | undefined;
                            rank?: number | undefined;
                        } & {
                            option?: string | undefined;
                            rank?: number | undefined;
                        } & Record<Exclude<keyof I["poll"]["ballots"][string]["votes"][string], keyof VoteDTO>, never>) | undefined;
                    } & Record<Exclude<keyof I["poll"]["ballots"][string]["votes"], string | number>, never>) | undefined;
                    ballotOptionMapping?: ({
                        [x: string]: string | undefined;
                    } & {
                        [x: string]: string | undefined;
                    } & Record<Exclude<keyof I["poll"]["ballots"][string]["ballotOptionMapping"], string | number>, never>) | undefined;
                    context?: ({
                        discord?: {
                            userId?: string | undefined;
                            userName?: string | undefined;
                        } | undefined;
                    } & {
                        $case: "discord";
                    } & {
                        discord?: ({
                            userId?: string | undefined;
                            userName?: string | undefined;
                        } & {
                            userId?: string | undefined;
                            userName?: string | undefined;
                        } & Record<Exclude<keyof I["poll"]["ballots"][string]["context"]["discord"], keyof DiscordBallotContextDTO>, never>) | undefined;
                        $case: "discord";
                    } & Record<Exclude<keyof I["poll"]["ballots"][string]["context"], "discord" | "$case">, never>) | ({
                        web?: {
                            userId?: string | undefined;
                            userName?: string | undefined;
                        } | undefined;
                    } & {
                        $case: "web";
                    } & {
                        web?: ({
                            userId?: string | undefined;
                            userName?: string | undefined;
                        } & {
                            userId?: string | undefined;
                            userName?: string | undefined;
                        } & Record<Exclude<keyof I["poll"]["ballots"][string]["context"]["web"], keyof WebBallotContextDTO>, never>) | undefined;
                        $case: "web";
                    } & Record<Exclude<keyof I["poll"]["ballots"][string]["context"], "$case" | "web">, never>) | undefined;
                } & Record<Exclude<keyof I["poll"]["ballots"][string], keyof BallotDTO>, never>) | undefined;
            } & Record<Exclude<keyof I["poll"]["ballots"], string | number>, never>) | undefined;
            features?: (PollFeatureDTO[] & PollFeatureDTO[] & Record<Exclude<keyof I["poll"]["features"], keyof PollFeatureDTO[]>, never>) | undefined;
            messageRef?: ({
                id?: string | undefined;
                channelId?: string | undefined;
            } & {
                id?: string | undefined;
                channelId?: string | undefined;
            } & Record<Exclude<keyof I["poll"]["messageRef"], keyof MessageRefDTO>, never>) | undefined;
            context?: ({
                discord?: {
                    guildId?: string | undefined;
                    ownerId?: string | undefined;
                    messageRef?: {
                        id?: string | undefined;
                        channelId?: string | undefined;
                    } | undefined;
                } | undefined;
            } & {
                $case: "discord";
            } & {
                discord?: ({
                    guildId?: string | undefined;
                    ownerId?: string | undefined;
                    messageRef?: {
                        id?: string | undefined;
                        channelId?: string | undefined;
                    } | undefined;
                } & {
                    guildId?: string | undefined;
                    ownerId?: string | undefined;
                    messageRef?: ({
                        id?: string | undefined;
                        channelId?: string | undefined;
                    } & {
                        id?: string | undefined;
                        channelId?: string | undefined;
                    } & Record<Exclude<keyof I["poll"]["context"]["discord"]["messageRef"], keyof MessageRefDTO>, never>) | undefined;
                } & Record<Exclude<keyof I["poll"]["context"]["discord"], keyof DiscordPollContextDTO>, never>) | undefined;
                $case: "discord";
            } & Record<Exclude<keyof I["poll"]["context"], "discord" | "$case">, never>) | ({
                web?: {
                    ownerId?: string | undefined;
                } | undefined;
            } & {
                $case: "web";
            } & {
                web?: ({
                    ownerId?: string | undefined;
                } & {
                    ownerId?: string | undefined;
                } & Record<Exclude<keyof I["poll"]["context"]["web"], "ownerId">, never>) | undefined;
                $case: "web";
            } & Record<Exclude<keyof I["poll"]["context"], "$case" | "web">, never>) | undefined;
        } & Record<Exclude<keyof I["poll"], keyof PollDTO>, never>) | undefined;
    } & Record<Exclude<keyof I, "poll">, never>>(object: I): UpdatePollResponse;
};
export declare const DeletePollRequest: {
    encode(message: DeletePollRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): DeletePollRequest;
    fromJSON(object: any): DeletePollRequest;
    toJSON(message: DeletePollRequest): unknown;
    fromPartial<I extends {
        pollId?: string | undefined;
    } & {
        pollId?: string | undefined;
    } & Record<Exclude<keyof I, "pollId">, never>>(object: I): DeletePollRequest;
};
export declare const DeletePollResponse: {
    encode(message: DeletePollResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): DeletePollResponse;
    fromJSON(object: any): DeletePollResponse;
    toJSON(message: DeletePollResponse): unknown;
    fromPartial<I extends {
        poll?: {
            id?: string | undefined;
            guildId?: string | undefined;
            ownerId?: string | undefined;
            createdAt?: Date | undefined;
            closesAt?: Date | undefined;
            topic?: string | undefined;
            options?: {
                [x: string]: string | undefined;
            } | undefined;
            ballots?: {
                [x: string]: {
                    id?: string | undefined;
                    pollId?: string | undefined;
                    userId?: string | undefined;
                    userName?: string | undefined;
                    createdAt?: Date | undefined;
                    updatedAt?: Date | undefined;
                    votes?: {
                        [x: string]: {
                            option?: string | undefined;
                            rank?: number | undefined;
                        } | undefined;
                    } | undefined;
                    ballotOptionMapping?: {
                        [x: string]: string | undefined;
                    } | undefined;
                    context?: ({
                        discord?: {
                            userId?: string | undefined;
                            userName?: string | undefined;
                        } | undefined;
                    } & {
                        $case: "discord";
                    }) | ({
                        web?: {
                            userId?: string | undefined;
                            userName?: string | undefined;
                        } | undefined;
                    } & {
                        $case: "web";
                    }) | undefined;
                } | undefined;
            } | undefined;
            features?: PollFeatureDTO[] | undefined;
            messageRef?: {
                id?: string | undefined;
                channelId?: string | undefined;
            } | undefined;
            context?: ({
                discord?: {
                    guildId?: string | undefined;
                    ownerId?: string | undefined;
                    messageRef?: {
                        id?: string | undefined;
                        channelId?: string | undefined;
                    } | undefined;
                } | undefined;
            } & {
                $case: "discord";
            }) | ({
                web?: {
                    ownerId?: string | undefined;
                } | undefined;
            } & {
                $case: "web";
            }) | undefined;
        } | undefined;
    } & {
        poll?: ({
            id?: string | undefined;
            guildId?: string | undefined;
            ownerId?: string | undefined;
            createdAt?: Date | undefined;
            closesAt?: Date | undefined;
            topic?: string | undefined;
            options?: {
                [x: string]: string | undefined;
            } | undefined;
            ballots?: {
                [x: string]: {
                    id?: string | undefined;
                    pollId?: string | undefined;
                    userId?: string | undefined;
                    userName?: string | undefined;
                    createdAt?: Date | undefined;
                    updatedAt?: Date | undefined;
                    votes?: {
                        [x: string]: {
                            option?: string | undefined;
                            rank?: number | undefined;
                        } | undefined;
                    } | undefined;
                    ballotOptionMapping?: {
                        [x: string]: string | undefined;
                    } | undefined;
                    context?: ({
                        discord?: {
                            userId?: string | undefined;
                            userName?: string | undefined;
                        } | undefined;
                    } & {
                        $case: "discord";
                    }) | ({
                        web?: {
                            userId?: string | undefined;
                            userName?: string | undefined;
                        } | undefined;
                    } & {
                        $case: "web";
                    }) | undefined;
                } | undefined;
            } | undefined;
            features?: PollFeatureDTO[] | undefined;
            messageRef?: {
                id?: string | undefined;
                channelId?: string | undefined;
            } | undefined;
            context?: ({
                discord?: {
                    guildId?: string | undefined;
                    ownerId?: string | undefined;
                    messageRef?: {
                        id?: string | undefined;
                        channelId?: string | undefined;
                    } | undefined;
                } | undefined;
            } & {
                $case: "discord";
            }) | ({
                web?: {
                    ownerId?: string | undefined;
                } | undefined;
            } & {
                $case: "web";
            }) | undefined;
        } & {
            id?: string | undefined;
            guildId?: string | undefined;
            ownerId?: string | undefined;
            createdAt?: Date | undefined;
            closesAt?: Date | undefined;
            topic?: string | undefined;
            options?: ({
                [x: string]: string | undefined;
            } & {
                [x: string]: string | undefined;
            } & Record<Exclude<keyof I["poll"]["options"], string | number>, never>) | undefined;
            ballots?: ({
                [x: string]: {
                    id?: string | undefined;
                    pollId?: string | undefined;
                    userId?: string | undefined;
                    userName?: string | undefined;
                    createdAt?: Date | undefined;
                    updatedAt?: Date | undefined;
                    votes?: {
                        [x: string]: {
                            option?: string | undefined;
                            rank?: number | undefined;
                        } | undefined;
                    } | undefined;
                    ballotOptionMapping?: {
                        [x: string]: string | undefined;
                    } | undefined;
                    context?: ({
                        discord?: {
                            userId?: string | undefined;
                            userName?: string | undefined;
                        } | undefined;
                    } & {
                        $case: "discord";
                    }) | ({
                        web?: {
                            userId?: string | undefined;
                            userName?: string | undefined;
                        } | undefined;
                    } & {
                        $case: "web";
                    }) | undefined;
                } | undefined;
            } & {
                [x: string]: ({
                    id?: string | undefined;
                    pollId?: string | undefined;
                    userId?: string | undefined;
                    userName?: string | undefined;
                    createdAt?: Date | undefined;
                    updatedAt?: Date | undefined;
                    votes?: {
                        [x: string]: {
                            option?: string | undefined;
                            rank?: number | undefined;
                        } | undefined;
                    } | undefined;
                    ballotOptionMapping?: {
                        [x: string]: string | undefined;
                    } | undefined;
                    context?: ({
                        discord?: {
                            userId?: string | undefined;
                            userName?: string | undefined;
                        } | undefined;
                    } & {
                        $case: "discord";
                    }) | ({
                        web?: {
                            userId?: string | undefined;
                            userName?: string | undefined;
                        } | undefined;
                    } & {
                        $case: "web";
                    }) | undefined;
                } & {
                    id?: string | undefined;
                    pollId?: string | undefined;
                    userId?: string | undefined;
                    userName?: string | undefined;
                    createdAt?: Date | undefined;
                    updatedAt?: Date | undefined;
                    votes?: ({
                        [x: string]: {
                            option?: string | undefined;
                            rank?: number | undefined;
                        } | undefined;
                    } & {
                        [x: string]: ({
                            option?: string | undefined;
                            rank?: number | undefined;
                        } & {
                            option?: string | undefined;
                            rank?: number | undefined;
                        } & Record<Exclude<keyof I["poll"]["ballots"][string]["votes"][string], keyof VoteDTO>, never>) | undefined;
                    } & Record<Exclude<keyof I["poll"]["ballots"][string]["votes"], string | number>, never>) | undefined;
                    ballotOptionMapping?: ({
                        [x: string]: string | undefined;
                    } & {
                        [x: string]: string | undefined;
                    } & Record<Exclude<keyof I["poll"]["ballots"][string]["ballotOptionMapping"], string | number>, never>) | undefined;
                    context?: ({
                        discord?: {
                            userId?: string | undefined;
                            userName?: string | undefined;
                        } | undefined;
                    } & {
                        $case: "discord";
                    } & {
                        discord?: ({
                            userId?: string | undefined;
                            userName?: string | undefined;
                        } & {
                            userId?: string | undefined;
                            userName?: string | undefined;
                        } & Record<Exclude<keyof I["poll"]["ballots"][string]["context"]["discord"], keyof DiscordBallotContextDTO>, never>) | undefined;
                        $case: "discord";
                    } & Record<Exclude<keyof I["poll"]["ballots"][string]["context"], "discord" | "$case">, never>) | ({
                        web?: {
                            userId?: string | undefined;
                            userName?: string | undefined;
                        } | undefined;
                    } & {
                        $case: "web";
                    } & {
                        web?: ({
                            userId?: string | undefined;
                            userName?: string | undefined;
                        } & {
                            userId?: string | undefined;
                            userName?: string | undefined;
                        } & Record<Exclude<keyof I["poll"]["ballots"][string]["context"]["web"], keyof WebBallotContextDTO>, never>) | undefined;
                        $case: "web";
                    } & Record<Exclude<keyof I["poll"]["ballots"][string]["context"], "$case" | "web">, never>) | undefined;
                } & Record<Exclude<keyof I["poll"]["ballots"][string], keyof BallotDTO>, never>) | undefined;
            } & Record<Exclude<keyof I["poll"]["ballots"], string | number>, never>) | undefined;
            features?: (PollFeatureDTO[] & PollFeatureDTO[] & Record<Exclude<keyof I["poll"]["features"], keyof PollFeatureDTO[]>, never>) | undefined;
            messageRef?: ({
                id?: string | undefined;
                channelId?: string | undefined;
            } & {
                id?: string | undefined;
                channelId?: string | undefined;
            } & Record<Exclude<keyof I["poll"]["messageRef"], keyof MessageRefDTO>, never>) | undefined;
            context?: ({
                discord?: {
                    guildId?: string | undefined;
                    ownerId?: string | undefined;
                    messageRef?: {
                        id?: string | undefined;
                        channelId?: string | undefined;
                    } | undefined;
                } | undefined;
            } & {
                $case: "discord";
            } & {
                discord?: ({
                    guildId?: string | undefined;
                    ownerId?: string | undefined;
                    messageRef?: {
                        id?: string | undefined;
                        channelId?: string | undefined;
                    } | undefined;
                } & {
                    guildId?: string | undefined;
                    ownerId?: string | undefined;
                    messageRef?: ({
                        id?: string | undefined;
                        channelId?: string | undefined;
                    } & {
                        id?: string | undefined;
                        channelId?: string | undefined;
                    } & Record<Exclude<keyof I["poll"]["context"]["discord"]["messageRef"], keyof MessageRefDTO>, never>) | undefined;
                } & Record<Exclude<keyof I["poll"]["context"]["discord"], keyof DiscordPollContextDTO>, never>) | undefined;
                $case: "discord";
            } & Record<Exclude<keyof I["poll"]["context"], "discord" | "$case">, never>) | ({
                web?: {
                    ownerId?: string | undefined;
                } | undefined;
            } & {
                $case: "web";
            } & {
                web?: ({
                    ownerId?: string | undefined;
                } & {
                    ownerId?: string | undefined;
                } & Record<Exclude<keyof I["poll"]["context"]["web"], "ownerId">, never>) | undefined;
                $case: "web";
            } & Record<Exclude<keyof I["poll"]["context"], "$case" | "web">, never>) | undefined;
        } & Record<Exclude<keyof I["poll"], keyof PollDTO>, never>) | undefined;
    } & Record<Exclude<keyof I, "poll">, never>>(object: I): DeletePollResponse;
};
export declare const VoteDTO: {
    encode(message: VoteDTO, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): VoteDTO;
    fromJSON(object: any): VoteDTO;
    toJSON(message: VoteDTO): unknown;
    fromPartial<I extends {
        option?: string | undefined;
        rank?: number | undefined;
    } & {
        option?: string | undefined;
        rank?: number | undefined;
    } & Record<Exclude<keyof I, keyof VoteDTO>, never>>(object: I): VoteDTO;
};
export declare const BallotRequestDTO: {
    encode(message: BallotRequestDTO, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): BallotRequestDTO;
    fromJSON(object: any): BallotRequestDTO;
    toJSON(message: BallotRequestDTO): unknown;
    fromPartial<I extends {
        pollId?: string | undefined;
        context?: ({
            discord?: {
                userId?: string | undefined;
                userName?: string | undefined;
            } | undefined;
        } & {
            $case: "discord";
        }) | ({
            web?: {
                userId?: string | undefined;
                userName?: string | undefined;
            } | undefined;
        } & {
            $case: "web";
        }) | undefined;
    } & {
        pollId?: string | undefined;
        context?: ({
            discord?: {
                userId?: string | undefined;
                userName?: string | undefined;
            } | undefined;
        } & {
            $case: "discord";
        } & {
            discord?: ({
                userId?: string | undefined;
                userName?: string | undefined;
            } & {
                userId?: string | undefined;
                userName?: string | undefined;
            } & Record<Exclude<keyof I["context"]["discord"], keyof DiscordBallotContextDTO>, never>) | undefined;
            $case: "discord";
        } & Record<Exclude<keyof I["context"], "discord" | "$case">, never>) | ({
            web?: {
                userId?: string | undefined;
                userName?: string | undefined;
            } | undefined;
        } & {
            $case: "web";
        } & {
            web?: ({
                userId?: string | undefined;
                userName?: string | undefined;
            } & {
                userId?: string | undefined;
                userName?: string | undefined;
            } & Record<Exclude<keyof I["context"]["web"], keyof WebBallotContextDTO>, never>) | undefined;
            $case: "web";
        } & Record<Exclude<keyof I["context"], "$case" | "web">, never>) | undefined;
    } & Record<Exclude<keyof I, keyof BallotRequestDTO>, never>>(object: I): BallotRequestDTO;
};
export declare const BallotDTO: {
    encode(message: BallotDTO, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): BallotDTO;
    fromJSON(object: any): BallotDTO;
    toJSON(message: BallotDTO): unknown;
    fromPartial<I extends {
        id?: string | undefined;
        pollId?: string | undefined;
        userId?: string | undefined;
        userName?: string | undefined;
        createdAt?: Date | undefined;
        updatedAt?: Date | undefined;
        votes?: {
            [x: string]: {
                option?: string | undefined;
                rank?: number | undefined;
            } | undefined;
        } | undefined;
        ballotOptionMapping?: {
            [x: string]: string | undefined;
        } | undefined;
        context?: ({
            discord?: {
                userId?: string | undefined;
                userName?: string | undefined;
            } | undefined;
        } & {
            $case: "discord";
        }) | ({
            web?: {
                userId?: string | undefined;
                userName?: string | undefined;
            } | undefined;
        } & {
            $case: "web";
        }) | undefined;
    } & {
        id?: string | undefined;
        pollId?: string | undefined;
        userId?: string | undefined;
        userName?: string | undefined;
        createdAt?: Date | undefined;
        updatedAt?: Date | undefined;
        votes?: ({
            [x: string]: {
                option?: string | undefined;
                rank?: number | undefined;
            } | undefined;
        } & {
            [x: string]: ({
                option?: string | undefined;
                rank?: number | undefined;
            } & {
                option?: string | undefined;
                rank?: number | undefined;
            } & Record<Exclude<keyof I["votes"][string], keyof VoteDTO>, never>) | undefined;
        } & Record<Exclude<keyof I["votes"], string | number>, never>) | undefined;
        ballotOptionMapping?: ({
            [x: string]: string | undefined;
        } & {
            [x: string]: string | undefined;
        } & Record<Exclude<keyof I["ballotOptionMapping"], string | number>, never>) | undefined;
        context?: ({
            discord?: {
                userId?: string | undefined;
                userName?: string | undefined;
            } | undefined;
        } & {
            $case: "discord";
        } & {
            discord?: ({
                userId?: string | undefined;
                userName?: string | undefined;
            } & {
                userId?: string | undefined;
                userName?: string | undefined;
            } & Record<Exclude<keyof I["context"]["discord"], keyof DiscordBallotContextDTO>, never>) | undefined;
            $case: "discord";
        } & Record<Exclude<keyof I["context"], "discord" | "$case">, never>) | ({
            web?: {
                userId?: string | undefined;
                userName?: string | undefined;
            } | undefined;
        } & {
            $case: "web";
        } & {
            web?: ({
                userId?: string | undefined;
                userName?: string | undefined;
            } & {
                userId?: string | undefined;
                userName?: string | undefined;
            } & Record<Exclude<keyof I["context"]["web"], keyof WebBallotContextDTO>, never>) | undefined;
            $case: "web";
        } & Record<Exclude<keyof I["context"], "$case" | "web">, never>) | undefined;
    } & Record<Exclude<keyof I, keyof BallotDTO>, never>>(object: I): BallotDTO;
};
export declare const BallotDTO_VotesEntry: {
    encode(message: BallotDTO_VotesEntry, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): BallotDTO_VotesEntry;
    fromJSON(object: any): BallotDTO_VotesEntry;
    toJSON(message: BallotDTO_VotesEntry): unknown;
    fromPartial<I extends {
        key?: string | undefined;
        value?: {
            option?: string | undefined;
            rank?: number | undefined;
        } | undefined;
    } & {
        key?: string | undefined;
        value?: ({
            option?: string | undefined;
            rank?: number | undefined;
        } & {
            option?: string | undefined;
            rank?: number | undefined;
        } & Record<Exclude<keyof I["value"], keyof VoteDTO>, never>) | undefined;
    } & Record<Exclude<keyof I, keyof BallotDTO_VotesEntry>, never>>(object: I): BallotDTO_VotesEntry;
};
export declare const BallotDTO_BallotOptionMappingEntry: {
    encode(message: BallotDTO_BallotOptionMappingEntry, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): BallotDTO_BallotOptionMappingEntry;
    fromJSON(object: any): BallotDTO_BallotOptionMappingEntry;
    toJSON(message: BallotDTO_BallotOptionMappingEntry): unknown;
    fromPartial<I extends {
        key?: string | undefined;
        value?: string | undefined;
    } & {
        key?: string | undefined;
        value?: string | undefined;
    } & Record<Exclude<keyof I, keyof BallotDTO_BallotOptionMappingEntry>, never>>(object: I): BallotDTO_BallotOptionMappingEntry;
};
export declare const DiscordBallotContextDTO: {
    encode(message: DiscordBallotContextDTO, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): DiscordBallotContextDTO;
    fromJSON(object: any): DiscordBallotContextDTO;
    toJSON(message: DiscordBallotContextDTO): unknown;
    fromPartial<I extends {
        userId?: string | undefined;
        userName?: string | undefined;
    } & {
        userId?: string | undefined;
        userName?: string | undefined;
    } & Record<Exclude<keyof I, keyof DiscordBallotContextDTO>, never>>(object: I): DiscordBallotContextDTO;
};
export declare const WebBallotContextDTO: {
    encode(message: WebBallotContextDTO, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): WebBallotContextDTO;
    fromJSON(object: any): WebBallotContextDTO;
    toJSON(message: WebBallotContextDTO): unknown;
    fromPartial<I extends {
        userId?: string | undefined;
        userName?: string | undefined;
    } & {
        userId?: string | undefined;
        userName?: string | undefined;
    } & Record<Exclude<keyof I, keyof WebBallotContextDTO>, never>>(object: I): WebBallotContextDTO;
};
export declare const PollRequestDTO: {
    encode(message: PollRequestDTO, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): PollRequestDTO;
    fromJSON(object: any): PollRequestDTO;
    toJSON(message: PollRequestDTO): unknown;
    fromPartial<I extends {
        topic?: string | undefined;
        options?: {
            [x: string]: string | undefined;
        } | undefined;
        features?: PollFeatureDTO[] | undefined;
        context?: ({
            discord?: {
                guildId?: string | undefined;
                ownerId?: string | undefined;
                messageRef?: {
                    id?: string | undefined;
                    channelId?: string | undefined;
                } | undefined;
            } | undefined;
        } & {
            $case: "discord";
        }) | ({
            web?: {
                ownerId?: string | undefined;
            } | undefined;
        } & {
            $case: "web";
        }) | undefined;
    } & {
        topic?: string | undefined;
        options?: ({
            [x: string]: string | undefined;
        } & {
            [x: string]: string | undefined;
        } & Record<Exclude<keyof I["options"], string | number>, never>) | undefined;
        features?: (PollFeatureDTO[] & PollFeatureDTO[] & Record<Exclude<keyof I["features"], keyof PollFeatureDTO[]>, never>) | undefined;
        context?: ({
            discord?: {
                guildId?: string | undefined;
                ownerId?: string | undefined;
                messageRef?: {
                    id?: string | undefined;
                    channelId?: string | undefined;
                } | undefined;
            } | undefined;
        } & {
            $case: "discord";
        } & {
            discord?: ({
                guildId?: string | undefined;
                ownerId?: string | undefined;
                messageRef?: {
                    id?: string | undefined;
                    channelId?: string | undefined;
                } | undefined;
            } & {
                guildId?: string | undefined;
                ownerId?: string | undefined;
                messageRef?: ({
                    id?: string | undefined;
                    channelId?: string | undefined;
                } & {
                    id?: string | undefined;
                    channelId?: string | undefined;
                } & Record<Exclude<keyof I["context"]["discord"]["messageRef"], keyof MessageRefDTO>, never>) | undefined;
            } & Record<Exclude<keyof I["context"]["discord"], keyof DiscordPollContextDTO>, never>) | undefined;
            $case: "discord";
        } & Record<Exclude<keyof I["context"], "discord" | "$case">, never>) | ({
            web?: {
                ownerId?: string | undefined;
            } | undefined;
        } & {
            $case: "web";
        } & {
            web?: ({
                ownerId?: string | undefined;
            } & {
                ownerId?: string | undefined;
            } & Record<Exclude<keyof I["context"]["web"], "ownerId">, never>) | undefined;
            $case: "web";
        } & Record<Exclude<keyof I["context"], "$case" | "web">, never>) | undefined;
    } & Record<Exclude<keyof I, keyof PollRequestDTO>, never>>(object: I): PollRequestDTO;
};
export declare const PollRequestDTO_OptionsEntry: {
    encode(message: PollRequestDTO_OptionsEntry, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): PollRequestDTO_OptionsEntry;
    fromJSON(object: any): PollRequestDTO_OptionsEntry;
    toJSON(message: PollRequestDTO_OptionsEntry): unknown;
    fromPartial<I extends {
        key?: string | undefined;
        value?: string | undefined;
    } & {
        key?: string | undefined;
        value?: string | undefined;
    } & Record<Exclude<keyof I, keyof PollRequestDTO_OptionsEntry>, never>>(object: I): PollRequestDTO_OptionsEntry;
};
export declare const PollDTO: {
    encode(message: PollDTO, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): PollDTO;
    fromJSON(object: any): PollDTO;
    toJSON(message: PollDTO): unknown;
    fromPartial<I extends {
        id?: string | undefined;
        guildId?: string | undefined;
        ownerId?: string | undefined;
        createdAt?: Date | undefined;
        closesAt?: Date | undefined;
        topic?: string | undefined;
        options?: {
            [x: string]: string | undefined;
        } | undefined;
        ballots?: {
            [x: string]: {
                id?: string | undefined;
                pollId?: string | undefined;
                userId?: string | undefined;
                userName?: string | undefined;
                createdAt?: Date | undefined;
                updatedAt?: Date | undefined;
                votes?: {
                    [x: string]: {
                        option?: string | undefined;
                        rank?: number | undefined;
                    } | undefined;
                } | undefined;
                ballotOptionMapping?: {
                    [x: string]: string | undefined;
                } | undefined;
                context?: ({
                    discord?: {
                        userId?: string | undefined;
                        userName?: string | undefined;
                    } | undefined;
                } & {
                    $case: "discord";
                }) | ({
                    web?: {
                        userId?: string | undefined;
                        userName?: string | undefined;
                    } | undefined;
                } & {
                    $case: "web";
                }) | undefined;
            } | undefined;
        } | undefined;
        features?: PollFeatureDTO[] | undefined;
        messageRef?: {
            id?: string | undefined;
            channelId?: string | undefined;
        } | undefined;
        context?: ({
            discord?: {
                guildId?: string | undefined;
                ownerId?: string | undefined;
                messageRef?: {
                    id?: string | undefined;
                    channelId?: string | undefined;
                } | undefined;
            } | undefined;
        } & {
            $case: "discord";
        }) | ({
            web?: {
                ownerId?: string | undefined;
            } | undefined;
        } & {
            $case: "web";
        }) | undefined;
    } & {
        id?: string | undefined;
        guildId?: string | undefined;
        ownerId?: string | undefined;
        createdAt?: Date | undefined;
        closesAt?: Date | undefined;
        topic?: string | undefined;
        options?: ({
            [x: string]: string | undefined;
        } & {
            [x: string]: string | undefined;
        } & Record<Exclude<keyof I["options"], string | number>, never>) | undefined;
        ballots?: ({
            [x: string]: {
                id?: string | undefined;
                pollId?: string | undefined;
                userId?: string | undefined;
                userName?: string | undefined;
                createdAt?: Date | undefined;
                updatedAt?: Date | undefined;
                votes?: {
                    [x: string]: {
                        option?: string | undefined;
                        rank?: number | undefined;
                    } | undefined;
                } | undefined;
                ballotOptionMapping?: {
                    [x: string]: string | undefined;
                } | undefined;
                context?: ({
                    discord?: {
                        userId?: string | undefined;
                        userName?: string | undefined;
                    } | undefined;
                } & {
                    $case: "discord";
                }) | ({
                    web?: {
                        userId?: string | undefined;
                        userName?: string | undefined;
                    } | undefined;
                } & {
                    $case: "web";
                }) | undefined;
            } | undefined;
        } & {
            [x: string]: ({
                id?: string | undefined;
                pollId?: string | undefined;
                userId?: string | undefined;
                userName?: string | undefined;
                createdAt?: Date | undefined;
                updatedAt?: Date | undefined;
                votes?: {
                    [x: string]: {
                        option?: string | undefined;
                        rank?: number | undefined;
                    } | undefined;
                } | undefined;
                ballotOptionMapping?: {
                    [x: string]: string | undefined;
                } | undefined;
                context?: ({
                    discord?: {
                        userId?: string | undefined;
                        userName?: string | undefined;
                    } | undefined;
                } & {
                    $case: "discord";
                }) | ({
                    web?: {
                        userId?: string | undefined;
                        userName?: string | undefined;
                    } | undefined;
                } & {
                    $case: "web";
                }) | undefined;
            } & {
                id?: string | undefined;
                pollId?: string | undefined;
                userId?: string | undefined;
                userName?: string | undefined;
                createdAt?: Date | undefined;
                updatedAt?: Date | undefined;
                votes?: ({
                    [x: string]: {
                        option?: string | undefined;
                        rank?: number | undefined;
                    } | undefined;
                } & {
                    [x: string]: ({
                        option?: string | undefined;
                        rank?: number | undefined;
                    } & {
                        option?: string | undefined;
                        rank?: number | undefined;
                    } & Record<Exclude<keyof I["ballots"][string]["votes"][string], keyof VoteDTO>, never>) | undefined;
                } & Record<Exclude<keyof I["ballots"][string]["votes"], string | number>, never>) | undefined;
                ballotOptionMapping?: ({
                    [x: string]: string | undefined;
                } & {
                    [x: string]: string | undefined;
                } & Record<Exclude<keyof I["ballots"][string]["ballotOptionMapping"], string | number>, never>) | undefined;
                context?: ({
                    discord?: {
                        userId?: string | undefined;
                        userName?: string | undefined;
                    } | undefined;
                } & {
                    $case: "discord";
                } & {
                    discord?: ({
                        userId?: string | undefined;
                        userName?: string | undefined;
                    } & {
                        userId?: string | undefined;
                        userName?: string | undefined;
                    } & Record<Exclude<keyof I["ballots"][string]["context"]["discord"], keyof DiscordBallotContextDTO>, never>) | undefined;
                    $case: "discord";
                } & Record<Exclude<keyof I["ballots"][string]["context"], "discord" | "$case">, never>) | ({
                    web?: {
                        userId?: string | undefined;
                        userName?: string | undefined;
                    } | undefined;
                } & {
                    $case: "web";
                } & {
                    web?: ({
                        userId?: string | undefined;
                        userName?: string | undefined;
                    } & {
                        userId?: string | undefined;
                        userName?: string | undefined;
                    } & Record<Exclude<keyof I["ballots"][string]["context"]["web"], keyof WebBallotContextDTO>, never>) | undefined;
                    $case: "web";
                } & Record<Exclude<keyof I["ballots"][string]["context"], "$case" | "web">, never>) | undefined;
            } & Record<Exclude<keyof I["ballots"][string], keyof BallotDTO>, never>) | undefined;
        } & Record<Exclude<keyof I["ballots"], string | number>, never>) | undefined;
        features?: (PollFeatureDTO[] & PollFeatureDTO[] & Record<Exclude<keyof I["features"], keyof PollFeatureDTO[]>, never>) | undefined;
        messageRef?: ({
            id?: string | undefined;
            channelId?: string | undefined;
        } & {
            id?: string | undefined;
            channelId?: string | undefined;
        } & Record<Exclude<keyof I["messageRef"], keyof MessageRefDTO>, never>) | undefined;
        context?: ({
            discord?: {
                guildId?: string | undefined;
                ownerId?: string | undefined;
                messageRef?: {
                    id?: string | undefined;
                    channelId?: string | undefined;
                } | undefined;
            } | undefined;
        } & {
            $case: "discord";
        } & {
            discord?: ({
                guildId?: string | undefined;
                ownerId?: string | undefined;
                messageRef?: {
                    id?: string | undefined;
                    channelId?: string | undefined;
                } | undefined;
            } & {
                guildId?: string | undefined;
                ownerId?: string | undefined;
                messageRef?: ({
                    id?: string | undefined;
                    channelId?: string | undefined;
                } & {
                    id?: string | undefined;
                    channelId?: string | undefined;
                } & Record<Exclude<keyof I["context"]["discord"]["messageRef"], keyof MessageRefDTO>, never>) | undefined;
            } & Record<Exclude<keyof I["context"]["discord"], keyof DiscordPollContextDTO>, never>) | undefined;
            $case: "discord";
        } & Record<Exclude<keyof I["context"], "discord" | "$case">, never>) | ({
            web?: {
                ownerId?: string | undefined;
            } | undefined;
        } & {
            $case: "web";
        } & {
            web?: ({
                ownerId?: string | undefined;
            } & {
                ownerId?: string | undefined;
            } & Record<Exclude<keyof I["context"]["web"], "ownerId">, never>) | undefined;
            $case: "web";
        } & Record<Exclude<keyof I["context"], "$case" | "web">, never>) | undefined;
    } & Record<Exclude<keyof I, keyof PollDTO>, never>>(object: I): PollDTO;
};
export declare const PollDTO_OptionsEntry: {
    encode(message: PollDTO_OptionsEntry, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): PollDTO_OptionsEntry;
    fromJSON(object: any): PollDTO_OptionsEntry;
    toJSON(message: PollDTO_OptionsEntry): unknown;
    fromPartial<I extends {
        key?: string | undefined;
        value?: string | undefined;
    } & {
        key?: string | undefined;
        value?: string | undefined;
    } & Record<Exclude<keyof I, keyof PollDTO_OptionsEntry>, never>>(object: I): PollDTO_OptionsEntry;
};
export declare const PollDTO_BallotsEntry: {
    encode(message: PollDTO_BallotsEntry, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): PollDTO_BallotsEntry;
    fromJSON(object: any): PollDTO_BallotsEntry;
    toJSON(message: PollDTO_BallotsEntry): unknown;
    fromPartial<I extends {
        key?: string | undefined;
        value?: {
            id?: string | undefined;
            pollId?: string | undefined;
            userId?: string | undefined;
            userName?: string | undefined;
            createdAt?: Date | undefined;
            updatedAt?: Date | undefined;
            votes?: {
                [x: string]: {
                    option?: string | undefined;
                    rank?: number | undefined;
                } | undefined;
            } | undefined;
            ballotOptionMapping?: {
                [x: string]: string | undefined;
            } | undefined;
            context?: ({
                discord?: {
                    userId?: string | undefined;
                    userName?: string | undefined;
                } | undefined;
            } & {
                $case: "discord";
            }) | ({
                web?: {
                    userId?: string | undefined;
                    userName?: string | undefined;
                } | undefined;
            } & {
                $case: "web";
            }) | undefined;
        } | undefined;
    } & {
        key?: string | undefined;
        value?: ({
            id?: string | undefined;
            pollId?: string | undefined;
            userId?: string | undefined;
            userName?: string | undefined;
            createdAt?: Date | undefined;
            updatedAt?: Date | undefined;
            votes?: {
                [x: string]: {
                    option?: string | undefined;
                    rank?: number | undefined;
                } | undefined;
            } | undefined;
            ballotOptionMapping?: {
                [x: string]: string | undefined;
            } | undefined;
            context?: ({
                discord?: {
                    userId?: string | undefined;
                    userName?: string | undefined;
                } | undefined;
            } & {
                $case: "discord";
            }) | ({
                web?: {
                    userId?: string | undefined;
                    userName?: string | undefined;
                } | undefined;
            } & {
                $case: "web";
            }) | undefined;
        } & {
            id?: string | undefined;
            pollId?: string | undefined;
            userId?: string | undefined;
            userName?: string | undefined;
            createdAt?: Date | undefined;
            updatedAt?: Date | undefined;
            votes?: ({
                [x: string]: {
                    option?: string | undefined;
                    rank?: number | undefined;
                } | undefined;
            } & {
                [x: string]: ({
                    option?: string | undefined;
                    rank?: number | undefined;
                } & {
                    option?: string | undefined;
                    rank?: number | undefined;
                } & Record<Exclude<keyof I["value"]["votes"][string], keyof VoteDTO>, never>) | undefined;
            } & Record<Exclude<keyof I["value"]["votes"], string | number>, never>) | undefined;
            ballotOptionMapping?: ({
                [x: string]: string | undefined;
            } & {
                [x: string]: string | undefined;
            } & Record<Exclude<keyof I["value"]["ballotOptionMapping"], string | number>, never>) | undefined;
            context?: ({
                discord?: {
                    userId?: string | undefined;
                    userName?: string | undefined;
                } | undefined;
            } & {
                $case: "discord";
            } & {
                discord?: ({
                    userId?: string | undefined;
                    userName?: string | undefined;
                } & {
                    userId?: string | undefined;
                    userName?: string | undefined;
                } & Record<Exclude<keyof I["value"]["context"]["discord"], keyof DiscordBallotContextDTO>, never>) | undefined;
                $case: "discord";
            } & Record<Exclude<keyof I["value"]["context"], "discord" | "$case">, never>) | ({
                web?: {
                    userId?: string | undefined;
                    userName?: string | undefined;
                } | undefined;
            } & {
                $case: "web";
            } & {
                web?: ({
                    userId?: string | undefined;
                    userName?: string | undefined;
                } & {
                    userId?: string | undefined;
                    userName?: string | undefined;
                } & Record<Exclude<keyof I["value"]["context"]["web"], keyof WebBallotContextDTO>, never>) | undefined;
                $case: "web";
            } & Record<Exclude<keyof I["value"]["context"], "$case" | "web">, never>) | undefined;
        } & Record<Exclude<keyof I["value"], keyof BallotDTO>, never>) | undefined;
    } & Record<Exclude<keyof I, keyof PollDTO_BallotsEntry>, never>>(object: I): PollDTO_BallotsEntry;
};
export declare const PollMetricsDTO: {
    encode(message: PollMetricsDTO, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): PollMetricsDTO;
    fromJSON(object: any): PollMetricsDTO;
    toJSON(message: PollMetricsDTO): unknown;
    fromPartial<I extends {
        ballotsRequested?: number | undefined;
        ballotsSubmitted?: number | undefined;
    } & {
        ballotsRequested?: number | undefined;
        ballotsSubmitted?: number | undefined;
    } & Record<Exclude<keyof I, keyof PollMetricsDTO>, never>>(object: I): PollMetricsDTO;
};
export declare const DiscordPollContextDTO: {
    encode(message: DiscordPollContextDTO, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): DiscordPollContextDTO;
    fromJSON(object: any): DiscordPollContextDTO;
    toJSON(message: DiscordPollContextDTO): unknown;
    fromPartial<I extends {
        guildId?: string | undefined;
        ownerId?: string | undefined;
        messageRef?: {
            id?: string | undefined;
            channelId?: string | undefined;
        } | undefined;
    } & {
        guildId?: string | undefined;
        ownerId?: string | undefined;
        messageRef?: ({
            id?: string | undefined;
            channelId?: string | undefined;
        } & {
            id?: string | undefined;
            channelId?: string | undefined;
        } & Record<Exclude<keyof I["messageRef"], keyof MessageRefDTO>, never>) | undefined;
    } & Record<Exclude<keyof I, keyof DiscordPollContextDTO>, never>>(object: I): DiscordPollContextDTO;
};
export declare const WebPollContextDTO: {
    encode(message: WebPollContextDTO, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): WebPollContextDTO;
    fromJSON(object: any): WebPollContextDTO;
    toJSON(message: WebPollContextDTO): unknown;
    fromPartial<I extends {
        ownerId?: string | undefined;
    } & {
        ownerId?: string | undefined;
    } & Record<Exclude<keyof I, "ownerId">, never>>(object: I): WebPollContextDTO;
};
export interface PollsService {
    CreatePoll(request: CreatePollRequest): Promise<CreatePollResponse>;
    ReadPoll(request: ReadPollRequest): Promise<ReadPollResponse>;
    UpdatePoll(request: UpdatePollRequest): Promise<UpdatePollResponse>;
    DeletePoll(request: DeletePollRequest): Promise<DeletePollResponse>;
}
export declare class PollsServiceClientImpl implements PollsService {
    private readonly rpc;
    constructor(rpc: Rpc);
    CreatePoll(request: CreatePollRequest): Promise<CreatePollResponse>;
    ReadPoll(request: ReadPollRequest): Promise<ReadPollResponse>;
    UpdatePoll(request: UpdatePollRequest): Promise<UpdatePollResponse>;
    DeletePoll(request: DeletePollRequest): Promise<DeletePollResponse>;
}
interface Rpc {
    request(service: string, method: string, data: Uint8Array): Promise<Uint8Array>;
}
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
