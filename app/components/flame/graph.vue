<script setup lang="ts">

import {type ChartNode, constant, type ItemData, type RawData} from "~/types/flame";
import {transformChartData} from "~/util/flame-utils";

type Props = {
  raw: RawData,
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

const data = computed(() => transformChartData(props.raw))

const focusedNode = ref<ChartNode>(data.value.nodes.get(data.value.root)!)
function focusNode(uid: string) {
  const chartNode = data.value.nodes.get(uid)!
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
  data: data.value,
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