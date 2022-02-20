

export function range(start: number, end: number): number[] {
    return Array.from({ length: end - start }, (_, key) => key + start)
}

export function generateRange<T>(start: number, end: number, gen: (position: number) => T): T[] {
    return range(start, end).map(i => gen(i))
}
