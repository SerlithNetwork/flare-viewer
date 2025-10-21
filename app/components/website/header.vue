<script setup lang="ts">

import {useProfilerScreenStore} from "~/store/profiler-screen-store";

const appConfig = useAppConfig();
const route = useRoute();
const screenStore = useProfilerScreenStore()

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
      <span @click="screenStore.setScreen('profiler')" :class="['cursor-pointer duration-200', screenStore.screen === 'profiler' ? 'text-pink-200' : 'hover:text-white']">
        Profiler
      </span>
      <span @click="screenStore.setScreen('config')" :class="['cursor-pointer duration-200', screenStore.screen === 'config' ? 'text-pink-200' : 'hover:text-white']">
        Configs
      </span>
      <span @click="screenStore.setScreen('server')" :class="['cursor-pointer duration-200', screenStore.screen === 'server' ? 'text-pink-200' : 'hover:text-white']">
        Server
      </span>
      <span @click="screenStore.setScreen('system')" :class="['cursor-pointer duration-200', screenStore.screen === 'system' ? 'text-pink-200' : 'hover:text-white']">
        System
      </span>
    </div>
  </div>
</header>
</template>

<style scoped>

</style>