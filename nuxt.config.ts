// https://nuxt.com/docs/api/configuration/nuxt-config

const apiBackendUrl = "https://jet.serlith.net"
const wsBackendUrl = "https://jet-live.serlith.net"
const apiMappingsUrl = "https://spark-mappings.lucko.me"

export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    devtools: { enabled: true },
    modules: ['@nuxt/content', '@nuxt/image', '@nuxt/ui', '@pinia/nuxt', 'nuxt-charts'],
    css: ['~/assets/css/input.css'],
    runtimeConfig : {
        public: {
            apiBackendUrl,
            wsBackendUrl,
            apiMappingsUrl,
        }
    },

    nitro: {
        prerender: {
            routes:[
                "/"
            ]
        },
        routeRules: {
            "/create" : { proxy: `${apiBackendUrl}/create` },
            "/license" : { proxy: `${apiBackendUrl}/license` },
            "/:id/:key" : { proxy: `${apiBackendUrl}/**` },
            "/:id/:key/timeline" : { proxy: `${apiBackendUrl}/**` },
        }
    }
})