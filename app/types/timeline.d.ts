export interface MetricInstant {
  time: string;
  value: number;
}

export interface LiveSummary {
  events: Map<string, MetricInstant[]>;
  metrics: Map<string, MetricInstant[]>;
}

export interface WorldMetrics {
  world: string;
  mspt: MetricInstant[];
}

export interface RegionMetrics {
  region: string;
  tps: MetricInstant[];
  mspt: MetricInstant[];
}
