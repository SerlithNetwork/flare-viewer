<script setup lang="ts">

import {type MethodDictionarySlice} from "~/proto/ProfileFile_pb";
import {mergeDictionarySlices} from "~/util/merge-utils";
import type {ContextMenuItem} from "#ui/components/ContextMenu.vue";
import type {ThreadAccumulator} from "~/types/protos";

type Props = {
  timeThreads: Map<string, ThreadAccumulator>,
  memoryThreads: Map<string, ThreadAccumulator>,
  dictionarySlices: MethodDictionarySlice[],
  plugins: Set<string>,
}

const { timeThreads, memoryThreads, dictionarySlices, plugins } = defineProps<Props>()

const profilerType = ref<"time" | "memory">("time")
const dictionary = computed(() => mergeDictionarySlices(dictionarySlices))

const sortedPlugins = computed(() => plugins.values().map(i => ({
  label: i,
  icon: "i-lucide-plug"
})).toArray().sort((a, b) => a.label.toLowerCase().localeCompare(b.label.toLowerCase())))
const sortedTimeThreads = computed(() => timeThreads.values().toArray().sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase())).filter(i => {
  if (selectedPluginsRaw.value.length > 0) {
    return selectedPluginsRaw.value.some(j => i.plugins.values().toArray().includes(j))
  }
  return true
}))
const sortedMemoryThreads = computed(() => memoryThreads.values().toArray().sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase())).filter(i => {
  if (selectedPluginsRaw.value.length > 0) {
    return selectedPluginsRaw.value.some(j => i.plugins.values().toArray().includes(j))
  }
  return true
}))

const selectedPlugins = ref<{ label: string, icon: string }[]>([])
const selectedPluginsRaw = computed(() => selectedPlugins.value.map(i => i.label))

const flameShown = ref(false)
const items = ref<ContextMenuItem[][]>([
  [
    {
      label: "Coming soon...",
      icon: "i-lucide-flame",
      onSelect() {
        flameShown.value = true
      }
    }
  ]
])

</script>

<template>
  <div class="flex flex-col min-h-6 min-w-[90%] m-8 max-w-sm" >
    <div class="flex flex-col w-full gap-4">
      <div class="flex flex-row justify-between items-center w-full px-8">
        <div class="flex gap-4">
          <UButton icon="i-lucide-cpu" size="xl" color="primary" class="font-bold text-lg" @click="profilerType = 'time'" :variant="profilerType === 'time' ? 'solid' : 'outline'" >CPU</UButton>
          <UButton icon="i-lucide-memory-stick" size="xl" color="secondary" class="font-bold text-lg" @click="profilerType = 'memory'" :variant="profilerType === 'memory' ? 'solid' : 'outline'" >Memory</UButton>
        </div>
        <USelectMenu v-model="selectedPlugins" multiple :items="sortedPlugins" icon="i-lucide-list-filter" placeholder="Filter by Plugin" class="h-10 w-64" />
      </div>
      <div v-if="timeThreads.size === 0 || memoryThreads.size === 0" class="flex flex-col gap-1" >
        <USkeleton v-for="i in 20" :key="i" class="h-6 w-full" />
      </div>
      <div v-else class="flex flex-col items-start w-full rounded-lg" v-bind="$attrs">
        <UContextMenu v-if="profilerType === 'time'" :items="items" v-for="thread in sortedTimeThreads" :key="thread.name">
          <ProfilerThread :mode="profilerType" :thread="thread" :dictionary="dictionary" :plugins="selectedPluginsRaw" />
        </UContextMenu>
        <UContextMenu v-else-if="profilerType === 'memory'" :items="items" v-for="thread in sortedMemoryThreads" :key="thread.name">
          <ProfilerThread :mode="profilerType" :thread="thread" :dictionary="dictionary" :plugins="selectedPluginsRaw" />
        </UContextMenu>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>