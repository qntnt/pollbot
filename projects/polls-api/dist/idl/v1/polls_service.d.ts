import Long from "long";
import _m0 from "protobufjs/minimal";
import { PollDTO, PollRequestDTO } from "../v1/polls";
export declare const protobufPackage = "polls_service";
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
export declare const ReadPollRequest: {
    encode(message: ReadPollRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): ReadPollRequest;
    fromJSON(object: any): ReadPollRequest;
    toJSON(message: ReadPollRequest): unknown;
    fromPartial<I extends {
        id?: string;
    } & {
        id?: string;
    } & Record<Exclude<keyof I, "id">, never>>(object: I): ReadPollRequest;
};
export declare const ReadPollResponse: {
    encode(message: ReadPollResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): ReadPollResponse;
    fromJSON(object: any): ReadPollResponse;
    toJSON(message: ReadPollResponse): unknown;
    fromPartial<I extends {
        poll?: {
            id?: string;
            guildId?: string;
            ownerId?: string;
            createdAt?: Date;
            closesAt?: Date;
            topic?: string;
            options?: {
                [x: string]: string;
            };
            ballots?: {
                [x: string]: {
                    id?: string;
                    pollId?: string;
                    userId?: string;
                    userName?: string;
                    createdAt?: Date;
                    updatedAt?: Date;
                    votes?: {
                        [x: string]: {
                            option?: string;
                            rank?: number;
                        };
                    };
                    ballotOptionMapping?: {
                        [x: string]: string;
                    };
                    context?: ({
                        discord?: {
                            userId?: string;
                            userName?: string;
                        };
                    } & {
                        $case: "discord";
                    }) | ({
                        web?: {
                            userId?: string;
                            userName?: string;
                        };
                    } & {
                        $case: "web";
                    });
                };
            };
            features?: import("../v1/polls").PollFeatureDTO[];
            messageRef?: {
                id?: string;
                channelId?: string;
            };
            context?: ({
                discord?: {
                    guildId?: string;
                    ownerId?: string;
                    messageRef?: {
                        id?: string;
                        channelId?: string;
                    };
                };
            } & {
                $case: "discord";
            }) | ({
                web?: {
                    ownerId?: string;
                };
            } & {
                $case: "web";
            });
        };
    } & {
        poll?: {
            id?: string;
            guildId?: string;
            ownerId?: string;
            createdAt?: Date;
            closesAt?: Date;
            topic?: string;
            options?: {
                [x: string]: string;
            };
            ballots?: {
                [x: string]: {
                    id?: string;
                    pollId?: string;
                    userId?: string;
                    userName?: string;
                    createdAt?: Date;
                    updatedAt?: Date;
                    votes?: {
                        [x: string]: {
                            option?: string;
                            rank?: number;
                        };
                    };
                    ballotOptionMapping?: {
                        [x: string]: string;
                    };
                    context?: ({
                        discord?: {
                            userId?: string;
                            userName?: string;
                        };
                    } & {
                        $case: "discord";
                    }) | ({
                        web?: {
                            userId?: string;
                            userName?: string;
                        };
                    } & {
                        $case: "web";
                    });
                };
            };
            features?: import("../v1/polls").PollFeatureDTO[];
            messageRef?: {
                id?: string;
                channelId?: string;
            };
            context?: ({
                discord?: {
                    guildId?: string;
                    ownerId?: string;
                    messageRef?: {
                        id?: string;
                        channelId?: string;
                    };
                };
            } & {
                $case: "discord";
            }) | ({
                web?: {
                    ownerId?: string;
                };
            } & {
                $case: "web";
            });
        } & {
            id?: string;
            guildId?: string;
            ownerId?: string;
            createdAt?: Date;
            closesAt?: Date;
            topic?: string;
            options?: {
                [x: string]: string;
            } & {
                [x: string]: string;
            } & Record<Exclude<keyof I["poll"]["options"], string | number>, never>;
            ballots?: {
                [x: string]: {
                    id?: string;
                    pollId?: string;
                    userId?: string;
                    userName?: string;
                    createdAt?: Date;
                    updatedAt?: Date;
                    votes?: {
                        [x: string]: {
                            option?: string;
                            rank?: number;
                        };
                    };
                    ballotOptionMapping?: {
                        [x: string]: string;
                    };
                    context?: ({
                        discord?: {
                            userId?: string;
                            userName?: string;
                        };
                    } & {
                        $case: "discord";
                    }) | ({
                        web?: {
                            userId?: string;
                            userName?: string;
                        };
                    } & {
                        $case: "web";
                    });
                };
            } & {
                [x: string]: {
                    id?: string;
                    pollId?: string;
                    userId?: string;
                    userName?: string;
                    createdAt?: Date;
                    updatedAt?: Date;
                    votes?: {
                        [x: string]: {
                            option?: string;
                            rank?: number;
                        };
                    };
                    ballotOptionMapping?: {
                        [x: string]: string;
                    };
                    context?: ({
                        discord?: {
                            userId?: string;
                            userName?: string;
                        };
                    } & {
                        $case: "discord";
                    }) | ({
                        web?: {
                            userId?: string;
                            userName?: string;
                        };
                    } & {
                        $case: "web";
                    });
                } & {
                    id?: string;
                    pollId?: string;
                    userId?: string;
                    userName?: string;
                    createdAt?: Date;
                    updatedAt?: Date;
                    votes?: {
                        [x: string]: {
                            option?: string;
                            rank?: number;
                        };
                    } & {
                        [x: string]: {
                            option?: string;
                            rank?: number;
                        } & {
                            option?: string;
                            rank?: number;
                        } & Record<Exclude<keyof I["poll"]["ballots"][string]["votes"][string], keyof import("../v1/polls").VoteDTO>, never>;
                    } & Record<Exclude<keyof I["poll"]["ballots"][string]["votes"], string | number>, never>;
                    ballotOptionMapping?: {
                        [x: string]: string;
                    } & {
                        [x: string]: string;
                    } & Record<Exclude<keyof I["poll"]["ballots"][string]["ballotOptionMapping"], string | number>, never>;
                    context?: ({
                        discord?: {
                            userId?: string;
                            userName?: string;
                        };
                    } & {
                        $case: "discord";
                    } & {
                        discord?: {
                            userId?: string;
                            userName?: string;
                        } & {
                            userId?: string;
                            userName?: string;
                        } & Record<Exclude<keyof I["poll"]["ballots"][string]["context"]["discord"], keyof import("../v1/polls").DiscordBallotContextDTO>, never>;
                        $case: "discord";
                    } & Record<Exclude<keyof I["poll"]["ballots"][string]["context"], "discord" | "$case">, never>) | ({
                        web?: {
                            userId?: string;
                            userName?: string;
                        };
                    } & {
                        $case: "web";
                    } & {
                        web?: {
                            userId?: string;
                            userName?: string;
                        } & {
                            userId?: string;
                            userName?: string;
                        } & Record<Exclude<keyof I["poll"]["ballots"][string]["context"]["web"], keyof import("../v1/polls").WebBallotContextDTO>, never>;
                        $case: "web";
                    } & Record<Exclude<keyof I["poll"]["ballots"][string]["context"], "web" | "$case">, never>);
                } & Record<Exclude<keyof I["poll"]["ballots"][string], keyof import("../v1/polls").BallotDTO>, never>;
            } & Record<Exclude<keyof I["poll"]["ballots"], string | number>, never>;
            features?: import("../v1/polls").PollFeatureDTO[] & import("../v1/polls").PollFeatureDTO[] & Record<Exclude<keyof I["poll"]["features"], keyof import("../v1/polls").PollFeatureDTO[]>, never>;
            messageRef?: {
                id?: string;
                channelId?: string;
            } & {
                id?: string;
                channelId?: string;
            } & Record<Exclude<keyof I["poll"]["messageRef"], keyof import("./discord").MessageRefDTO>, never>;
            context?: ({
                discord?: {
                    guildId?: string;
                    ownerId?: string;
                    messageRef?: {
                        id?: string;
                        channelId?: string;
                    };
                };
            } & {
                $case: "discord";
            } & {
                discord?: {
                    guildId?: string;
                    ownerId?: string;
                    messageRef?: {
                        id?: string;
                        channelId?: string;
                    };
                } & {
                    guildId?: string;
                    ownerId?: string;
                    messageRef?: {
                        id?: string;
                        channelId?: string;
                    } & {
                        id?: string;
                        channelId?: string;
                    } & Record<Exclude<keyof I["poll"]["context"]["discord"]["messageRef"], keyof import("./discord").MessageRefDTO>, never>;
                } & Record<Exclude<keyof I["poll"]["context"]["discord"], keyof import("../v1/polls").DiscordPollContextDTO>, never>;
                $case: "discord";
            } & Record<Exclude<keyof I["poll"]["context"], "discord" | "$case">, never>) | ({
                web?: {
                    ownerId?: string;
                };
            } & {
                $case: "web";
            } & {
                web?: {
                    ownerId?: string;
                } & {
                    ownerId?: string;
                } & Record<Exclude<keyof I["poll"]["context"]["web"], "ownerId">, never>;
                $case: "web";
            } & Record<Exclude<keyof I["poll"]["context"], "web" | "$case">, never>);
        } & Record<Exclude<keyof I["poll"], keyof PollDTO>, never>;
    } & Record<Exclude<keyof I, "poll">, never>>(object: I): ReadPollResponse;
};
export declare const CreatePollRequest: {
    encode(message: CreatePollRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): CreatePollRequest;
    fromJSON(object: any): CreatePollRequest;
    toJSON(message: CreatePollRequest): unknown;
    fromPartial<I extends {
        pollRequest?: {
            topic?: string;
            options?: {
                [x: string]: string;
            };
            features?: import("../v1/polls").PollFeatureDTO[];
            context?: ({
                discord?: {
                    guildId?: string;
                    ownerId?: string;
                    messageRef?: {
                        id?: string;
                        channelId?: string;
                    };
                };
            } & {
                $case: "discord";
            }) | ({
                web?: {
                    ownerId?: string;
                };
            } & {
                $case: "web";
            });
        };
    } & {
        pollRequest?: {
            topic?: string;
            options?: {
                [x: string]: string;
            };
            features?: import("../v1/polls").PollFeatureDTO[];
            context?: ({
                discord?: {
                    guildId?: string;
                    ownerId?: string;
                    messageRef?: {
                        id?: string;
                        channelId?: string;
                    };
                };
            } & {
                $case: "discord";
            }) | ({
                web?: {
                    ownerId?: string;
                };
            } & {
                $case: "web";
            });
        } & {
            topic?: string;
            options?: {
                [x: string]: string;
            } & {
                [x: string]: string;
            } & Record<Exclude<keyof I["pollRequest"]["options"], string | number>, never>;
            features?: import("../v1/polls").PollFeatureDTO[] & import("../v1/polls").PollFeatureDTO[] & Record<Exclude<keyof I["pollRequest"]["features"], keyof import("../v1/polls").PollFeatureDTO[]>, never>;
            context?: ({
                discord?: {
                    guildId?: string;
                    ownerId?: string;
                    messageRef?: {
                        id?: string;
                        channelId?: string;
                    };
                };
            } & {
                $case: "discord";
            } & {
                discord?: {
                    guildId?: string;
                    ownerId?: string;
                    messageRef?: {
                        id?: string;
                        channelId?: string;
                    };
                } & {
                    guildId?: string;
                    ownerId?: string;
                    messageRef?: {
                        id?: string;
                        channelId?: string;
                    } & {
                        id?: string;
                        channelId?: string;
                    } & Record<Exclude<keyof I["pollRequest"]["context"]["discord"]["messageRef"], keyof import("./discord").MessageRefDTO>, never>;
                } & Record<Exclude<keyof I["pollRequest"]["context"]["discord"], keyof import("../v1/polls").DiscordPollContextDTO>, never>;
                $case: "discord";
            } & Record<Exclude<keyof I["pollRequest"]["context"], "discord" | "$case">, never>) | ({
                web?: {
                    ownerId?: string;
                };
            } & {
                $case: "web";
            } & {
                web?: {
                    ownerId?: string;
                } & {
                    ownerId?: string;
                } & Record<Exclude<keyof I["pollRequest"]["context"]["web"], "ownerId">, never>;
                $case: "web";
            } & Record<Exclude<keyof I["pollRequest"]["context"], "web" | "$case">, never>);
        } & Record<Exclude<keyof I["pollRequest"], keyof PollRequestDTO>, never>;
    } & Record<Exclude<keyof I, "pollRequest">, never>>(object: I): CreatePollRequest;
};
export declare const CreatePollResponse: {
    encode(message: CreatePollResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): CreatePollResponse;
    fromJSON(object: any): CreatePollResponse;
    toJSON(message: CreatePollResponse): unknown;
    fromPartial<I extends {
        poll?: {
            id?: string;
            guildId?: string;
            ownerId?: string;
            createdAt?: Date;
            closesAt?: Date;
            topic?: string;
            options?: {
                [x: string]: string;
            };
            ballots?: {
                [x: string]: {
                    id?: string;
                    pollId?: string;
                    userId?: string;
                    userName?: string;
                    createdAt?: Date;
                    updatedAt?: Date;
                    votes?: {
                        [x: string]: {
                            option?: string;
                            rank?: number;
                        };
                    };
                    ballotOptionMapping?: {
                        [x: string]: string;
                    };
                    context?: ({
                        discord?: {
                            userId?: string;
                            userName?: string;
                        };
                    } & {
                        $case: "discord";
                    }) | ({
                        web?: {
                            userId?: string;
                            userName?: string;
                        };
                    } & {
                        $case: "web";
                    });
                };
            };
            features?: import("../v1/polls").PollFeatureDTO[];
            messageRef?: {
                id?: string;
                channelId?: string;
            };
            context?: ({
                discord?: {
                    guildId?: string;
                    ownerId?: string;
                    messageRef?: {
                        id?: string;
                        channelId?: string;
                    };
                };
            } & {
                $case: "discord";
            }) | ({
                web?: {
                    ownerId?: string;
                };
            } & {
                $case: "web";
            });
        };
    } & {
        poll?: {
            id?: string;
            guildId?: string;
            ownerId?: string;
            createdAt?: Date;
            closesAt?: Date;
            topic?: string;
            options?: {
                [x: string]: string;
            };
            ballots?: {
                [x: string]: {
                    id?: string;
                    pollId?: string;
                    userId?: string;
                    userName?: string;
                    createdAt?: Date;
                    updatedAt?: Date;
                    votes?: {
                        [x: string]: {
                            option?: string;
                            rank?: number;
                        };
                    };
                    ballotOptionMapping?: {
                        [x: string]: string;
                    };
                    context?: ({
                        discord?: {
                            userId?: string;
                            userName?: string;
                        };
                    } & {
                        $case: "discord";
                    }) | ({
                        web?: {
                            userId?: string;
                            userName?: string;
                        };
                    } & {
                        $case: "web";
                    });
                };
            };
            features?: import("../v1/polls").PollFeatureDTO[];
            messageRef?: {
                id?: string;
                channelId?: string;
            };
            context?: ({
                discord?: {
                    guildId?: string;
                    ownerId?: string;
                    messageRef?: {
                        id?: string;
                        channelId?: string;
                    };
                };
            } & {
                $case: "discord";
            }) | ({
                web?: {
                    ownerId?: string;
                };
            } & {
                $case: "web";
            });
        } & {
            id?: string;
            guildId?: string;
            ownerId?: string;
            createdAt?: Date;
            closesAt?: Date;
            topic?: string;
            options?: {
                [x: string]: string;
            } & {
                [x: string]: string;
            } & Record<Exclude<keyof I["poll"]["options"], string | number>, never>;
            ballots?: {
                [x: string]: {
                    id?: string;
                    pollId?: string;
                    userId?: string;
                    userName?: string;
                    createdAt?: Date;
                    updatedAt?: Date;
                    votes?: {
                        [x: string]: {
                            option?: string;
                            rank?: number;
                        };
                    };
                    ballotOptionMapping?: {
                        [x: string]: string;
                    };
                    context?: ({
                        discord?: {
                            userId?: string;
                            userName?: string;
                        };
                    } & {
                        $case: "discord";
                    }) | ({
                        web?: {
                            userId?: string;
                            userName?: string;
                        };
                    } & {
                        $case: "web";
                    });
                };
            } & {
                [x: string]: {
                    id?: string;
                    pollId?: string;
                    userId?: string;
                    userName?: string;
                    createdAt?: Date;
                    updatedAt?: Date;
                    votes?: {
                        [x: string]: {
                            option?: string;
                            rank?: number;
                        };
                    };
                    ballotOptionMapping?: {
                        [x: string]: string;
                    };
                    context?: ({
                        discord?: {
                            userId?: string;
                            userName?: string;
                        };
                    } & {
                        $case: "discord";
                    }) | ({
                        web?: {
                            userId?: string;
                            userName?: string;
                        };
                    } & {
                        $case: "web";
                    });
                } & {
                    id?: string;
                    pollId?: string;
                    userId?: string;
                    userName?: string;
                    createdAt?: Date;
                    updatedAt?: Date;
                    votes?: {
                        [x: string]: {
                            option?: string;
                            rank?: number;
                        };
                    } & {
                        [x: string]: {
                            option?: string;
                            rank?: number;
                        } & {
                            option?: string;
                            rank?: number;
                        } & Record<Exclude<keyof I["poll"]["ballots"][string]["votes"][string], keyof import("../v1/polls").VoteDTO>, never>;
                    } & Record<Exclude<keyof I["poll"]["ballots"][string]["votes"], string | number>, never>;
                    ballotOptionMapping?: {
                        [x: string]: string;
                    } & {
                        [x: string]: string;
                    } & Record<Exclude<keyof I["poll"]["ballots"][string]["ballotOptionMapping"], string | number>, never>;
                    context?: ({
                        discord?: {
                            userId?: string;
                            userName?: string;
                        };
                    } & {
                        $case: "discord";
                    } & {
                        discord?: {
                            userId?: string;
                            userName?: string;
                        } & {
                            userId?: string;
                            userName?: string;
                        } & Record<Exclude<keyof I["poll"]["ballots"][string]["context"]["discord"], keyof import("../v1/polls").DiscordBallotContextDTO>, never>;
                        $case: "discord";
                    } & Record<Exclude<keyof I["poll"]["ballots"][string]["context"], "discord" | "$case">, never>) | ({
                        web?: {
                            userId?: string;
                            userName?: string;
                        };
                    } & {
                        $case: "web";
                    } & {
                        web?: {
                            userId?: string;
                            userName?: string;
                        } & {
                            userId?: string;
                            userName?: string;
                        } & Record<Exclude<keyof I["poll"]["ballots"][string]["context"]["web"], keyof import("../v1/polls").WebBallotContextDTO>, never>;
                        $case: "web";
                    } & Record<Exclude<keyof I["poll"]["ballots"][string]["context"], "web" | "$case">, never>);
                } & Record<Exclude<keyof I["poll"]["ballots"][string], keyof import("../v1/polls").BallotDTO>, never>;
            } & Record<Exclude<keyof I["poll"]["ballots"], string | number>, never>;
            features?: import("../v1/polls").PollFeatureDTO[] & import("../v1/polls").PollFeatureDTO[] & Record<Exclude<keyof I["poll"]["features"], keyof import("../v1/polls").PollFeatureDTO[]>, never>;
            messageRef?: {
                id?: string;
                channelId?: string;
            } & {
                id?: string;
                channelId?: string;
            } & Record<Exclude<keyof I["poll"]["messageRef"], keyof import("./discord").MessageRefDTO>, never>;
            context?: ({
                discord?: {
                    guildId?: string;
                    ownerId?: string;
                    messageRef?: {
                        id?: string;
                        channelId?: string;
                    };
                };
            } & {
                $case: "discord";
            } & {
                discord?: {
                    guildId?: string;
                    ownerId?: string;
                    messageRef?: {
                        id?: string;
                        channelId?: string;
                    };
                } & {
                    guildId?: string;
                    ownerId?: string;
                    messageRef?: {
                        id?: string;
                        channelId?: string;
                    } & {
                        id?: string;
                        channelId?: string;
                    } & Record<Exclude<keyof I["poll"]["context"]["discord"]["messageRef"], keyof import("./discord").MessageRefDTO>, never>;
                } & Record<Exclude<keyof I["poll"]["context"]["discord"], keyof import("../v1/polls").DiscordPollContextDTO>, never>;
                $case: "discord";
            } & Record<Exclude<keyof I["poll"]["context"], "discord" | "$case">, never>) | ({
                web?: {
                    ownerId?: string;
                };
            } & {
                $case: "web";
            } & {
                web?: {
                    ownerId?: string;
                } & {
                    ownerId?: string;
                } & Record<Exclude<keyof I["poll"]["context"]["web"], "ownerId">, never>;
                $case: "web";
            } & Record<Exclude<keyof I["poll"]["context"], "web" | "$case">, never>);
        } & Record<Exclude<keyof I["poll"], keyof PollDTO>, never>;
    } & Record<Exclude<keyof I, "poll">, never>>(object: I): CreatePollResponse;
};
export declare const UpdatePollRequest: {
    encode(message: UpdatePollRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): UpdatePollRequest;
    fromJSON(object: any): UpdatePollRequest;
    toJSON(message: UpdatePollRequest): unknown;
    fromPartial<I extends {
        pollRequest?: {
            topic?: string;
            options?: {
                [x: string]: string;
            };
            features?: import("../v1/polls").PollFeatureDTO[];
            context?: ({
                discord?: {
                    guildId?: string;
                    ownerId?: string;
                    messageRef?: {
                        id?: string;
                        channelId?: string;
                    };
                };
            } & {
                $case: "discord";
            }) | ({
                web?: {
                    ownerId?: string;
                };
            } & {
                $case: "web";
            });
        };
    } & {
        pollRequest?: {
            topic?: string;
            options?: {
                [x: string]: string;
            };
            features?: import("../v1/polls").PollFeatureDTO[];
            context?: ({
                discord?: {
                    guildId?: string;
                    ownerId?: string;
                    messageRef?: {
                        id?: string;
                        channelId?: string;
                    };
                };
            } & {
                $case: "discord";
            }) | ({
                web?: {
                    ownerId?: string;
                };
            } & {
                $case: "web";
            });
        } & {
            topic?: string;
            options?: {
                [x: string]: string;
            } & {
                [x: string]: string;
            } & Record<Exclude<keyof I["pollRequest"]["options"], string | number>, never>;
            features?: import("../v1/polls").PollFeatureDTO[] & import("../v1/polls").PollFeatureDTO[] & Record<Exclude<keyof I["pollRequest"]["features"], keyof import("../v1/polls").PollFeatureDTO[]>, never>;
            context?: ({
                discord?: {
                    guildId?: string;
                    ownerId?: string;
                    messageRef?: {
                        id?: string;
                        channelId?: string;
                    };
                };
            } & {
                $case: "discord";
            } & {
                discord?: {
                    guildId?: string;
                    ownerId?: string;
                    messageRef?: {
                        id?: string;
                        channelId?: string;
                    };
                } & {
                    guildId?: string;
                    ownerId?: string;
                    messageRef?: {
                        id?: string;
                        channelId?: string;
                    } & {
                        id?: string;
                        channelId?: string;
                    } & Record<Exclude<keyof I["pollRequest"]["context"]["discord"]["messageRef"], keyof import("./discord").MessageRefDTO>, never>;
                } & Record<Exclude<keyof I["pollRequest"]["context"]["discord"], keyof import("../v1/polls").DiscordPollContextDTO>, never>;
                $case: "discord";
            } & Record<Exclude<keyof I["pollRequest"]["context"], "discord" | "$case">, never>) | ({
                web?: {
                    ownerId?: string;
                };
            } & {
                $case: "web";
            } & {
                web?: {
                    ownerId?: string;
                } & {
                    ownerId?: string;
                } & Record<Exclude<keyof I["pollRequest"]["context"]["web"], "ownerId">, never>;
                $case: "web";
            } & Record<Exclude<keyof I["pollRequest"]["context"], "web" | "$case">, never>);
        } & Record<Exclude<keyof I["pollRequest"], keyof PollRequestDTO>, never>;
    } & Record<Exclude<keyof I, "pollRequest">, never>>(object: I): UpdatePollRequest;
};
export declare const UpdatePollResponse: {
    encode(message: UpdatePollResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): UpdatePollResponse;
    fromJSON(object: any): UpdatePollResponse;
    toJSON(message: UpdatePollResponse): unknown;
    fromPartial<I extends {
        poll?: {
            id?: string;
            guildId?: string;
            ownerId?: string;
            createdAt?: Date;
            closesAt?: Date;
            topic?: string;
            options?: {
                [x: string]: string;
            };
            ballots?: {
                [x: string]: {
                    id?: string;
                    pollId?: string;
                    userId?: string;
                    userName?: string;
                    createdAt?: Date;
                    updatedAt?: Date;
                    votes?: {
                        [x: string]: {
                            option?: string;
                            rank?: number;
                        };
                    };
                    ballotOptionMapping?: {
                        [x: string]: string;
                    };
                    context?: ({
                        discord?: {
                            userId?: string;
                            userName?: string;
                        };
                    } & {
                        $case: "discord";
                    }) | ({
                        web?: {
                            userId?: string;
                            userName?: string;
                        };
                    } & {
                        $case: "web";
                    });
                };
            };
            features?: import("../v1/polls").PollFeatureDTO[];
            messageRef?: {
                id?: string;
                channelId?: string;
            };
            context?: ({
                discord?: {
                    guildId?: string;
                    ownerId?: string;
                    messageRef?: {
                        id?: string;
                        channelId?: string;
                    };
                };
            } & {
                $case: "discord";
            }) | ({
                web?: {
                    ownerId?: string;
                };
            } & {
                $case: "web";
            });
        };
    } & {
        poll?: {
            id?: string;
            guildId?: string;
            ownerId?: string;
            createdAt?: Date;
            closesAt?: Date;
            topic?: string;
            options?: {
                [x: string]: string;
            };
            ballots?: {
                [x: string]: {
                    id?: string;
                    pollId?: string;
                    userId?: string;
                    userName?: string;
                    createdAt?: Date;
                    updatedAt?: Date;
                    votes?: {
                        [x: string]: {
                            option?: string;
                            rank?: number;
                        };
                    };
                    ballotOptionMapping?: {
                        [x: string]: string;
                    };
                    context?: ({
                        discord?: {
                            userId?: string;
                            userName?: string;
                        };
                    } & {
                        $case: "discord";
                    }) | ({
                        web?: {
                            userId?: string;
                            userName?: string;
                        };
                    } & {
                        $case: "web";
                    });
                };
            };
            features?: import("../v1/polls").PollFeatureDTO[];
            messageRef?: {
                id?: string;
                channelId?: string;
            };
            context?: ({
                discord?: {
                    guildId?: string;
                    ownerId?: string;
                    messageRef?: {
                        id?: string;
                        channelId?: string;
                    };
                };
            } & {
                $case: "discord";
            }) | ({
                web?: {
                    ownerId?: string;
                };
            } & {
                $case: "web";
            });
        } & {
            id?: string;
            guildId?: string;
            ownerId?: string;
            createdAt?: Date;
            closesAt?: Date;
            topic?: string;
            options?: {
                [x: string]: string;
            } & {
                [x: string]: string;
            } & Record<Exclude<keyof I["poll"]["options"], string | number>, never>;
            ballots?: {
                [x: string]: {
                    id?: string;
                    pollId?: string;
                    userId?: string;
                    userName?: string;
                    createdAt?: Date;
                    updatedAt?: Date;
                    votes?: {
                        [x: string]: {
                            option?: string;
                            rank?: number;
                        };
                    };
                    ballotOptionMapping?: {
                        [x: string]: string;
                    };
                    context?: ({
                        discord?: {
                            userId?: string;
                            userName?: string;
                        };
                    } & {
                        $case: "discord";
                    }) | ({
                        web?: {
                            userId?: string;
                            userName?: string;
                        };
                    } & {
                        $case: "web";
                    });
                };
            } & {
                [x: string]: {
                    id?: string;
                    pollId?: string;
                    userId?: string;
                    userName?: string;
                    createdAt?: Date;
                    updatedAt?: Date;
                    votes?: {
                        [x: string]: {
                            option?: string;
                            rank?: number;
                        };
                    };
                    ballotOptionMapping?: {
                        [x: string]: string;
                    };
                    context?: ({
                        discord?: {
                            userId?: string;
                            userName?: string;
                        };
                    } & {
                        $case: "discord";
                    }) | ({
                        web?: {
                            userId?: string;
                            userName?: string;
                        };
                    } & {
                        $case: "web";
                    });
                } & {
                    id?: string;
                    pollId?: string;
                    userId?: string;
                    userName?: string;
                    createdAt?: Date;
                    updatedAt?: Date;
                    votes?: {
                        [x: string]: {
                            option?: string;
                            rank?: number;
                        };
                    } & {
                        [x: string]: {
                            option?: string;
                            rank?: number;
                        } & {
                            option?: string;
                            rank?: number;
                        } & Record<Exclude<keyof I["poll"]["ballots"][string]["votes"][string], keyof import("../v1/polls").VoteDTO>, never>;
                    } & Record<Exclude<keyof I["poll"]["ballots"][string]["votes"], string | number>, never>;
                    ballotOptionMapping?: {
                        [x: string]: string;
                    } & {
                        [x: string]: string;
                    } & Record<Exclude<keyof I["poll"]["ballots"][string]["ballotOptionMapping"], string | number>, never>;
                    context?: ({
                        discord?: {
                            userId?: string;
                            userName?: string;
                        };
                    } & {
                        $case: "discord";
                    } & {
                        discord?: {
                            userId?: string;
                            userName?: string;
                        } & {
                            userId?: string;
                            userName?: string;
                        } & Record<Exclude<keyof I["poll"]["ballots"][string]["context"]["discord"], keyof import("../v1/polls").DiscordBallotContextDTO>, never>;
                        $case: "discord";
                    } & Record<Exclude<keyof I["poll"]["ballots"][string]["context"], "discord" | "$case">, never>) | ({
                        web?: {
                            userId?: string;
                            userName?: string;
                        };
                    } & {
                        $case: "web";
                    } & {
                        web?: {
                            userId?: string;
                            userName?: string;
                        } & {
                            userId?: string;
                            userName?: string;
                        } & Record<Exclude<keyof I["poll"]["ballots"][string]["context"]["web"], keyof import("../v1/polls").WebBallotContextDTO>, never>;
                        $case: "web";
                    } & Record<Exclude<keyof I["poll"]["ballots"][string]["context"], "web" | "$case">, never>);
                } & Record<Exclude<keyof I["poll"]["ballots"][string], keyof import("../v1/polls").BallotDTO>, never>;
            } & Record<Exclude<keyof I["poll"]["ballots"], string | number>, never>;
            features?: import("../v1/polls").PollFeatureDTO[] & import("../v1/polls").PollFeatureDTO[] & Record<Exclude<keyof I["poll"]["features"], keyof import("../v1/polls").PollFeatureDTO[]>, never>;
            messageRef?: {
                id?: string;
                channelId?: string;
            } & {
                id?: string;
                channelId?: string;
            } & Record<Exclude<keyof I["poll"]["messageRef"], keyof import("./discord").MessageRefDTO>, never>;
            context?: ({
                discord?: {
                    guildId?: string;
                    ownerId?: string;
                    messageRef?: {
                        id?: string;
                        channelId?: string;
                    };
                };
            } & {
                $case: "discord";
            } & {
                discord?: {
                    guildId?: string;
                    ownerId?: string;
                    messageRef?: {
                        id?: string;
                        channelId?: string;
                    };
                } & {
                    guildId?: string;
                    ownerId?: string;
                    messageRef?: {
                        id?: string;
                        channelId?: string;
                    } & {
                        id?: string;
                        channelId?: string;
                    } & Record<Exclude<keyof I["poll"]["context"]["discord"]["messageRef"], keyof import("./discord").MessageRefDTO>, never>;
                } & Record<Exclude<keyof I["poll"]["context"]["discord"], keyof import("../v1/polls").DiscordPollContextDTO>, never>;
                $case: "discord";
            } & Record<Exclude<keyof I["poll"]["context"], "discord" | "$case">, never>) | ({
                web?: {
                    ownerId?: string;
                };
            } & {
                $case: "web";
            } & {
                web?: {
                    ownerId?: string;
                } & {
                    ownerId?: string;
                } & Record<Exclude<keyof I["poll"]["context"]["web"], "ownerId">, never>;
                $case: "web";
            } & Record<Exclude<keyof I["poll"]["context"], "web" | "$case">, never>);
        } & Record<Exclude<keyof I["poll"], keyof PollDTO>, never>;
    } & Record<Exclude<keyof I, "poll">, never>>(object: I): UpdatePollResponse;
};
export declare const DeletePollRequest: {
    encode(message: DeletePollRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): DeletePollRequest;
    fromJSON(object: any): DeletePollRequest;
    toJSON(message: DeletePollRequest): unknown;
    fromPartial<I extends {
        pollId?: string;
    } & {
        pollId?: string;
    } & Record<Exclude<keyof I, "pollId">, never>>(object: I): DeletePollRequest;
};
export declare const DeletePollResponse: {
    encode(message: DeletePollResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number): DeletePollResponse;
    fromJSON(object: any): DeletePollResponse;
    toJSON(message: DeletePollResponse): unknown;
    fromPartial<I extends {
        poll?: {
            id?: string;
            guildId?: string;
            ownerId?: string;
            createdAt?: Date;
            closesAt?: Date;
            topic?: string;
            options?: {
                [x: string]: string;
            };
            ballots?: {
                [x: string]: {
                    id?: string;
                    pollId?: string;
                    userId?: string;
                    userName?: string;
                    createdAt?: Date;
                    updatedAt?: Date;
                    votes?: {
                        [x: string]: {
                            option?: string;
                            rank?: number;
                        };
                    };
                    ballotOptionMapping?: {
                        [x: string]: string;
                    };
                    context?: ({
                        discord?: {
                            userId?: string;
                            userName?: string;
                        };
                    } & {
                        $case: "discord";
                    }) | ({
                        web?: {
                            userId?: string;
                            userName?: string;
                        };
                    } & {
                        $case: "web";
                    });
                };
            };
            features?: import("../v1/polls").PollFeatureDTO[];
            messageRef?: {
                id?: string;
                channelId?: string;
            };
            context?: ({
                discord?: {
                    guildId?: string;
                    ownerId?: string;
                    messageRef?: {
                        id?: string;
                        channelId?: string;
                    };
                };
            } & {
                $case: "discord";
            }) | ({
                web?: {
                    ownerId?: string;
                };
            } & {
                $case: "web";
            });
        };
    } & {
        poll?: {
            id?: string;
            guildId?: string;
            ownerId?: string;
            createdAt?: Date;
            closesAt?: Date;
            topic?: string;
            options?: {
                [x: string]: string;
            };
            ballots?: {
                [x: string]: {
                    id?: string;
                    pollId?: string;
                    userId?: string;
                    userName?: string;
                    createdAt?: Date;
                    updatedAt?: Date;
                    votes?: {
                        [x: string]: {
                            option?: string;
                            rank?: number;
                        };
                    };
                    ballotOptionMapping?: {
                        [x: string]: string;
                    };
                    context?: ({
                        discord?: {
                            userId?: string;
                            userName?: string;
                        };
                    } & {
                        $case: "discord";
                    }) | ({
                        web?: {
                            userId?: string;
                            userName?: string;
                        };
                    } & {
                        $case: "web";
                    });
                };
            };
            features?: import("../v1/polls").PollFeatureDTO[];
            messageRef?: {
                id?: string;
                channelId?: string;
            };
            context?: ({
                discord?: {
                    guildId?: string;
                    ownerId?: string;
                    messageRef?: {
                        id?: string;
                        channelId?: string;
                    };
                };
            } & {
                $case: "discord";
            }) | ({
                web?: {
                    ownerId?: string;
                };
            } & {
                $case: "web";
            });
        } & {
            id?: string;
            guildId?: string;
            ownerId?: string;
            createdAt?: Date;
            closesAt?: Date;
            topic?: string;
            options?: {
                [x: string]: string;
            } & {
                [x: string]: string;
            } & Record<Exclude<keyof I["poll"]["options"], string | number>, never>;
            ballots?: {
                [x: string]: {
                    id?: string;
                    pollId?: string;
                    userId?: string;
                    userName?: string;
                    createdAt?: Date;
                    updatedAt?: Date;
                    votes?: {
                        [x: string]: {
                            option?: string;
                            rank?: number;
                        };
                    };
                    ballotOptionMapping?: {
                        [x: string]: string;
                    };
                    context?: ({
                        discord?: {
                            userId?: string;
                            userName?: string;
                        };
                    } & {
                        $case: "discord";
                    }) | ({
                        web?: {
                            userId?: string;
                            userName?: string;
                        };
                    } & {
                        $case: "web";
                    });
                };
            } & {
                [x: string]: {
                    id?: string;
                    pollId?: string;
                    userId?: string;
                    userName?: string;
                    createdAt?: Date;
                    updatedAt?: Date;
                    votes?: {
                        [x: string]: {
                            option?: string;
                            rank?: number;
                        };
                    };
                    ballotOptionMapping?: {
                        [x: string]: string;
                    };
                    context?: ({
                        discord?: {
                            userId?: string;
                            userName?: string;
                        };
                    } & {
                        $case: "discord";
                    }) | ({
                        web?: {
                            userId?: string;
                            userName?: string;
                        };
                    } & {
                        $case: "web";
                    });
                } & {
                    id?: string;
                    pollId?: string;
                    userId?: string;
                    userName?: string;
                    createdAt?: Date;
                    updatedAt?: Date;
                    votes?: {
                        [x: string]: {
                            option?: string;
                            rank?: number;
                        };
                    } & {
                        [x: string]: {
                            option?: string;
                            rank?: number;
                        } & {
                            option?: string;
                            rank?: number;
                        } & Record<Exclude<keyof I["poll"]["ballots"][string]["votes"][string], keyof import("../v1/polls").VoteDTO>, never>;
                    } & Record<Exclude<keyof I["poll"]["ballots"][string]["votes"], string | number>, never>;
                    ballotOptionMapping?: {
                        [x: string]: string;
                    } & {
                        [x: string]: string;
                    } & Record<Exclude<keyof I["poll"]["ballots"][string]["ballotOptionMapping"], string | number>, never>;
                    context?: ({
                        discord?: {
                            userId?: string;
                            userName?: string;
                        };
                    } & {
                        $case: "discord";
                    } & {
                        discord?: {
                            userId?: string;
                            userName?: string;
                        } & {
                            userId?: string;
                            userName?: string;
                        } & Record<Exclude<keyof I["poll"]["ballots"][string]["context"]["discord"], keyof import("../v1/polls").DiscordBallotContextDTO>, never>;
                        $case: "discord";
                    } & Record<Exclude<keyof I["poll"]["ballots"][string]["context"], "discord" | "$case">, never>) | ({
                        web?: {
                            userId?: string;
                            userName?: string;
                        };
                    } & {
                        $case: "web";
                    } & {
                        web?: {
                            userId?: string;
                            userName?: string;
                        } & {
                            userId?: string;
                            userName?: string;
                        } & Record<Exclude<keyof I["poll"]["ballots"][string]["context"]["web"], keyof import("../v1/polls").WebBallotContextDTO>, never>;
                        $case: "web";
                    } & Record<Exclude<keyof I["poll"]["ballots"][string]["context"], "web" | "$case">, never>);
                } & Record<Exclude<keyof I["poll"]["ballots"][string], keyof import("../v1/polls").BallotDTO>, never>;
            } & Record<Exclude<keyof I["poll"]["ballots"], string | number>, never>;
            features?: import("../v1/polls").PollFeatureDTO[] & import("../v1/polls").PollFeatureDTO[] & Record<Exclude<keyof I["poll"]["features"], keyof import("../v1/polls").PollFeatureDTO[]>, never>;
            messageRef?: {
                id?: string;
                channelId?: string;
            } & {
                id?: string;
                channelId?: string;
            } & Record<Exclude<keyof I["poll"]["messageRef"], keyof import("./discord").MessageRefDTO>, never>;
            context?: ({
                discord?: {
                    guildId?: string;
                    ownerId?: string;
                    messageRef?: {
                        id?: string;
                        channelId?: string;
                    };
                };
            } & {
                $case: "discord";
            } & {
                discord?: {
                    guildId?: string;
                    ownerId?: string;
                    messageRef?: {
                        id?: string;
                        channelId?: string;
                    };
                } & {
                    guildId?: string;
                    ownerId?: string;
                    messageRef?: {
                        id?: string;
                        channelId?: string;
                    } & {
                        id?: string;
                        channelId?: string;
                    } & Record<Exclude<keyof I["poll"]["context"]["discord"]["messageRef"], keyof import("./discord").MessageRefDTO>, never>;
                } & Record<Exclude<keyof I["poll"]["context"]["discord"], keyof import("../v1/polls").DiscordPollContextDTO>, never>;
                $case: "discord";
            } & Record<Exclude<keyof I["poll"]["context"], "discord" | "$case">, never>) | ({
                web?: {
                    ownerId?: string;
                };
            } & {
                $case: "web";
            } & {
                web?: {
                    ownerId?: string;
                } & {
                    ownerId?: string;
                } & Record<Exclude<keyof I["poll"]["context"]["web"], "ownerId">, never>;
                $case: "web";
            } & Record<Exclude<keyof I["poll"]["context"], "web" | "$case">, never>);
        } & Record<Exclude<keyof I["poll"], keyof PollDTO>, never>;
    } & Record<Exclude<keyof I, "poll">, never>>(object: I): DeletePollResponse;
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
export declare type DeepPartial<T> = T extends Builtin ? T : T extends Long ? string | number | Long : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>> : T extends {
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
