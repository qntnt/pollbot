const _DISCORD_TOKEN = process.env.DISCORD_TOKEN 
if (!_DISCORD_TOKEN) throw new Error('DISCORD_TOKEN environment variable is unset.')
export const DISCORD_TOKEN = _DISCORD_TOKEN 

const _DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID
if (!_DISCORD_CLIENT_ID) throw new Error('DISCORD_CLIENT_ID environment variable is unset')
export const DISCORD_CLIENT_ID = _DISCORD_CLIENT_ID

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

export class L {
  public static d(...args: any): void {
    if (DEBUG) {
        console.log(...args)
    }
  }
}