import * as admin from 'firebase-admin'
import moment from 'moment'
import { Ballot, BallotConfig, GuildData, PollOptionKey, Poll, PollConfig, UserId, Vote } from '../models'
import { zipToRecord } from '../util/array'
import { shuffled } from '../util/random'
import { Storage } from './interface'

admin.initializeApp()

const firestore = admin.firestore()

export class FirestoreStorage implements Storage {
    pollCollection = firestore.collection('polls')
    ballotCollection = firestore.collection('ballots')
    guildCollection = firestore.collection('guilds')
    counters = firestore.collection('counters')
    pollIdCounterRef = this.counters.doc('poll_id')

    private async incrementPollId(): Promise<string> {
        const newPollId: number = await firestore.runTransaction(async t => {
            const snapshot = await t.get(this.pollIdCounterRef)
            const newPollId: number = (snapshot.data()?.value ?? 0) + 1
            t.update(this.pollIdCounterRef, { value: newPollId })
            return newPollId
        })
        return newPollId.toString()
    }

    async createPoll(pollConfig: PollConfig): Promise<Poll | undefined> {
        const pollId = await this.incrementPollId()
        const now = moment()
        const poll: Poll = {
            ...pollConfig,
            id: pollId,
            createdAt: now.toDate(),
            closesAt: now.add(3, 'days').toDate(),
            ballots: {},
        }
        await this.pollCollection.doc(pollId).set(poll)
        return poll
    }

    async getPoll(pollId: string): Promise<Poll | undefined> {
        const snapshot = await this.pollCollection.doc(pollId).get()
        const data = snapshot.data()
        if (!data) return
        const poll = {
            ...data as Poll,
            createdAt: data.createdAt.toDate(),
            closesAt: data.closesAt.toDate(),
        }
        return poll
    }

    async updatePoll(pollId: string, poll: Partial<Poll>): Promise<Poll | undefined> {
        await this.pollCollection.doc(pollId).update(poll)
        return await this.getPoll(pollId)
    }

    async listGuildData(): Promise<string[]> {
        const snapshot = await this.guildCollection.select().get()
        return snapshot.docs.map(d => d.id)
    }

    async getGuildData(guildId: string): Promise<GuildData | undefined> {
        const snapshot = await this.guildCollection.doc(guildId).get()
        if (!snapshot.exists) {
            const guildData = {
                id: guildId,
                admins: {}
            }
            await this.createGuildData(guildData)
            return guildData
        }
        return snapshot.data() as GuildData | undefined
    }

    async createGuildData(guildData: GuildData): Promise<GuildData | undefined> {
        await this.guildCollection.doc(guildData.id).set(guildData)
        return guildData
    }

    async deleteGuildData(guildId: string): Promise<void> {
        await this.guildCollection.doc(guildId).delete()
    }

    async createBallot({ poll, userId, userName }: BallotConfig): Promise<Ballot | undefined> {
        const now = moment()
        const pollOptionKeys = Object.keys(poll.options)
        const votes = pollOptionKeys.reduce((acc, key) => {
            acc[key] = {
                option: poll.options[key],
            }
            return acc
        }, {} as Record<PollOptionKey, Vote>)
        const randomizedBallotMapping = zipToRecord(shuffled(pollOptionKeys), pollOptionKeys)
        const ballot: Ballot = {
            pollId: poll.id,
            id: poll.id + userId,
            userId,
            userName,
            createdAt: now.toDate(),
            updatedAt: now.toDate(),
            votes,
            ballotOptionMapping: randomizedBallotMapping
        }
        await this.ballotCollection.doc(ballot.id).set(ballot)
        return ballot
    }

    async findBallot(pollId: string, userId: UserId): Promise<Ballot | undefined> {
        const snapshot = await this.ballotCollection.where('pollId', '==', pollId)
            .where('userId', '==', userId)
            .get()
        if (snapshot.empty) return
        const data = snapshot.docs[0].data()
        if (!data) return
        const ballot = {
            ...data as Ballot,
            createdAt: data.createdAt.toDate(),
            updatedAt: data.updatedAt.toDate(),
        }
        return ballot
    }

    async updateBallot(ballotId: string, ballot: Partial<Ballot>): Promise<Ballot | undefined> {
        const doc = this.ballotCollection.doc(ballotId)
        await doc.update(ballot)
        const snapshot = await doc.get()
        if (!snapshot.exists) return
        return snapshot.data() as Ballot
    }

    async listBallots(pollId: string): Promise<Ballot[]> {
        const snapshot = await this.ballotCollection.where('pollId', '==', pollId)
            .get()
        return snapshot.docs.map(doc => doc.data()) as Ballot[]
    }
}

