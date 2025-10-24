// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/content', '@nuxt/image', '@nuxt/ui', '@pinia/nuxt'],
  css: ['~/assets/css/input.css'],
  runtimeConfig : {
    public: {
        apiBackendUrl: "https://jet.serlith.net",
        apiMappingsUrl: "https://spark-mappings.lucko.me",
    }
  },
  io: {
    sockets: [{
      name: "main",
      url: "https://jet-live.serlith.net",
    }]
  },

  nitro: {
    prerender: {
      routes:[ // TODO: Check why this doesn't work with highlight.js
        "/"
      ]
    }
  }
})