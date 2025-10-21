import {defineStore} from "pinia";

export type ProfilerScreen = "profiler" | "config" | "world" | "system";

export const useProfilerScreenStore = defineStore("screen", () => {
    const screen =ref<ProfilerScreen>("profiler")

    function setScreen(selected: ProfilerScreen) {
        screen.value = selected
    }

    return { screen, setScreen }
})
