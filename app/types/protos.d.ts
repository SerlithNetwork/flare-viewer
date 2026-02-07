import {
    type MemoryProfileV2, type MemoryProfileV2_Children,
    type MethodDictionarySlice_MethodDictionaryEntry,
    type TimeProfileV2,
    type TimeProfileV2_Children
} from "~/proto/ProfileFile_pb";


public export interface MethodDictionary {

    methods: MethodDictionarySlice_MethodDictionaryEntry[];

    packages: string[];

}

public export interface MethodDefinition {

    javaClassName?: string;

    javaMethodName?: string;

    javaPackageName?: string;

    javaArguments?: string;

    javaReturn?: string;

    otherPath?: string;

    fullName: string;

    methodType: "java" | "native" | "kernel" | "java?";

}

export interface ThreadAccumulator {
    name: string;
    units: number;
    nodes: Map<number, NodeAccumulator>;
    plugins: Set<string>;
}

export interface NodeAccumulator {
    name: number;
    units: number;
    children: Map<number, NodeAccumulator>;
    plugins: Set<string>;
    plugin?: string;
}

export type AirplaneSample = {
    threads: TimeProfileV2[],
    type: "time"
} | {
    threads: MemoryProfileV2[];
    type: "memory"
}

export type AirplaneNode = {
    nodes: TimeProfileV2_Children[],
    type: "time"
} | {
    nodes: MemoryProfileV2_Children[];
    type: "memory"
}
