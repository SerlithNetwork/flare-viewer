<script setup lang="ts">
import type { ButtonProps } from "#ui/components/Button.vue";

const links = ref<ButtonProps[]>([
  {
    label: "My Profilers",
    to: "/profilers",
    icon: "i-lucide-plane",
    target: "_blank",
  },
  {
    label: "Documentation",
    to: "/docs",
    color: "neutral",
    variant: "subtle",
    trailingIcon: "i-lucide-arrow-right",
    target: "_blank",
  },
]);
</script>

<template>
  <div class="flex flex-col justify-center h-[80vh]">
    <UPageHero
      title="Flare"
      orientation="horizontal"
      description="The Minecraft thread and allocation profiler revitalized"
      :links="links"
      reverse
    >
      <img src="~/assets/airplane.png" alt="airplane" />
    </UPageHero>
  </div>
</template>

<style scoped></style>
