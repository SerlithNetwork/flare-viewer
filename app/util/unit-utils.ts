
export function formatBytes(bytes: number): string {
    const units = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const factor = 1024;

    if (bytes < factor) return `${bytes} Bytes`;
    let i = 1;
    while (i < units.length && bytes >= Math.pow(factor, i)) {
        i++;
    }
    const value = bytes / Math.pow(factor, i - 1);
    return `${value.toFixed(2)} ${units[i - 1]}`;
}

export function formatMilliseconds(ms: number): string {
    const units = [
        { unit: 'ms', factor: 1 },
        { unit: 's', factor: 1_000 },
        { unit: 'min', factor: 60_000 },
        { unit: 'h', factor: 3_600_000 }
    ];

    let i = 0;
    while (i < units.length - 1 && ms >= units[i + 1]!.factor) {
        i++;
    }
    const value = ms / units[i]!.factor;
    const formatted = units[i]!.unit === 'ms' ? Math.round(value).toString() : value.toFixed(2);
    return `${formatted} ${units[i]!.unit}`;
}

export function formatPercentage(percentage: number): string {
    return `${(percentage * 100).toFixed(1)}%`;
}

export function calculatePercentage(part: number, total: number): number {
    if (!total) {
        return 0
    }
    return part / total;
}
