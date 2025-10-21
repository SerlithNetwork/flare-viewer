// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/content', '@nuxt/image', '@nuxt/ui', '@pinia/nuxt'],
  css: ['~/assets/css/input.css'],
  runtimeConfig : {
    public: {
        apiBackendUrl: "http://192.168.18.132:25633", // "https://jet.serlith.net",
        apiMappingsUrl: "https://spark-mappings.lucko.me",
    }
  }
})