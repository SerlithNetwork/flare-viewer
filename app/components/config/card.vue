<script setup lang="ts">

import 'highlight.js/styles/nord.css';
import {type CreateProfile_ConfigurationFile} from "~/proto/ProfileFile_pb";
import type {TabsItem} from "#ui/components/Tabs.vue";

const { configs } = defineProps<{ configs: CreateProfile_ConfigurationFile[] }>()
const configMap = computed(() => new Map(configs.map(config => [config.filename, config.contents])))


const selectedConfig = ref(configs[0]!.filename)
const selectedContent = ref(configs[0]!.contents)
const items = computed<TabsItem[]>(() => configs.map(config => ({
  label: config.filename,
  icon: "i-lucide-file-cog",
  value: config.filename,
})))


const selected = computed<string>({
  get() {
    return selectedConfig.value
  },
  set(value) {
    selectedContent.value = configMap.value.get(value)!
    selectedConfig.value = value
  },
})

</script>

<template>
  <div class="flex flex-col items-center min-h-6 w-[90%] m-8" >
    <div class="flex flex-col w-full gap-4">
      <div class="flex justify-start items-center w-full">
        <UScrollArea orientation="horizontal">
          <UTabs :items="items" v-model="selected" variant="link" />
        </UScrollArea>
      </div>
      <UCard class="w-full">
        <highlightjs class="text-wrap w-full" :code="selectedContent" :autodetect="true" />
      </UCard>
    </div>
  </div>
</template>

<style scoped>

::-webkit-scrollbar-track {
  border-radius: 4px;
  background-color: var(--ui-bg-accented);
}

::-webkit-scrollbar {
  height: 8px;
  background-color: transparent;
}

::-webkit-scrollbar-thumb {
  border-radius: 4px;
  background-color: var(--ui-bg-muted);
}

::-webkit-scrollbar-corner {
  display: none;
}

</style>