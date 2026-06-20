<script setup lang="ts" generic="T extends IAudited">
import type { IAudited } from "~/types/audited";

type Props = {
  user: T;
  nameField: keyof T;
  deleteFunction: (_: T) => Promise<any>;
};

const props = defineProps<Props>();
const emit = defineEmits(["submit"]);

function onSubmit() {
  props.deleteFunction(props.user).then(() => {
    emit("submit");
  });
}
</script>

<template>
  <div class="flex flex-col items-center gap-4 w-full">
    <div class="flex flex-col items-center w-full">
      <span>You're about to delete [{{ props.user[props.nameField] }}]</span>
      <span>Are you sure?</span>
    </div>
    <div class="flex flex-col items-end w-full">
      <UButton @click="onSubmit"> Confirm </UButton>
    </div>
  </div>
</template>

<style scoped></style>
