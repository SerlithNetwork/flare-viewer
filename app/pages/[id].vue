<script setup lang="ts">

import {useProfilerScreenStore} from "~/store/profiler-screen-store";
import type {FlareProfile} from "~/types/profiler";
import {CreateProfile, AirplaneProfileFile, TimelineFile} from "~/proto/ProfileFile_pb";
import {b64UnzipBytes} from "~/util/binary-utils";
import { io } from 'socket.io-client';
import {useProfilerStatusStore} from "~/store/status-store";


const appConfig = useAppConfig()
const route = useRoute()
const id = route.params.id
const config = useRuntimeConfig()
const screenStore = useProfilerScreenStore()
const statusStore = useProfilerStatusStore()

const profile = ref<CreateProfile | null>(null)
const dataSamples = ref<AirplaneProfileFile[] | null>([])
const timelineSamples = ref<TimelineFile[] | null>([])

async function fallbackToProfilerEnded() {

  const { error, data } = await useFetch<FlareProfile>(`${config.public.apiBackendUrl}/api/profiler/${id}`)

  if (error.value) {
    statusStore.status = "error"
  } else if (!data.value) {
    statusStore.status = "error"
  } else {
    profile.value = CreateProfile.fromBinary(b64UnzipBytes(data.value.raw));
    dataSamples.value = data.value.dataSamples.map(i => AirplaneProfileFile.fromBinary(b64UnzipBytes(i)))
    timelineSamples.value = data.value.timelineSamples.map(i => TimelineFile.fromBinary(b64UnzipBytes(i)))
    statusStore.status = "ready"
  }

}

onMounted(() => {
  const socketUri = new URL(config.public.wsBackendUrl)
  socketUri.searchParams.set("key", id!.toString())

  const socket = io(socketUri.toString(), {
    transports: ["websocket"],
    upgrade: false,
    reconnection: false,
    timeout: 10000,
  });

  socket.on("connect_error", () => {
    socket.disconnect();
    console.log("Profiler probably done, attempting to fetch via REST")
    fallbackToProfilerEnded();
  });

  socket.once("airplane_profiler", async (profiler: { payload: string }) => {
    profile.value = CreateProfile.fromBinary(b64UnzipBytes(profiler.payload));
    statusStore.status = "ready"
  })

  socket.on("airplane_data", async (data: { payload: string }) => {
    if (dataSamples.value === null) {
      dataSamples.value = []
    }
    dataSamples.value = dataSamples.value.concat(AirplaneProfileFile.fromBinary(b64UnzipBytes(data.payload)));
  })

  socket.on("airplane_timeline", async (timeline: { payload: string }) => {
    if (timelineSamples.value === null) {
      timelineSamples.value = []
    }
    timelineSamples.value = timelineSamples.value.concat(TimelineFile.fromBinary(b64UnzipBytes(timeline.payload)));
  })

})



useSeoMeta({
  title: `${appConfig.title} - ${id}`,
  description: appConfig.description,

  ogTitle: `${appConfig.title} - ${id}`,
  ogDescription: appConfig.description,
  ogUrl: new URL(`/${id}`, appConfig.url).toString(),
  ogImage: new URL(`/api/thumbnail/${id}.png`, appConfig.url).toString(),
  twitterImage: new URL(`/api/thumbnail/${id}.png`, appConfig.url).toString(),

  themeColor: appConfig.color,
})

</script>

<template>
  <div v-if="statusStore.status === 'error'" class="flex flex-col items-center text-white">
    <WebsiteNotFound />
  </div>
  <div v-else-if="statusStore.status === 'loading'" class="flex flex-col items-center text-white">
    <ToolLoading message="Loading..." />
  </div>
  <div v-else-if="statusStore.status === 'ready'" class="flex flex-col items-center text-white">
    <ProfilerCard v-if="screenStore.screen === 'profiler'" :dataSamples="dataSamples!" class="animate-fade-left" />
    <ConfigCard v-if="screenStore.screen === 'config'" :configs="profile!.configs" class="animate-fade-left" />
    <ServerCard v-if="screenStore.screen === 'server'" :timelineSamples="timelineSamples!" class="animate-fade-left" />
    <SystemCard v-if="screenStore.screen === 'system'" :hwInfo="profile!.hwinfo!" :os="profile!.os!" :vmOptions="profile!.vmoptions!" :v3="profile!.v3!" class="animate-fade-left" />
  </div>
</template>

<style scoped>

</style>