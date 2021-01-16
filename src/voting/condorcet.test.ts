import { computeResults } from '.'
import { Ballot, Poll } from '../models'
import { buildMatrix, rankedPairs, showMatrix } from './condorcet'

test('buildMatrix', () => {
    const poll = {} as Poll
    poll.options = {
        a: 'aaa',
        b: 'bbb',
        c: 'ccc',
    }
    const b1 = {} as Ballot
    b1.votes = {
        a: {
            option: 'aaa',
            rank: 1
        },
        b: {
            option: 'bbb',
            rank: 2
        },
        c: {
            option: 'ccc',
            rank: 3
        },
    }
    const b2 = {} as Ballot
    b2.votes = {
        a: {
            option: 'aaa',
            rank: 3
        },
        b: {
            option: 'bbb',
            rank: 2
        },
        c: {
            option: 'ccc',
            rank: 1
        },
    }
    const b3 = {} as Ballot
    b3.votes = {
        a: {
            option: 'aaa',
            rank: 2
        },
        b: {
            option: 'bbb',
            rank: 1
        },
        c: {
            option: 'ccc',
            rank: 3
        },
    }
    const b4 = {} as Ballot
    b4.votes = {
        a: {
            option: 'aaa',
            rank: 1
        },
        b: {
            option: 'bbb',
            rank: 3
        },
        c: {
            option: 'ccc',
            rank: 2
        }
    }

    const ballots = [b1, b2, b3, b4, b4]
    const r = computeResults(poll, ballots)

    console.log(r?.rankings)
    console.log(showMatrix(r?.matrix))
})
