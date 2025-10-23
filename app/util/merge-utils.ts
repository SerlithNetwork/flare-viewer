import {
    AirplaneProfileFile,
    type MemoryProfileV2, type MemoryProfileV2_Children,
    type MethodDictionarySlice, MethodDictionarySlice_MethodType,
    type TimeProfileV2, type TimeProfileV2_Children
} from "~/proto/ProfileFile_pb";
import type {
    AirplaneProfileFileV2Data,
    MemoryProfileV2Children, MethodDefinition,
    MethodDictionary,
    TimeProfileV2Children
} from "~/types/protos";

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
        dictionary.push(sample.v2!.dictionary!)
    }

    const timeProfile = Array.from(timeMap.values())
    const memoryProfile = Array.from(memoryMap.values())
    timeProfile.sort((a, b) => a.thread.toLowerCase().localeCompare(b.thread.toLowerCase()))
    memoryProfile.sort((a, b) => a.thread.toLowerCase().localeCompare(b.thread.toLowerCase()))

    return { dictionary, timeProfile, memoryProfile };
}

export function mergeDictionarySlices(slices: MethodDictionarySlice[]): MethodDictionary {
    const dictionary: MethodDictionary = { methods: [], packages: [] }

    for (const slice of slices) {
        dictionary.methods.push(...slice.entries)
        dictionary.packages.push(...slice.packageEntries)
    }

    return dictionary
}

export function mergeTimeChildren(dictionary: MethodDictionary, children: TimeProfileV2_Children[]): TimeProfileV2Children[] {
    const childMap = new Map<number, TimeProfileV2Children>();

    for (const child of children) {
        const c = childMap.get(child.name);
        if (c) {
            c.time += child.time;
            c.samples += child.time;
            c.children = c.children.concat(child.children);
        } else {
            const definition = getFromDictionary(dictionary, child.name)
            childMap.set(child.name, {
                methodDefinition: definition,
                time: child.time,
                plugin: child.plugin,
                samples: child.samples,
                children: [...child.children],
            })
        }
    }

    const sortedChildren = Array.from(childMap.values())
    sortedChildren.sort((a, b) => a.time - b.time)

    return sortedChildren
}

export function mergeMemoryChildren(dictionary: MethodDictionary, children: MemoryProfileV2_Children[]): MemoryProfileV2Children[] {
    const childMap = new Map<number, MemoryProfileV2Children>();

    for (const child of children) {
        const c = childMap.get(child.name);
        if (c) {
            c.bytes += child.bytes;
            c.children = c.children.concat(child.children);
        } else {
            const definition = getFromDictionary(dictionary, child.name)
            childMap.set(child.name, {
                methodDefinition: definition,
                plugin: child.plugin,
                bytes: child.bytes,
                children: [...child.children],
            })
        }
    }

    const sortedChildren = Array.from(childMap.values())
    sortedChildren.sort((a, b) => a.bytes - b.bytes)

    return sortedChildren
}

export function getFromDictionary(dictionary: MethodDictionary, id: number): MethodDefinition {
    const method = dictionary.methods[id]!;

    if (method.methodDictionaryType.oneofKind === "javaEntry") {
        return {
            javaClassName: method.methodDictionaryType.javaEntry.javaClass!.name,
            javaMethodName: method.methodDictionaryType.javaEntry.method,
            javaPackageName: dictionary.packages[method.methodDictionaryType.javaEntry.javaClass!.packageIndex]!,
            methodType: "java"
        }
    } else if (method.methodDictionaryType.oneofKind === "otherEntry") {
        switch (method.methodDictionaryType.otherEntry.type) {
            case MethodDictionarySlice_MethodType.NATIVE:
                return {
                    otherPath: method.methodDictionaryType.otherEntry.path,
                    methodType: "native",
                }
            case MethodDictionarySlice_MethodType.KERNEL:
                return {
                    otherPath: method.methodDictionaryType.otherEntry.path,
                    methodType: "kernel",
                }
            case MethodDictionarySlice_MethodType.JAVA:
                return {
                    otherPath: method.methodDictionaryType.otherEntry.path,
                    methodType: "java?",
                }
        }
    }

    throw "Why it got here"
}
