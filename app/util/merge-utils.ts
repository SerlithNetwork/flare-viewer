import {
    type MemoryProfileV2, type MemoryProfileV2_Children,
    type MethodDictionarySlice,
    MethodDictionarySlice_JavaDictionaryEntry_JavaTypeValue, MethodDictionarySlice_MethodType,
    type TimeProfileV2, type TimeProfileV2_Children
} from "~/proto/ProfileFile_pb";
import type {MethodDefinition, MethodDictionary, ThreadAccumulator, NodeAccumulator, AirplaneSample, AirplaneNode} from "~/types/protos";



export function mergeAirplaneSample(
    sample: AirplaneSample,
    threads: Map<string, ThreadAccumulator>,
    plugins: Set<string>
) {

    for (const thread of sample.threads) {
        let accumulator = threads.get(thread.thread)

        if (!accumulator) {
            accumulator = {
                name: thread.thread,
                units: 0,
                nodes: new Map(),
                plugins: new Set(),
            }
            threads.set(thread.thread, accumulator)
        }

        switch (sample.type) {
            case "time":
                const tt = (thread as TimeProfileV2)
                accumulator.units += tt.time
                mergeAirplaneNodes({ nodes: tt.children, type: sample.type }, accumulator.nodes, accumulator.plugins, plugins)
                break
            case "memory":
                const tm = (thread as MemoryProfileV2)
                accumulator.units += tm.bytes
                mergeAirplaneNodes({ nodes: tm.children, type: sample.type }, accumulator.nodes, accumulator.plugins, plugins)
                break
        }

    }
}

export function mergeAirplaneNodes(
    sample: AirplaneNode,
    parentNodes: Map<number, NodeAccumulator>,
    threadPlugins: Set<string>,
    plugins: Set<string>
) {

    for (const node of sample.nodes) {
        let accumulator = parentNodes.get(node.name)

        if (!accumulator) {
            accumulator = {
                name: node.name,
                units: 0,
                children: new Map(),
                plugins: new Set(),
                plugin: node.plugin,
            }
            parentNodes.set(node.name, accumulator)
        }

        if (node.plugin) {
            accumulator.plugins.add(node.plugin)
            threadPlugins.add(node.plugin)
            plugins.add(node.plugin)
        }

        switch (sample.type) {
            case "time":
                const nt = (node as TimeProfileV2_Children)
                accumulator.units += nt.time
                mergeAirplaneNodes({ nodes: nt.children, type: sample.type }, accumulator.children, threadPlugins, plugins)
                break
            case "memory":
                const nm = (node as MemoryProfileV2_Children)
                mergeAirplaneNodes({ nodes: nm.children, type: sample.type }, accumulator.children, threadPlugins, plugins)
                accumulator.units += nm.bytes
                break
        }

        for (const pl of accumulator.children.values()) {
            pl.plugins.forEach(p => accumulator.plugins.add(p))
        }

    }
}


export function mergeDictionarySlices(slices: MethodDictionarySlice[]): MethodDictionary {
    const dictionary: MethodDictionary = { methods: [], packages: [] }

    for (const slice of slices) {
        dictionary.methods.push(...slice.entries)
        dictionary.packages.push(...slice.packageEntries)
    }

    return dictionary
}


export function getFromDictionary(dictionary: MethodDictionary, id: number): MethodDefinition {
    const method = dictionary.methods[id]!;

    if (method.methodDictionaryType.oneofKind === "javaEntry") {
        const jClassName = method.methodDictionaryType.javaEntry.javaClass!.name
        const jMethodName = method.methodDictionaryType.javaEntry.method
        const jPackageName = dictionary.packages[method.methodDictionaryType.javaEntry.javaClass!.packageIndex]!
        return {
            javaClassName: jClassName,
            javaMethodName: jMethodName,
            javaPackageName: jPackageName,
            javaArguments: formatTypeValues(dictionary, ...method.methodDictionaryType.javaEntry.params),
            javaReturn: formatTypeValues(dictionary, method.methodDictionaryType.javaEntry.returnType),
            fullName: `${jPackageName}.${jClassName}.${jMethodName}`,
            methodType: "java"
        }
    } else if (method.methodDictionaryType.oneofKind === "otherEntry") {
        switch (method.methodDictionaryType.otherEntry.type) {
            case MethodDictionarySlice_MethodType.NATIVE:
                return {
                    otherPath: method.methodDictionaryType.otherEntry.path,
                    fullName: method.methodDictionaryType.otherEntry.path,
                    methodType: "native",
                }
            case MethodDictionarySlice_MethodType.KERNEL:
                return {
                    otherPath: method.methodDictionaryType.otherEntry.path,
                    fullName: method.methodDictionaryType.otherEntry.path,
                    methodType: "kernel",
                }
            case MethodDictionarySlice_MethodType.JAVA:
                return {
                    otherPath: method.methodDictionaryType.otherEntry.path,
                    fullName: method.methodDictionaryType.otherEntry.path,
                    methodType: "java?",
                }
        }
    }

    throw "Why it got here"
}

export function formatTypeValues(dictionary: MethodDictionary, ...values:( MethodDictionarySlice_JavaDictionaryEntry_JavaTypeValue | undefined)[]): string {
    const types: string[] = []

    for (const value of values) {
        switch (value?.javaType.oneofKind) {
            case "javaClassType":
                const packageName = dictionary.packages[value.javaType.javaClassType.packageIndex]
                if (packageName && value.javaType.javaClassType.name) {
                    types.push(`${packageName}.${value.javaType.javaClassType.name}`)
                }
                break
            case "primitive":
                if (value.javaType.primitive !== "void") {
                    types.push(value.javaType.primitive)
                }
                break
        }
    }

    return types.filter(Boolean).join(", ")
}
