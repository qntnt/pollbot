import columnify from "columnify"
import { MessageEmbed } from "discord.js"
import { POLL_ID_PREFIX } from "../commands"
import { Ballot, Poll } from "../models"
import { DEBUG } from "../settings"
import { shuffled } from "../util/random"
import { rankedPairs, showMatrix } from "./condorcet"
import { RankingResults, RankingType, Vote } from "./interfaces"

export function computeResults(poll: Poll, ballots: Ballot[]): RankingResults | undefined {
    const optionKeys = Object.keys(poll?.options ?? {}).sort()
    const votes: Vote[] = ballots.map(b => {
        const v: Record<string, number> = {}
        optionKeys.forEach(k => {
            v[k] = optionKeys.length - (b.votes[k]?.rank ?? optionKeys.length)
        })
        return v
    })
    return rankedPairs(shuffled(optionKeys, poll.id), votes)
}

function displayRankingType(rankingType: RankingType): string {
    switch (rankingType) {
        case 'rankedPairs':
            return '**Ranked Pairs - Tideman** (<https://en.wikipedia.org/wiki/Ranked_pairs>)'
    }
}

export function resultsSummary(poll: Poll, results: RankingResults): MessageEmbed {
    const footer = `Ranking Type: ${displayRankingType(results.rankingType)}\n`
    const columns = DEBUG ? ['rank', 'option', 'score'] : ['rank', 'option']
    const finalRankings = columnify(results.finalRankings.map(([key, score], i) => ({ option: poll.options[key], rank: i + 1, score })), {
        columns,
        align: 'right',
        columnSplitter: ' | ',
    })
    const metrics = (
        `Ballot count: ${results.metrics.voteCount}\n` +
        `Time to compute: ${results.metrics.computeDuration.toFormat('S')}ms\n`
    )
    const embed = new MessageEmbed({
        title: poll.topic,
        description: '```' + finalRankings + '```'
    })

    const closeCalls = []
    for (let i = 1; i < results.finalRankings.length; i++) {
        const [prev, prevScore] = results.finalRankings[i - 1]
        const [curr, currScore] = results.finalRankings[i]
        if (prevScore <= currScore) {
            closeCalls.push([prev, curr])
        }
    }

    if (closeCalls.length > 0) {
        const closeCallMsg = closeCalls.map(([p, c]) => `- \`${poll.options[p]}\` beat \`${poll.options[c]}\``).join('\n')
        embed.addField('These were close calls!', closeCallMsg.substring(0, 1024))
    }

    embed
        .addField('Metrics', metrics.substring(0, 1024))
        .addField('Info', footer.substring(0, 1024))
        .setFooter(`${POLL_ID_PREFIX}${poll.id}`)
    return embed
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
