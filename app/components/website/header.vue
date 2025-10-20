<script setup lang="ts">

const appConfig = useAppConfig();
const route = useRoute();

</script>

<template>
<header class="border-b animate-fade-down animate-once" style="background-color: var(--background-color); border-color: var(--border-color);">
  <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl mx-auto">
    <div class="flex flex-row gap-2 text-pink-300 sm:mb-0 text-2xl font-bold">
      <img src="../../assets/airplane.png" alt="airplane" width="60">
      <div>{{ appConfig.title }}</div>
    </div>

    <div v-if="route.path !== '/'" class="flex items-center justify-center text-lg underline space-x-6 text-gray-400">
      <!-- Add buttons -->
      <span class="cursor-pointer hover:text-white duration-200">Profiler</span>
      <span class="cursor-pointer hover:text-white duration-200">Configs</span>
      <span class="cursor-pointer hover:text-white duration-200">World</span>
      <span class="cursor-pointer hover:text-white duration-200">System</span>
    </div>
  </div>
</header>
</template>

<style scoped>

</style>