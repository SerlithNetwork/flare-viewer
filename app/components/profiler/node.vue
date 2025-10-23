<script setup lang="ts">

import type {MemoryProfileV2Children, MethodDictionary, TimeProfileV2Children} from "~/types/protos";
import {faCircleChevronRight} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

const { mode, dictionary, timeChildren, memoryChildren } = defineProps<{ mode: "cpu" | "memory", dictionary: MethodDictionary, timeChildren?: TimeProfileV2Children, memoryChildren?: MemoryProfileV2Children }>()

if (mode === "cpu") {
} else if (mode === "memory") {
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
  <div class="flex flex-row items-center gap-2 ml-2">
    <FontAwesomeIcon class="text-gray-600" :class="collapsed" :icon="faCircleChevronRight" />
    <span>Test</span>
  </div>
</template>

<style scoped>

</style>