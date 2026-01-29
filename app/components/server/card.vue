<script setup lang="ts">

import {TimelineFile} from "~/proto/ProfileFile_pb";
import {groupTimelineSamples} from "~/util/live-utils";
import type {LiveSummary} from "~/types/timeline";

const { timelineSamples } = defineProps<{ timelineSamples: TimelineFile[] }>()
const eventCount = timelineSamples.reduce((subtotal, sample) => subtotal + sample.events.length + sample.live.length, 0);

const knownKeys = [
  "airplane:tps",
  "airplane:mspt",
  "builtin:stat:cpu_process",
  "builtin:stat:cpu",
  "builtin:stat:memory_used",
  "builtin:stat:memory_total",
  "airplane:world:playercount",
  "airplane:world:entitycount",
  "airplane:world:chunkcount",
  "airplane:world:blockentitycount",
  "builtin:gc:minor",
  "builtin:gc:generic",
  "builtin:gc:major",
  "builtin:thread:startedcount",
  "builtin:thread:peakcount",
  "builtin:thread:schedulercount",
  "builtin:thread:daemoncount",
  "builtin:thread:threadcount",
  "flare:network:outpacketcount",
]

const summary: ComputedRef<LiveSummary> = computed(() => groupTimelineSamples(timelineSamples));

const categories = new Map<string, { value: { name: string, color: string } }>()
categories.set("airplane:tps", { value: { name: "TPS", color: "#53DB75" } })
categories.set("airplane:mspt", { value: { name: "MSPT", color: "#53DBC7" } })
categories.set("builtin:stat:memory_used", { value: { name: "Memory Used", color: "#FFB46E" } })
categories.set("builtin:stat:memory_total", { value: { name: "Memory Allocated", color: "#FF996E" } })
categories.set("builtin:stat:cpu_process", { value: { name: "CPU Process", color: "#A579F7" } })
categories.set("builtin:stat:cpu", { value: { name: "CPU System", color: "#7B38E8" } })
categories.set("airplane:world:playercount", { value: { name: "Players", color: "#FCD4FF" } })
categories.set("airplane:world:entitycount", { value: { name: "Entities", color: "#FCC7FF" } })
categories.set("airplane:world:chunkcount", { value: { name: "Chunks", color: "#FF8787" } })
categories.set("airplane:world:blockentitycount", { value: { name: "Block Entities", color: "#FCBDFF" } })
categories.set("builtin:gc:minor", { value: { name: "Minor GC Pause", color: "#5476FF" } })
categories.set("builtin:gc:generic", { value: { name: "Generic GC Pause", color: "#2954FF" } })
categories.set("builtin:gc:major", { value: { name: "Major GC Pause", color: "#082FC9" } })
categories.set("builtin:thread:startedcount", { value: { name: "Threads Started", color: "#4DFFC0" } })
categories.set("builtin:thread:peakcount", { value: { name: "Max Threads Lifetime", color: "#4DFFC0" } })
categories.set("builtin:thread:schedulercount", { value: { name: "Craft Scheduler Threads", color: "#80FF88" } })
categories.set("builtin:thread:daemoncount", { value: { name: "Daemon Threads", color: "#C7FFCC" } })
categories.set("builtin:thread:threadcount", { value: { name: "Native Threads", color: "#ADFFB2" } })
categories.set("flare:network:outpacketcount", { value: { name: "Packets Sent", color: "#87FF8D" } })

const titles = new Map<string, string>()
titles.set("airplane:tps", "TPS")
titles.set("airplane:mspt", "MSPT")
titles.set("builtin:stat:memory_used", "Memory Used")
titles.set("builtin:stat:memory_total", "Memory Allocated")
titles.set("builtin:stat:cpu_process", "CPU Process %")
titles.set("builtin:stat:cpu", "CPU System %")
titles.set("airplane:world:playercount", "Players")
titles.set("airplane:world:entitycount", "Entities")
titles.set("airplane:world:chunkcount", "Loaded Chunks")
titles.set("airplane:world:blockentitycount", "Block Entities")
titles.set("builtin:gc:minor", "Minor GC Pauses")
titles.set("builtin:gc:generic", "Generic GC Pauses")
titles.set("builtin:gc:major", "Major GC Pauses")
titles.set("builtin:thread:startedcount", "Threads Started")
titles.set("builtin:thread:peakcount", "Max Threads Lifetime")
titles.set("builtin:thread:schedulercount", "Craft Scheduler Threads")
titles.set("builtin:thread:daemoncount", "Daemon Threads")
titles.set("builtin:thread:threadcount", "Native Threads")
titles.set("flare:network:outpacketcount", "Packets Sent")

const labels = new Map<string, string>()
labels.set("airplane:tps", "Ticks")
labels.set("airplane:mspt", "Milliseconds")
labels.set("builtin:stat:memory_used", "GB")
labels.set("builtin:stat:memory_total", "GB")
labels.set("builtin:stat:cpu_process", "Usage %")
labels.set("builtin:stat:cpu", "Usage %")
titles.set("airplane:world:playercount", "Players")
titles.set("airplane:world:entitycount", "Entities")
titles.set("airplane:world:chunkcount", "Chunks Loaded")
titles.set("airplane:world:blockentitycount", "Block Entities")
labels.set("builtin:gc:minor", "Milliseconds")
labels.set("builtin:gc:generic", "Milliseconds")
labels.set("builtin:gc:major", "Milliseconds")
labels.set("builtin:thread:startedcount", "Threads")
labels.set("builtin:thread:peakcount", "Threads")
labels.set("builtin:thread:schedulercount", "Threads")
labels.set("builtin:thread:daemoncount", "Threads")
labels.set("builtin:thread:threadcount", "Threads")
labels.set("flare:network:outpacketcount", "Packets")

const unknownMetrics = computed(() => summary.value.metrics.entries().filter((entry) => !knownKeys.includes(entry[0])).toArray())
const unknownEvents = computed(() => summary.value.events.entries().filter((entry) => !knownKeys.includes(entry[0])).toArray())

</script>

<template>
  <div v-if="eventCount === 0" class="flex flex-col items-center justify-center min-h-36 min-w-[80%] m-8 max-w-sm p-6 gap-6 rounded-lg shadow-sm" style="background-color: var(--surface-color)">
    <span class="text-default text-3xl md:text-4xl font-bold">Nothing to report</span>
  </div>
  <div v-else class="flex flex-col items-center min-w-fit m-8 max-w-sm gap-6">
    <UCard class="flex flex-col w-full shadow-sm" >
      <div class="flex flex-col items-center w-full gap-4">
        <span class="text-default text-3xl font-bold">Performance Metrics</span>
        <div class="flex flex-wrap justify-around w-full gap-4">
          <AreaChart class="w-[70vh]"
                     :data="summary.metrics.get('airplane:tps')!"
                     :categories="categories.get('airplane:tps')!"
                     :height="300"
                     :yLabel="labels.get('airplane:tps')!"
          />
          <AreaChart class="w-[70vh]"
                     :data="summary.metrics.get('airplane:mspt')!"
                     :categories="categories.get('airplane:mspt')!"
                     :height="300"
                     :yLabel="labels.get('airplane:mspt')!"
          />
        </div>
      </div>
    </UCard>
    <UCard class="flex flex-col w-full shadow-sm" >
      <div class="flex flex-col items-center w-full gap-4">
        <span class="text-default text-3xl font-bold">Resource Utilisation</span>
        <div class="flex flex-wrap justify-around w-full gap-4">
          <AreaChart class="w-[70vh]"
                     :data="summary.metrics.get('builtin:stat:cpu_process')!"
                     :categories="categories.get('builtin:stat:cpu_process')!"
                     :height="300"
                     :yLabel="labels.get('builtin:stat:cpu_process')!"
          />
          <AreaChart class="w-[70vh]"
                     :data="summary.metrics.get('builtin:stat:cpu')!"
                     :categories="categories.get('builtin:stat:cpu')!"
                     :height="300"
                     :yLabel="labels.get('builtin:stat:cpu')!"
          />
          <AreaChart class="w-[70vh]"
                     :data="summary.metrics.get('builtin:stat:memory_used')!"
                     :categories="categories.get('builtin:stat:memory_used')!"
                     :height="300"
                     :yLabel="labels.get('builtin:stat:memory_used')!"
          />
          <AreaChart class="w-[70vh]"
                     :data="summary.metrics.get('builtin:stat:memory_total')!"
                     :categories="categories.get('builtin:stat:memory_total')!"
                     :height="300"
                     :yLabel="labels.get('builtin:stat:memory_total')!"
          />
        </div>
      </div>
    </UCard>
    <UCard class="flex flex-col w-full shadow-sm" >
      <div class="flex flex-col items-center w-full gap-4">
        <span class="text-default text-3xl font-bold">World Resources</span>
        <div class="flex flex-wrap justify-around w-full gap-4">
          <AreaChart class="w-[70vh]"
                     :data="summary.metrics.get('airplane:world:playercount')!"
                     :categories="categories.get('airplane:world:playercount')!"
                     :height="300"
                     :yLabel="labels.get('airplane:world:playercount')!"
          />
          <AreaChart class="w-[70vh]"
                     :data="summary.metrics.get('airplane:world:entitycount')!"
                     :categories="categories.get('airplane:world:entitycount')!"
                     :height="300"
                     :yLabel="labels.get('airplane:world:entitycount')!"
          />
          <AreaChart class="w-[70vh]"
                     :data="summary.metrics.get('airplane:world:blockentitycount')!"
                     :categories="categories.get('airplane:world:blockentitycount')!"
                     :height="300"
                     :yLabel="labels.get('airplane:world:blockentitycount')!"
          />
          <AreaChart class="w-[70vh]"
                     :data="summary.metrics.get('airplane:world:chunkcount')!"
                     :categories="categories.get('airplane:world:chunkcount')!"
                     :height="300"
                     :yLabel="labels.get('airplane:world:chunkcount')!"
          />
        </div>
      </div>
    </UCard>
    <UCard class="flex flex-col w-full shadow-sm" >
      <div class="flex flex-col items-center w-full gap-4">
        <span class="text-default text-3xl font-bold">Network Metrics</span>
        <div class="flex flex-wrap justify-around w-full gap-4">
          <AreaChart class="w-[70vh]"
                     :data="summary.metrics.get('flare:network:outpacketcount')!"
                     :categories="categories.get('flare:network:outpacketcount')!"
                     :height="300"
                     :yLabel="labels.get('flare:network:outpacketcount')!"
          />
        </div>
      </div>
    </UCard>
    <UCard class="flex flex-col w-full shadow-sm" >
      <div class="flex flex-col items-center w-full gap-4">
        <span class="text-default text-3xl font-bold">Garbage Collections</span>
        <div class="flex flex-wrap justify-around w-full gap-4">
          <AreaChart class="w-[70vh]"
                     :data="summary.events.get('builtin:gc:minor')!"
                     :categories="categories.get('builtin:gc:minor')!"
                     :height="300"
                     :yLabel="labels.get('builtin:gc:minor')!"
                     :curve-type="CurveType.Step"
          />
          <AreaChart class="w-[70vh]"
                     :data="summary.events.get('builtin:gc:generic')!"
                     :categories="categories.get('builtin:gc:generic')!"
                     :height="300"
                     :yLabel="labels.get('builtin:gc:generic')!"
                     :curve-type="CurveType.Step"
          />
          <AreaChart class="w-[70vh]"
                     :data="summary.events.get('builtin:gc:major')!"
                     :categories="categories.get('builtin:gc:major')!"
                     :height="300"
                     :yLabel="labels.get('builtin:gc:major')!"
                     :curve-type="CurveType.Step"
          />
        </div>
      </div>
    </UCard>
    <UCard class="flex flex-col w-full shadow-sm" >
      <div class="flex flex-col items-center w-full gap-4">
        <span class="text-default text-3xl font-bold">Thread Utilisation</span>
        <div class="flex flex-wrap justify-around w-full gap-4">
          <AreaChart class="w-[70vh]"
                     :data="summary.metrics.get('builtin:thread:threadcount')!"
                     :categories="categories.get('builtin:thread:threadcount')!"
                     :height="300"
                     :yLabel="labels.get('builtin:thread:threadcount')!"
          />
          <AreaChart class="w-[70vh]"
                     :data="summary.metrics.get('builtin:thread:schedulercount')!"
                     :categories="categories.get('builtin:thread:schedulercount')!"
                     :height="300"
                     :yLabel="labels.get('builtin:thread:schedulercount')!"
          />
          <AreaChart class="w-[70vh]"
                     :data="summary.metrics.get('builtin:thread:daemoncount')!"
                     :categories="categories.get('builtin:thread:daemoncount')!"
                     :height="300"
                     :yLabel="labels.get('builtin:thread:daemoncount')!"
          />
          <AreaChart class="w-[70vh]"
                     :data="summary.metrics.get('builtin:thread:startedcount')!"
                     :categories="categories.get('builtin:thread:startedcount')!"
                     :height="300"
                     :yLabel="labels.get('builtin:thread:startedcount')!"
          />
          <AreaChart class="w-[70vh]"
                     :data="summary.metrics.get('builtin:thread:peakcount')!"
                     :categories="categories.get('builtin:thread:peakcount')!"
                     :height="300"
                     :yLabel="labels.get('builtin:thread:peakcount')!"
          />
        </div>
      </div>
    </UCard>
    <UCard v-if="unknownMetrics.length + unknownEvents.length > 0" class="flex flex-col w-full shadow-sm" >
      <div class="flex flex-col items-center w-full gap-4">
        <span class="text-default text-3xl font-bold">Other Metrics</span>
        <div class="flex flex-wrap justify-around w-full gap-4">
          <AreaChart v-for="metric in unknownMetrics" class="w-[70vh]"
                     :data="metric[1]"
                     :categories="{ value: { name: metric[0], color: '#ffffff' } }"
                     :height="300"
                     :yLabel="metric[0]"
          />
          <AreaChart v-for="event in unknownEvents" class="w-[70vh]"
                     :data="event[1]"
                     :categories="{ value: { name: event[0], color: '#ffffff' } }"
                     :height="300"
                     :yLabel="event[0]"
          />
        </div>
      </div>
    </UCard>
  </div>
</template>

<style scoped>

</style>