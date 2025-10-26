<script setup lang="ts">

import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {faDesktop, faGears, faMugHot, faServer, faTerminal} from "@fortawesome/free-solid-svg-icons";
import type {
  CreateProfile_HardwareInfo,
  CreateProfile_OperatingSystem, CreateProfile_V3,
  CreateProfile_VMOptions
} from "~/proto/ProfileFile_pb";

const { hwInfo, os, vmOptions, v3 } = defineProps<{ hwInfo: CreateProfile_HardwareInfo, os: CreateProfile_OperatingSystem, vmOptions: CreateProfile_VMOptions, v3: CreateProfile_V3 }>()

const flags = vmOptions.flags.join(" ")

</script>

<template>
  <div class="flex flex-col items-center min-h-6 min-w-[95%] m-8 max-w-sm p-6 gap-4">
    <div>
      <div class="flex flex-wrap items-start justify-center min-w-full">
        <div class="min-h-64 min-w-[40%] m-8 max-w-sm p-6 gap-4 rounded-lg shadow-sm" style="background-color: var(--surface-color)">
          <div class="flex flex-row gap-4 items-center text-2xl font-bold">
            <FontAwesomeIcon :icon="faGears" class="text-pink-400" />
            <span>Hardware</span>
          </div>
          <div class="flex flex-col gap-1 items-start mt-4">
            <div class="flex flex-row items-center gap-2">
              <span class="text-lg font-bold">CPU Brand:</span>
              <span class="text-gray-400">{{ hwInfo.cpu!.model }}</span>
            </div>
            <div class="flex flex-row items-center gap-2">
              <span class="text-lg font-bold">CPU Cores:</span>
              <span class="text-gray-400">{{ hwInfo.cpu!.coreCount }} ({{ hwInfo.cpu!.threadCount }} threads)</span>
            </div>
            <div class="flex flex-row items-center gap-2">
              <span class="text-lg font-bold">RAM Total:</span>
              <span class="text-gray-400">{{ Math.round(hwInfo.memory!.total / 10737418.24) / 100 }} GiB</span>
            </div>
            <div class="flex flex-row items-center gap-2">
              <span class="text-lg font-bold">SWAP Total:</span>
              <span class="text-gray-400">{{ Math.round(hwInfo.memory!.swapTotal / 10737418.24) / 100 }} GiB</span>
            </div>
            <div class="flex flex-row items-center gap-2">
              <span class="text-lg font-bold">Virtual Max:</span>
              <span class="text-gray-400">{{ Math.round(hwInfo.memory!.virtualMax / 10737418.24) / 100 }} GiB</span>
            </div>
          </div>
        </div>
        <div class="min-h-64 min-w-[40%] m-8 max-w-sm p-6 gap-4 rounded-lg shadow-sm" style="background-color: var(--surface-color)">
          <div class="flex flex-row gap-4 items-center text-2xl font-bold">
            <FontAwesomeIcon :icon="faDesktop" class="text-pink-400" />
            <span>Operating System</span>
          </div>
          <div class="flex flex-col gap-1 items-start mt-4">
            <div class="flex flex-row items-center gap-2">
              <span class="text-lg font-bold">OS:</span>
              <span class="text-gray-400">{{ os.family }}</span>
            </div>
            <div class="flex flex-row items-center gap-2">
              <span class="text-lg font-bold">Version:</span>
              <span class="text-gray-400">{{ os.version }}</span>
            </div>
            <div class="flex flex-row items-center gap-2">
              <span class="text-lg font-bold">Family:</span>
              <span class="text-gray-400">{{ os.manufacturer }}</span>
            </div>
            <div class="flex flex-row items-center gap-2">
              <span class="text-lg font-bold">Architecture:</span>
              <span class="text-gray-400">{{ os.bitness }} bits</span>
            </div>
          </div>
        </div>
        <div class="min-h-64 min-w-[40%] m-8 max-w-sm p-6 gap-4 rounded-lg shadow-sm" style="background-color: var(--surface-color)">
          <div class="flex flex-row gap-4 items-center text-2xl font-bold">
            <FontAwesomeIcon :icon="faMugHot" class="text-pink-400" />
            <span>Java</span>
          </div>
          <div class="flex flex-col gap-1 items-start mt-4">
            <div class="flex flex-row items-center gap-2">
              <span class="text-lg font-bold">Vendor:</span>
              <span class="text-gray-400">{{ vmOptions.vendor }}</span>
            </div>
            <div class="flex flex-row items-center gap-2">
              <span class="text-lg font-bold">Version:</span>
              <span class="text-gray-400">{{ vmOptions.version }}</span>
            </div>
            <div class="flex flex-row items-center gap-2">
              <span class="text-lg font-bold">Runtime:</span>
              <span class="text-gray-400">{{ vmOptions.runtimeName }} {{ vmOptions.runtimeVersion }}</span>
            </div>
            <div class="flex flex-row items-center gap-2">
              <span class="text-lg font-bold">JVM:</span>
              <span class="text-gray-400">{{ vmOptions.vm }}</span>
            </div>
          </div>
        </div>
        <div class="min-h-64 min-w-[40%] m-8 max-w-sm p-6 gap-4 rounded-lg shadow-sm" style="background-color: var(--surface-color)">
          <div class="flex flex-row gap-4 items-center text-2xl font-bold">
            <FontAwesomeIcon :icon="faServer" class="text-pink-400" />
            <span>Server</span>
          </div>
          <div class="flex flex-col gap-1 items-start mt-4">
            <div class="flex flex-row items-center gap-2">
              <span class="text-lg font-bold">Build:</span>
              <span class="text-gray-400">{{ v3.versions["Primary Version"] }}</span>
            </div>
            <div class="flex flex-row items-center gap-2">
              <span class="text-lg font-bold">API:</span>
              <span class="text-gray-400">{{ v3.versions["Bukkit Version"] }}</span>
            </div>
            <div class="flex flex-row items-center gap-2">
              <span class="text-lg font-bold">Version:</span>
              <span class="text-gray-400">{{ v3.versions["Minecraft Version"] }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex flex-col items-start min-h-6 min-w-[75%] mx-8 mb-16 max-w-sm p-6 gap-6 rounded-lg shadow-sm" style="background-color: var(--surface-color)">
      <div class="flex flex-row gap-4 items-center text-2xl font-bold">
        <FontAwesomeIcon :icon="faTerminal" class="text-pink-400" />
        <span>Flags</span>
      </div>
      <span class="text-gray-400">
      {{ flags }}
    </span>
    </div>
  </div>
</template>

<style scoped>

</style>