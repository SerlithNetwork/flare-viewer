<script setup lang="ts">

import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {faCircleChevronRight} from "@fortawesome/free-solid-svg-icons";
import {formatBytes, formatMilliseconds} from "~/util/unit-utils";
import type {MethodDictionary, NodeAccumulator, ThreadAccumulator} from "~/types/protos";

type Props = {
  mode: "time" | "memory",
  thread: ThreadAccumulator,
  dictionary: MethodDictionary,
  plugins: string[],
}

const { mode, thread, dictionary, plugins } = defineProps<Props>();

const threadName: ComputedRef<string> = computed(() => thread.name)
const children: ComputedRef<NodeAccumulator[]> = computed(() => thread.nodes.values().toArray().sort((a, b) => b.units - a.units).filter(i => {
  if (plugins.length > 0) {
    return plugins.some(j => i.plugins.values().toArray().includes(j))
  }
  return true
}))

const threadUsage: ComputedRef<string> = computed(() => {
  if (mode === "time") {
    return formatMilliseconds(thread.units)
  } else if (mode === "memory") {
    return formatBytes(thread.units)
  }
  throw new Error("Not properly used")
})

const threadColor: ComputedRef<string> = computed(() => {
  if (mode === "time") {
    return "bg-gradient-to-r from-pink-300 to-pink-400"
  } else if (mode == "memory") {
    return "bg-gradient-to-r from-purple-400 to-purple-600"
  }
  throw new Error("Not properly used")
})

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
    <div class="flex justify-between items-center min-w-full py-1.5 px-2 text-sm bg-default rounded-lg hover:bg-muted">
      <div @click="onClick()" class="flex flex-row items-center gap-2 cursor-pointer">
        <FontAwesomeIcon class="text-dimmed" :class="collapsed" :icon="faCircleChevronRight" />
        <span class="text-toned">{{ threadName }}</span>
        <span class="text-primary">(100%)</span>
        <span class="text-dimmed">{{ threadUsage }}</span>
      </div>
      <div class="min-w-24 hidden xl:block">
        <ToolPercentageBar :percentage="1.0" :loaded="threadColor" rest="bg-gray-700" />
      </div>
    </div>
    <div v-if="collapsed !== ''" class="bg-elevated ml-2">
      <ProfilerNode v-for="child in children" :key="child.name" :mode="mode" :node="child" :dictionary="dictionary" :root-units="thread.units" :siblings="children" :plugins="plugins" />
      <ProfilerSelf :mode="mode" :parent-units="thread.units" :root-units="thread.units" :siblings="children" />
    </div>
  </div>
</template>

<style scoped>

</style>