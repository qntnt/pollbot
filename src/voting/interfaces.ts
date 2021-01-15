
// Inputs
export type Option = string
export type Vote = Record<Option, number | undefined>

// Processing
type Rows<T> = Record<Option, T>
type Cols<T> = Record<Option, T>

export type OptionMatrix = Rows<Cols<number | undefined>>

// Outputs
export interface Ranking {
    rank: number
    key: string
    score: number
}

export type RankingType = 'rankedPairs'

export interface RankingResults {
    rankingType: RankingType
    rankings: Ranking[]
    matrix?: OptionMatrix
}
