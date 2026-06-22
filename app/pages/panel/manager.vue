<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import type { FlareManagerDetails$View } from "~/types/authentication";

const backend = useBackend();
const { data: users, status, refresh } = backend.fetchManagers();

const filter = ref("");
const columns: TableColumn<FlareManagerDetails$View>[] = [
  {
    accessorKey: "id",
    header: "#",
  },
  {
    accessorKey: "username",
    header: "Username",
  },
  {
    accessorKey: "created_at",
    header: "Created at",
    cell: ({ row }) => {
      return new Date(row.original.created_at).toLocaleString("en-US", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    },
  },
  {
    id: "actions",
    header: "Actions",
  },
];

const isCreateModalShown = ref(false);
const isUpdateModalShown = ref(false);
const isDeleteModalShown = ref(false);
const isResetModalShown = ref(false);
const userSelected = ref<FlareManagerDetails$View>();

function triggerUpdateModal(user: FlareManagerDetails$View) {
  userSelected.value = user;
  isUpdateModalShown.value = true;
}

function triggerDeleteModal(user: FlareManagerDetails$View) {
  userSelected.value = user;
  isDeleteModalShown.value = true;
}

function triggerResetModal(user: FlareManagerDetails$View) {
  userSelected.value = user;
  isResetModalShown.value = true;
}

function onSubmitPasswordReset() {}

function onSubmitGeneric() {
  isCreateModalShown.value = false;
  isUpdateModalShown.value = false;
  isDeleteModalShown.value = false;
  isResetModalShown.value = false;
  refresh();
}

definePageMeta({
  layout: "dashboard",
});
</script>

<template>
  <div class="flex flex-col w-full h-full">
    <div class="flex justify-between px-4 py-3.5 border-b border-accented">
      <UInput v-model="filter" placeholder="Filter..." class="max-w-sm" />
      <UModal v-model:open="isCreateModalShown" title="Register Manager">
        <UButton icon="i-lucide-plus" />
        <template #body>
          <div class="flex items-center justify-center">
            <ModalManagerCreate @submit="onSubmitGeneric" />
          </div>
        </template>
      </UModal>
    </div>
    <UTable
      v-model:global-filter="filter"
      :data="users"
      :columns="columns"
      :loading="status === 'pending'"
      class="flex-1"
    >
      <template #actions-cell="{ row }">
        <UButton
          icon="i-lucide-rotate-ccw-key"
          color="neutral"
          variant="ghost"
          class="ml-auto"
          @click="triggerResetModal(row.original)"
        />
        <UButton
          icon="i-lucide-pencil-line"
          color="neutral"
          variant="ghost"
          class="ml-auto"
          @click="triggerUpdateModal(row.original)"
        />
        <UButton
          icon="i-lucide-trash-2"
          color="neutral"
          variant="ghost"
          class="ml-auto"
          @click="triggerDeleteModal(row.original)"
        />
      </template>
    </UTable>
    <UModal title="Update Manager Details" v-model:open="isUpdateModalShown">
      <template #body>
        <div class="flex items-center justify-center">
          <ModalManagerUpdate :user="userSelected!" @submit="onSubmitGeneric" />
        </div>
      </template>
    </UModal>
    <UModal title="Delete Manager" v-model:open="isDeleteModalShown">
      <template #body>
        <div class="flex items-center justify-center">
          <ModalGenericDelete
            :user="userSelected!"
            name-field="username"
            :delete-function="backend.deleteManager"
            @submit="onSubmitGeneric"
          />
        </div>
      </template>
    </UModal>
    <UModal title="Change Manager Password" v-model:open="isResetModalShown">
      <template #body>
        <div class="flex items-center justify-center">
          <ModalManagerReset
            :user="userSelected!"
            @submit="onSubmitPasswordReset"
          />
        </div>
      </template>
    </UModal>
  </div>
</template>
