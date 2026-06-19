export const useTokenStore = defineStore("token_store", () => {
  const profilingToken = useCookie<string | undefined>(
    "flare_profiling_token",
    {
      maxAge: 45 * 60, // 45 minutes
      sameSite: "lax",
      secure: true,
    },
  );

  const isAuthenticated = computed(() => !!profilingToken.value);

  function setProfilingToken(token: string) {
    profilingToken.value = token;
  }

  function invalidateTokens() {
    profilingToken.value = undefined;
  }

  return {
    profilingToken,
    isAuthenticated,
    setProfilingToken,
    invalidateTokens,
  };
});
