<script setup lang="ts">

import {MemoryProfileV2, MethodDictionarySlice, TimeProfileV2} from "~/proto/ProfileFile_pb";

const { mode, dictionary, timeProfile, memoryProfile } = defineProps<{ mode: "cpu" | "memory", dictionary: MethodDictionarySlice[], timeProfile?: TimeProfileV2, memoryProfile?: MemoryProfileV2 }>();

let threadName: string
if (mode === "cpu") {
  threadName = timeProfile!.thread;
} else if (mode === "memory") {
  threadName = memoryProfile!.thread;
}

function onClick() {}

</script>

<template>
  <div class="flex justify-between min-w-full border py-1 px-2 border-white text-xs bg-gray-800 border-b-gray-400">
    <div @click="onClick()" class="cursor-pointer">
      {{ threadName }}
    </div>
    <div class="min-w-24">
      <ToolPercentageBar :percentage="1.0" loaded="bg-pink-300" rest="bg-gray-700" />
    </div>
  </div>
</template>

<style scoped>

</style>