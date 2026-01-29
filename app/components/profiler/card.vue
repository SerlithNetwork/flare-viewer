<script setup lang="ts">

import {AirplaneProfileFile} from "~/proto/ProfileFile_pb";
import {mergeAirplaneFile, mergeDictionarySlices} from "~/util/merge-utils";

const { dataSamples } = defineProps<{ dataSamples: AirplaneProfileFile[] }>()
const profilerType = ref<"cpu" | "memory">("cpu")

// Get plugins from the protocol buffer
// Get mappings from spark-mappings.lucko.me

const airplaneData = computed(() => mergeAirplaneFile(dataSamples))
const dictionary = computed(() => mergeDictionarySlices(airplaneData.value.dictionary))

</script>

<template>
  <UCard class="flex flex-col min-h-6 min-w-[90%] m-8 max-w-sm" >
    <div class="flex flex-col w-full gap-4">
      <div class="flex flex-row justify-between items-center w-full px-8">
        <div class="flex gap-4">
          <UButton icon="i-lucide-cpu" size="xl" color="primary" class="font-bold text-lg" @click="profilerType = 'cpu'" :variant="profilerType === 'cpu' ? 'solid' : 'outline'" >CPU</UButton>
          <UButton icon="i-lucide-memory-stick" size="xl" color="secondary" class="font-bold text-lg" @click="profilerType = 'memory'" :variant="profilerType === 'memory' ? 'solid' : 'outline'" >Memory</UButton>
        </div>
      </div>
      <div class="flex flex-col items-start w-full rounded-lg">
        <ProfilerThread v-if="profilerType === 'cpu'" v-for="thread in airplaneData.timeProfile" :key="thread.thread" mode="cpu" :dictionary="dictionary" :timeProfile="thread" />
        <ProfilerThread v-if="profilerType === 'memory'" v-for="thread in airplaneData.memoryProfile" :key="thread.thread" mode="memory" :dictionary="dictionary" :memoryProfile="thread" />
      </div>
    </div>
  </UCard>
</template>

<style scoped>

</style>