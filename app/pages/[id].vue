<script setup lang="ts">

import {useProfilerScreenStore} from "~/store/profiler-screen-store";
import type {FlareProfile} from "~/types/profiler";
import {CreateProfile} from "~/proto/ProfileFile_pb";
import {b64UnzipBytes} from "~/util/binary-utils";

const route = useRoute()
const id = route.params.id

const config = useRuntimeConfig()
const screenStore = useProfilerScreenStore()
const { error, pending, data } = await useFetch<FlareProfile>(`${config.public.apiBackendUrl}/api/profiler/${id}`)

const profile = ref<CreateProfile | null>(null)
watch(data, (dataReady) => { // Maybe use onMounted ?
  if (dataReady) {
    profile.value = CreateProfile.fromBinary(b64UnzipBytes(dataReady.raw));
  }
}, { immediate: true })

</script>

<template>
  <div v-if="pending" class="flex flex-col items-center text-white">
    <ToolLoading message="Loading..." />
  </div>
  <div v-else-if="error" class="flex flex-col items-center text-white">
    Error: {{ error.message }}
  </div>
  <div v-else-if="profile" class="flex flex-col items-center text-white">
    <ProfilerCard v-if="screenStore.screen === 'profiler'" :flare="profile" class="animate-fade-left" />
    <ConfigCard v-if="screenStore.screen === 'config'" :configs="profile.configs" class="animate-fade-left" />
    <!-- WorldCard -->
    <SystemCard v-if="screenStore.screen === 'system'" :hwInfo="profile.hwinfo!" :os="profile.os!" :vmOptions="profile.vmoptions!" :v3="profile.v3!" class="animate-fade-left" />
  </div>
</template>

<style scoped>

</style>