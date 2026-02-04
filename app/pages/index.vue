<script setup lang="ts">

import type {ButtonProps} from "#ui/components/Button.vue";

const appConfig = useAppConfig()

const links = ref<ButtonProps[]>([
  {
    label: "Repository",
    to: appConfig.repository,
    icon: "i-lucide-github",
    target: "_blank",
  },
  {
    label: "Start Profiling",
    to: appConfig.flare,
    color: "neutral",
    variant: "subtle",
    trailingIcon: "i-lucide-arrow-right",
    target: "_blank",
  }
])

</script>

<template>
  <UPageHero
      title="Flare"
      orientation="horizontal"
      description="The Minecraft thread and allocation profiler revitalized"
      :links="links"
      reverse
  >
    <img src="~/assets/airplane.png" alt="airplane">
  </UPageHero>
</template>

<style scoped>

</style>