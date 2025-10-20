<script setup lang="ts">
import {initFlowbite} from "flowbite";
import {useFlowbite} from "~/composables/useFlowbite";

const { id, title, items } = defineProps(["id", "title", "items"]);

onMounted(() => {
  useFlowbite(() => {
    initFlowbite();
  })
})

</script>

<template>
  <button :id="id" :data-dropdown-toggle="'dropdown-' + id" class="text-white bg-gray-700 hover:bg-gray-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center duration-200" type="button">
    {{ title }}
    <svg class="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
    </svg>
  </button>

  <!-- Dropdown menu -->
  <div :id="'dropdown-' + id" class="z-10 hidden bg-gray-600 divide-y divide-gray-100 rounded-lg shadow-sm w-44">
    <ul class="py-2 text-sm text-gray-600 dark:text-gray-200 animate-fade-down animate-once animate-duration-[150ms]" :aria-labelledby="id">
      <li v-for="item in items" :key="item.id">
        <span class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-500 dark:hover:text-white">{{ item.name }}</span>
      </li>
    </ul>
  </div>
</template>

<style scoped>

</style>