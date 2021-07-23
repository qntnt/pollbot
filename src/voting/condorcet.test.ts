import { computeResults } from '.'
import { Ballot, Poll, Vote } from '../models'
import { generateRange } from '../util/range'
import { DateTime, Duration, Interval } from 'luxon'
import { unsafe } from '../util/testing'
import { Timer } from '../util/timer'
import { showMatrix } from './condorcet'


test('buildMatrix', () => {
    const poll = {} as Poll
    poll.options = {
        a: 'Mephis',
        b: 'Nashville',
        c: 'Chattanooga',
        d: 'Knoxville'
    }

    const genVotes = (keys: string[]) => {
        const votes: Record<string, Vote> = {}
        keys.map((k, i) => ({ k, r: i + 1 })).forEach(({ k, r }) => {
            votes[k] = {
                option: poll.options[k],
                rank: r,
            }
        })
        return votes
    }

    const ballotCount = 1000
    const ballots = generateRange(1, ballotCount, i => {
        const ballot = {} as Ballot
        if (i <= (0.42 * ballotCount)) {
            ballot.votes = genVotes(['a', 'b', 'c', 'd'])
        } else if (i <= ((0.42 + 0.26) * ballotCount)) {
            ballot.votes = genVotes(['b', 'c', 'd', 'a'])
        } else if (i <= ((0.42 + 0.26 + 0.15) * ballotCount)) {
            ballot.votes = genVotes(['c', 'd', 'b', 'a'])
        } else {
            ballot.votes = genVotes(['d', 'c', 'b', 'a'])
        }
        return ballot
    })

    const computeTimer = Timer.startTimer()
    const r = computeResults(poll, ballots)
    computeTimer.endTimer()

    console.log(computeTimer.elapsed().toISO())
    expect(computeTimer.elapsed().milliseconds).toBeLessThan(Duration.fromMillis(1000).milliseconds)

    expect(r).toBeDefined()
    const matrix = unsafe(r?.matrix)
    expect(unsafe(matrix['c']['d']) / ballotCount).toBeCloseTo(0.83, 1) // Chattanooga beats Knoxville 83%
    expect(unsafe(matrix['b']['d']) / ballotCount).toBeCloseTo(0.68, 1) // Nashville beats Knoxville 68%
    expect(unsafe(matrix['b']['c']) / ballotCount).toBeCloseTo(0.68, 1) // Nashville beats Chattanooga 68%
    expect(unsafe(matrix['b']['a']) / ballotCount).toBeCloseTo(0.57, 1) // Nashville beats Memphis 57%
    expect(unsafe(matrix['c']['a']) / ballotCount).toBeCloseTo(0.57, 1) // Chattanooga beats Memphis 57%
    expect(unsafe(matrix['d']['a']) / ballotCount).toBeCloseTo(0.57, 1) // Knoxville beats Memphis 57%

    // Make sure rankings are ordered
    expect(r?.finalRankings[0][1]).toEqual(1)
    expect(r?.finalRankings[1][1]).toEqual(2)
    expect(r?.finalRankings[2][1]).toEqual(3)
    expect(r?.finalRankings[3][1]).toEqual(4)

    expect(r?.finalRankings[0][0]).toEqual('b') // 1st: Nashville
    expect(r?.finalRankings[1][0]).toEqual('c') // 2nd: Chattanooga
    expect(r?.finalRankings[2][0]).toEqual('d') // 3rd: Knoxville
    expect(r?.finalRankings[3][0]).toEqual('a') // 4th: Memphis
})
