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

const { mode, dictionary, timeChildren, memoryChildren, parentTime, parentBytes } = defineProps<{ mode: "cpu" | "memory", dictionary: MethodDictionary, timeChildren?: TimeProfileV2Children, memoryChildren?: MemoryProfileV2Children, parentTime?: number, parentBytes?: number }>()

let definition: MethodDefinition
let nodeUsage: string
let nodeColor: string
let nodeTimeChildren: TimeProfileV2Children[]
let nodeMemoryChildren: MemoryProfileV2Children[]
let nodePercentage: number
let nodePercentageString: string
if (mode === "cpu") {
  definition = timeChildren!.methodDefinition
  nodeUsage = formatMilliseconds(timeChildren!.time)
  nodeColor = "bg-pink-200"
  nodeTimeChildren = mergeTimeChildren(dictionary, timeChildren!.children)
  nodePercentage = calculatePercentage(timeChildren!.time, parentTime!)
  nodePercentageString = formatPercentage(nodePercentage)
} else if (mode === "memory") {
  definition = memoryChildren!.methodDefinition
  nodeUsage = formatBytes(memoryChildren!.bytes)
  nodeColor = "bg-purple-300"
  nodeMemoryChildren = mergeMemoryChildren(dictionary, memoryChildren!.children)
  nodePercentage = calculatePercentage(memoryChildren!.bytes, parentBytes!)
  nodePercentageString = formatPercentage(nodePercentage)
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
    <div class="flex justify-between items-center text-sm min-w-full hover:bg-gray-800">
      <div @click="onClick()" class="flex flex-row items-center gap-2 ml-2 cursor-pointer">
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
      </div>
      <div class="min-w-24 mr-2">
        <ToolPercentageBar :percentage="nodePercentage" :loaded="nodeColor" rest="bg-gray-700" class="max-h-2" />
      </div>
    </div>
    <div v-if="collapsed !== ''" class="bg-gray-900 ml-2">
      <ProfilerNode v-if="mode === 'cpu'" v-for="child in nodeTimeChildren" mode="cpu" :dictionary="dictionary" :timeChildren="child" :parentTime="parentTime" />
      <ProfilerNode v-if="mode === 'memory'" v-for="child in nodeMemoryChildren" mode="memory" :dictionary="dictionary" :memoryChildren="child" :parentBytes="parentBytes" />
    </div>
  </div>
</template>

<style scoped>

</style>