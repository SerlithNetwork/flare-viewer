<script lang="ts" setup>
import type { FormSubmitEvent } from "@nuxt/ui";
import * as z from "zod";
import type { FlareManagerDetails$View } from "~/types/authentication";

type Emits = {
  submit: [FlareManagerDetails$View];
};

const backend = useBackend();
const emit = defineEmits<Emits>();

const schema = z.object({
  username: z.string().min(4, "Must be at least 4 characters long"),
  password: z.string().min(8, "Must be at least 8 characters long"),
});
type Schema = z.output<typeof schema>;

const state = reactive<Partial<Schema>>({
  username: "",
  password: "",
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
  return backend
    .createManager({
      username: event.data.username,
      password: event.data.password,
    })
    .then((result) => {
      emit("submit", result);
    });
}
</script>

<template>
  <UForm
    :schema="schema"
    :state="state"
    @submit="onSubmit"
    class="flex flex-col items-center justify-center gap-4 w-full"
  >
    <div class="flex flex-col items-center justify-center gap-2 w-full">
      <UFormField label="Username" name="username">
        <UInput v-model="state.username" />
      </UFormField>
      <UFormField label="Password" name="password">
        <UInput v-model="state.password" type="password" />
      </UFormField>
    </div>
    <div class="flex flex-col items-end w-full">
      <UButton type="submit"> Submit </UButton>
    </div>
  </UForm>
</template>
