<script setup lang="ts">

import {constant, type ItemData, type RawData} from "~/types/flame";

type Props = {
  data: ItemData;
  index: number;
  top: number;
}

type Emits = {
  click: [string];
  mouseenter: [MouseEvent, RawData];
  mouseleave: [MouseEvent, RawData];
  mousemove: [MouseEvent, RawData];
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()


const {
  containerWidth,
  data,
  disableDefaultTooltips,
  focusedNode,
  scale,
} = props.data

const uids = computed(() => data.levels[props.index] || [])
const focusedNodeLeft = computed(() => scale(focusedNode.left))
const focusedNodeWidth = computed(() => scale(focusedNode.width))
const nodes = computed(() => {
  return uids.value.map(uid => {
    const node = data.nodes.get(uid)
    if (!node) {
      return undefined
    }
    const left = scale(node.left)
    const width = scale(node.width)
    if (width < constant.minWidthToDisplay) return undefined
    if (
        left + width < focusedNodeLeft.value ||
        left > focusedNodeLeft.value + focusedNodeWidth.value
    ) {
      return undefined
    }
    return { uid, node, left, width }
  }).filter(i => i != undefined)
})

</script>

<template>
  <FlameRect
      v-for="{ uid, node, left, width } in nodes"
      :key="uid"
      :node="node"
      :background-color="node.backgroundColor"
      :color="node.color"
      :container-width="containerWidth"
      :disable-default-tooltips="disableDefaultTooltips"
      :height="constant.rowHeight"
      :is-dimmed="index < focusedNode.depth"
      :label="node.name"
      :tooltip="node.tooltip"
      :width="width"
      :x="left - focusedNodeLeft"
      :y="top"

      @click="emit('click', uid)"
      @mouseenter="emit('mouseenter', $event, node.source)"
      @mouseleave="emit('mouseleave', $event, node.source)"
      @mousemove="emit('mousemove', $event, node.source)"
  />
</template>

<style scoped>

</style>