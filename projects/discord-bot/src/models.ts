import { 
    PollFeatureDTO,
} from 'idl/lib/polls/v1/polls'
import { kill } from 'process'
import { reverseLookup } from './util/record'
export {
    PollDTO as Poll,
    PollFeatureDTO as PollFeature,
    VoteDTO as Vote,
    BallotDTO as Ballot,
    PollRequestDTO as PollConfig,
    BallotRequestDTO as BallotConfig,
} from 'idl/lib/polls/v1/polls'
export {
    GuildDataDTO as GuildData,
    MessageRefDTO as MessageRef,
} from 'idl/lib/discord/v1/discord'

export type UserId = string
export type GuildId = string
export type PollId = string
export type BallotOptionKey = string
export type PollOptionKey = string
export type Option = string
export type BallotId = string

export const POLL_FEATURES_MAPPER = {
    disableRandomizedBallots: PollFeatureDTO.DISABLE_RANDOMIZED_BALLOTS,
    DISABLE_RANDOMIZED_BALLOTS: PollFeatureDTO.DISABLE_RANDOMIZED_BALLOTS,
    disableAnytimeResults: PollFeatureDTO.DISABLE_ANYTIME_RESULTS,
    DISABLE_ANYTIME_RESULTS: PollFeatureDTO.DISABLE_ANYTIME_RESULTS,
}
type RecordKey = string | number | symbol
type Reverse<R extends Record<K, V>, K extends RecordKey = RecordKey, V extends RecordKey = RecordKey> = {
    [V in R[keyof R]]: keyof R
}

function keys<K extends RecordKey>(obj: Record<K, unknown>): K[] {
    return Object.keys(obj) as K[]
}

export const POLL_FEATURES_REVERSE_MAPPER: Reverse<typeof POLL_FEATURES_MAPPER> = {
    ...keys(POLL_FEATURES_MAPPER)
        .map(k => ({ k, v: POLL_FEATURES_MAPPER[k] }))
        .reduce((prev, current) => {
            prev[current.v] = current.k
            return prev
        }, {} as Reverse<typeof POLL_FEATURES_MAPPER>)
}

export interface UserDataMetrics {
    numPolls: number
    numBallots: number
}