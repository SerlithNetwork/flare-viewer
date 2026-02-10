<script setup lang="ts">

import type {FlameConstants, ItemData, RawData} from "~/types/flame";

type Props = {
  data: ItemData;
  index: number;
  top: number;
  constants: FlameConstants;
}

type Emits = {
  click: [string];
  mouseenter: [MouseEvent, RawData];
  mouseleave: [MouseEvent, RawData];
  mousemove: [MouseEvent, RawData];
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()


const uids = computed(() => props.data.data.levels[props.index] || [])
const focusedNodeLeft = computed(() => props.data.scale(props.data.focusedNode.left))
const focusedNodeWidth = computed(() => props.data.scale(props.data.focusedNode.width))

const nodes = computed(() => {
  return uids.value.map(uid => {

    const node = props.data.data.nodes.get(uid)
    if (!node) {
      return undefined
    }

    const left = props.data.scale(node.left)
    const width = props.data.scale(node.width)
    if (width < props.constants.minWidthToDisplay) {
      return undefined
    }
    if (left + width <= focusedNodeLeft.value || left >= focusedNodeLeft.value + focusedNodeWidth.value) {
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
      :container-width="props.data.containerWidth"
      :disable-default-tooltips="props.data.disableDefaultTooltips"
      :height="props.constants.rowHeight"
      :is-dimmed="index < props.data.focusedNode.depth"
      :label="node.name"
      :tooltip="node.tooltip"
      :width="width"
      :x="left - focusedNodeLeft"
      :y="top"
      :constants="props.constants"

      @click="emit('click', uid)"
      @mouseenter="emit('mouseenter', $event, node.source)"
      @mouseleave="emit('mouseleave', $event, node.source)"
      @mousemove="emit('mousemove', $event, node.source)"
  />
</template>

<style scoped>

</style>