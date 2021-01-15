
export type QuotaType = 'hare' | 'droop'

function droopQuota(votesCast: number, availableSeats: number) {
    return Math.floor(votesCast / (availableSeats + 1)) + 1
}

function hareQuota(votesCast: number, availableSeats: number) {
    return votesCast / availableSeats
}

function quota(quotaType: QuotaType, votesCast: number, availableSeats: number): number {
    switch (quotaType) {
        case 'hare':
            return hareQuota(votesCast, availableSeats)
        case 'droop':
            return droopQuota(votesCast, availableSeats)
    }
}

type Candidate = string | symbol | number

interface Ballot<ID> {
    id: ID
    votes: Record<Candidate, number>
}

interface TallyConfig {
    numWinners: number
    quotaType?: QuotaType
}

export function tally<ID>(ballots: Ballot<ID>[], tallyConfig?: TallyConfig): Candidate[] {
    if (tallyConfig?.quotaType) {
        // TODO
        return []
    }

    return []
}
