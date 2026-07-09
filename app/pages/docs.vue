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
        :initial="{ opacity: 0, transform: 'translateY(10px)' }"
        :while-in-view="{ opacity: 1, transform: 'translateY(0)' }"
        :transition="{ delay: 0.2 }"
        :in-view-options="{ once: true }"
      >
        <UPageCard
          title="Download the Plugin"
          description="Download the plugin from our repositories."
          to=""
          orientation="horizontal"
          variant="naked"
          :reverse="false"
          class="group"
          :ui="{
            wrapper: 'max-sm:order-last',
          }"
        >
          <img
            src="/assets/docs/picture_0.png"
            alt="Download the Plugin"
            class="object-cover w-full rounded-lg"
          />
        </UPageCard>
      </Motion>
      <Motion
          :initial="{ opacity: 0, transform: 'translateY(10px)' }"
          :while-in-view="{ opacity: 1, transform: 'translateY(0)' }"
          :transition="{ delay: 0.4 }"
          :in-view-options="{ once: true }"
      >
        <UPageCard
          title="Add the plugin to your server"
          description="Upload the plugin for your platform into your plugins folder"
          to=""
          orientation="horizontal"
          variant="naked"
          :reverse="true"
          class="group"
          :ui="{
          wrapper: 'max-sm:order-last',
          }"
        >
          <img
            src="/assets/docs/picture_1.png"
            alt="Add the plugin to your server"
            class="object-cover w-full rounded-lg"
          />
        </UPageCard>
      </Motion>
      <Motion
          :initial="{ opacity: 0, transform: 'translateY(10px)' }"
          :while-in-view="{ opacity: 1, transform: 'translateY(0)' }"
          :transition="{ delay: 0.6 }"
          :in-view-options="{ once: true }"
      >
        <UPageCard
            title="Link our instance"
            :description="`Open the config.yml file in Flare's configuration folder, add your token and set the url to our instance at ${url.protocol}//${url.host}`"
            to=""
            orientation="horizontal"
            variant="naked"
            :reverse="false"
            class="group"
            :ui="{
            wrapper: 'max-sm:order-last',
          }"
        >
          <img
              src="/assets/docs/picture_2.png"
              alt="Link our instance"
              class="object-cover w-full rounded-lg"
          />
        </UPageCard>
      </Motion>
      <Motion
          :initial="{ opacity: 0, transform: 'translateY(10px)' }"
          :while-in-view="{ opacity: 1, transform: 'translateY(0)' }"
          :transition="{ delay: 0.8 }"
          :in-view-options="{ once: true }"
      >
        <UPageCard
            title="Start Profiling"
            description="Reload the plugin and start profiling with /flare profiler start"
            to=""
            orientation="horizontal"
            variant="naked"
            :reverse="true"
            class="group"
            :ui="{
            wrapper: 'max-sm:order-last',
          }"
        >
          <img
              src="/assets/docs/picture_3.gif"
              alt="Start Profiling"
              class="object-cover w-full rounded-lg"
          />
        </UPageCard>
      </Motion>
    </UPageSection>
  </UPage>
</template>
