<script setup lang="ts">
import type { ButtonProps, FormSubmitEvent } from "@nuxt/ui";
import * as z from "zod";

const schema = z.object({
  token: z
    .string("Token is required")
    .min(48, "Tokens are at least 48 characters"),
});

type Schema = z.output<typeof schema>;

const state = reactive<Partial<Schema>>({
  token: "",
});

async function onSubmit(event: FormSubmitEvent<Schema>) {}
</script>

<template>
  <div class="flex flex-col justify-center h-[80vh]">
    <UPageSection
      title="Profiler Manager"
      description="Insert your flare token to display all the profiler sessions associated with your user. Be sure to provide the token associated with this instance of Flare."
    >
      <template #links>
        <UForm
          :schema="schema"
          :state="state"
          class="space-y-4"
          @submit="onSubmit"
        >
          <UFormField label="Authorization Token" name="token">
            <UInput
              v-model="state.token"
              type="password"
              class="w-[60vw] md:w-[40vw]"
            />
          </UFormField>

          <UButton type="submit"> Submit </UButton>
        </UForm>
      </template>
    </UPageSection>
  </div>
</template>
