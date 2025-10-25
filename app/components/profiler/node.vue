<script setup lang="ts">

import type {
  MemoryProfileV2Children, MethodDefinition,
  MethodDictionary,
  TimeProfileV2Children
} from "~/types/protos";
import {faCircleChevronRight} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {calculatePercentage, formatBytes, formatMilliseconds, formatPercentage} from "~/util/unit-utils";
import {mergeMemoryChildren, mergeTimeChildren} from "~/util/merge-utils";

const { mode, dictionary, timeChildren, memoryChildren, parentTime, parentBytes, rootTime, rootBytes } = defineProps<{ mode: "cpu" | "memory", dictionary: MethodDictionary, timeChildren?: TimeProfileV2Children, memoryChildren?: MemoryProfileV2Children, parentTime?: number, parentBytes?: number, rootTime?: number, rootBytes?: number }>();

const definition: ComputedRef<MethodDefinition> = computed(() => {
  if (mode === "cpu" && timeChildren) {
    return timeChildren.methodDefinition
  } else if (mode === "memory" && memoryChildren) {
    return memoryChildren.methodDefinition
  }
  throw new Error("Not properly used")
})

const nodeUsage: ComputedRef<string> = computed(() => {
  if (mode === "cpu" && timeChildren) {
    return formatMilliseconds(timeChildren.time)
  } else if (mode === "memory" && memoryChildren) {
    return formatBytes(memoryChildren.bytes)
  }
  throw new Error("Not properly used")
})

const nodeColor: ComputedRef<string> = computed(() => {
  if (mode === "cpu") {
    return "bg-pink-200"
  } else if (mode === "memory") {
    return "bg-purple-300"
  }
  throw new Error("Not properly used")
})

const nodeTimeChildren: ComputedRef<TimeProfileV2Children[]> = computed(() => {
  if (mode === "cpu" && timeChildren) {
    return mergeTimeChildren(dictionary, timeChildren.children)
  }
  return []
})


const nodeMemoryChildren: ComputedRef<MemoryProfileV2Children[]> = computed(() => {
  if (mode === "memory" && memoryChildren) {
    return mergeMemoryChildren(dictionary, memoryChildren.children)
  }
  return []
})


const nodePercentage: ComputedRef<number> = computed(() => {
  if (mode === "cpu" && timeChildren) {
    return calculatePercentage(timeChildren.time, rootTime!)
  } else if (mode === "memory" && memoryChildren) {
    return calculatePercentage(memoryChildren.bytes, rootBytes!)
  }
  throw new Error("Not properly used")
})


const nodePercentageString: ComputedRef<string> = computed(() => formatPercentage(nodePercentage.value))

const nodePlugin: ComputedRef<string> = computed(() => {
  if (mode === "cpu" && timeChildren) {
    return timeChildren.plugin
  } else if (mode === "memory" && memoryChildren) {
    return memoryChildren.plugin
  }
  return ""
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
  <div class="flex flex-col min-w-fit border-l border-gray-500 ml-2">
    <div class="flex justify-between items-center text-sm min-w-fit hover:bg-gray-800 ml-2">
      <div @click="onClick()" class="flex flex-row items-center gap-2 cursor-pointer">
        <FontAwesomeIcon class="text-gray-600" :class="collapsed" :icon="faCircleChevronRight" />
        <div v-if="definition.methodType === 'java'" class="flex flex-row">
          <span class="text-gray-500">{{ definition.javaPackageName }}.</span>
          <span class="text-gray-200">{{ definition.javaClassName }}.</span>
          <span class="text-blue-200">{{ definition.javaMethodName }}</span>

          <span class="group relative text-blue-200 cursor-pointer">
            (<span class="hidden group-hover:inline text-gray-500">{{ definition.javaArguments }}</span>)
            <span class="hidden group-hover:inline text-gray-500">{{ definition.javaReturn }}</span>
          </span>
        </div>
        <div v-else >
          <span class="text-gray-500">{{ definition.otherPath }}</span>
          <span class="text-gray-600"> ({{ definition.methodType }})</span>
        </div>
        <span class="text-pink-300">({{ nodePercentageString }})</span>
        <span class="text-gray-500">{{ nodeUsage }}</span>
        <span v-if="nodePlugin !== ''" class="text-amber-500">({{ nodePlugin }})</span>
      </div>
      <div class="min-w-24 mr-2 hidden xl:block">
        <ToolPercentageBar :percentage="nodePercentage" :loaded="nodeColor" rest="bg-gray-700" class="max-h-2" />
      </div>
    </div>
    <div v-if="collapsed !== ''" class="bg-gray-900 ml-2">
      <ProfilerNode v-if="mode === 'cpu'" v-for="child in nodeTimeChildren" :key="child.methodDefinition.fullName" mode="cpu" :dictionary="dictionary" :timeChildren="child" :parentTime="child.time" :rootTime="rootTime" />
      <ProfilerNode v-if="mode === 'memory'" v-for="child in nodeMemoryChildren" :key="child.methodDefinition.fullName" mode="memory" :dictionary="dictionary" :memoryChildren="child" :parentBytes="child.bytes" :rootBytes="rootBytes" />
      <ProfilerSelf v-if="mode === 'cpu'" mode="cpu" :parentTime="parentTime!" :childrenTime="nodeTimeChildren" :rootTime="rootTime" />
      <ProfilerSelf v-if="mode === 'memory'" mode="memory" :parentBytes="parentBytes!" :childrenBytes="nodeMemoryChildren" :rootBytes="rootBytes" />
    </div>
  </div>
</template>

<style scoped>

</style>