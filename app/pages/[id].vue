<script setup lang="ts">

import {useProfilerScreenStore} from "~/store/profiler-screen-store";
import {CreateProfile, AirplaneProfileFile, TimelineFile, type MethodDictionarySlice} from "~/proto/ProfileFile_pb";
import {b64UnzipBytes} from "~/util/binary-utils";
import {useProfilerStatusStore} from "~/store/status-store";
import {mergeAirplaneSample} from "~/util/merge-utils";
import type {ThreadAccumulator} from "~/types/protos";


const appConfig = useAppConfig()
const route = useRoute()
const id = route.params.id
const config = useRuntimeConfig()
const screenStore = useProfilerScreenStore()
const statusStore = useProfilerStatusStore()

const profile = ref<CreateProfile | undefined>(undefined)
const timelineSamples = ref<TimelineFile[]>([])

const dictionary = ref<MethodDictionarySlice[]>([])
const timeThreads = ref(new Map<string, ThreadAccumulator>)
const memoryThreads = ref(new Map<string, ThreadAccumulator>)
const plugins = ref(new Set<string>())

const dataSource = ref<EventSource | undefined>(undefined)
const timelineSource = ref<EventSource | undefined>(undefined)

const { data, error } = useFetch<string>(`${config.public.apiBackendUrl}/api/profiler/${id}`, {
  method: "get",
})

onMounted(() => {
  watchEffect(async () => {

    if (error.value) {
      statusStore.status = "error"
    }

    if (data.value) {
      profile.value = CreateProfile.fromBinary(b64UnzipBytes(data.value))

      dataSource.value = new EventSource(`${config.public.apiBackendUrl}/api/stream/data/${id}`)
      dataSource.value.onmessage = (event: MessageEvent<string>) => {
        const sample = AirplaneProfileFile.fromBinary(b64UnzipBytes(event.data))
        mergeAirplaneSample({ threads: sample.v2!.timeProfile, type: "time" }, timeThreads.value, plugins.value)
        mergeAirplaneSample({ threads: sample.v2!.memoryProfile, type: "memory" }, memoryThreads.value, plugins.value)
        if (sample.v2!.dictionary) {
          dictionary.value.push(sample.v2!.dictionary)
        }
      }
      dataSource.value.addEventListener("flare$terminated", () => {
        dataSource.value?.close()
      })

      timelineSource.value = new EventSource(`${config.public.apiBackendUrl}/api/stream/timeline/${id}`)
      timelineSource.value.onmessage = (event: MessageEvent<string>) => {
        timelineSamples.value = timelineSamples.value.concat(TimelineFile.fromBinary(b64UnzipBytes(event.data)))
      }
      timelineSource.value.addEventListener("flare$terminated", () => {
        timelineSource.value?.close()
      })

      statusStore.status = "ready"
    }

  })
})


onUnmounted(() => {
  dataSource.value?.close()
  timelineSource.value?.close()
})


useSeoMeta({
  title: `${appConfig.title} - ${id}`,
  description: appConfig.description,

  ogTitle: `${appConfig.title} - ${id}`,
  ogDescription: appConfig.description,
  ogUrl: new URL(`/${id}`, appConfig.url).toString(),
  ogImage: new URL(`/api/thumbnail/${id}.png`, appConfig.url).toString(),

  twitterTitle: `${appConfig.title} - ${id}`,
  twitterDescription: appConfig.description,
  twitterImage: new URL(`/api/thumbnail/${id}.png`, appConfig.url).toString(),
  twitterCard: "summary_large_image",

  themeColor: appConfig.color,
})

</script>

<template>
  <div v-if="statusStore.status === 'error'" class="flex flex-col items-center text-default">
    <WebsiteNotFound />
  </div>
  <div v-else-if="statusStore.status === 'loading'" class="flex flex-col items-center text-default">
    <ToolLoading message="Loading..." />
  </div>
  <div v-else-if="statusStore.status === 'ready'" class="flex flex-col items-center text-default">
    <ProfilerCard v-if="screenStore.screen === 'profiler'" :time-threads="timeThreads" :memory-threads="memoryThreads" :dictionary-slices="dictionary" :plugins="plugins" class="animate-fade-left" />
    <ConfigCard v-if="screenStore.screen === 'config'" :configs="profile!.configs" class="animate-fade-left" />
    <ServerCard v-if="screenStore.screen === 'server'" :timelineSamples="timelineSamples" class="animate-fade-left" />
    <SystemCard v-if="screenStore.screen === 'system'" :hwInfo="profile!.hwinfo!" :os="profile!.os!" :vmOptions="profile!.vmoptions!" :v3="profile!.v3!" class="animate-fade-left" />
  </div>
</template>

<style scoped>

</style>