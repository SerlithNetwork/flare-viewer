import type {
  AuthenticationDetails$Entry,
  FlareManagerDetails$View,
} from "~/types/authentication";

export const useAuthenticationStore = defineStore("authentication", () => {
  // State
  const user = ref<FlareManagerDetails$View | undefined>(undefined);

  // Cookies for token storage (SSR-compatible)
  const accessToken = useCookie<AuthenticationDetails$Entry | undefined>(
    "flare_access_token",
    {
      maxAge: 45 * 60, // 45 minutes
      sameSite: "lax",
      secure: true,
    },
  );

  const refreshToken = useCookie<AuthenticationDetails$Entry | undefined>(
    "flare_refresh_token",
    {
      maxAge: 24 * 60 * 60, // 1 day
      sameSite: "lax",
      secure: true,
    },
  );

  // Getters
  const isAuthenticated = computed(() => !!accessToken.value);

  // Actions
  function setUser(u: FlareManagerDetails$View) {
    user.value = u;
  }

  function setAccessToken(token: string, expiration: number) {
    accessToken.value = {
      token,
      expiration,
    };
  }

  function setRefreshToken(token: string, expiration: number) {
    refreshToken.value = {
      token,
      expiration,
    };
  }

  function invalidateTokens() {
    accessToken.value = undefined;
    refreshToken.value = undefined;
  }

  return {
    // State
    user,
    accessToken,
    refreshToken,

    // Getters
    isAuthenticated,

    // Actions
    setUser,
    setAccessToken,
    setRefreshToken,
    invalidateTokens,
  };
});
