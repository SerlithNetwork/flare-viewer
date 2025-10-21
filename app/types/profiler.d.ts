
export interface FlareProfile {
    profile: Profile;
    createdAt: string;
}

export interface Profile {
    configs: ConfigurationFile[];
    hwInfo: HardwareInfo;
    vmOptions: VMOptions;
    os: OperatingSystem;
    v3: V3;
}

export interface ConfigurationFile {
    filename: string;
    contents: string;
}

export interface HardwareInfo {
    cpu: CPU;
    memory: Memory;
}

export interface CPU {
    model: string;
    coreCount: number;
    threadCount: number;
    frequency: number;
}

export interface Memory {
    total: number;
    swapTotal: number;
    virtualMax: number;
}

export interface VMOptions {
    version: string;
    vendor: string;
    vm: string;
    runtimeName: string;
    runtimeVersion: string;
    flags: string[];
}

export interface OperatingSystem {
    manufacturer: string;
    family: string;
    version: string;
    bitness: number;
}

export interface V3 {
    versions: Record<string, string>;
    timelineData: Record<string, TimelineData>;
    graphCategories: GraphCategory[];
}

export interface TimelineData {
    name: string;
    description: string;
    format: string;
}

export interface GraphCategory {
    name: string;
    types: string[];
    default: boolean;
}
