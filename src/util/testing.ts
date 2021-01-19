import { DateTime, Duration, Interval } from "luxon"

export function unsafe<T>(obj: T | undefined | null): T {
    return obj as T
}

export class Timer {
    start: DateTime
    end?: DateTime

    private constructor() {
        this.start = DateTime.local()
    }

    static startTimer(): Timer {
        return new Timer()
    }

    elapsed(): Duration {
        if (this.end) {
            return Interval.fromDateTimes(this.start, this.end).toDuration()
        }
        return Interval.fromDateTimes(this.start, DateTime.local()).toDuration()
    }

    restartTimer() {
        this.start = DateTime.local()
        this.end = undefined
    }

    endTimer(): Duration {
        this.end = DateTime.local()
        return this.elapsed()
    }
}
