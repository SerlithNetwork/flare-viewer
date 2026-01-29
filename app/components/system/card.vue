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
        <UCard class="min-h-64 min-w-[40%] m-8 p-6" >
          <div class="min-h-64 w-full gap-4 rounded-lg">
            <div class="flex flex-row gap-4 items-center text-2xl font-bold">
              <FontAwesomeIcon :icon="faGears" class="text-primary" />
              <span class="text-default">Hardware</span>
            </div>
            <div class="flex flex-col gap-1 items-start mt-4">
              <div class="flex flex-row items-center gap-2">
                <span class="text-default text-lg font-bold">CPU Brand:</span>
                <span class="text-dimmed">{{ hwInfo.cpu!.model }}</span>
              </div>
              <div class="flex flex-row items-center gap-2">
                <span class="text-default text-lg font-bold">CPU Cores:</span>
                <span class="text-dimmed">{{ hwInfo.cpu!.coreCount }} ({{ hwInfo.cpu!.threadCount }} threads)</span>
              </div>
              <div class="flex flex-row items-center gap-2">
                <span class="text-default text-lg font-bold">RAM Total:</span>
                <span class="text-dimmed">{{ Math.round(hwInfo.memory!.total / 10737418.24) / 100 }} GiB</span>
              </div>
              <div class="flex flex-row items-center gap-2">
                <span class="text-default text-lg font-bold">SWAP Total:</span>
                <span class="text-dimmed">{{ Math.round(hwInfo.memory!.swapTotal / 10737418.24) / 100 }} GiB</span>
              </div>
              <div class="flex flex-row items-center gap-2">
                <span class="text-default text-lg font-bold">Virtual Max:</span>
                <span class="text-dimmed">{{ Math.round(hwInfo.memory!.virtualMax / 10737418.24) / 100 }} GiB</span>
              </div>
            </div>
          </div>
        </UCard>
        <UCard class="min-h-64 min-w-[40%] m-8 p-6" >
          <div class="min-h-64 w-full gap-4 rounded-lg">
            <div class="flex flex-row gap-4 items-center text-2xl font-bold">
              <FontAwesomeIcon :icon="faDesktop" class="text-primary" />
              <span class="text-default">Operating System</span>
            </div>
            <div class="flex flex-col gap-1 items-start mt-4">
              <div class="flex flex-row items-center gap-2">
                <span class="text-default text-lg font-bold">OS:</span>
                <span class="text-dimmed">{{ os.family }}</span>
              </div>
              <div class="flex flex-row items-center gap-2">
                <span class="text-default text-lg font-bold">Version:</span>
                <span class="text-dimmed">{{ os.version }}</span>
              </div>
              <div class="flex flex-row items-center gap-2">
                <span class="text-default text-lg font-bold">Family:</span>
                <span class="text-dimmed">{{ os.manufacturer }}</span>
              </div>
              <div class="flex flex-row items-center gap-2">
                <span class="text-default text-lg font-bold">Architecture:</span>
                <span class="text-dimmed">{{ os.bitness }} bits</span>
              </div>
            </div>
          </div>
        </UCard>
        <UCard class="min-h-64 min-w-[40%] m-8 p-6" >
          <div class="min-h-64 w-full gap-4 rounded-lg">
            <div class="flex flex-row gap-4 items-center text-2xl font-bold">
              <FontAwesomeIcon :icon="faMugHot" class="text-primary" />
              <span class="text-default">Java</span>
            </div>
            <div class="flex flex-col gap-1 items-start mt-4">
              <div class="flex flex-row items-center gap-2">
                <span class="text-default text-lg font-bold">Vendor:</span>
                <span class="text-dimmed">{{ vmOptions.vendor }}</span>
              </div>
              <div class="flex flex-row items-center gap-2">
                <span class="text-default text-lg font-bold">Version:</span>
                <span class="text-dimmed">{{ vmOptions.version }}</span>
              </div>
              <div class="flex flex-row items-center gap-2">
                <span class="text-default text-lg font-bold">Runtime:</span>
                <span class="text-dimmed">{{ vmOptions.runtimeName }} {{ vmOptions.runtimeVersion }}</span>
              </div>
              <div class="flex flex-row items-center gap-2">
                <span class="text-default text-lg font-bold">JVM:</span>
                <span class="text-dimmed">{{ vmOptions.vm }}</span>
              </div>
            </div>
          </div>
        </UCard>
        <UCard class="min-h-64 min-w-[40%] m-8 p-6" >
          <div class="min-h-64 w-full gap-4 rounded-lg">
            <div class="flex flex-row gap-4 items-center text-2xl font-bold">
              <FontAwesomeIcon :icon="faServer" class="text-primary" />
              <span class="text-default">Server</span>
            </div>
            <div class="flex flex-col gap-1 items-start mt-4">
              <div class="flex flex-row items-center gap-2">
                <span class="text-default text-lg font-bold">Build:</span>
                <span class="text-dimmed">{{ v3.versions["Primary Version"] }}</span>
              </div>
              <div class="flex flex-row items-center gap-2">
                <span class="text-default text-lg font-bold">API:</span>
                <span class="text-dimmed">{{ v3.versions["Bukkit Version"] }}</span>
              </div>
              <div class="flex flex-row items-center gap-2">
                <span class="text-default text-lg font-bold">Version:</span>
                <span class="text-dimmed">{{ v3.versions["Minecraft Version"] }}</span>
              </div>
            </div>
          </div>
        </UCard>
      </div>
    </div>
    <UCard class="min-h-64 w-fit m-8 p-6" >
      <div class="flex flex-col w-full gap-4 rounded-lg">
        <div class="flex flex-row gap-4 items-center text-2xl font-bold">
          <FontAwesomeIcon :icon="faTerminal" class="text-primary" />
          <span class="text-default">Flags</span>
        </div>
        <span class="text-dimmed text-wrap">{{ flags }}</span>
      </div>
    </UCard>
  </div>
</template>

<style scoped>

</style>