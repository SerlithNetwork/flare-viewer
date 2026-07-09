<script setup lang="ts">
import * as z from "zod";
import type { FormSubmitEvent, AuthFormField } from "@nuxt/ui";
import useAuthentication from "~/composables/use-authentication";

const { authenticate } = useAuthentication();
const toast = useToast();

const fields: AuthFormField[] = [
  {
    name: "username",
    type: "username",
    label: "Username",
    placeholder: "Enter your username",
    required: true,
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    placeholder: "Enter your password",
    required: true,
  },
];

const schema = z.object({
  username: z
    .string("Username is required")
    .min(4, "Must be at least 4 characters"),
  password: z
    .string("Password is required")
    .min(8, "Must be at least 8 characters"),
});

type Schema = z.output<typeof schema>;

function onSubmit(payload: FormSubmitEvent<Schema>) {
  authenticate(payload.data.username, payload.data.password, "/panel", {
    onRequestError() {
      toast.add({
        title: "Error",
        description: "Service unavailable, try again later",
        icon: "uil:times-circle",
        color: "success",
      });
    },
    onResponseError() {
      toast.add({
        title: "Error",
        description: "Wrong credentials",
        icon: "uil:times-circle",
        color: "error",
      });
    },
  });
}
</script>

<template>
  <div class="flex flex-col items-center justify-center h-[80vh]">
    <UPageCard class="w-full max-w-md">
      <UAuthForm
        :schema="schema"
        title="Login"
        description="Enter your credentials to access your account."
        icon="i-lucide-user"
        :fields="fields"
        @submit="onSubmit"
      >
        <template #leading>
          <div class="flex flex-row items-center justify-center">
            <UColorModeImage
              light="/flare_light.svg"
              dark="/flare.svg"
              width="160"
            />
          </div>
        </template>
      </UAuthForm>
    </UPageCard>
  </div>
</template>
