import { useTokenStore } from "~/store/token-store";

export default defineNuxtRouteMiddleware((to, _) => {
  const { isAuthenticated } = useTokenStore();

  if (to.path === "/profilers") {
    if (isAuthenticated) {
      return navigateTo("/profilers/panel");
    }

    return;
  }

  if (to.path.startsWith("/profilers/panel")) {
    if (!isAuthenticated) {
      return navigateTo("/profilers");
    }
  }
});
