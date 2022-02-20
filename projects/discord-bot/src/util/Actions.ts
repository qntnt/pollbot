import { L } from "../settings";

export type Action<T> = () => Promise<T>

interface RunAllResult {
  success: {
    indexes: number[],
    items: unknown[],
  },
  error: {
    indexes: number[],
    errors: unknown[],
    factories: Action<unknown>[]
  }
}

function initialRunAllResult(): RunAllResult {
  return {
    success: {
      indexes: [],
      items: [],
    },
    error: {
      indexes: [],
      errors: [],
      factories: [],
    }
  }
}

export class Actions {
    static async runAll(concurrency: number, actions: Action<unknown>[]): Promise<RunAllResult> {
      L.d(`Running all: concurrency=${concurrency} actions.length=${actions.length}`)
      const chunks = this.chunk(concurrency, actions);
      const result = initialRunAllResult()
      let offset = 0
      for (const chunk of chunks) {
        try {
          L.d(`Running chunk: ${offset}-${offset + chunk.length}`)
          const items = await Promise.all(chunk.map(action => action()));
          items.forEach((item, i) => {
            result.success.indexes.push(offset + i)
            result.success.items.push(item)
          })
          offset += items.length
        } catch (e) {
          // On error do chunk in sequence. Skip error action.
          L.d(`Error when running chunk: ${offset}-${offset + chunk.length}`)
          let chunkOffset = 0
          for (const action of chunk) {
            try {
              L.d(`Running action: ${offset + chunkOffset}`)
              const item = await action()
              result.success.indexes.push(offset + chunkOffset)
              result.success.items.push(item)
            } catch (e: unknown) {
              L.d(`Error when running action: ${offset + chunkOffset}`)
              result.error.indexes.push(offset + chunkOffset)
              result.error.errors.push(e)
              result.error.factories.push(action)
            }
            chunkOffset += 1
          }
          offset += chunkOffset
        }
      }
      return result
    }

    static async run<T>(action: Action<T>): Promise<T> {
      return await action()
    }

    static chunk<T>(chunkSize: number, arr: T[]): T[][] {
        const chunks: T[][] = [];
        let currChunk: T[] = [];
        arr.forEach(item => {
            currChunk.push(item);
            if (currChunk.length >= chunkSize) {
                chunks.push(currChunk);
                currChunk = [];
            }
        });
        chunks.push(currChunk);
        return chunks;
    }
}
