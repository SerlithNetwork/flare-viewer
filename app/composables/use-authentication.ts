import type {
  AuthenticationForm$Password,
  AuthenticationDetails,
} from "~/types/authentication";
import { useAuthenticationStore } from "~/store/auth-store";

export default function () {
  const runtime = useRuntimeConfig();
  const router = useRouter();

  const authentication = useAuthenticationStore();

  async function authenticate(
    username: string,
    password: string,
    redirect?: string,
    triggers?: {
      onResponseError?: () => void;
      onRequestError?: () => void;
    },
  ) {
    try {
      const response = await $fetch<AuthenticationDetails>(
        `${runtime.public.apiBackendUrl}/api/v1/authentication/password`,
        {
          method: "POST",
          body: {
            username,
            password,
          } satisfies AuthenticationForm$Password,

          onResponseError: triggers?.onResponseError,
          onRequestError: triggers?.onRequestError,
        },
      );

      authentication.setAccessToken(
        response.access.token,
        response.access.expiration,
      );
      authentication.setRefreshToken(
        response.refresh.token,
        response.refresh.expiration,
      );
      authentication.setUser(response.user);

      await router.push(redirect ?? "/");
    } catch {
      console.error("Failed to authenticate user");
    }
  }

  return {
    authenticate,
  };
}
