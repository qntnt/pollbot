import * as admin from 'firebase-admin'
import moment from 'moment'
import { Ballot, BallotConfig, Poll, GuildData, PollOptionKey, PollConfig, UserId, Vote, BallotOptionKey, UserDataMetrics, POLL_FEATURES_MAPPER, PollFeature } from '../models'
import { zipToRecord } from '../util/array'
import { shuffled } from '../util/random'
import { Actions } from '../util/Actions'
import { Storage } from './interface'
import { DateTime } from 'luxon'
import { PollDTO } from 'idl/lib/polls/v1/polls'

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
        const poll: Poll = PollDTO.fromJSON({
            ...PollConfig.toJSON(pollConfig) as any,
            id: pollId,
            createdAt: now.toDate(),
            closesAt: now.add(3, 'days').toDate(),
            ballots: {},
        })
        poll.features = poll.features.filter(f => f != PollFeature.UNKNOWN && f != PollFeature.UNRECOGNIZED)
        await this.pollCollection.doc(pollId)
            .set(Poll.toJSON(poll) as any)
        return poll
    }

    async getPoll(pollId: string): Promise<Poll | undefined> {
        const snapshot = await this.pollCollection.doc(pollId).get()
        const data = snapshot.data()
        if (!data) return
        let createdAt = data.createdAt
        if (typeof(createdAt) === 'string') {
            createdAt = DateTime.fromISO(createdAt).toJSDate()
        } else {
            createdAt = createdAt.toDate()
        }
        let closesAt = data.closesAt
        if (typeof(closesAt) === 'string') {
            closesAt = DateTime.fromISO(closesAt).toJSDate()
        } else {
            closesAt = closesAt.toDate()
        }
        const poll = PollDTO.fromJSON({
            ...Poll.fromJSON(data),
            createdAt: createdAt,
            closesAt: closesAt,
            features: data.features
                .map((feature: unknown) => {
                    if (typeof(feature) === 'string') {
                        if (feature === 'disableRandomizedBallots') return 'DISABLE_RANDOMIZED_BALLOTS'
                        if (feature === 'disableAnytimeResults') return 'DISABLE_ANYTIME_RESULTS'
                    }
                    if (typeof(feature) === 'number') {
                        if (feature === PollFeature.DISABLE_RANDOMIZED_BALLOTS) return 'DISABLE_RANDOMIZED_BALLOTS'
                        if (feature === PollFeature.DISABLE_ANYTIME_RESULTS) return 'DISABLE_ANYTIME_RESULTS'
                    }
                    return feature
                })
        })
        poll.features = poll.features.filter(f => f !== PollFeature.UNKNOWN && f !== PollFeature.UNRECOGNIZED)
        return poll
    }

    async updatePoll(pollId: string, poll: Poll): Promise<Poll | undefined> {
        await this.pollCollection.doc(pollId)
            .update(Poll.toJSON(poll) as any)
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
        await this.guildCollection.doc(guildData.id).set(GuildData.toJSON(guildData) as any)
        return guildData
    }

    async deleteGuildData(guildId: string): Promise<void> {
        await this.guildCollection.doc(guildId).delete()
    }

    async createBallot(poll: Poll, { context }: BallotConfig): Promise<Ballot | undefined> {
        if (context?.$case !== 'discord') throw new Error('Cannot create a ballot on a non-Discord poll.')
        const { userId, userName } = context.discord
        const now = moment()
        const pollOptionKeys = Object.keys(poll.options)
        const votes = pollOptionKeys.reduce((acc, key) => {
            acc[key] = {
                option: poll.options[key],
            }
            return acc
        }, {} as Record<PollOptionKey, Vote>)
        const randomizedBallotMapping = zipToRecord(shuffled(pollOptionKeys), pollOptionKeys) as Record<BallotOptionKey, PollOptionKey>
        const ballot: Ballot = Ballot.fromJSON({
            pollId: poll.id,
            id: poll.id + userId,
            createdAt: now.toDate(),
            updatedAt: now.toDate(),
            votes,
            ballotOptionMapping: randomizedBallotMapping,
            context: {
                $case: 'discord',
                discord: {
                    userId,
                    userName,
                }
            }
        })
        await this.ballotCollection.doc(ballot.id)
            .set(Ballot.toJSON(ballot) as any)
        return ballot
    }

    async findBallot(pollId: string, userId: UserId): Promise<Ballot | undefined> {
        // v2
        let snapshot =  await this.ballotCollection.where('pollId', '==', pollId)
            .where('discord.userId', '==', userId)
            .get()
        if (snapshot.empty) {
            // v1
            snapshot = await this.ballotCollection.where('pollId', '==', pollId)
                .where('userId', '==', userId)
                .get()
        }
        if (snapshot.empty) return
        const data = snapshot.docs[0].data()
        if (!data) return
        const ballot = Ballot.fromJSON(data)
        return ballot
    }

    async updateBallot(ballotId: string, ballot: Ballot): Promise<Ballot | undefined> {
        const doc = this.ballotCollection.doc(ballotId)
        await doc.update(Ballot.toJSON(ballot) as any)
        const snapshot = await doc.get()
        if (!snapshot.exists) return
        return Ballot.fromJSON(snapshot.data())
    }

    async listBallots(pollId: string): Promise<Ballot[]> {
        const snapshot = await this.ballotCollection.where('pollId', '==', pollId)
            .get()
        return snapshot.docs.map(doc => Ballot.fromJSON(doc.data()))
    }

    async getUserDataMetrics(userId: string): Promise<UserDataMetrics> {
        const pollSnapshot = await this.pollCollection.where('ownerId', '==', userId).get()
        const numPolls = pollSnapshot.size
        const ballotSnapshot = await this.ballotCollection.where('userId', '==', userId).get()
        const numBallots = ballotSnapshot.size
        return {
            numPolls,
            numBallots,
        }
    }

    async deleteUserData(userId: string): Promise<UserDataMetrics> {
        const pollSnapshot = await this.pollCollection.where('ownerId', '==', userId).get()
        const ballotSnapshot = await this.ballotCollection.where('userId', '==', userId).get()
        const metrics = {
            numPolls: pollSnapshot.size,
            numBallots: ballotSnapshot.size,
        }
        const deletePollActions = pollSnapshot.docs.map((doc) => () => doc.ref.delete())
        const deleteBallotActions = ballotSnapshot.docs.map((doc) => () => doc.ref.delete())
        await Actions.runAll(3, [...deletePollActions, ...deleteBallotActions])
        return metrics
    }
}
