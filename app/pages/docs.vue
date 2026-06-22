<script setup lang="ts">
import type { ButtonProps } from "@nuxt/ui";

const url = useRequestURL();

const links = ref<ButtonProps[]>([
  {
    label: "Plugin",
    to: "https://github.com/SerlithNetwork/FlarePlatform",
    target: "_blank",
    icon: "i-lucide-plug",
  },
  {
    label: "Puffernot",
    to: "https://github.com/SerlithNetwork/Puffernot",
    target: "_blank",
    icon: "i-lucide-server",
  },
  {
    label: "Pufferfish",
    to: "https://pufferfish.host/downloads",
    target: "_blank",
    icon: "i-lucide-server",
  },
]);

const steps = [
  {
    title: "Download the Plugin",
    description:
      "Download the plugin and place it in your /plugins folder. Then restart your server.",
    image:
      "https://ui.nuxt.com/_ipx/s_654x368/assets/templates/nuxt/chat-dark.png", // FIXME: Placeholder
  },
  {
    title: "Link our instance",
    description: `Open the config.yml file in Flare's configuration folder and set the url to our instance at ${url.protocol}//${url.host}`,
    image:
      "https://ui.nuxt.com/_ipx/s_654x368/assets/templates/nuxt/chat-dark.png", // FIXME: Placeholder
  },
  {
    title: "Add your credentials",
    description:
      "In the same config.yml file, set your credentials provided by this instance's manager.",
    image:
      "https://ui.nuxt.com/_ipx/s_654x368/assets/templates/nuxt/chat-dark.png", // FIXME: Placeholder
  },
  {
    title: "Start Profiling",
    description:
      "Reload the plugin and start profiling with /flare profiler start",
    image:
      "https://ui.nuxt.com/_ipx/s_654x368/assets/templates/nuxt/chat-dark.png", // FIXME: Placeholder
  },
];
</script>

<template>
  <UPage>
    <UPageHero
      title="Installation"
      description="You can get Flare via the plugin or running a supported platform."
      :links="links"
      :ui="{
        title: 'mx-0! text-left',
        description: 'mx-0! text-left',
        links: 'justify-start',
      }"
    />
    <UPageSection
      :ui="{
        container: 'pt-0!',
      }"
    >
      <Motion
        v-for="(step, index) in steps"
        :key="step.title"
        :initial="{ opacity: 0, transform: 'translateY(10px)' }"
        :while-in-view="{ opacity: 1, transform: 'translateY(0)' }"
        :transition="{ delay: 0.2 * index }"
        :in-view-options="{ once: true }"
      >
        <UPageCard
          :title="step.title"
          :description="step.description"
          to=""
          orientation="horizontal"
          variant="naked"
          :reverse="index % 2 === 1"
          class="group"
          :ui="{
            wrapper: 'max-sm:order-last',
          }"
        >
          <img
            :src="step.image"
            :alt="step.title"
            class="object-cover w-full rounded-lg"
          />
        </UPageCard>
      </Motion>
    </UPageSection>
  </UPage>
</template>
