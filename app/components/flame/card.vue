<script setup lang="ts">

import type {MethodDictionary, ThreadAccumulator} from "~/types/protos";
import {toFlameNode} from "~/util/flame-utils";

type Props = {
  thread: ThreadAccumulator,
  dictionary: MethodDictionary,
  mode: "time" | "memory",
}

const props = defineProps<Props>()

const container = ref<HTMLDivElement>()
const nodePair = computed(() => toFlameNode(
    { node: props.thread, type: "thread" },
    props.dictionary,
    props.mode === "memory",
))
const height = computed(() => Math.min(nodePair.value[1] * 20, 5000))
const width = ref(0)

let observer: ResizeObserver | undefined
onMounted(() => {
  if (!container.value) {
    return
  }

  observer = new ResizeObserver(entries => {
    const entry = entries[0]!
    width.value = entry.contentRect.width
  })

  observer.observe(container.value)
})

onBeforeUnmount(() => {
  observer?.disconnect()
})

</script>

<template>
  <div ref="container" :class="`w-full`" :style="{ 'height': `${height}px` }" >
    <FlameGraph v-if="width > 0" :raw="nodePair[0]" :height="height" :width="width" />
  </div>
</template>

<style scoped>

</style>