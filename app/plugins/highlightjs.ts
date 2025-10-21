
import { defineNuxtPlugin } from '#app';
import hljsVuePlugin from '@highlightjs/vue-plugin';

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(hljsVuePlugin);
});
