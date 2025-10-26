<script setup lang="ts">

import {TimelineFile} from "~/proto/ProfileFile_pb";
import {groupTimelineSamples} from "~/util/live-utils";
import type {LiveSummary} from "~/types/timeline";

const { timelineSamples } = defineProps<{ timelineSamples: TimelineFile[] }>()
const eventCount = timelineSamples.reduce((subtotal, sample) => subtotal + sample.events.length + sample.live.length, 0);

const summary: ComputedRef<LiveSummary> = computed(() => groupTimelineSamples(timelineSamples));
const sortedMetrics = computed(() => {
  return Array.from(summary.value.metrics.entries()).sort((a, b) => a[0].localeCompare(b[0]));
})
const sortedEvents = computed(() => {
  return Array.from(summary.value.events.entries()).sort((a, b) => a[0].localeCompare(b[0]));
})

const categories = new Map<string, { value: { name: string, color: string } }>()
categories.set("airplane:tps", { value: { name: "TPS", color: "#53db75" } })
categories.set("airplane:mspt", { value: { name: "MSPT", color: "#53dbc7" } })
categories.set("builtin:stat:memory_used", { value: { name: "Memory Used", color: "#ffc26e" } })
categories.set("builtin:stat:memory_total", { value: { name: "Memory Allocated", color: "#ff996e" } })
categories.set("builtin:stat:cpu_process", { value: { name: "CPU Process", color: "#d29cff" } })
categories.set("builtin:stat:cpu", { value: { name: "CPU System", color: "#a579f7" } })
categories.set("builtin:gc:minor", { value: { name: "Minor GC Pause", color: "#d29cff" } })
categories.set("builtin:gc:generic", { value: { name: "Generic GC Pause", color: "#a579f7" } })
categories.set("builtin:gc:mejor", { value: { name: "Major GC Pause", color: "#a579f7" } })

const titles = new Map<string, string>()
titles.set("airplane:tps", "TPS")
titles.set("airplane:mspt", "MSPT")
titles.set("builtin:stat:memory_used", "Memory Used")
titles.set("builtin:stat:memory_total", "Memory Allocated")
titles.set("builtin:stat:cpu_process", "CPU Process %")
titles.set("builtin:stat:cpu", "CPU System %")
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
      <span class="text-2xl font-bold">{{ titles.get(entry[0]) }}</span>
      <LineChart class="w-full"
          :data="entry[1]"
          :categories="categories.get(entry[0])!"
          :height="300"
          :yLabel="labels.get(entry[0])!"
      />
    </div>
    <div v-for="entry in sortedEvents" :key="entry[0]" class="flex flex-col justify-center items-center p-12 min-h-6 min-w-full rounded-lg shadow-sm gap-4" style="background-color: var(--surface-color)">
      <span class="text-2xl font-bold">{{ titles.get(entry[0]) }}</span>
      <LineChart class="w-full"
                 :data="entry[1]"
                 :categories="categories.get(entry[0])!"
                 :height="300"
                 :yLabel="labels.get(entry[0])!"
      />
    </div>
  </div>
</template>

<style scoped>

</style>