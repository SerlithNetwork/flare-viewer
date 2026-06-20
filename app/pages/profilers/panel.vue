<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import type { FlareProfileData$View } from "~/types/profiling";

const backend = useBackend();

const { data, status, refresh } = backend.fetchProfilerSummaries();

const columns: TableColumn<FlareProfileData$View>[] = [
  {
    accessorKey: "key",
    header: "Key",
  },
  {
    accessorKey: "server_brand",
    header: "Server",
  },
  {
    accessorKey: "server_version",
    header: "Version",
  },
  {
    accessorKey: "os_family",
    header: "Operating System",
  },
  {
    accessorKey: "jvm_vendor",
    header: "JVM Implementation",
  },
  {
    accessorKey: "created_at",
    header: "Created at",
    cell: ({ row }) => {
      return new Date(row.getValue(row.original.created_at)).toLocaleString(
        "en-US",
        {
          day: "numeric",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        },
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
  },
];

async function onExpireProfiler(profiler: FlareProfileData$View) {
  return backend.deleteProfiler(profiler.key).then(() => {
    refresh();
  });
}
</script>

<template>
  <div class="flex flex-col justify-center h-[80vh]">
    <UTable
      :data="data"
      :columns="columns"
      :loading="status === 'pending'"
      class="flex-1"
    >
      <template #actions-cell="{ row }">
        <UButton
          icon="i-lucide-trash-2"
          color="neutral"
          variant="ghost"
          class="ml-auto"
          @click="onExpireProfiler(row.original)"
        />
      </template>
    </UTable>
  </div>
</template>
