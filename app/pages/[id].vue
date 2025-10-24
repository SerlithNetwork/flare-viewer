<script setup lang="ts">

import {useProfilerScreenStore} from "~/store/profiler-screen-store";
import type {FlareProfile} from "~/types/profiler";
import {CreateProfile, AirplaneProfileFile, TimelineFile} from "~/proto/ProfileFile_pb";
import {b64UnzipBytes} from "~/util/binary-utils";

const route = useRoute()
const id = route.params.id

const config = useRuntimeConfig()
const screenStore = useProfilerScreenStore()
const { error, data } = await useFetch<FlareProfile>(`${config.public.apiBackendUrl}/api/profiler/${id}`)

const status = ref<"pending" | "ready">("pending")
const profile = ref<CreateProfile | null>(null)
const dataSamples = ref<AirplaneProfileFile[] | null>(null)
const timelineSamples = ref<TimelineFile[] | null>(null)
watch(data, (dataReady) => {
  if (dataReady) {
    profile.value = CreateProfile.fromBinary(b64UnzipBytes(dataReady.raw));
    dataSamples.value = dataReady.dataSamples.map(i => AirplaneProfileFile.fromBinary(b64UnzipBytes(i)))
    timelineSamples.value = dataReady.dataSamples.map(i => TimelineFile.fromBinary(b64UnzipBytes(i)))
    status.value = "ready"
  }
}, { immediate: true })

</script>

<template>
  <div v-if="error" class="flex flex-col items-center text-white">
    Error: {{ error.message }}
  </div>
  <div v-else-if="status === 'pending'" class="flex flex-col items-center text-white">
    <ToolLoading message="Loading..." />
  </div>
  <div v-else-if="status === 'ready'" class="flex flex-col items-center text-white">
    <ProfilerCard v-if="screenStore.screen === 'profiler'" :dataSamples="dataSamples!" class="animate-fade-left" />
    <ConfigCard v-if="screenStore.screen === 'config'" :configs="profile!.configs" class="animate-fade-left" />
    <ServerCard v-if="screenStore.screen === 'server'" :timelineSamples="timelineSamples!" class="animate-fade-left" />
    <SystemCard v-if="screenStore.screen === 'system'" :hwInfo="profile!.hwinfo!" :os="profile!.os!" :vmOptions="profile!.vmoptions!" :v3="profile!.v3!" class="animate-fade-left" />
  </div>
</template>

<style scoped>

</style>