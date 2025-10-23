<script setup lang="ts">

import type {
  AbstractProfileV2Children,
  MemoryProfileV2Children, MethodDefinition,
  MethodDictionary,
  TimeProfileV2Children
} from "~/types/protos";
import {faCircleChevronRight} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

const { mode, dictionary, timeChildren, memoryChildren } = defineProps<{ mode: "cpu" | "memory", dictionary: MethodDictionary, timeChildren?: TimeProfileV2Children, memoryChildren?: MemoryProfileV2Children }>()

let definition: MethodDefinition
if (mode === "cpu") {
  definition = timeChildren!.methodDefinition
} else if (mode === "memory") {
  definition = memoryChildren!.methodDefinition
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
    <div v-if="definition.methodType === 'java'">
      <span class="text-gray-500">{{ definition.javaPackageName }}.</span>
      <span class="text-gray-200">{{ definition.javaClassName }}.</span>
      <span class="text-blue-200">{{ definition.javaMethodName }}(</span>
      <span class="text-blue-200">)</span>
    </div>
    <div v-else >
      <span class="text-gray-500">{{ definition.otherPath }}</span>
      <span class="text-gray-600"> ({{ definition.methodType }})</span>
    </div>
  </div>
</template>

<style scoped>

</style>