<script setup lang="ts">

import {constant, type ChartNode} from "~/types/flame";

type Props = {
  node: ChartNode;
  backgroundColor: string;
  color: string;
  containerWidth: number;
  disableDefaultTooltips: boolean;
  height: number;
  isDimmed?: boolean;
  label: string;
  tooltip?: string;
  width: number;
  x: number;
  y: number;
}

type Emits = {
  click: [];
  mouseenter: [MouseEvent, ChartNode];
  mouseleave: [MouseEvent, ChartNode];
  mousemove: [MouseEvent, ChartNode];
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()


const x = ref<number>(props.x)
const width = ref<number>(props.width)
const height = ref<number>(props.height)
const filter = ref<string | undefined>(undefined)

onMounted(() => {
  if (x.value < 0) {
    width.value += x.value
    x.value = 0
  }
  // Fake a border by shrinking the rect slightly.
  height.value -= 1
  width.value = Math.min(width.value, props.containerWidth)
  filter.value = props.isDimmed ? 'brightness(115%) grayscale(50%)' : undefined
})

</script>

<template>
  <template>
    <div
        :title="disableDefaultTooltips ? undefined : tooltip != undefined ? tooltip : label"
        :style="{
      backgroundColor: props.backgroundColor,
      color: props.color,
      height: height,
      filter: filter,
      transform: `translate(${x}px,${props.y}px)`,
      width: width,
    }"

        @click="emit('click')"
        @mouseenter="emit('mouseenter', $event, props.node)"
        @mouseleave="emit('mouseleave', $event, props.node)"
        @mousemove="emit('mousemove', $event, props.node)"
    >
      &nbsp;{{ width >= constant.minWidthToDisplayText ? label : '' }}
    </div>
  </template>
</template>

<style scoped>

div {
  position: absolute;
  transition: all ease-in-out 200ms;
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  font-size: 12px;
  font-family: sans-serif;
  font-weight: 400;
  line-height: 1.5;
}

</style>