import {
    AirplaneProfileFile,
    type MemoryProfileV2,
    type MethodDictionarySlice,
    type TimeProfileV2
} from "~/proto/ProfileFile_pb";
import type {AirplaneProfileFileV2Data} from "~/types/protos";

export function mergeAirplaneFile(samples: AirplaneProfileFile[]): AirplaneProfileFileV2Data {
    const dictionary: MethodDictionarySlice[] = [];
    const timeMap = new Map<string, TimeProfileV2>();
    const memoryMap = new Map<string, MemoryProfileV2>();

    for (const sample of samples) {
        const v2 = sample.v2!
        for (const time of v2.timeProfile) {
            const t = timeMap.get(time.thread)
            if (t) {
                t.time += time.time
                t.children = t.children.concat(time.children)
                t.samples += time.samples
            } else {
                timeMap.set(time.thread, { ...time, children: [...time.children] })
            }
        }
        for (const memory of v2.memoryProfile) {
            const m = memoryMap.get(memory.thread)
            if (m) {
                m.bytes += memory.bytes
                m.children = m.children.concat(memory.children)
            } else {
                memoryMap.set(memory.thread, { ...memory, children: [...memory.children] })
            }
        }
    }

    return { dictionary, timeProfile: Array.from(timeMap.values()), memoryProfile: Array.from(memoryMap.values()) };
}
