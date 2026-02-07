<script setup lang="ts">

import type {MethodDefinition, MethodDictionary, NodeAccumulator} from "~/types/protos";
import {faCircleChevronRight} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {calculatePercentage, formatBytes, formatMilliseconds, formatPercentage} from "~/util/unit-utils";
import {getFromDictionary} from "~/util/merge-utils";

type Props = {
  mode: "time" | "memory",
  node: NodeAccumulator,
  dictionary: MethodDictionary,
  parentUnits: number,
  rootUnits: number,
  siblings: any[],
  plugins: string[],
}

const { mode, node, dictionary, parentUnits, rootUnits, siblings, plugins } = defineProps<Props>();

const definition: ComputedRef<MethodDefinition> = computed(() => getFromDictionary(dictionary, node.name))
const children: ComputedRef<NodeAccumulator[]> = computed(() => node.children.values().toArray().sort((a, b) => b.units - a.units).filter(i => {
  if (plugins.length > 0) {
    return plugins.some(j => i.plugins.values().toArray().includes(j))
  }
  return true
}))

const nodeUsage: ComputedRef<string> = computed(() => {
  if (mode === "time") {
    return formatMilliseconds(node.units)
  } else if (mode === "memory") {
    return formatBytes(node.units)
  }
  throw new Error("Not properly used")
})

const nodeColor: ComputedRef<string> = computed(() => {
  if (mode === "time") {
    return "bg-pink-200"
  } else if (mode === "memory") {
    return "bg-purple-300"
  }
  throw new Error("Not properly used")
})


const nodePercentage: ComputedRef<number> = computed(() => calculatePercentage(node.units, rootUnits))
const nodePercentageString: ComputedRef<string> = computed(() => formatPercentage(nodePercentage.value))
const nodePlugin: ComputedRef<string> = computed(() => node.plugin || "")

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
      <ProfilerNode v-for="child in children" :key="child.name" :mode="mode" :node="child" :dictionary="dictionary" :parent-units="child.units" :root-units="rootUnits" :siblings="children" :plugins="plugins" />
      <ProfilerSelf :mode="mode" :parent-units="parentUnits" :root-units="rootUnits" :siblings="children" />
    </div>
  </div>
</template>

<style scoped>

</style>