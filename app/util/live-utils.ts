import { TimelineFile } from "~/proto/ProfileFile_pb";
import type { LiveSummary, MetricInstant } from "~/types/timeline";

export function groupTimelineSamples(samples: TimelineFile[]): LiveSummary {
  const metrics = new Map<string, MetricInstant[]>();
  const events = new Map<string, MetricInstant[]>();

  for (const sample of samples) {
    const timeString = new Date(sample.startedAt).toLocaleString("en-US", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    for (const entry of sample.live) {
      if (
        entry.type.startsWith("flare:world") ||
        entry.type.startsWith("flare:region")
      ) {
        continue;
      }

      const avg = entry.data.reduce((a, b) => a + b, 0) / entry.data.length;
      if (!Number.isFinite(avg)) {
        continue;
      }
      if (!metrics.get(entry.type)) {
        metrics.set(entry.type, []);
      }
      if (entry.type.includes("memory")) {
        metrics
          .get(entry.type)!
          .push({ time: timeString, value: avg / 1073741824 });
      } else if (entry.type.includes("cpu")) {
        metrics.get(entry.type)!.push({ time: timeString, value: avg * 1000 });
      } else {
        metrics.get(entry.type)!.push({ time: timeString, value: avg });
      }
    }
    for (const entry of sample.events) {
      if (!events.get(entry.type)) {
        events.set(entry.type, []);
      }
      const event = events.get(entry.type)!;
      const entryTimeStart = new Date(entry.time).toLocaleString("en-US", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });
      const entryTimeEnd = new Date(entry.time + entry.duration).toLocaleString(
        "en-US",
        {
          day: "numeric",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        },
      );
      event.push({ time: entryTimeStart, value: entry.duration });
      event.push({ time: entryTimeEnd, value: 0 });
    }
  }

  return { events, metrics };
}

export function filterWorldAndRegionSamples(samples: TimelineFile[]) {
  // Key=(time,worldname,regionname) Value=(timestamp,values)
  const worldMspt: Record<string, string | number>[] = [];
  const regionMspt: Record<string, string | number>[] = [];
  const regionTps: Record<string, string | number>[] = [];

  for (const sample of samples) {
    const timeString = new Date(sample.startedAt).toLocaleString("en-US", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });

    const worldMsptRecord: Record<string, string | number> = {
      time: timeString,
    };
    const regionMsptRecord: Record<string, string | number> = {
      time: timeString,
    };
    const regionTpsRecord: Record<string, string | number> = {
      time: timeString,
    };

    for (const entry of sample.live) {
      if (
        !entry.type.startsWith("flare:world") &&
        !entry.type.startsWith("flare:region")
      ) {
        continue;
      }

      const splits = entry.type.split(":");
      if (splits.length !== 3) {
        continue;
      }

      const tag = splits[1]!;
      const match = tag.match(/\[(.*?)\]/);
      if (!match) {
        continue;
      }

      const identifier = match[1]!;
      const avg = entry.data.reduce((a, b) => a + b, 0) / entry.data.length;

      if (tag.startsWith("world")) {
        if (entry.type.endsWith("mspt")) {
          worldMsptRecord[identifier] = avg;
        }
      }
      if (tag.startsWith("region")) {
        if (entry.type.endsWith("tps")) {
          regionTpsRecord[identifier] = avg;
        }
        if (entry.type.endsWith("mspt")) {
          regionMsptRecord[identifier] = avg;
        }
      }
    }

    if (Object.keys(worldMsptRecord).length > 1) {
      worldMspt.push(worldMsptRecord);
    }
    if (Object.keys(regionTpsRecord).length > 1) {
      regionTps.push(regionTpsRecord);
    }
    if (Object.keys(regionMsptRecord).length > 1) {
      regionMspt.push(regionMsptRecord);
    }
  }

  return {
    worldMspt,
    regionMspt,
    regionTps,
  };
}
