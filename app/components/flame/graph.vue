<script setup lang="ts">

import {type ChartData, type ChartNode, type FlameConstants, type ItemData, type RawData} from "~/types/flame";

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


const constants: FlameConstants = {
  minWidthToDisplay: 1,
  minWidthToDisplayText: 12,
  rowHeight: 20,

  backgroundColorGradient: [
    '#37afa9', // Change to #c88aff
    '#4bb0a5',
    '#5ab0a1',
    '#67b19d',
    '#72b299',
    '#7cb295',
    '#86b390',
    '#8fb48c',
    '#97b488',
    '#9fb584',
    '#a6b680',
    '#aeb67b',
    '#b5b777',
    '#bcb772',
    '#c2b86e',
    '#c9b869',
    '#cfb965',
    '#d5b960',
    '#dbba5b',
    '#e1ba56',
    '#e7bb50',
    '#edbb4b',
    '#f3bb45',
    '#f8bc3f',
    '#febc38', // Change to #ffc4fd
  ],

  colorGradient: ['#000000'],
}

const backgroundColorGradientLength = constants.backgroundColorGradient.length;
const colorGradientLength = constants.colorGradient.length;

function getNodeBackgroundColor(
    value: number,
    maxValue: number
): string {

  return constants.backgroundColorGradient[
      Math.round((value / maxValue) * (backgroundColorGradientLength - 1))
      ]!;
}

function getNodeColor(
    value: number,
    maxValue: number
): string {

  return constants.colorGradient[
      Math.round((value / maxValue) * (colorGradientLength - 1))
      ]!;
}

function transformChartData(rawData: RawData): ChartData {
  let uidCounter = 0;

  const maxValue = rawData.value;

  const nodes = new Map<string, ChartNode>();
  const levels: string[][] = [];

  function convertNode(
      sourceNode: RawData,
      depth: number,
      leftOffset: number
  ): ChartNode {
    const {
      backgroundColor,
      children,
      color,
      id,
      name,
      tooltip,
      value,
    } = sourceNode;

    const uidOrCounter = id || `_${uidCounter}`;

    // Add this node to the node-map and assign it a UID.
    const targetNode = {
      backgroundColor:
          backgroundColor || getNodeBackgroundColor(value, maxValue),
      color: color || getNodeColor(value, maxValue),
      depth,
      left: leftOffset,
      name,
      source: sourceNode,
      tooltip,
      width: value / maxValue,
    }
    nodes.set(uidOrCounter, targetNode);

    // Register the node's depth within the graph.
    if (levels.length <= depth) {
      levels.push([]);
    }
    levels[depth]?.push(uidOrCounter);

    // Now that the current UID has been used, increment it.
    uidCounter++;

    // Process node children.
    if (Array.isArray(children)) {
      children.forEach(sourceChildNode => {
        const targetChildNode = convertNode(
            sourceChildNode,
            depth + 1,
            leftOffset
        );
        leftOffset += targetChildNode.width;
      });
    }

    return targetNode;
  }

  convertNode(rawData, 0, 0);

  const rootUid = rawData.id || '_0';

  return {
    height: levels.length,
    levels,
    nodes,
    root: rootUid,
  };
}


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
  <FlameItem
      v-for="(_, index) in data.levels"
      :key="index"

      :index="index"
      :data="itemData"
      :top="index * constants.rowHeight"
      :constants="constants"

      @click="focusNode"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
      @mousemove="handleMouseMove"
  />
</template>

<style scoped>

</style>