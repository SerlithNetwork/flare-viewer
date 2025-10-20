<script setup lang="ts">

import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {faDiscord, faGithub} from "@fortawesome/free-brands-svg-icons";

const appConfig = useAppConfig()
const year = ref("")

onMounted(() => {
  const date = new Date()
  year.value = date.getFullYear().toString()
})

</script>

<template>
<footer class="border-t animate-fade-up animate-once" style="background-color: var(--background-color); border-color: var(--border-color);">
  <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl mx-auto">
    <div class="text-slate-500 mb-4 sm:mb-0">
      <div class="mb-1">{{ appConfig.holder }}</div>
      <div class="text-sm">{{ year }}</div>
    </div>

    <!-- Probably add more socials later -->
    <div class="flex items-center justify-center text-2xl space-x-6 text-slate-400">
      <NuxtLink to="https://github.com/SerlithNetwork/flare-viewer" target="_blank" class="hover:text-white duration-500">
        <FontAwesomeIcon :icon="faGithub" />
      </NuxtLink>
      <NuxtLink to="https://discord.serlith.net" target="_blank" class="hover:text-white duration-500">
        <FontAwesomeIcon :icon="faDiscord" />
      </NuxtLink>
    </div>
  </div>
</footer>
</template>

<style scoped>

</style>