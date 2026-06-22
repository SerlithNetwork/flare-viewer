<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import type { FlareUserDetails$View } from "~/types/authentication";

const backend = useBackend();
const { data: users, status, refresh } = backend.fetchUsers();

const filter = ref("");
const columns: TableColumn<FlareUserDetails$View>[] = [
  {
    accessorKey: "id",
    header: "#",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    id: "token",
    header: "Token",
    cell: ({ row }) => {
      return `${row.original.id.toString(16).padStart(8, "0")}.******`;
    },
  },
  {
    accessorKey: "can_manage",
    header: "Manage Profilers",
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
const userSelected = ref<FlareUserDetails$View>();

const isSecretModalShown = ref(false);
const userForSecret = ref<FlareUserDetails$View>();

function triggerUpdateModal(user: FlareUserDetails$View) {
  userSelected.value = user;
  isUpdateModalShown.value = true;
}

function triggerDeleteModal(user: FlareUserDetails$View) {
  userSelected.value = user;
  isDeleteModalShown.value = true;
}

function triggerResetModal(user: FlareUserDetails$View) {
  userSelected.value = user;
  isResetModalShown.value = true;
}

function onSubmitDisplaySecret(user: FlareUserDetails$View) {
  onSubmitGeneric();
  userForSecret.value = user;
  isSecretModalShown.value = true;
}

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
      <UModal v-model:open="isCreateModalShown" title="Register User">
        <UButton icon="i-lucide-plus" />
        <template #body>
          <div class="flex items-center justify-center">
            <ModalUserCreate @submit="onSubmitDisplaySecret" />
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
    <UModal title="Update User Details" v-model:open="isUpdateModalShown">
      <template #body>
        <div class="flex items-center justify-center">
          <ModalUserUpdate :user="userSelected!" @submit="onSubmitGeneric" />
        </div>
      </template>
    </UModal>
    <UModal title="Delete User" v-model:open="isDeleteModalShown">
      <template #body>
        <div class="flex items-center justify-center">
          <ModalGenericDelete
            :user="userSelected!"
            name-field="name"
            :delete-function="backend.deleteUser"
            @submit="onSubmitGeneric"
          />
        </div>
      </template>
    </UModal>
    <UModal title="Reset User Credentials" v-model:open="isResetModalShown">
      <template #body>
        <div class="flex items-center justify-center">
          <ModalUserReset
            :user="userSelected!"
            @submit="onSubmitDisplaySecret"
          />
        </div>
      </template>
    </UModal>
    <UModal
      title="Secret"
      v-model:open="isSecretModalShown"
      :ui="{ content: 'md:max-w-3xl' }"
    >
      <template #body>
        <div class="flex items-center justify-center">
          <ModalSecretDisplay
            :target="userForSecret!"
            name-field="name"
            secret-field="token"
          />
        </div>
      </template>
    </UModal>
  </div>
</template>
