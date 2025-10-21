<script setup lang="ts">

import type {FlareProfile} from "~/types/profiler";

import 'highlight.js/styles/nord.css';
import hljs from 'highlight.js/lib/core';
import properties from 'highlight.js/lib/languages/properties';
import yaml from 'highlight.js/lib/languages/yaml';
import json from 'highlight.js/lib/languages/json';

hljs.registerLanguage('properties', properties);
hljs.registerLanguage('yaml', yaml);
hljs.registerLanguage('json', json);

const { flare } = defineProps<{ flare: FlareProfile }>()

const configs = new Map(flare.profile.configs.map(config => [config.filename, config.contents]))
const selectedConfig = ref("server.properties")

</script>

<template>
  <div class="flex flex-col items-center min-h-6 min-w-[75%] m-8 max-w-sm p-6 gap-6 rounded-lg shadow-sm" style="background-color: var(--surface-color)">
    <div class="flex flex-row flex-wrap-reverse justify-items-start items-center w-full px-8">
      <button v-for="filename in configs.keys()" :key="filename" @click="selectedConfig = filename" class="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-white text-sm font-medium rounded-full group bg-gradient-to-br from-pink-400 to-purple-500 group-hover:from-pink-400 group-hover:to-purple-500">
        <span :class="['relative px-5 py-2.5 transition-all ease-in duration-150 rounded-full group-hover:opacity-50 group-hover:dark:opacity-50', (selectedConfig === filename ? '' : 'bg-gray-900')]">
        {{ filename }}
        </span>
      </button>
    </div>
    <div class="flex flex-col items-center w-full">
      <highlightjs class="text-wrap w-full" :code="configs.get(selectedConfig)" autodetect="true" />
    </div>
  </div>
</template>

<style scoped>

</style>