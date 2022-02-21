import {
    Poll,
    Ballot,
    BallotConfig,
    BallotId,
    GuildData,
    GuildId, PollConfig, PollId, UserDataMetrics, UserId
} from "../models";

export interface Storage {

    listGuildData(): Promise<GuildId[]>

    getGuildData(guildId: GuildId): Promise<GuildData | undefined>

    createGuildData(guildData: GuildData): Promise<GuildData | undefined>

    deleteGuildData(guildId: GuildId): Promise<void>

    createPoll(poll: PollConfig): Promise<Poll | undefined>

    getPoll(pollId: PollId): Promise<Poll | undefined>

    updatePoll(pollId: PollId, poll: Poll): Promise<Poll | undefined>

    createBallot(poll: Poll, ballotConfig: BallotConfig): Promise<Ballot | undefined>

    findBallot(pollId: PollId, userId: UserId): Promise<Ballot | undefined>

    updateBallot(ballotId: BallotId, ballot: Ballot): Promise<Ballot | undefined>

    listBallots(pollId: PollId): Promise<Ballot[]>
    
    getUserDataMetrics(userId: string): Promise<UserDataMetrics>

    deleteUserData(userId: string): Promise<UserDataMetrics>
}

