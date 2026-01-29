<script setup lang="ts">

import {useProfilerScreenStore} from "~/store/profiler-screen-store";
import {useProfilerStatusStore} from "~/store/status-store";
import type {NavigationMenuItem} from "#ui/components/NavigationMenu.vue";

const appConfig = useAppConfig();
const screenStore = useProfilerScreenStore()
const statusStore = useProfilerStatusStore()

const items = computed<NavigationMenuItem[]>(() => [
  {
    label: 'Profiler',
    onSelect() {
      screenStore.setScreen('profiler')
    },
  },
  {
    label: 'Configurations',
    onSelect() {
      screenStore.setScreen('config')
    },
  },
  {
    label: 'Statistics',
    onSelect() {
      screenStore.setScreen('server')
    },
  },
  {
    label: 'System',
    onSelect() {
      screenStore.setScreen('system')
    },
  }
])

</script>

<template>
  <UHeader mode="slideover">
    <template #title>
      <div class="flex flex-row items-center gap-4">
        <img src="../../assets/airplane.png" alt="logo" width="60">
        <span class="text-2xl text-primary font-bold">Flare</span>
      </div>
    </template>

    <UNavigationMenu v-if="statusStore.status === 'ready'" :items="items" />

    <template #right>
      <UColorModeSwitch />
    </template>

    <template #body>
      <UNavigationMenu v-if="statusStore.status === 'ready'" :items="items" orientation="vertical" class="-mx-2.5" />
    </template>

  </UHeader>
</template>

<style scoped>

</style>