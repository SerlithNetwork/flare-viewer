<script setup lang="ts">

const error = {
  statusMessage: "Not Found",
  message: "Maybe this profiler already expired?"
}

</script>

<template>
  <UError :error="error" />
</template>

<style scoped>

</style>