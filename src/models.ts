export type UserId = string
export type GuildId = string
export type PollId = string
export type BallotOptionKey = string
export type PollOptionKey = string
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
    votes: Record<PollOptionKey, Vote>
    ballotOptionMapping?: Record<BallotOptionKey, PollOptionKey>
}

// Used to create new polls
export interface PollConfig {
    guildId: GuildId,
    ownerId: UserId,
    topic: string,
    options: Record<PollOptionKey, Option>,
    features: PollFeature[]
}

export const POLL_FEATURES = {
    disableRandomizedBallots: {
        description: 'Disables randomized ballot option ordering',
    },
    disableAnytimeResults: {
        description: 'Disallows users to view results before the poll is closed'
    }
}

export type PollFeature = keyof (typeof POLL_FEATURES)

export const POLL_FEATURES_ARRAY = Object.keys(POLL_FEATURES) as PollFeature[]

export const POLL_FEATURES_SET = new Set(POLL_FEATURES_ARRAY)

export interface MessageRef {
    id: string,
    channelId: string,
}

export interface Poll {
    id: PollId
    guildId: GuildId
    ownerId: UserId
    createdAt: Date
    closesAt: Date
    topic: string
    options: Record<PollOptionKey, Option>
    ballots: Record<UserId, Ballot>
    features?: PollFeature[]
    messageRef?: MessageRef
}

const editablePollPropNames = 
    [ 'closesAt'
    , 'topic'
    ] as const

export const EDITABLE_POLL_PROPS = new Set(editablePollPropNames)

export type EditablePollProperty = (typeof editablePollPropNames)[number]

export interface UserDataMetrics {
    numPolls: number
    numBallots: number
}