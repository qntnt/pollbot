
export function foldr<T, Acc>(arr: T[], initial: Acc, callback: (acc: Acc, curr: T, index: number) => Acc): Acc {
  let acc = initial
  arr.forEach((a, i) => {
    acc = callback(acc, a, i)
  })
  return acc
}

export function zip<A, B>(as: A[], bs: B[]): [A, B][] {
  return as.slice(0, bs.length).map((a, i) => [a, bs[i]])
}

export function zipToRecord<A extends string | number | symbol, B>(as: A[], bs: B[]): Partial<Record<A, B>> {
  return zip(as, bs).reduce((acc, [a, b]) => ({ 
    ...acc,
    [a]: b,
  }), {} as Partial<Record<A, B>>)
}