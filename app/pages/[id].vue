<script setup lang="ts">

import {useProfilerScreenStore} from "~/store/profiler-screen-store";
import type {FlareProfile} from "~/types/profiler";
import {CreateProfile, AirplaneProfileFile, TimelineFile} from "~/proto/ProfileFile_pb";
import {b64UnzipBytes, binaryUnzipBytes} from "~/util/binary-utils";
import { io } from 'socket.io-client';


const route = useRoute()
const id = route.params.id
const config = useRuntimeConfig()
const screenStore = useProfilerScreenStore()

const status = ref<"pending" | "ready" | "error">("pending")
const profile = ref<CreateProfile | null>(null)
const dataSamples = ref<AirplaneProfileFile[] | null>(null)
const timelineSamples = ref<TimelineFile[] | null>(null)

async function fallbackToProfilerEnded() {

  const { error, data } = await useFetch<FlareProfile>(`${config.public.apiBackendUrl}/api/profiler/${id}`)

  if (error.value) {
    status.value = "error"
  } else if (!data.value) {
    status.value = "error"
  } else {
    profile.value = CreateProfile.fromBinary(b64UnzipBytes(data.value.raw));
    dataSamples.value = data.value.dataSamples.map(i => AirplaneProfileFile.fromBinary(b64UnzipBytes(i)))
    timelineSamples.value = data.value.dataSamples.map(i => TimelineFile.fromBinary(b64UnzipBytes(i)))
    status.value = "ready"
  }

}

onMounted(() => {
  const socketUri = new URL(config.public.wsBackendUrl)
  socketUri.searchParams.set("key", id!.toString())

  const socket = io(socketUri.toString(), {
    reconnection: false,
  });

  socket.on("connect", () => {
    console.log("Connected to websocket")
  });

  socket.on("disconnect", () => {
    console.log("Disconnected from websocket")
  });

  socket.on("connect_error", () => {
    socket.disconnect();
    console.log("Profiler probably done, attempting to fetch via REST")
    fallbackToProfilerEnded();
  });

  socket.on("airplane_profiler", async (profiler: ArrayBuffer | Blob) => {
    const unzipped = await binaryUnzipBytes(profiler)
    profile.value = CreateProfile.fromBinary(unzipped)
  })

  socket.on("airplane_data", async (data: ArrayBuffer | Blob) => {
    const unzipped = await binaryUnzipBytes(data)
    if (dataSamples.value === null) {
      dataSamples.value = []
    }
    dataSamples.value = dataSamples.value.concat(AirplaneProfileFile.fromBinary(unzipped))
  })

  socket.on("airplane_timeline", async (timeline: ArrayBuffer | Blob) => {
    const unzipped = await binaryUnzipBytes(timeline)
    if (timelineSamples.value === null) {
      timelineSamples.value = []
    }
    timelineSamples.value = timelineSamples.value.concat(TimelineFile.fromBinary(unzipped))
  })

})

</script>

<template>
  <div v-if="status === 'error'" class="flex flex-col items-center text-white">
    Error: Test
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