import type {
  AuthenticationForm$Token,
  AuthenticationDetails,
} from "~/types/authentication";
import { useAuthenticationStore } from "~/store/auth-store";

export default function () {
  const runtime = useRuntimeConfig();
  const authentication = useAuthenticationStore();

  async function refresh() {
    const tokenInfo = authentication.refreshToken;
    if (!tokenInfo) {
      return;
    }

    try {
      const response = await $fetch<AuthenticationDetails>(
        `${runtime.public.apiBackendUrl}/api/v1/authentication/token`,
        {
          method: "post",
          body: {
            token: tokenInfo.token,
          } satisfies AuthenticationForm$Token,
        },
      );

      authentication.setAccessToken(
        response.access.token,
        response.access.expiration,
      );
      authentication.setUser(response.user);
    } catch {
      console.error("Failed to refresh access token");
    }
  }

  return {
    refresh,
  };
}
