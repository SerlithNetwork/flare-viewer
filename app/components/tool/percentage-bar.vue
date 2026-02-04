<script setup lang="ts">

const { percentage, loaded, rest } = defineProps<{ percentage: number, loaded: string, rest: string }>()

const percentageString = computed(() => `${percentage * 100}%`)
// const percentageStringTrimmed = computed(() => `${(percentage * 100).toFixed(2)}%`)

</script>

<template>
  <div :class="`h-4 w-full rounded-sm overflow-hidden ${rest}`">
    <div :class="`h-full transition-all duration-500 ${loaded}`" :style="{ width: percentageString }"></div>
  </div>
</template>

<style scoped>

</style>