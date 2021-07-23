import columnify from "columnify";
import { L } from "../settings";
import { shuffled } from "../util/random";
import { Timer } from "../util/timer";
import { Ranking, Vote, OptionMatrix, RankingResults, RankingMetrics } from "./interfaces";

function initMatrix(options: string[]): OptionMatrix {
    const m: OptionMatrix = {}
    options.forEach(runner => {
        options.forEach(opponent => {
            m[runner] = {}
            if (runner === opponent) {
                m[runner][opponent] = undefined
            } else {
                m[runner][opponent] = 0
            }
        })
    })
    return m
}

function addMatrices(matrixA: OptionMatrix, matrixB: OptionMatrix): OptionMatrix {
    const options = Object.keys(matrixA)
    const result = initMatrix(options)
    options.forEach(runner => {
        options.forEach(opponent => {
            const a = matrixA[runner][opponent]
            const b = matrixB[runner][opponent]
            if (runner !== opponent) {
                result[runner][opponent] = (a ?? 0) + (b ?? 0)
            }
        })
    })
    return result
}

export function buildMatrix(options: string[], votes: Vote[]): OptionMatrix {
    return votes.reduce((accMatrix, vote) => {
        const matrix = initMatrix(options)
        options.forEach(runner => {
            options.forEach(opponent => {
                if (runner !== opponent) {
                    const voteR = vote[runner]
                    const voteO = vote[opponent]
                    if (voteR !== undefined && voteO !== undefined) {
                        if (voteR === voteO) {
                            matrix[runner][opponent] = undefined
                        } else {
                            matrix[runner][opponent] = voteR > voteO ? 1 : 0
                        }
                    }
                }
            })
        })
        return addMatrices(accMatrix, matrix)
    }, initMatrix(options))
}

export function showMatrix(matrix: OptionMatrix | undefined): string {
    if (!matrix) {
        return 'Matrix does not exist'
    }
    const options = Object.keys(matrix)
    const rows = options.map(o => {
        const row = matrix[o]
        return {
            key: o,
            ...row,
        }
    })
    return columnify(rows.sort((a, b) => a.key < b.key ? -1 : 1), {
        columns: ['key', ...options.sort()],
        columnSplitter: ' | ',
        align: 'right',
        headingTransform: t => t === 'key' ? '' : t.toLowerCase()
    })
}

interface RankedPair {
    runner: string
    opponent: string
    result: { winner: string, loser: string, percentage: number }
}

function buildRankedPairs(options: string[], matrix: OptionMatrix): RankedPair[] {
    const pairs: RankedPair[] = []
    options.forEach(runner => {
        options.forEach(opponent => {
            const doneAlready = pairs.find(p => {
                return (
                    (p.runner === opponent && p.opponent === runner) ||
                    (p.runner === runner && p.opponent === opponent)
                )
            })
            if (!doneAlready) {
                if (runner !== opponent) {
                    const prefersRunner = matrix[runner][opponent] ?? 0
                    const prefersOpponent = matrix[opponent][runner] ?? 0
                    const total = prefersRunner + prefersOpponent
                    if (total > 0) {
                        if (prefersRunner > prefersOpponent) {
                            pairs.push({
                                runner,
                                opponent,
                                result: {
                                    winner: runner,
                                    loser: opponent,
                                    percentage: prefersRunner / total
                                }
                            })
                        } else {
                            pairs.push({
                                runner,
                                opponent,
                                result: {
                                    winner: opponent,
                                    loser: runner,
                                    percentage: prefersOpponent / total
                                }
                            })
                        }
                    }
                }
            }
        })
    })
    return pairs
}

function sortRankedPairs(rankedPairs: RankedPair[]): RankedPair[] {
    return rankedPairs.sort((p1, p2) => {
        return p1.result.percentage - p2.result.percentage
    })
}

type Node = string | number
interface Edge {
    start: Node
    end: Node
}
type Graph = Record<Node, Node[]>

function addEdge(g: Graph, { start, end }: Edge) {
    if (!g[start]) {
        g[start] = [end]
        return
    }
    if (end in g[start]) {
        return
    }
    g[start].push(end)
}

function deleteEdge(g: Graph, { start, end }: Edge) {
    const nextNodes = g[start]
    if (nextNodes) {
        const nextIndex = nextNodes.findIndex(n => n === end)
        g[start] = nextNodes.splice(nextIndex, 1)
    }
}

function dfs(g: Graph, start: Node, pred: ((node: Node, depth: number) => boolean)): Node | undefined {
    return dfsVisited(g, start, [], 0, pred)
}

function dfsVisited(g: Graph, start: Node, visited: Node[], depth: number, pred: ((node: Node, depth: number) => boolean)): Node | undefined {
    if (pred(start, depth)) {
        return start
    }
    if (visited.indexOf(start) !== -1) {
        return
    }
    if (!g[start]) {
        return
    }
    visited.push(start)
    const nextNodes = g[start]
    for (const next of nextNodes) {
        const foundInSubgraph = dfsVisited(g, next, visited, depth + 1, pred)
        if (foundInSubgraph) {
            return foundInSubgraph
        }
    }
}

function addAcyclicEdge(g: Graph, edge: Edge) {
    addEdge(g, edge)
    const hasCycle = dfs(g, edge.start, (n, depth) => {
        return n === edge.start && depth !== 0
    })
    if (hasCycle) {
        L.d('New edge would create cycle', edge, g)
        deleteEdge(g, edge)
    }
}

function nodes(g: Graph): Node[] {
    return Object.keys(g)
}

function edges(g: Graph): Edge[] {
    const ns = nodes(g)
    const edges = ns.map(start => g[start].map(end => ({
        start,
        end,
    })))
    return edges.flat()
}

function union<T>(setA: Set<T>, setB: Set<T>): Set<T> {
    return new Set([...setA, ...setB])
}

function intersection<T>(setA: Set<T>, setB: Set<T>): Set<T> {
    const i = new Set<T>()
    setA.forEach(a => {
        if (setB.has(a)) {
            i.add(a)
        }
    })
    return i
}

function subtract<T>(setA: Set<T>, setB: Set<T>): Set<T> {
    const result = new Set<T>(setA)
    setB.forEach(b => {
        if (result.has(b)) {
            result.delete(b)
        }
    })
    return result
}

function findRoot(g: Graph): Node {
    const ns = new Set(nodes(g))
    const es = new Set(edges(g))
    const nonRoots = new Set<Node>()
    es.forEach(({ end }) => {
        nonRoots.add(end)
    })
    const roots = subtract(ns, nonRoots)
    return roots.keys().next().value
}

function lockRankedPairs(rankedPairs: RankedPair[]): Graph {
    const g: Graph = {}
    rankedPairs.forEach(p => {
        if (!g[p.result.loser]) {
            g[p.result.loser] = []
        }
        if (!g[p.result.winner]) {
            g[p.result.winner] = []
        }
        addAcyclicEdge(g, {
            start: p.result.winner,
            end: p.result.loser,
        })
    })
    return g
}

function sortBy<T>(arr: T[], key: (o: T) => number): T[] {
    return arr.sort((a, b) => key(a) - key(b))
}

function _rankedPairs(options: string[], votes: Vote[]): [string, number][] {
    options = options.slice(0)
    if (options.length === 0) return []
    // No votes -> random ordering.
    if (votes.length === 0) return shuffled(options).map(o => [o, 0])

    const matrix = buildMatrix(options, votes)
    const rankedPairs = buildRankedPairs(options, matrix)
    const sorted = sortRankedPairs(rankedPairs)
    const locked = lockRankedPairs(sorted)

    const _rankings = sortBy(options.map(option => ({
        key: option,
        score: locked[option]?.length ?? 0
    })), ({ score }) => -score)

    const runWinner = _rankings[0]
    if (!runWinner) return []

    const runWinnerIndex = options.indexOf(runWinner.key)
    options.splice(runWinnerIndex, 1)
    const restRankings = _rankedPairs(options, votes)
    return [ [runWinner.key, runWinner.score], ...restRankings ]
}

export function rankedPairs(options: string[], votes: Vote[]): RankingResults | undefined {
    if (votes.length === 0) return

    const computeTimer = Timer.startTimer()
    const matrix = buildMatrix(options, votes)
    const finalRankings = _rankedPairs(options, votes)
    const metrics: RankingMetrics = {
        voteCount: votes.length,
        computeDuration: computeTimer.endTimer()
    }
    
    return {
        rankingType: 'rankedPairs',
        matrix,
        metrics,
        finalRankings,
    }
}


