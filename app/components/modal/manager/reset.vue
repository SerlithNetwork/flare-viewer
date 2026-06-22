<script lang="ts" setup>
import type { FormSubmitEvent } from "@nuxt/ui";
import * as z from "zod";
import type { FlareManagerDetails$View } from "~/types/authentication";

type Props = {
  user: FlareManagerDetails$View;
};

type Emits = {
  submit: [FlareManagerDetails$View];
};

const toast = useToast();
const backend = useBackend();
const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const schema = z.object({
  password: z.string().min(8, "Must be at least 8 characters long"),
  confirmation: z.string().min(8, "Must be at least 8 characters long"),
});
type Schema = z.output<typeof schema>;

const state = reactive<Partial<Schema>>({
  password: "",
  confirmation: "",
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
  if (event.data.password !== event.data.confirmation) {
    toast.add({
      title: "Error",
      description: "Passwords do not match",
      icon: "uil:times-circle",
      color: "error",
    });
    return;
  }

  return backend
    .resetManagerPassword(props.user.id, {
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
      <UFormField label="Password" name="password">
        <UInput v-model="state.password" type="password" />
      </UFormField>
      <UFormField label="Confirm Password" name="confirmation">
        <UInput v-model="state.confirmation" type="password" />
      </UFormField>
    </div>
    <div class="flex flex-col items-end w-full">
      <UButton type="submit"> Submit </UButton>
    </div>
  </UForm>
</template>
