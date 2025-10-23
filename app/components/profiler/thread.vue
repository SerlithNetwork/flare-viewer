<script setup lang="ts">

import type {AirplaneThreadNode} from "~/types/nodes";

const { mode, thread } = defineProps<{ mode: "cpu" | "memory", thread: AirplaneThreadNode }>();

function onClick() {}

</script>

<template>
<div @click="onClick()" class="bg-gray-800 border-b-gray-400">
  A
</div>
</template>

<style scoped>

</style>