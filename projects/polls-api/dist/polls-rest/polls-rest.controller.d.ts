import { OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { CreatePollResponse, ReadPollResponse } from 'src/idl/polls/v1/polls';
export declare class PollsRestController implements OnModuleInit {
    private client;
    private pollsService;
    constructor(client: ClientGrpc);
    onModuleInit(): void;
    readPoll(pollId: string): Observable<ReadPollResponse>;
    createPoll(request: unknown): Observable<CreatePollResponse>;
}
