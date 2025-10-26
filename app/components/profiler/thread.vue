<script setup lang="ts">

import {MemoryProfileV2, TimeProfileV2} from "~/proto/ProfileFile_pb";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {faCircleChevronRight} from "@fortawesome/free-solid-svg-icons";
import {formatBytes, formatMilliseconds} from "~/util/unit-utils";
import {mergeMemoryChildren, mergeTimeChildren} from "~/util/merge-utils";
import type {MemoryProfileV2Children, MethodDictionary, TimeProfileV2Children} from "~/types/protos";

const { mode, dictionary, timeProfile, memoryProfile } = defineProps<{ mode: "cpu" | "memory", dictionary: MethodDictionary, timeProfile?: TimeProfileV2, memoryProfile?: MemoryProfileV2 }>();

const threadName: ComputedRef<string> = computed(() => {
  if (mode === "cpu" && timeProfile) {
    return timeProfile.thread
  } else if (mode === "memory" && memoryProfile) {
    return memoryProfile.thread
  }
  return ""
})

const threadUsage: ComputedRef<string> = computed(() => {
  if (mode === "cpu" && timeProfile) {
    return formatMilliseconds(timeProfile.time)
  } else if (mode === "memory" && memoryProfile) {
    return formatBytes(memoryProfile.bytes)
  }
  throw new Error("Not properly used")
})

const threadColor: ComputedRef<string> = computed(() => {
  if (mode === "cpu") {
    return "bg-pink-300"
  } else if (mode == "memory") {
    return "bg-purple-400"
  }
  throw new Error("Not properly used")
})

const threadTimeChildren: ComputedRef<TimeProfileV2Children[]> = computed(() => {
  if (mode === "cpu" && timeProfile) {
    return mergeTimeChildren(dictionary, timeProfile.children)
  }
  return []
})

const threadMemoryChildren: ComputedRef<MemoryProfileV2Children[]> = computed(() => {
  if (mode === "memory" && memoryProfile) {
    return mergeMemoryChildren(dictionary, memoryProfile.children)
  }
  return []
})

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
    <div class="flex justify-between items-center min-w-full py-1.5 px-2 text-sm bg-(--profiler-top-color) rounded-lg hover:bg-(--profiler-top-hover-color)">
      <div @click="onClick()" class="flex flex-row items-center gap-2 cursor-pointer">
        <FontAwesomeIcon class="text-gray-600" :class="collapsed" :icon="faCircleChevronRight" />
        <span class="text-gray-200">{{ threadName }}</span>
        <span class="text-pink-300">(100%)</span>
        <span class="text-gray-500">{{ threadUsage }}</span>
      </div>
      <div class="min-w-24 hidden xl:block">
        <ToolPercentageBar :percentage="1.0" :loaded="threadColor" rest="bg-gray-700" />
      </div>
    </div>
    <div v-if="collapsed !== ''" class="bg-(--profiler-child-color) ml-2">
      <ProfilerNode v-if="mode === 'cpu'" v-for="child in threadTimeChildren" :key="child.methodDefinition.fullName" mode="cpu" :dictionary="dictionary" :timeChildren="child" :parentTime="timeProfile!.time" :rootTime="timeProfile!.time" />
      <ProfilerNode v-if="mode === 'memory'" v-for="child in threadMemoryChildren" :key="child.methodDefinition.fullName" mode="memory" :dictionary="dictionary" :memoryChildren="child" :parentBytes="memoryProfile!.bytes" :rootBytes="memoryProfile!.bytes" />
      <ProfilerSelf v-if="mode === 'cpu'" mode="cpu" :parentTime="timeProfile!.time" :childrenTime="timeProfile!.children" :rootTime="timeProfile!.time" />
      <ProfilerSelf v-if="mode === 'memory'" mode="memory" :parentBytes="memoryProfile!.bytes" :childrenBytes="memoryProfile!.children" :rootBytes="memoryProfile!.bytes" />
    </div>
  </div>

</template>

<style scoped>

</style>