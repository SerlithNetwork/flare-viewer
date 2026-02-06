<script setup lang="ts">

import {type ChartData, type ChartNode, constant, type ItemData, type RawData} from "~/types/flame";
import type {
  MemoryProfileV2,
  TimeProfileV2,
} from "~/proto/ProfileFile_pb";

type Props = {
  data: ChartData;
  profile: TimeProfileV2 | MemoryProfileV2;
  disableDefaultTooltips?: boolean;
  height: number;
  width: number;
}

type Emits = {
  change: [ChartNode, any];
  mousemove: [MouseEvent, RawData];
  mouseout: [MouseEvent, RawData];
  mouseover: [MouseEvent, RawData];
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const focusedNode = ref<ChartNode>(props.data.nodes[props.data.root]!)

function focusNode(uid: number) {
  const chartNode = props.data.nodes[uid]!
  focusedNode.value = chartNode
  emit("change", chartNode, uid)
}

function handleMouseEnter(event: MouseEvent, rawData: RawData) {
  emit("mouseover", event, rawData)
}

function handleMouseLeave(event: MouseEvent, rawData: RawData) {
  emit("mouseout", event, rawData)
}

function handleMouseMove(event: MouseEvent, rawData: RawData) {
  emit("mousemove", event, rawData)
}

const itemData = computed<ItemData>(() => ({
  containerWidth: props.width,
  data: props.data,
  disableDefaultTooltips: props.disableDefaultTooltips,
  focusedNode: focusedNode.value,
  scale: (value: number) => (value / (focusedNode.value?.width || 1)) * props.width
}))


</script>

<template>
  <div
      v-for="(_, index) in data.levels"
      :key="index"
  >
    <FlameItem
        :index="index"
        :data="itemData"
        :top="index * constant.rowHeight"

        @click="focusNode"
        @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseLeave"
        @mousemove="handleMouseMove"
    />
  </div>
</template>

<style scoped>

</style>