
export interface FlareProfile {
    raw: string;
    dataSamples: string[];
    timelineSamples: string[];
    createdAt: string;
}

export interface TypedProfilerSample {
    type: string;
    payload: string;
}
