import { useAuthenticationStore } from "~/store/auth-store";

export default defineNuxtRouteMiddleware((to, _) => {
  const { isAuthenticated } = useAuthenticationStore();

  if (to.path.startsWith("/login")) {
    if (isAuthenticated) {
      return navigateTo("/panel");
    }

    return;
  }

  if (to.path.startsWith("/panel")) {
    if (!isAuthenticated) {
      return navigateTo("/");
    }
  }
});
