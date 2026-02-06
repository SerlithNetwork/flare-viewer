<script setup lang="ts">

import {AirplaneProfileFile, type MemoryProfileV2, type TimeProfileV2} from "~/proto/ProfileFile_pb";
import {mergeAirplaneFile, mergeDictionarySlices} from "~/util/merge-utils";
import type {ContextMenuItem} from "#ui/components/ContextMenu.vue";
import type {AbstractNode} from "~/types/profiler";

const { dataSamples } = defineProps<{ dataSamples: AirplaneProfileFile[] }>()
const profilerType = ref<"cpu" | "memory">("cpu")

// Get plugins from the protocol buffer
// Get mappings from spark-mappings.lucko.me

const airplaneData = computed(() => mergeAirplaneFile(dataSamples))
const dictionary = computed(() => mergeDictionarySlices(airplaneData.value.dictionary))

const flameShown = ref(false)
const flameThread = ref("")
const flameProfile = ref<AbstractNode | undefined>(undefined)
const items = ref<ContextMenuItem[][]>([
    [
      {
        label: "Open as Flame Graph",
        icon: "i-lucide-flame",
        onSelect() {
          flameShown.value = true
        }
      }
    ]
])

function onTimeThreadSelected(profile: TimeProfileV2) {
  if (flameThread.value === profile.thread) {
    return
  }

  flameThread.value = profile.thread
  flameProfile.value = { node: profile, type: "time" }
}

function onMemoryThreadSelected(profile: MemoryProfileV2) {
  if (flameThread.value === profile.thread) {
    return
  }

  flameThread.value = profile.thread
  flameProfile.value = { node: profile, type: "memory" }
}

</script>

<template>
  <div class="flex flex-col min-h-6 min-w-[90%] m-8 max-w-sm" >
    <div class="flex flex-col w-full gap-4">
      <div class="flex flex-row justify-between items-center w-full px-8">
        <div class="flex gap-4">
          <UButton icon="i-lucide-cpu" size="xl" color="primary" class="font-bold text-lg" @click="profilerType = 'cpu'" :variant="profilerType === 'cpu' ? 'solid' : 'outline'" >CPU</UButton>
          <UButton icon="i-lucide-memory-stick" size="xl" color="secondary" class="font-bold text-lg" @click="profilerType = 'memory'" :variant="profilerType === 'memory' ? 'solid' : 'outline'" >Memory</UButton>
        </div>
      </div>
      <div class="flex flex-col items-start w-full rounded-lg" v-bind="$attrs">
        <UContextMenu v-if="profilerType === 'cpu'" v-for="thread in airplaneData.timeProfile" :key="thread.thread" :items="items" @update:open="onTimeThreadSelected(thread)" >
          <ProfilerThread mode="cpu" :dictionary="dictionary" :timeProfile="thread" />
        </UContextMenu>
        <UContextMenu v-if="profilerType === 'memory'" v-for="thread in airplaneData.memoryProfile" :key="thread.thread" :items="items" @update:open="onMemoryThreadSelected(thread)">
          <ProfilerThread mode="memory" :dictionary="dictionary" :memoryProfile="thread" />
        </UContextMenu>
      </div>
    </div>
  </div>
  <UModal fullscreen v-model:open="flameShown" :title="flameThread" close-icon="i-lucide-corner-up-right" >
    <FlameCard :node="flameProfile!" :dictionary="dictionary" />
  </UModal>
</template>

<style scoped>

</style>