<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";
import { useAuthenticationStore } from "~/store/auth-store";
import useAuthenticationRefresh from "~/composables/use-authentication-refresh";

const backend = useBackend();
const authStore = useAuthenticationStore();
const { refresh } = useAuthenticationRefresh();
const { data, status } = backend.fetchSelfManager();

const interval = ref(0);
watch(status, (newStatus) => {
  // Fetch user
  if (newStatus === "success") {
    authStore.setUser(data.value!);
  } else {
    authStore.invalidateTokens();
  }

  interval.value = setInterval(
    () => {
      refresh();
      console.log("Performed a refresh");
    },
    45 * 64 * 1000,
  );
});

onUnmounted(() => {
  clearInterval(interval.value);
});

const items: NavigationMenuItem[][] = [
  [
    {
      label: "Statistics",
      icon: "i-lucide-chart-spline",
      to: "/panel",
    },
    {
      label: "Users",
      icon: "i-lucide-users",
      defaultOpen: true,
      children: [
        {
          label: "User",
          icon: "i-lucide-user",
          to: "/panel/user",
        },
        {
          label: "Manager",
          icon: "i-lucide-shield-user",
          to: "/panel/manager",
        },
      ],
    },
  ],
];
</script>

<template>
  <UDashboardGroup class="mt-(--ui-header-height)">
    <UDashboardSidebar
      collapsible
      resizable
      :min-size="15"
      :default-size="15"
      :max-size="20"
      :ui="{ footer: 'border-t border-default' }"
    >
      <template #default="{ collapsed }">
        <UNavigationMenu
          :collapsed="collapsed"
          :items="items[0]"
          orientation="vertical"
        />

        <UNavigationMenu
          :collapsed="collapsed"
          :items="items[1]"
          orientation="vertical"
          class="mt-auto"
        />
      </template>

      <template #footer="{ collapsed }">
        <UButton
          :label="collapsed ? undefined : authStore.user?.username"
          color="neutral"
          variant="ghost"
          class="w-full"
          :block="collapsed"
        />
      </template>
    </UDashboardSidebar>

    <div class="w-full">
      <slot />
    </div>
  </UDashboardGroup>
</template>
