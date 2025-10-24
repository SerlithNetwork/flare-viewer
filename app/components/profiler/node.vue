<script setup lang="ts">

import type {
  MemoryProfileV2Children, MethodDefinition,
  MethodDictionary,
  TimeProfileV2Children
} from "~/types/protos";
import {faCircleChevronRight} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {formatBytes, formatMilliseconds} from "~/util/unit-utils";
import {mergeMemoryChildren, mergeTimeChildren} from "~/util/merge-utils";

const { mode, dictionary, timeChildren, memoryChildren, parentTime, parentBytes } = defineProps<{ mode: "cpu" | "memory", dictionary: MethodDictionary, timeChildren?: TimeProfileV2Children, memoryChildren?: MemoryProfileV2Children, parentTime?: number, parentBytes?: number }>()

let definition: MethodDefinition
let nodeUsage: string
let nodeColor: string
let nodeTimeChildren: TimeProfileV2Children[]
let nodeMemoryChildren: MemoryProfileV2Children[]
if (mode === "cpu") {
  definition = timeChildren!.methodDefinition
  nodeUsage = formatMilliseconds(timeChildren!.time)
  nodeColor = "bg-pink-300"
  nodeTimeChildren = mergeTimeChildren(dictionary, timeChildren!.children)
} else if (mode === "memory") {
  definition = memoryChildren!.methodDefinition
  nodeUsage = formatBytes(memoryChildren!.bytes)
  nodeColor = "bg-purple-400"
  nodeMemoryChildren = mergeMemoryChildren(dictionary, memoryChildren!.children)
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
  </div>
</template>

<style scoped>

</style>