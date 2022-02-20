import { Body, Controller, Get, Header, Inject, OnModuleInit, Param, Post } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Metadata, ServerUnaryCall } from '@grpc/grpc-js'
import { PollsService } from 'src/polls-grpc/polls-grpc.controller';
import { observable, Observable, from, map } from 'rxjs';
import { CreatePollRequest, CreatePollResponse, ReadPollRequest, ReadPollResponse } from 'src/idl/polls/v1/polls';

@Controller('polls')
export class PollsRestController implements OnModuleInit {
    private pollsService: PollsService

    constructor(@Inject('POLLS_PACKAGE') private client: ClientGrpc) {}

    onModuleInit() {
        this.pollsService = this.client.getService<PollsService>('PollsService')
    }

    @Get(':pollId')
    readPoll(@Param('pollId') pollId: string): Observable<ReadPollResponse> {
        return from(this.pollsService.readPoll(ReadPollRequest.fromJSON({ id: pollId })))
            .pipe(
                map(value => ReadPollResponse.fromJSON(value))
            )
    }

    @Post()
    createPoll(@Body() request: unknown): Observable<CreatePollResponse> {
        console.log('REST JSON:\t', request)
        const createPollRequest = CreatePollRequest.fromJSON(request)
        console.log('REST PROTO:\t', createPollRequest)
        return from(this.pollsService.createPoll(createPollRequest))
            .pipe(
                map(value => CreatePollResponse.fromJSON(value))
            )
    }

}
