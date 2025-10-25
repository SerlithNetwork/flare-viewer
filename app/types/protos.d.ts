import {
    type MemoryProfileV2, type MemoryProfileV2_Children,
    MethodDictionarySlice, type MethodDictionarySlice_MethodDictionaryEntry,
    type TimeProfileV2,
    type TimeProfileV2_Children
} from "~/proto/ProfileFile_pb";

public export interface AirplaneProfileFileV2Data {

    dictionary: MethodDictionarySlice[];

    timeProfile: TimeProfileV2[];

    memoryProfile: MemoryProfileV2[];

}

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

public export interface TimeProfileV2Children {

    methodDefinition: MethodDefinition;

    time: number;

    plugin: string;

    samples: number;

    children: TimeProfileV2_Children[];

}

public export interface MemoryProfileV2Children {

    methodDefinition: MethodDefinition;

    plugin: string;

    bytes: number;

    children: MemoryProfileV2_Children[];

}
