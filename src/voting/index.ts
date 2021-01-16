import columnify from "columnify";
import { Ballot, Poll } from "../models";
import { rankedPairs, showMatrix } from "./condorcet";
import { RankingResults, RankingType, Vote } from "./interfaces";

export function computeResults(poll: Poll, ballots: Ballot[]): RankingResults | undefined {
    const optionKeys = Object.keys(poll?.options ?? {})
    const votes: Vote[] = ballots.map(b => {
        const v: Record<string, number> = {}
        optionKeys.forEach(k => {
            v[k] = optionKeys.length - (b.votes[k]?.rank ?? optionKeys.length)
        })
        return v
    })
    return rankedPairs(optionKeys, votes)
}

function displayRankingType(rankingType: RankingType): string {
    switch (rankingType) {
        case 'rankedPairs':
            return '**Ranked Pairs - Tideman** (<https://en.wikipedia.org/wiki/Ranked_pairs>)'
    }
}

export function resultsSummary(poll: Poll, results: RankingResults): string {
    const footer = `> Ranking Type: ${displayRankingType(results.rankingType)}\n`
    const table = columnify(
        results.rankings.map(({ key, rank, score }) => ({
            key,
            rank,
            option: poll?.options[key],
            score,
        })), {
        columns: ['rank', 'key', 'option', 'score'],
        align: 'right',
        columnSplitter: ' | '
    })
    return (
        '```\n' +
        table +
        '```\n' +
        footer
    )
}

export function explainResults(poll: Poll, results: RankingResults): string {
    const summary = resultsSummary(poll, results)
    const matrixText = showMatrix(results.matrix)
    return (
        summary +
        '\n```' +
        matrixText +
        '```'
    )
}
