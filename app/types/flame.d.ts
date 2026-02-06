
export const constant = {
    minWidthToDisplay: 1,
    minWidthToDisplayText: 12,
    rowHeight: 20,

    backgroundColorGradient: [
        '#37afa9',
        '#4bb0a5',
        '#5ab0a1',
        '#67b19d',
        '#72b299',
        '#7cb295',
        '#86b390',
        '#8fb48c',
        '#97b488',
        '#9fb584',
        '#a6b680',
        '#aeb67b',
        '#b5b777',
        '#bcb772',
        '#c2b86e',
        '#c9b869',
        '#cfb965',
        '#d5b960',
        '#dbba5b',
        '#e1ba56',
        '#e7bb50',
        '#edbb4b',
        '#f3bb45',
        '#f8bc3f',
        '#febc38',
    ],

    colorGradient: ['#000000'],
}

export interface RawData {
    backgroundColor?: string;
    color?: string;
    children?: RawData[];
    id?: string;
    name: string;
    tooltip?: string;
    uid?: any;
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
    levels: number[][];
    nodes: {
        [uid: number]: ChartNode
    };
    root: number;
}

export interface ItemData {
    containerWidth: number;
    data: ChartData;
    disableDefaultTooltips: boolean;
    focusedNode: ChartNode;
    scale: (value: number) => number;
}
