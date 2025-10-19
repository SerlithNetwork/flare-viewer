<script setup lang="ts">

const appConfig = useAppConfig()

useHead({
  title: appConfig.title
})

useSeoMeta({
  title: appConfig.title,
  description: appConfig.description,

  ogTitle: appConfig.title,
  ogDescription: appConfig.description,
  ogUrl: appConfig.url,
  ogImage: new URL(appConfig.image, appConfig.url).toString(),

  themeColor: appConfig.color,
})

</script>

<template>
  <div class="min-h-screen" style="background-color: var(--background-color)">
    <div class="flex flex-col grow">
      <WebsiteHeader/>
      <main>
        <NuxtPage/>
      </main>
      <WebsiteFooter/>
    </div>
  </div>
</template>
