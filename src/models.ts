export type UserId = string
export type GuildId = string
export type PollId = string
export type OptionKey = string
export type Option = string
export type BallotId = string

export interface GuildData {
    id: GuildId
    admins: Record<UserId, boolean>
}

export interface Vote {
    option: Option
    rank?: number
}

// Used to create new ballots
export interface BallotConfig {
    poll: Poll
    userId: UserId
    userName: string
}

export interface Ballot {
    id: BallotId
    pollId: PollId
    userId: UserId
    userName: string
    createdAt: Date
    updatedAt: Date
    votes: Record<OptionKey, Vote>
}

// Used to create new polls
export interface PollConfig {
    guildId: GuildId,
    ownerId: UserId,
    topic: string,
    options: Record<OptionKey, Option>,
}

export interface Poll {
    id: PollId
    guildId: GuildId
    ownerId: UserId
    createdAt: Date
    closesAt: Date
    topic: string
    options: Record<OptionKey, Option>
    ballots: Record<UserId, Ballot>
}
