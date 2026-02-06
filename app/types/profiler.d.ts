import type {
    MemoryProfileV2,
    MemoryProfileV2_Children,
    TimeProfileV2,
    TimeProfileV2_Children
} from "~/proto/ProfileFile_pb";

export type AbstractNode = {
    node: TimeProfileV2,
    type: "time",
} | {
    node: MemoryProfileV2;
    type: "memory",
} | {
    node: TimeProfileV2_Children,
    type: "time_children",
} | {
    node: MemoryProfileV2_Children,
    type: "memory_children",
}
