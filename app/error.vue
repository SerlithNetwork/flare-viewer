<script setup lang="ts">

const error = {
  statusCode: 404,
  statusMessage: "Not Found",
  message: "This page does not exist"
}

</script>

<template>
  <div>
    <UError :error="error" />
  </div>
</template>

<style scoped>

</style>