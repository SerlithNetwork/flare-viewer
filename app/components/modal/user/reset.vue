<script setup lang="ts">
import type { FlareUserDetails$View } from "~/types/authentication";

type Props = {
  user: FlareUserDetails$View;
};

type Emits = {
  submit: [FlareUserDetails$View];
};

const props = defineProps<Props>();
const emit = defineEmits<Emits>();
const backend = useBackend();

async function onSubmit() {
  return backend.resetUserToken(props.user).then(() => {
    emit("submit", props.user);
  });
}
</script>

<template>
  <div class="flex flex-col items-center gap-4 w-full">
    <div class="flex flex-col items-center w-full">
      <span>You're about to reset credentials for [{{ props.user.name }}]</span>
      <span>Are you sure?</span>
    </div>
    <div class="flex flex-col items-end w-full">
      <UButton @click="onSubmit"> Confirm </UButton>
    </div>
  </div>
</template>

<style scoped></style>
