<script setup lang="ts">

import type {FlareProfile} from "~/types/profiler";

const { flare } = defineProps<{ flare: FlareProfile }>()
const profilerType = ref<"cpu" | "memory">("cpu")

// Get plugins from the protocol buffer
// Get mappings from spark-mappings.lucko.me

</script>

<template>
<div class="flex flex-col items-center min-h-6 min-w-[80%] m-8 max-w-sm p-6 gap-6 rounded-lg shadow-sm" style="background-color: var(--surface-color)">
  <div class="flex flex-row flex-wrap justify-between items-center w-full px-8">
    <div class="flex gap-4">
      <button @click="profilerType = 'cpu'" class="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-white text-sm font-medium rounded-full group bg-gradient-to-br from-pink-400 to-purple-500 group-hover:from-pink-400 group-hover:to-purple-500">
        <span :class="['w-25 relative px-5 py-2.5 transition-all ease-in duration-150 rounded-full group-hover:opacity-50 group-hover:dark:opacity-50', (profilerType === 'cpu' ? '' : 'bg-gray-900')]">
        CPU
        </span>
      </button>
      <button @click="profilerType = 'memory'" class="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-white text-sm font-medium rounded-full group bg-gradient-to-br from-pink-400 to-purple-500 group-hover:from-pink-400 group-hover:to-purple-500">
        <span :class="['w-25 relative px-5 py-2.5 transition-all ease-in duration-150 rounded-full group-hover:opacity-50 group-hover:dark:opacity-50', (profilerType === 'memory' ? '' : 'bg-gray-900')]">
        Memory
        </span>
      </button>
    </div>
    <div class="flex gap-4">
      <ToolDropdown id="plugins" title="Filter by Plugin" :items="[ { id: 1, name: 'Option 1' }, { id: 2, name: 'Option 2' } ]"></ToolDropdown>
      <ToolDropdown id="mappings" title="Mappings" :items="[ { id: 1, name: 'Option 1' }, { id: 2, name: 'Option 2' } ]"></ToolDropdown>
    </div>
  </div>
  <div class="flex flex-col items-center w-full rounded-lg">
    <!-- <ProfilerThread v-for="thread in threads" :key="thread.id" :mode="thread.mode" :nodes="thread.nodes" :time="thread.time" :bytes="thread.bytes" /> -->
  </div>
</div>
</template>

<style scoped>

</style>