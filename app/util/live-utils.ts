import { TimelineFile } from "~/proto/ProfileFile_pb";
import type { LiveSummary, MetricInstant } from "~/types/timeline";
import {roundTo2} from "~/util/unit-utils";

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
        entry.type.startsWith("flare:perf:world") ||
        entry.type.startsWith("flare:perf:region") ||
        entry.type.startsWith("flare:count:world")
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
          .push({ time: timeString, value: roundTo2(avg / 1073741824) });
      } else if (entry.type.includes("cpu")) {
        metrics.get(entry.type)!.push({ time: timeString, value: roundTo2(avg * 1000) });
      } else {
        metrics.get(entry.type)!.push({ time: timeString, value: roundTo2(avg) });
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
  const perfWorldMspt: Record<string, string | number>[] = [];
  const perfRegionMspt: Record<string, string | number>[] = [];
  const perfRegionTps: Record<string, string | number>[] = [];
  const countWorldRegions: Record<string, string | number>[] = [];

  for (const sample of samples) {
    const timeString = new Date(sample.startedAt).toLocaleString("en-US", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });

    const perfWorldMsptRecord: Record<string, string | number> = {
      time: timeString,
    };
    const perfRegionMsptRecord: Record<string, string | number> = {
      time: timeString,
    };
    const perfRegionTpsRecord: Record<string, string | number> = {
      time: timeString,
    };
    const countWorldRegionsRecord: Record<string, string | number> = {
      time: timeString,
    };

    for (const entry of sample.live) {
      const match = entry.type.match(
        /^flare:(perf|count):(world|region)\[(.*?)]:(mspt|tps|regions)$/,
      );
      if (!match) {
        continue;
      }

      const [, mode, scope, identifier, metric] = match;
      const avg = entry.data.reduce((a, b) => a + b, 0) / entry.data.length;
      if (!Number.isFinite(avg)) {
        continue;
      }

      if (mode === "perf") {
        if (scope === "world" && metric === "mspt") {
          perfWorldMsptRecord[identifier!] = avg;
        } else if (scope === "region" && metric === "tps") {
          perfRegionTpsRecord[identifier!] = avg;
        } else if (scope === "region" && metric === "mspt") {
          perfRegionMsptRecord[identifier!] = avg;
        }
      } else if (mode === "count") {
        if (scope === "world" && metric === "regions") {
          countWorldRegionsRecord[identifier!] = Math.round(avg);
        }
      }
    }

    if (Object.keys(perfWorldMsptRecord).length > 1) {
      perfWorldMspt.push(perfWorldMsptRecord);
    }
    if (Object.keys(perfRegionTpsRecord).length > 1) {
      perfRegionTps.push(perfRegionTpsRecord);
    }
    if (Object.keys(perfRegionMsptRecord).length > 1) {
      perfRegionMspt.push(perfRegionMsptRecord);
    }
    if (Object.keys(countWorldRegionsRecord).length > 1) {
      countWorldRegions.push(countWorldRegionsRecord);
    }
  }

  return {
    worldMspt: perfWorldMspt,
    regionMspt: perfRegionMspt,
    regionTps: perfRegionTps,

    worldRegions: countWorldRegions,
  };
}
