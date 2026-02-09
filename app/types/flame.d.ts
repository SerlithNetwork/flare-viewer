import type {NodeAccumulator, ThreadAccumulator} from "~/types/protos";

export interface FlameConstants {
    minWidthToDisplay: number,
    minWidthToDisplayText: number,
    rowHeight: number,
    backgroundColorGradient: string[],
    colorGradient: string[],
}

export interface RawData {
    backgroundColor?: string;
    color?: string;
    children?: RawData[];
    id?: string;
    name: string;
    tooltip?: string;
    uid?: string;
    value: number;
}

export interface ChartNode {
    backgroundColor: string;
    color: string;
    depth: number;
    left: number;
    name: string;
    source: RawData;
    tooltip?: string;
    width: number;
}

export interface ChartData {
    height: number;
    levels: string[][];
    nodes: Map<string, ChartNode>;
    root: string;
}

export interface ItemData {
    containerWidth: number;
    data: ChartData;
    disableDefaultTooltips: boolean;
    focusedNode: ChartNode;
    scale: (value: number) => number;
}

export type AbstractAccumulator = {
    node: ThreadAccumulator;
    type: "thread";
} | {
    node: NodeAccumulator;
    type: "node";
}

export interface FlameNode {
    accumulator: AbstractAccumulator;
    backgroundColor?: string;
    color?: string;
    id?: string;
    name: string;
    tooltip?: string;
    uid?: any;
    value: number;
}
