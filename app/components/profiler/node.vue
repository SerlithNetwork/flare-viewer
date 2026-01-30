<script setup lang="ts">

import type {MemoryProfileV2Children, MethodDefinition, MethodDictionary, TimeProfileV2Children} from "~/types/protos";
import {faCircleChevronRight} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {calculatePercentage, formatBytes, formatMilliseconds, formatPercentage} from "~/util/unit-utils";
import {mergeMemoryChildren, mergeTimeChildren} from "~/util/merge-utils";

const { mode, dictionary, timeChildren, memoryChildren, parentTime, parentBytes, rootTime, rootBytes, siblings } = defineProps<{ mode: "cpu" | "memory", dictionary: MethodDictionary, timeChildren?: TimeProfileV2Children, memoryChildren?: MemoryProfileV2Children, parentTime?: number, parentBytes?: number, rootTime?: number, rootBytes?: number, siblings: any[] }>();

const definition: ComputedRef<MethodDefinition> = computed(() => {
  if (mode === "cpu" && timeChildren) {
    return timeChildren.methodDefinition
  } else if (mode === "memory" && memoryChildren) {
    return memoryChildren.methodDefinition
  }
  throw new Error("Not properly used")
})

const nodeUsage: ComputedRef<string> = computed(() => {
  if (mode === "cpu" && timeChildren) {
    return formatMilliseconds(timeChildren.time)
  } else if (mode === "memory" && memoryChildren) {
    return formatBytes(memoryChildren.bytes)
  }
  throw new Error("Not properly used")
})

const nodeColor: ComputedRef<string> = computed(() => {
  if (mode === "cpu") {
    return "bg-pink-200"
  } else if (mode === "memory") {
    return "bg-purple-300"
  }
  throw new Error("Not properly used")
})

const nodeTimeChildren: ComputedRef<TimeProfileV2Children[]> = computed(() => {
  if (mode === "cpu" && timeChildren) {
    return mergeTimeChildren(dictionary, timeChildren.children)
  }
  return []
})


const nodeMemoryChildren: ComputedRef<MemoryProfileV2Children[]> = computed(() => {
  if (mode === "memory" && memoryChildren) {
    return mergeMemoryChildren(dictionary, memoryChildren.children)
  }
  return []
})


const nodePercentage: ComputedRef<number> = computed(() => {
  if (mode === "cpu" && timeChildren) {
    return calculatePercentage(timeChildren.time, rootTime!)
  } else if (mode === "memory" && memoryChildren) {
    return calculatePercentage(memoryChildren.bytes, rootBytes!)
  }
  throw new Error("Not properly used")
})


const nodePercentageString: ComputedRef<string> = computed(() => formatPercentage(nodePercentage.value))

const nodePlugin: ComputedRef<string> = computed(() => {
  if (mode === "cpu" && timeChildren) {
    return timeChildren.plugin
  } else if (mode === "memory" && memoryChildren) {
    return memoryChildren.plugin
  }
  return ""
})

enum CollapsedState {
  COLLAPSED,
  UNCOLLAPSED,
}

const collapsedStyle = ref("")
const collapsed = ref(CollapsedState.COLLAPSED);
function onClick() {
  if (collapsed.value === CollapsedState.COLLAPSED) { // Is collapsed
    collapsedStyle.value = "rotate-90"
    collapsed.value = CollapsedState.UNCOLLAPSED
  } else {
    collapsedStyle.value = ""
    collapsed.value = CollapsedState.COLLAPSED
  }
}

onMounted(() => {
  if (siblings.length < 2) {
    collapsedStyle.value = "rotate-90"
    collapsed.value = CollapsedState.UNCOLLAPSED
  } else {
    collapsedStyle.value = ""
    collapsed.value = CollapsedState.COLLAPSED
  }
})

</script>

<template>
  <div class="flex flex-col min-w-fit border-l border-gray-500 ml-2">
    <div class="flex justify-between items-center text-sm min-w-fit hover:bg-accented ml-2">
      <div @click="onClick()" class="flex flex-row items-center gap-2 cursor-pointer text-nowrap">
        <FontAwesomeIcon class="text-dimmed" :class="collapsedStyle" :icon="faCircleChevronRight" />
        <div v-if="definition.methodType === 'java'" class="flex flex-row">
          <span class="text-dimmed">{{ definition.javaPackageName }}.</span>
          <span class="text-muted">{{ definition.javaClassName }}.</span>
          <span class="text-secondary">{{ definition.javaMethodName }}</span>

          <span class="group relative text-blue-200 cursor-pointer">
            (<span class="hidden group-hover:inline text-dimmed">{{ definition.javaArguments }}</span>)
            <span class="hidden group-hover:inline text-dimmed">{{ definition.javaReturn }}</span>
          </span>
        </div>
        <div v-else >
          <span class="text-dimmed">{{ definition.otherPath }}</span>
          <span class="text-default"> ({{ definition.methodType }})</span>
        </div>
        <span class="text-primary">({{ nodePercentageString }})</span>
        <span class="text-dimmed">{{ nodeUsage }}</span>
        <span v-if="nodePlugin !== ''" class="text-amber-500">({{ nodePlugin }})</span>
      </div>
      <div class="min-w-24 mr-2 hidden xl:block">
        <ToolPercentageBar :percentage="nodePercentage" :loaded="nodeColor" rest="bg-toned" class="max-h-2" />
      </div>
    </div>
    <div v-if="collapsed === CollapsedState.UNCOLLAPSED" class="bg-elevated ml-2">
      <ProfilerNode v-if="mode === 'cpu'" v-for="child in nodeTimeChildren" :key="child.methodDefinition.fullName" mode="cpu" :dictionary="dictionary" :timeChildren="child" :parentTime="child.time" :rootTime="rootTime" :siblings="nodeTimeChildren" />
      <ProfilerNode v-if="mode === 'memory'" v-for="child in nodeMemoryChildren" :key="child.methodDefinition.fullName" mode="memory" :dictionary="dictionary" :memoryChildren="child" :parentBytes="child.bytes" :rootBytes="rootBytes" :siblings="nodeMemoryChildren" />
      <ProfilerSelf v-if="mode === 'cpu'" mode="cpu" :parentTime="parentTime!" :childrenTime="nodeTimeChildren" :rootTime="rootTime" />
      <ProfilerSelf v-if="mode === 'memory'" mode="memory" :parentBytes="parentBytes!" :childrenBytes="nodeMemoryChildren" :rootBytes="rootBytes" />
    </div>
  </div>
</template>

<style scoped>

</style>