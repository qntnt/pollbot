import { Metadata, ServerUnaryCall } from '@grpc/grpc-js';
import { CreatePollRequest, CreatePollResponse, ReadPollRequest, ReadPollResponse } from '../idl/polls/v1/polls';
export declare class PollsService {
    private readonly firestore;
    private readonly pollCollection;
    private readonly ballotCollection;
    private readonly guildCollection;
    private readonly counters;
    private readonly pollIdCounterRef;
    private incrementPollId;
    createPoll(request: CreatePollRequest, metadata?: Metadata, call?: ServerUnaryCall<any, any>): Promise<CreatePollResponse>;
    private _readPoll;
    readPoll(request: ReadPollRequest, metadata?: Metadata, call?: ServerUnaryCall<any, any>): Promise<ReadPollResponse>;
}
