export const DISCORD_TOKEN = process.env.DISCORD_TOKEN
export const STORAGE_TYPE = 'firestore'
export const ENV_PREFIXES = {
  'production': '!pollbot',
  'staging': '!pbstaging',
  'unknown': '!pbtesting'
}
type Environment = keyof typeof ENV_PREFIXES
export const ENV: Environment = ENV_PREFIXES[(process.env['NODE_ENV'] ?? 'unknown') as Environment] ? (process.env['NODE_ENV'] ?? 'unknown') as Environment : 'unknown'
export const PREFIX = ENV_PREFIXES[ENV] 
export const DEBUG = ENV !== 'production'