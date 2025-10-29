
import {TimelineFile} from "~/proto/ProfileFile_pb";
import type {LiveSummary, MetricInstant} from "~/types/timeline";

export function groupTimelineSamples(samples: TimelineFile[]): LiveSummary {
    const metrics = new Map<string, MetricInstant[]>()
    const events = new Map<string, MetricInstant[]>()

    for (const sample of samples) {
        const time = sample.startedAt
        for (const entry of sample.live) {
            const avg = entry.data.reduce((a, b) => a + b, 0) / entry.data.length
            if (!Number.isFinite(avg)) {
                continue
            }
            if (!metrics.get(entry.type)) {
                metrics.set(entry.type, [])
            }
            if (entry.type.includes("memory")) {
                metrics.get(entry.type)!.push({ time, value: (avg / 1073741824) })
            } else if (entry.type.includes("cpu")) {
                metrics.get(entry.type)!.push({ time, value: (avg * 1000) })
            } else {
                metrics.get(entry.type)!.push({ time, value: avg })
            }

        }
        for (const entry of sample.events) {
            if (!events.get(entry.type)) {
                events.set(entry.type, [])
            }
            const event = events.get(entry.type)!
            event.push({ time: entry.time, value: entry.duration })
            event.push({ time: (entry.time + entry.duration), value: 0 })
        }
    }

    return { events, metrics }
}
