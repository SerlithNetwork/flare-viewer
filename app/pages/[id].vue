<script setup lang="ts">

import {useProfilerScreenStore} from "~/store/profiler-screen-store";
import type {FlareProfile} from "~/types/profiler";

const route = useRoute()
const id = route.params.id

const config = useRuntimeConfig()
const screenStore = useProfilerScreenStore()
const { error, pending, data } = await useFetch<FlareProfile>(`${config.public.apiBackendUrl}/api/profile/${id}`)

</script>

<template>
  <div v-if="pending" class="flex flex-col items-center text-white">
    <ToolLoading message="Loading..." />
  </div>
  <div v-else-if="error" class="flex flex-col items-center text-white">
    Error: {{ error.message }}
  </div>
  <div v-else-if="data" class="flex flex-col items-center text-white">
    <ProfilerCard v-if="screenStore.screen === 'profiler'" :flare="data" class="animate-fade-left" />
    <ConfigCard v-if="screenStore.screen === 'config'" :flare="data" class="animate-fade-left" />
    <!-- WorldCard -->
    <SystemCard v-if="screenStore.screen === 'system'" :flare="data" class="animate-fade-left" />
  </div>
</template>

<style scoped>

</style>