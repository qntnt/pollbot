import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices'
import { Metadata, ServerUnaryCall } from '@grpc/grpc-js'
import { CreatePollRequest, CreatePollResponse, PollDTO, PollRequestDTO, ReadPollRequest, ReadPollResponse } from '../idl/polls/v1/polls';
import admin from 'firebase-admin';
import { DateTime } from 'luxon';
import assert from 'assert';
import { Timestamp } from 'firebase-admin/firestore';

@Controller('/polls')
export class PollsService {
    private readonly firestore = admin.firestore()
    private readonly pollCollection = this.firestore.collection('polls')
    private readonly ballotCollection = this.firestore.collection('ballots')
    private readonly guildCollection = this.firestore.collection('guilds')
    private readonly counters = this.firestore.collection('counters')
    private readonly pollIdCounterRef = this.counters.doc('poll_id')

    private async incrementPollId(): Promise<string> {
        const newPollId: number = await this.firestore.runTransaction(async t => {
            const snapshot = await t.get(this.pollIdCounterRef)
            const newPollId: number = (snapshot.data()?.value ?? 0) + 1
            t.update(this.pollIdCounterRef, { value: newPollId })
            return newPollId
        })
        return newPollId.toString()
    }

    @GrpcMethod('PollsService')
    async createPoll(request: CreatePollRequest, metadata?: Metadata, call?: ServerUnaryCall<any, any>): Promise<CreatePollResponse> {
        console.log('GRPC:\t', request)
        const pollRequest = request.pollRequest
        assert(pollRequest)
        assert(pollRequest.context !== undefined)
        assert(pollRequest.topic.length > 0)
        assert(Object.keys(pollRequest.options).length > 0)
        const pollId = await this.incrementPollId()
        const now = DateTime.now()
        const closeDate = now.plus({ days: 3 })
        const nowTimestamp = Timestamp.fromMillis(now.toMillis())
        const closeTimestamp = Timestamp.fromMillis(closeDate.toMillis())
        const pollDTO = PollDTO.toJSON({
            ...pollRequest,
            id: pollId,
            createdAt: {
                seconds: nowTimestamp.seconds,
                nanos: nowTimestamp.nanoseconds,
            },
            closesAt: {
                seconds: closeTimestamp.seconds,
                nanos: closeTimestamp.nanoseconds,
            },
            ballots: {},
        })
        
        await this.pollCollection.doc(pollId).set(pollDTO)
        return {
            poll: PollDTO.fromJSON(pollDTO),
        }
    }

    private async _readPoll(request: ReadPollRequest): Promise<ReadPollResponse> {
        const pollDoc = await this.firestore.collection('polls').doc(request.id).get()
        const poll = PollDTO.fromJSON(pollDoc.data())
        assert(poll.context)
        console.log(poll.context)
        return {
            poll,
        }
    }

    @GrpcMethod('PollsService')
    async readPoll(request: ReadPollRequest, metadata?: Metadata, call?: ServerUnaryCall<any, any>) {
        const pollDoc = await this.firestore.collection('polls').doc(request.id).get()
        const response =  ReadPollResponse.fromJSON({
            poll: pollDoc.data(),
        })
        console.log('GRPC:\t', pollDoc.data().ballots)
        return ReadPollResponse.fromJSON({
            poll: pollDoc.data(),
        })
    }
}
