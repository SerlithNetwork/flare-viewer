
export interface MetricInstant {
    time: number;
    value: number;
}

export interface LiveSummary {
    events: Map<string, MetricInstant[]>;
    metrics: Map<string, MetricInstant[]>;
}
