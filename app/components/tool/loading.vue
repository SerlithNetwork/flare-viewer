<script setup lang="ts">

const { message } = defineProps(["message"]);

</script>

<template>
  <div class="flex flex-col gap-8 justify-center items-center min-h-[60vh]">
    <div class="w-24 h-24 rounded-full border-4 border-t-pink-400 border-r-pink-300 border-b-pink-100 border-l-transparent animate-spin"></div>
    <span class="text-white font-bold">{{ message }}</span>
  </div>
</template>

<style scoped>

</style>