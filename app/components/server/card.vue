<script setup lang="ts">

import {TimelineFile} from "~/proto/ProfileFile_pb";

const { timelineSamples } = defineProps<{ timelineSamples: TimelineFile[] }>()

</script>

<template>
  <div>
    {{ timelineSamples }}
  </div>
</template>

<style scoped>

</style>