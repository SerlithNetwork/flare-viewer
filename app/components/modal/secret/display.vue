<script setup lang="ts" generic="T extends IAudited">
import type { IAudited } from "~/types/audited";

type Props = {
  target: T;
  nameField: keyof T;
  secretField: keyof T;
};

const props = defineProps<Props>();

const name = computed(() => props.target[props.nameField] as string);
const secret = computed(() => props.target[props.secretField] as string);
</script>

<template>
  <div class="flex flex-col items-center gap-4 w-full">
    <div class="flex flex-col items-center w-full">
      <span>User [{{ name }}] created with the following secret</span>
      <span>This won't show up again</span>
    </div>
    <div class="flex flex-col items-center w-full">
      <UCard>
        <UChatShimmer :text="secret" :duration="3" />
      </UCard>
    </div>
  </div>
</template>

<style scoped></style>
