import {defineStore} from "pinia";

export type ProfilerStatus = "loading" | "ready" | "error"

export const useProfilerStatusStore = defineStore("status", () => {
    const status = ref<ProfilerStatus>("loading")

    function setStatus(stat: ProfilerStatus) {
        status.value = stat
    }

    return { status, setStatus }
})
