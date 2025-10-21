
export interface AirplaneThreadNode {
    thread: string;
    time: number;
    bytes: number;
    children: AirplaneChildNode[];
}

export interface AirplaneChildNode {
    name: number;
    method: string;
    time: number;
    bytes: number;
    plugin: string;
    children: AirplaneChildNode[];
}
