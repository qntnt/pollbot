
export function reverseLookup<A extends string | number | symbol, B extends string | number | symbol>(record: Record<A, B>, b: B): A | undefined {
  for (const a in record) {
    if (record[a] === b) return a
  }
  return undefined
}