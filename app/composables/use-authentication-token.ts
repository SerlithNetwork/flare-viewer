import { useTokenStore } from "~/store/token-store";

export default function () {
  const runtime = useRuntimeConfig();
  const router = useRouter();

  const tokenStore = useTokenStore();

  async function authenticate(
    token: string,
    redirect?: string,
    triggers?: {
      onResponseError?: () => void;
      onRequestError?: () => void;
    },
  ) {
    try {
      await $fetch<boolean>(
        `${runtime.public.apiBackendUrl}/api/v1/user/token`,
        {
          method: "GET",
          headers: {
            Authentication: `token ${token}`,
          },

          onResponseError: triggers?.onResponseError,
          onRequestError: triggers?.onRequestError,
        },
      );

      tokenStore.setProfilingToken(token);

      await router.push(redirect ?? "/");
    } catch {
      console.error("Failed to authenticate token");
    }
  }

  return {
    authenticate,
  };
}
