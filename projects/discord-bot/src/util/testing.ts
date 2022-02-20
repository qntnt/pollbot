
export function unsafe<T>(obj: T | undefined | null): T {
    return obj as T
}
