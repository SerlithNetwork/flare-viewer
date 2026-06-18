<script setup lang="ts">
import type { NavigationMenuItem } from "#ui/components/NavigationMenu.vue";

const appConfig = useAppConfig();
const year = ref("");

onMounted(() => {
  const date = new Date();
  year.value = date.getFullYear().toString();
});

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
];
</script>

<template>
  <USeparator icon="i-lucide-plane" />
  <UFooter>
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

<style scoped></style>
