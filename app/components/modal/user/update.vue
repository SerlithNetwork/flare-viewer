<script lang="ts" setup>
import type { FormSubmitEvent } from "@nuxt/ui";
import * as z from "zod";
import type { FlareUserDetails$View } from "~/types/authentication";

type Props = {
  user: FlareUserDetails$View;
};

type Emits = {
  submit: [FlareUserDetails$View];
};

const config = useRuntimeConfig();
const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const schema = z.object({
  name: z.string().min(4, "Must be at least 4 characters long"),
  canManage: z.boolean(),
});
type Schema = z.output<typeof schema>;

const state = reactive<Partial<Schema>>({
  name: props.user.name,
  canManage: props.user.can_manage,
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
  return $fetch<FlareUserDetails$View>(
    `${config.public.apiBackendUrl}/api/v1/management/user/${props.user.id}`,
    {
      method: "put",
      body: {
        name: event.data.name,
        can_manage: event.data.canManage,
      },
    },
  ).then((result) => {
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
      <UFormField label="User Name" name="name">
        <UInput v-model="state.name" />
      </UFormField>
      <UFormField label="Manage Profilers" name="manage">
        <UCheckbox v-model="state.canManage" />
      </UFormField>
    </div>
    <div class="flex flex-col items-end w-full">
      <UButton type="submit"> Submit </UButton>
    </div>
  </UForm>
</template>
