<script setup lang="ts">

import 'highlight.js/styles/nord.css';
import {type CreateProfile_ConfigurationFile} from "~/proto/ProfileFile_pb";

const { configs } = defineProps<{ configs: CreateProfile_ConfigurationFile[] }>()
const configMap = computed(() => new Map(configs.map(config => [config.filename, config.contents])))
const selectedConfig = ref("server.properties")

</script>

<template>
  <UCard class="flex flex-col items-center min-h-6 min-w-[90%] m-8 max-w-sm shadow-sm" >
    <div class="flex flex-col w-full gap-4">
      <div class="flex flex-row flex-wrap-reverse justify-items-start items-center w-full gap-2">
        <UButton v-for="filename in configMap.keys()" icon="i-lucide-file-cog" size="xl" color="primary" class="font-bold text-lg" @click="selectedConfig = filename" :variant="selectedConfig === filename ? 'solid' : 'outline'" >{{ filename }}</UButton>
      </div>
      <UCard class="w-full">
        <highlightjs class="text-wrap w-full" :code="configMap.get(selectedConfig)" :autodetect="true" />
      </UCard>
    </div>
  </UCard>
</template>

<style scoped>

</style>