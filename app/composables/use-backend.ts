import type { UseFetchOptions } from "#app";
import { useAuthenticationStore } from "~/store/auth-store";
import { useTokenStore } from "~/store/token-store";
import type {
  FlareManagerDetails$Request,
  FlareManagerDetails$Reset,
  FlareManagerDetails$Update,
  FlareManagerDetails$View,
  FlareUserDetails$Request,
  FlareUserDetails$Update,
  FlareUserDetails$View,
} from "~/types/authentication";
import type { FlareProfileData$View } from "~/types/profiling";

export default function () {
  const runtime = useRuntimeConfig();
  const authStore = useAuthenticationStore();
  const tokenStore = useTokenStore();
  const messages = useToastGeneric();
  const toast = useToast();

  const flareApi = `${runtime.public.apiBackendUrl}/api/v1/flare`;
  const managementApi = `${runtime.public.apiBackendUrl}/api/v1/management`;
  const userApi = `${runtime.public.apiBackendUrl}/api/v1/user`;

  const managerHeaders: HeadersInit | undefined = authStore.accessToken
    ? {
        Authorization: `Bearer ${authStore.accessToken.token}`,
      }
    : undefined;
  const userHeaders: HeadersInit | undefined = tokenStore.profilingToken
    ? {
        Authorization: `token ${tokenStore.profilingToken}`,
      }
    : undefined;

  function fetchSelfManager(
    opts: UseFetchOptions<any> | undefined = undefined,
  ) {
    return useFetch<FlareManagerDetails$View>(`${managementApi}/manager/self`, {
      headers: managerHeaders,
      method: "get",
      ...opts,
    });
  }

  function fetchManagers(opts: UseFetchOptions<any> | undefined = undefined) {
    return useFetch<FlareManagerDetails$View[]>(`${managementApi}/manager`, {
      headers: managerHeaders,
      method: "get",
      ...opts,
    });
  }

  function createManager(request: FlareManagerDetails$Request) {
    return $fetch<FlareManagerDetails$View>(`${managementApi}/manager`, {
      headers: managerHeaders,
      method: "post",
      body: request,
      ...messages,
    });
  }

  function updateManager(id: number, request: FlareManagerDetails$Update) {
    return $fetch<FlareManagerDetails$View>(`${managementApi}/manager/${id}`, {
      headers: managerHeaders,
      method: "put",
      body: request,
      ...messages,
    });
  }

  function resetManagerPassword(
    id: number,
    request: FlareManagerDetails$Reset,
  ) {
    return $fetch<FlareManagerDetails$View>(
      `${managementApi}/manager/${id}/reset`,
      {
        headers: managerHeaders,
        method: "put",
        body: request,
        ...messages,
        onResponse(event) {
          if (!event.error) {
            toast.add({
              title: "Done!",
              description: "Manager password changed successfully",
              icon: "uil:check-circle",
              color: "success",
            });
          }
        },
      },
    );
  }

  function deleteManager(user: FlareManagerDetails$View) {
    return $fetch<number>(`${managementApi}/manager/${user.id}`, {
      headers: managerHeaders,
      method: "delete",
      ...messages,
    });
  }

  function fetchUsers(opts: UseFetchOptions<any> | undefined = undefined) {
    return useFetch<FlareUserDetails$View[]>(`${managementApi}/user`, {
      headers: managerHeaders,
      method: "get",
      ...opts,
    });
  }

  function createUser(request: FlareUserDetails$Request) {
    return $fetch<FlareUserDetails$View>(`${managementApi}/user`, {
      headers: managerHeaders,
      method: "post",
      body: request,
      ...messages,
    });
  }

  function updateUser(id: number, request: FlareUserDetails$Update) {
    return $fetch<FlareUserDetails$View>(`${managementApi}/user/${id}`, {
      headers: managerHeaders,
      method: "put",
      body: request,
      ...messages,
    });
  }

  function resetUserToken(user: FlareUserDetails$View) {
    return $fetch<FlareUserDetails$View>(
      `${managementApi}/user/${user.id}/reset`,
      {
        headers: managerHeaders,
        method: "put",
        ...messages,
        onResponse(event) {
          if (!event.error) {
            toast.add({
              title: "Done!",
              description: "User token reset successfully",
              icon: "uil:check-circle",
              color: "success",
            });
          }
        },
      },
    );
  }

  function deleteUser(user: FlareUserDetails$View) {
    return $fetch<number>(`${managementApi}/user/${user.id}`, {
      headers: managerHeaders,
      method: "delete",
      ...messages,
    });
  }

  function fetchProfilerSummaries(
    opts: UseFetchOptions<any> | undefined = undefined,
  ) {
    return useFetch<FlareProfileData$View[]>(`${userApi}/profiler`, {
      headers: userHeaders,
      method: "get",
      ...opts,
    });
  }

  function refreshProfiler(key: string) {
    return $fetch<boolean>(`${userApi}/profiler/${key}`, {
      headers: userHeaders,
      method: "patch",
      onRequestError() {
        toast.add({
          title: "Error",
          description: "Service down, please try again later",
          icon: "uil:times-circle",
          color: "error",
        });
      },
      onResponseError() {
        toast.add({
          title: "Error",
          description:
            "Profiling token invalid or not authorized to perform this operation",
          icon: "uil:times-circle",
          color: "error",
        });
      },
    });
  }

  function deleteProfiler(key: string) {
    return $fetch<number>(`${userApi}/profiler/${key}`, {
      headers: userHeaders,
      method: "delete",
      onRequestError() {
        toast.add({
          title: "Error",
          description: "Service down, please try again later",
          icon: "uil:times-circle",
          color: "error",
        });
      },
      onResponseError() {
        toast.add({
          title: "Error",
          description:
            "Profiling token invalid or not authorized to perform this operation",
          icon: "uil:times-circle",
          color: "error",
        });
      },
    });
  }

  function fetchProfilerSummary(key: string) {
    return useFetch<FlareProfileData$View>(`${flareApi}/profiler/${key}`, {
      method: "get",
    });
  }

  function fetchProfilerEncoded(key: string) {
    return $fetch<string>(`${flareApi}/profiler/encoded/${key}`, {
      method: "get",
    });
  }

  return {
    flareApi,
    managementApi,
    userApi,

    fetchSelfManager,
    fetchManagers,
    createManager,
    updateManager,
    resetManagerPassword,
    deleteManager,

    fetchUsers,
    createUser,
    updateUser,
    resetUserToken,
    deleteUser,

    fetchProfilerSummaries,
    refreshProfiler,
    deleteProfiler,

    fetchProfilerSummary,
    fetchProfilerEncoded,
  };
}
