<script setup lang="ts">

import {TimelineFile} from "~/proto/ProfileFile_pb";
import {groupTimelineSamples} from "~/util/live-utils";
import type {LiveSummary} from "~/types/timeline";

const { timelineSamples } = defineProps<{ timelineSamples: TimelineFile[] }>()
const eventCount = timelineSamples.reduce((subtotal, sample) => subtotal + sample.events.length + sample.live.length, 0);

const sortedKeys = [
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
]

const summary: ComputedRef<LiveSummary> = computed(() => groupTimelineSamples(timelineSamples));
const sortedMetrics = computed(() => {
  return Array.from(summary.value.metrics.entries()).sort((a, b) => {
    const indexA = sortedKeys.indexOf(a[0])
    const indexB = sortedKeys.indexOf(b[0])
    return indexA - indexB
  });
})
const sortedEvents = computed(() => {
  return Array.from(summary.value.events.entries()).sort((a, b) => {
    const indexA = sortedKeys.indexOf(a[0])
    const indexB = sortedKeys.indexOf(b[0])
    return indexA - indexB
  });
})

const categories = new Map<string, { value: { name: string, color: string } }>()
categories.set("airplane:tps", { value: { name: "TPS", color: "#53db75" } })
categories.set("airplane:mspt", { value: { name: "MSPT", color: "#53dbc7" } })
categories.set("builtin:stat:memory_used", { value: { name: "Memory Used", color: "#ffc56e" } })
categories.set("builtin:stat:memory_total", { value: { name: "Memory Allocated", color: "#ff996e" } })
categories.set("builtin:stat:cpu_process", { value: { name: "CPU Process", color: "#a579f7" } })
categories.set("builtin:stat:cpu", { value: { name: "CPU System", color: "#7b38e8" } })
categories.set("airplane:world:playercount", { value: { name: "Players", color: "#ff66c9" } })
categories.set("airplane:world:entitycount", { value: { name: "Entities", color: "#ff547c" } })
categories.set("airplane:world:chunkcount", { value: { name: "Chunks", color: "#ff9ecf" } })
categories.set("airplane:world:blockentitycount", { value: { name: "Block Entities", color: "#ff547c" } })
categories.set("builtin:gc:minor", { value: { name: "Minor GC Pause", color: "#5476ff" } })
categories.set("builtin:gc:generic", { value: { name: "Generic GC Pause", color: "#2954ff" } })
categories.set("builtin:gc:major", { value: { name: "Major GC Pause", color: "#082fc9" } })

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

</script>

<template>
  <div v-if="eventCount === 0" class="flex flex-col items-center justify-center min-h-36 min-w-[80%] m-8 max-w-sm p-6 gap-6 rounded-lg shadow-sm" style="background-color: var(--surface-color)">
    <span class="text-white text-3xl md:text-4xl font-bold">Nothing to report</span>
  </div>
  <div v-else class="flex flex-col items-center min-h-6 min-w-[90%] m-8 max-w-sm p-6 gap-6">
    <div v-for="entry in sortedMetrics" :key="entry[0]" class="flex flex-col justify-center items-center p-12 min-h-6 min-w-full rounded-lg shadow-sm gap-4" style="background-color: var(--surface-color)">
      <span class="text-2xl font-bold">{{ titles.get(entry[0]) ?? entry[0] }}</span>
      <LineChart class="w-full"
          :data="entry[1]"
          :categories="categories.get(entry[0]) ?? { value: { name: entry[0], color: '#ffffff' } }"
          :height="300"
          :yLabel="labels.get(entry[0]) ?? entry[0]"
      />
    </div>
    <div v-for="entry in sortedEvents" :key="entry[0]" class="flex flex-col justify-center items-center p-12 min-h-6 min-w-full rounded-lg shadow-sm gap-4" style="background-color: var(--surface-color)">
      <span class="text-2xl font-bold">{{ titles.get(entry[0]) ?? entry[0] }}</span>
      <LineChart class="w-full"
                 :data="entry[1]"
                 :categories="categories.get(entry[0]) ?? { value: { name: entry[0], color: '#ffffff' } }"
                 :height="300"
                 :yLabel="labels.get(entry[0]) ?? entry[0]"
      />
    </div>
  </div>
</template>

<style scoped>

</style>