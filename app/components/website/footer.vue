<script setup lang="ts">

import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {faDiscord, faGithub} from "@fortawesome/free-brands-svg-icons";
import type {NavigationMenuItem} from "#ui/components/NavigationMenu.vue";

const appConfig = useAppConfig()
const year = ref("")

onMounted(() => {
  const date = new Date()
  year.value = date.getFullYear().toString()
})

const items: NavigationMenuItem[] = [
  {
    icon: "i-simple-icons-discord",
    to: appConfig.discord,
    target: "_blank",
  },
  {
    icon: "i-simple-icons-github",
    to: appConfig.repository,
    target: "_blank",
  },
  {
    icon: "i-lucide-newspaper",
    to: appConfig.blog,
    target: "_blank",
  },
]

</script>

<template>
  <UFooter class="border-t border-default">
    <template #left>
      <div class="text-slate-500 mb-4 sm:mb-0">
        <div class="mb-1">{{ appConfig.holder }}</div>
        <div class="text-sm">{{ year }}</div>
      </div>
    </template>

    <template #right>
      <UNavigationMenu :items="items" variant="link" />
    </template>
  </UFooter>
</template>

<style scoped>

</style>