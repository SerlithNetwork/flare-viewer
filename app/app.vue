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
  <UApp>
    <WebsiteHeader />

    <UMain>
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </UMain>

    <WebsiteFooter />
  </UApp>
</template>
