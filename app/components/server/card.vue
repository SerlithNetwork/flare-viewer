<script setup lang="ts">

import {TimelineFile} from "~/proto/ProfileFile_pb";

const { timelineSamples } = defineProps<{ timelineSamples: TimelineFile[] }>()
const eventCount = timelineSamples.reduce((subtotal, sample) => subtotal + sample.events.length + sample.live.length, 0);


</script>

<template>
  <div v-if="eventCount === 0" class="flex flex-col items-center justify-center min-h-36 min-w-[80%] m-8 max-w-sm p-6 gap-6 rounded-lg shadow-sm" style="background-color: var(--surface-color)">
    <span class="text-white text-3xl md:text-4xl font-bold">Nothing to report</span>
  </div>
  <div v-else>
    {{ timelineSamples }}
  </div>
</template>

<style scoped>

</style>