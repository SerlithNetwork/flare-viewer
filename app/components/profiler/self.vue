<script setup lang="ts">

import {calculatePercentage, formatBytes, formatMilliseconds, formatPercentage} from "~/util/unit-utils";
import {faCircle} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import type {NodeAccumulator, ThreadAccumulator} from "~/types/protos";

type Props = {
  mode: "time" | "memory",
  parentUnits: number,
  rootUnits: number,
  siblings: (ThreadAccumulator | NodeAccumulator)[]
}

const { mode, parentUnits, rootUnits, siblings } = defineProps<Props>();

const diff: ComputedRef<number> = computed(() => parentUnits - siblings.reduce((subtotal, { units }) => subtotal + units, 0))

const selfUsage: ComputedRef<string> = computed(() => {
  if (mode === "time") {
    return formatMilliseconds(diff.value)
  } else if (mode === "memory") {
    return formatBytes(diff.value)
  }
  throw new Error("Not properly used")
})

const selfColor: ComputedRef<string> = computed(() => {
  if (mode == "time") {
    return "bg-gradient-to-r from-pink-200 to-pink-300"
  } else if (mode == "memory") {
    return "bg-gradient-to-r from-purple-300 to-purple-500"
  }
  throw new Error("Not properly used")
})

const selfPercentage: ComputedRef<number> = computed(() => calculatePercentage(diff.value, rootUnits))
const selfPercentageString: ComputedRef<string> = computed(() => formatPercentage(selfPercentage.value))


</script>

<template>
  <div v-if="diff !== 0" class="flex justify-between items-center text-sm min-w-fit hover:bg-accented border-l border-gray-500 ml-2">
    <div class="flex flex-row items-center gap-2 ml-2 cursor-default">
      <FontAwesomeIcon class="text-dimmed" :icon="faCircle" />
      <span class="text-toned">self</span>
      <span class="text-primary">({{ selfPercentageString }})</span>
      <span class="text-dimmed">{{ selfUsage }}</span>
    </div>
    <div class="min-w-24 mr-2 hidden xl:block">
      <ToolPercentageBar :percentage="selfPercentage" :loaded="selfColor" rest="bg-toned" class="max-h-2" />
    </div>
  </div>
</template>

<style scoped>

</style>