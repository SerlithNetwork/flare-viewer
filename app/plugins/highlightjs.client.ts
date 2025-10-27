
import { defineNuxtPlugin } from '#app';
import hljs from 'highlight.js/lib/core';
import properties from 'highlight.js/lib/languages/properties';
import yaml from 'highlight.js/lib/languages/yaml';
import json from 'highlight.js/lib/languages/json';
import hljsVuePlugin from '@highlightjs/vue-plugin';

export default defineNuxtPlugin((nuxtApp) => {
    hljs.registerLanguage('properties', properties);
    hljs.registerLanguage('yaml', yaml);
    hljs.registerLanguage('json', json);
    nuxtApp.vueApp.use(hljsVuePlugin);
});
