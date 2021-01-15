import { tally } from "./stv"

test('tallies vote using stv without a quota', () => {
    expect(tally([])).toStrictEqual([])
})
