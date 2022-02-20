import seedrandom from 'seedrandom'

export function shuffled<T>(array: T[], seed?: string): T[] {
  const random = seed ? seedrandom(seed) : seedrandom()
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1))
      const temp = shuffled[i]
      shuffled[i] = shuffled[j]
      shuffled[j] = temp
  }
  return shuffled
}
