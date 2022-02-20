"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rankedPairs = exports.showMatrix = exports.buildMatrix = void 0;
const columnify_1 = __importDefault(require("columnify"));
const settings_1 = require("../settings");
const random_1 = require("../util/random");
const timer_1 = require("../util/timer");
function initMatrix(options) {
    const m = {};
    options.forEach(runner => {
        options.forEach(opponent => {
            m[runner] = {};
            if (runner === opponent) {
                m[runner][opponent] = undefined;
            }
            else {
                m[runner][opponent] = 0;
            }
        });
    });
    return m;
}
function addMatrices(matrixA, matrixB) {
    const options = Object.keys(matrixA);
    const result = initMatrix(options);
    options.forEach(runner => {
        options.forEach(opponent => {
            const a = matrixA[runner][opponent];
            const b = matrixB[runner][opponent];
            if (runner !== opponent) {
                result[runner][opponent] = (a !== null && a !== void 0 ? a : 0) + (b !== null && b !== void 0 ? b : 0);
            }
        });
    });
    return result;
}
function buildMatrix(options, votes) {
    return votes.reduce((accMatrix, vote) => {
        const matrix = initMatrix(options);
        options.forEach(runner => {
            options.forEach(opponent => {
                if (runner !== opponent) {
                    const voteR = vote[runner];
                    const voteO = vote[opponent];
                    if (voteR !== undefined && voteO !== undefined) {
                        if (voteR === voteO) {
                            matrix[runner][opponent] = undefined;
                        }
                        else {
                            matrix[runner][opponent] = voteR > voteO ? 1 : 0;
                        }
                    }
                }
            });
        });
        return addMatrices(accMatrix, matrix);
    }, initMatrix(options));
}
exports.buildMatrix = buildMatrix;
function showMatrix(matrix) {
    if (!matrix) {
        return 'Matrix does not exist';
    }
    const options = Object.keys(matrix);
    const rows = options.map(o => {
        const row = matrix[o];
        return Object.assign({ key: o }, row);
    });
    return (0, columnify_1.default)(rows.sort((a, b) => a.key < b.key ? -1 : 1), {
        columns: ['key', ...options.sort()],
        columnSplitter: ' | ',
        align: 'right',
        headingTransform: t => t === 'key' ? '' : t.toLowerCase()
    });
}
exports.showMatrix = showMatrix;
function buildRankedPairs(options, matrix) {
    const pairs = [];
    options.forEach(runner => {
        options.forEach(opponent => {
            var _a, _b;
            const doneAlready = pairs.find(p => {
                return ((p.runner === opponent && p.opponent === runner) ||
                    (p.runner === runner && p.opponent === opponent));
            });
            if (!doneAlready) {
                if (runner !== opponent) {
                    const prefersRunner = (_a = matrix[runner][opponent]) !== null && _a !== void 0 ? _a : 0;
                    const prefersOpponent = (_b = matrix[opponent][runner]) !== null && _b !== void 0 ? _b : 0;
                    const total = prefersRunner + prefersOpponent;
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
                            });
                        }
                        else {
                            pairs.push({
                                runner,
                                opponent,
                                result: {
                                    winner: opponent,
                                    loser: runner,
                                    percentage: prefersOpponent / total
                                }
                            });
                        }
                    }
                }
            }
        });
    });
    return pairs;
}
function sortRankedPairs(rankedPairs) {
    return rankedPairs.sort((p1, p2) => {
        return p1.result.percentage - p2.result.percentage;
    });
}
function addEdge(g, { start, end }) {
    if (!g[start]) {
        g[start] = [end];
        return;
    }
    if (end in g[start]) {
        return;
    }
    g[start].push(end);
}
function deleteEdge(g, { start, end }) {
    const nextNodes = g[start];
    if (nextNodes) {
        const nextIndex = nextNodes.findIndex(n => n === end);
        g[start] = nextNodes.splice(nextIndex, 1);
    }
}
function dfs(g, start, pred) {
    return dfsVisited(g, start, [], 0, pred);
}
function dfsVisited(g, start, visited, depth, pred) {
    if (pred(start, depth)) {
        return start;
    }
    if (visited.indexOf(start) !== -1) {
        return;
    }
    if (!g[start]) {
        return;
    }
    visited.push(start);
    const nextNodes = g[start];
    for (const next of nextNodes) {
        const foundInSubgraph = dfsVisited(g, next, visited, depth + 1, pred);
        if (foundInSubgraph) {
            return foundInSubgraph;
        }
    }
}
function addAcyclicEdge(g, edge) {
    addEdge(g, edge);
    const hasCycle = dfs(g, edge.start, (n, depth) => {
        return n === edge.start && depth !== 0;
    });
    if (hasCycle) {
        settings_1.L.d('New edge would create cycle', edge, g);
        deleteEdge(g, edge);
    }
}
function nodes(g) {
    return Object.keys(g);
}
function edges(g) {
    const ns = nodes(g);
    const edges = ns.map(start => g[start].map(end => ({
        start,
        end,
    })));
    return edges.flat();
}
function union(setA, setB) {
    return new Set([...setA, ...setB]);
}
function intersection(setA, setB) {
    const i = new Set();
    setA.forEach(a => {
        if (setB.has(a)) {
            i.add(a);
        }
    });
    return i;
}
function subtract(setA, setB) {
    const result = new Set(setA);
    setB.forEach(b => {
        if (result.has(b)) {
            result.delete(b);
        }
    });
    return result;
}
function findRoot(g) {
    const ns = new Set(nodes(g));
    const es = new Set(edges(g));
    const nonRoots = new Set();
    es.forEach(({ end }) => {
        nonRoots.add(end);
    });
    const roots = subtract(ns, nonRoots);
    return roots.keys().next().value;
}
function lockRankedPairs(rankedPairs) {
    const g = {};
    rankedPairs.forEach(p => {
        if (!g[p.result.loser]) {
            g[p.result.loser] = [];
        }
        if (!g[p.result.winner]) {
            g[p.result.winner] = [];
        }
        addAcyclicEdge(g, {
            start: p.result.winner,
            end: p.result.loser,
        });
    });
    return g;
}
function sortBy(arr, key) {
    return arr.sort((a, b) => key(a) - key(b));
}
function _rankedPairs(options, votes) {
    options = options.slice(0);
    if (options.length === 0)
        return [];
    if (votes.length === 0)
        return (0, random_1.shuffled)(options).map(o => [o, 0]);
    const matrix = buildMatrix(options, votes);
    const rankedPairs = buildRankedPairs(options, matrix);
    const sorted = sortRankedPairs(rankedPairs);
    const locked = lockRankedPairs(sorted);
    const _rankings = sortBy(options.map(option => {
        var _a, _b;
        return ({
            key: option,
            score: (_b = (_a = locked[option]) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0
        });
    }), ({ score }) => -score);
    const runWinner = _rankings[0];
    if (!runWinner)
        return [];
    const runWinnerIndex = options.indexOf(runWinner.key);
    options.splice(runWinnerIndex, 1);
    const restRankings = _rankedPairs(options, votes);
    return [[runWinner.key, runWinner.score], ...restRankings];
}
function rankedPairs(options, votes) {
    if (votes.length === 0)
        return;
    const computeTimer = timer_1.Timer.startTimer();
    const matrix = buildMatrix(options, votes);
    const finalRankings = _rankedPairs(options, votes);
    const metrics = {
        voteCount: votes.length,
        computeDuration: computeTimer.endTimer()
    };
    return {
        rankingType: 'rankedPairs',
        matrix,
        metrics,
        finalRankings,
    };
}
exports.rankedPairs = rankedPairs;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZG9yY2V0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3ZvdGluZy9jb25kb3JjZXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsMERBQWtDO0FBQ2xDLDBDQUFnQztBQUNoQywyQ0FBMEM7QUFDMUMseUNBQXNDO0FBR3RDLFNBQVMsVUFBVSxDQUFDLE9BQWlCO0lBQ2pDLE1BQU0sQ0FBQyxHQUFpQixFQUFFLENBQUE7SUFDMUIsT0FBTyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRTtRQUNyQixPQUFPLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxFQUFFO1lBQ3ZCLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUE7WUFDZCxJQUFJLE1BQU0sS0FBSyxRQUFRLEVBQUU7Z0JBQ3JCLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxRQUFRLENBQUMsR0FBRyxTQUFTLENBQUE7YUFDbEM7aUJBQU07Z0JBQ0gsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQTthQUMxQjtRQUNMLENBQUMsQ0FBQyxDQUFBO0lBQ04sQ0FBQyxDQUFDLENBQUE7SUFDRixPQUFPLENBQUMsQ0FBQTtBQUNaLENBQUM7QUFFRCxTQUFTLFdBQVcsQ0FBQyxPQUFxQixFQUFFLE9BQXFCO0lBQzdELE1BQU0sT0FBTyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUE7SUFDcEMsTUFBTSxNQUFNLEdBQUcsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFBO0lBQ2xDLE9BQU8sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUU7UUFDckIsT0FBTyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsRUFBRTtZQUN2QixNQUFNLENBQUMsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUE7WUFDbkMsTUFBTSxDQUFDLEdBQUcsT0FBTyxDQUFD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