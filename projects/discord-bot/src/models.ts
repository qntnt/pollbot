import { 
    PollDTO,
    VoteDTO,
    BallotDTO,
    PollFeatureDTO,
    PollRequestDTO,
    BallotRequestDTO,
} from 'idl/lib/polls/v1/polls'
export {
    PollFeatureDTO as PollFeature
} from 'idl/lib/polls/v1/polls'
import {
    GuildDataDTO,
    MessageRefDTO,
} from 'idl/lib/discord/v1/discord'

export type Poll = PollDTO
export type Vote = VoteDTO
export type Ballot = BallotDTO
export type PollConfig = PollRequestDTO

export type GuildData = GuildDataDTO
export type MessageRef = MessageRefDTO

export type UserId = string
export type GuildId = string
export type PollId = string
export type BallotOptionKey = string
export type PollOptionKey = string
export type Option = string
export type BallotId = string

// Used to create new ballots
export type BallotConfig = BallotRequestDTO

export const POLL_FEATURES_MAPPER: Record<string, number> = {
    disableRandomizedBallots: PollFeatureDTO.DISABLE_RANDOMIZED_BALLOTS,
    disableAnytimeResults: PollFeatureDTO.DISABLE_ANYTIME_RESULTS
}

export interface UserDataMetrics {
    numPolls: number
    numBallots: number
}