<script setup lang="ts">

import {type MemoryProfileV2_Children, type TimeProfileV2_Children} from "~/proto/ProfileFile_pb";
import type {MemoryProfileV2Children, TimeProfileV2Children} from "~/types/protos";
import {calculatePercentage, formatBytes, formatMilliseconds, formatPercentage} from "~/util/unit-utils";
import {faCircle} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

const { mode, parentTime, childrenTime, parentBytes, childrenBytes, rootTime, rootBytes } = defineProps<{ mode: "cpu" | "memory", parentTime?: number, childrenTime?: (TimeProfileV2_Children | TimeProfileV2Children)[], parentBytes?: number, childrenBytes?: (MemoryProfileV2_Children | MemoryProfileV2Children)[], rootTime?: number, rootBytes?: number }>();

let selfUsage: string = ""
let selfColor: string
let selfPercentage: number
let selfPercentageString: string
if (mode === "cpu") {
  const time = childrenTime!.reduce((subtotal, { time }) => subtotal + time, 0)
  const diff = parentTime! - time
  if (diff > 0) {
    selfUsage = formatMilliseconds(diff)
    selfColor = "bg-pink-200"
    selfPercentage = calculatePercentage(diff, rootTime!)
    selfPercentageString = formatPercentage(selfPercentage)
  }
} else if (mode === "memory") {
  const bytes = childrenBytes!.reduce((subtotal, { bytes }) => subtotal + bytes, 0)
  const diff = parentBytes! - bytes
  if (diff > 0) {
    selfUsage = formatBytes(bytes)
    selfColor = "bg-purple-300"
    selfPercentage = calculatePercentage(bytes, rootBytes!)
    selfPercentageString = formatPercentage(selfPercentage)
  }
}

</script>

<template>
  <div v-if="selfUsage !== ''" class="flex justify-between items-center text-sm min-w-fit hover:bg-gray-800 border-l border-gray-500 ml-2">
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