<script setup lang="ts">

import {type MemoryProfileV2_Children, type TimeProfileV2_Children} from "~/proto/ProfileFile_pb";
import type {MemoryProfileV2Children, TimeProfileV2Children} from "~/types/protos";
import {calculatePercentage, formatBytes, formatMilliseconds, formatPercentage} from "~/util/unit-utils";
import {faCircle} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

const { mode, parentTime, childrenTime, parentBytes, childrenBytes, rootTime, rootBytes } = defineProps<{ mode: "cpu" | "memory", parentTime?: number, childrenTime?: (TimeProfileV2_Children | TimeProfileV2Children)[], parentBytes?: number, childrenBytes?: (MemoryProfileV2_Children | MemoryProfileV2Children)[], rootTime?: number, rootBytes?: number }>();

const diff: ComputedRef<number> = computed(() => {
  if (mode === "cpu" && childrenTime && parentTime) {
    return parentTime - childrenTime.reduce((subtotal, { time }) => subtotal + time, 0)
  } else if (mode === "memory" && childrenBytes && parentBytes) {
    return parentBytes - childrenBytes.reduce((subtotal, { bytes }) => subtotal + bytes, 0)
  }
  throw new Error("Not properly used")
})

const selfUsage: ComputedRef<string> = computed(() => {
  if (mode === "cpu") {
    return formatMilliseconds(diff.value)
  } else if (mode === "memory") {
    return formatBytes(diff.value)
  }
  throw new Error("Not properly used")
})

const selfColor: ComputedRef<string> = computed(() => {
  if (mode == "cpu") {
    return "bg-pink-200"
  } else if (mode == "memory") {
    return "bg-purple-300"
  }
  throw new Error("Not properly used")
})

const selfPercentage: ComputedRef<number> = computed(() => {
  if (mode === "cpu" && rootTime) {
    return calculatePercentage(diff.value, rootTime)
  } else if (mode === "memory" && rootBytes) {
    return calculatePercentage(diff.value, rootBytes)
  }
  throw new Error("Not properly used")
})

const selfPercentageString: ComputedRef<string> = computed(() => formatPercentage(selfPercentage.value))


</script>

<template>
  <div v-if="diff !== 0" class="flex justify-between items-center text-sm min-w-fit hover:bg-gray-800 border-l border-gray-500 ml-2">
    <div class="flex flex-row items-center gap-2 ml-2 cursor-default">
      <FontAwesomeIcon class="text-gray-600" :icon="faCircle" />
      <span class="text-gray-500">self</span>
      <span class="text-pink-300">({{ selfPercentageString }})</span>
      <span class="text-gray-500">{{ selfUsage }}</span>
    </div>
    <div class="min-w-24 mr-2 hidden xl:block">
      <ToolPercentageBar :percentage="selfPercentage" :loaded="selfColor" rest="bg-gray-700" class="max-h-2" />
    </div>
  </div>
</template>

<style scoped>

</style>