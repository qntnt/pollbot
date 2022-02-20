import { ReadPollRequest, ReadPollResponse } from 'src/idl/polls/v1/polls';
import { Metadata, ServerUnaryCall } from '@grpc/grpc-js';
export declare class PollsController {
    readPoll(data: ReadPollRequest, metadata: Metadata, call: ServerUnaryCall<any, any>): ReadPollResponse;
}
