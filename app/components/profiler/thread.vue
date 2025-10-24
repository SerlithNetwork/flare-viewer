<script setup lang="ts">

import {MemoryProfileV2, TimeProfileV2} from "~/proto/ProfileFile_pb";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {faCircleChevronRight} from "@fortawesome/free-solid-svg-icons";
import {formatBytes, formatMilliseconds} from "~/util/unit-utils";
import {mergeMemoryChildren, mergeTimeChildren} from "~/util/merge-utils";
import type {MemoryProfileV2Children, MethodDictionary, TimeProfileV2Children} from "~/types/protos";

const { mode, dictionary, timeProfile, memoryProfile } = defineProps<{ mode: "cpu" | "memory", dictionary: MethodDictionary, timeProfile?: TimeProfileV2, memoryProfile?: MemoryProfileV2 }>();

let threadName: string
let threadUsage: string
let threadColor: string
let threadTimeChildren: TimeProfileV2Children[]
let threadMemoryChildren: MemoryProfileV2Children[]
if (mode === "cpu") {
  threadName = timeProfile!.thread;
  threadUsage = formatMilliseconds(timeProfile!.time);
  threadColor = "bg-pink-300"
  threadTimeChildren = mergeTimeChildren(dictionary, timeProfile!.children)
} else if (mode === "memory") {
  threadName = memoryProfile!.thread;
  threadUsage = formatBytes(memoryProfile!.bytes)
  threadColor = "bg-purple-400"
  threadMemoryChildren = mergeMemoryChildren(dictionary, memoryProfile!.children)
}

const collapsed = ref("")
function onClick() {
  if (collapsed.value === "") { // Is collapsed
    collapsed.value = "rotate-90"
  } else {
    collapsed.value = ""
  }
}

</script>

<template>
  <div class="flex flex-col min-w-full">
    <div class="flex justify-between min-w-full py-1.5 px-2 text-xs bg-gray-800 border-b-gray-400 rounded-lg">
      <div @click="onClick()" class="flex flex-row items-center gap-2 cursor-pointer">
        <FontAwesomeIcon class="text-gray-600" :class="collapsed" :icon="faCircleChevronRight" />
        <span class="text-gray-200">{{ threadName }}</span>
        <span class="text-pink-300">(100%)</span>
        <span class="text-gray-500">{{ threadUsage }}</span>
      </div>
      <div class="min-w-24">
        <ToolPercentageBar :percentage="1.0" :loaded="threadColor" rest="bg-gray-700" />
      </div>
    </div>
    <div v-if="collapsed !== ''" class="bg-gray-900 ml-2">
      <ProfilerNode v-if="mode === 'cpu'" v-for="child in threadTimeChildren" mode="cpu" :dictionary="dictionary" :timeChildren="child" :parentTime="timeProfile!.time" />
      <ProfilerNode v-if="mode === 'memory'" v-for="child in threadMemoryChildren" mode="memory" :dictionary="dictionary" :memoryChildren="child" :parentBytes="memoryProfile!.bytes" />
    </div>
  </div>

</template>

<style scoped>

</style>