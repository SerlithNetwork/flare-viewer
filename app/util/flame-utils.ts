import {
    type AbstractAccumulator,
    type ChartData,
    type ChartNode,
    constant,
    type FlameNode,
    type RawData
} from "~/types/flame";
import type {MethodDictionary} from "~/types/protos";
import {getFromDictionary} from "~/util/merge-utils";
import {formatBytes, formatMilliseconds} from "~/util/unit-utils";


const backgroundColorGradientLength = constant.backgroundColorGradient.length;
const colorGradientLength = constant.colorGradient.length;

const nms = /^net\.minecraft\.server(?:\.v[0-9R_]+)?\.(.*)$/;
const nm = /^net\.minecraft(?:\.v[0-9R_]+)?\.(.*)$/;
const obc = /^org\.bukkit\.craftbukkit(?:\.v[0-9R_]+)?\.(.*)$/;

function getNodeBackgroundColor(
    value: number,
    maxValue: number
): string {

    return constant.backgroundColorGradient[
        Math.round((value / maxValue) * (backgroundColorGradientLength - 1))
        ]!;
}

function getNodeColor(
    value: number,
    maxValue: number
): string {

    return constant.colorGradient[
        Math.round((value / maxValue) * (colorGradientLength - 1))
        ]!;
}

function simplifyPackageName(
    packageName: string | undefined,
    prefix: string,
    regex: RegExp
): string {

    if (!packageName) {
        return "";
    }

    let match = packageName.match(regex);
    if (match && match.length === 2) {
        packageName = prefix + match[1];
    }
    return packageName;
}

export function transformChartDataDirect(flameNode: FlameNode, dictionary: MethodDictionary, mode: "time" | "memory"): ChartData {
    let uidCounter = 0;

    const maxValue = flameNode.accumulator.node.units;

    const nodes = new Map<string, ChartNode>();
    const levels: string[][] = [];

    function convertNode(
        sourceNode: FlameNode,
        depth: number,
        leftOffset: number
    ): ChartNode {
        const {
            backgroundColor,
            accumulator,
            color,
            id,
            name,
            tooltip,
            value,
        } = sourceNode;

        const uidOrCounter = id || `_${uidCounter}`;

        // Add this node to the node-map and assign it a UID.
        const targetNode = {
            backgroundColor:
                backgroundColor || getNodeBackgroundColor(value, maxValue),
            color: color || getNodeColor(value, maxValue),
            depth,
            left: leftOffset,
            name,
            source: sourceNode,
            tooltip,
            width: value / maxValue,
        }
        nodes.set(uidOrCounter, targetNode);

        // Register the node's depth within the graph.
        if (levels.length <= depth) {
            levels.push([]);
        }
        levels[depth]!.push(uidOrCounter);

        // Now that the current UID has been used, increment it.
        uidCounter++;

        // Process node children.
        const children = accumulator.type === "thread" ? accumulator.node.nodes : accumulator.node.children;
        if (Array.isArray(children)) {
            children.forEach(sourceChildNode => {
                const definition = getFromDictionary(dictionary, sourceChildNode.name)

                let packageName = simplifyPackageName(definition.javaPackageName, "nms.", nms)
                packageName = simplifyPackageName(packageName, "nm.", nm)
                packageName = simplifyPackageName(packageName, "obc.", obc)

                const className = definition.javaClassName ?? ""
                const methodName = definition.javaMethodName ?? ""
                const formattedValue = mode === "time" ? formatMilliseconds(sourceChildNode.units) : formatBytes(sourceChildNode.units)

                const tooltip = `${className}.${methodName}() - ${formattedValue}`

                const childNode: FlameNode = {
                    accumulator: { node: sourceChildNode, type: "node" },
                    value: sourceChildNode.units,
                    name: `${packageName || ''}${className}.${methodName}()`,
                    tooltip,
                }

                const targetChildNode = convertNode(
                    childNode,
                    depth + 1,
                    leftOffset
                );
                leftOffset += targetChildNode.width;
            });
        }

        return targetNode;
    }

    convertNode(flameNode, 0, 0);

    const rootUid = flameNode.id || '_0';

    return {
        height: levels.length,
        levels,
        nodes,
        root: rootUid,
    };
}

export function transformChartData(rawData: RawData): ChartData {
    let uidCounter = 0;

    const maxValue = rawData.value;

    const nodes = new Map<string, ChartNode>();
    const levels: string[][] = [];

    function convertNode(
        sourceNode: RawData,
        depth: number,
        leftOffset: number
    ): ChartNode {
        const {
            backgroundColor,
            children,
            color,
            id,
            name,
            tooltip,
            value,
        } = sourceNode;

        const uidOrCounter = id || `_${uidCounter}`;

        // Add this node to the node-map and assign it a UID.
        const targetNode = {
            backgroundColor:
                backgroundColor || getNodeBackgroundColor(value, maxValue),
            color: color || getNodeColor(value, maxValue),
            depth,
            left: leftOffset,
            name,
            source: sourceNode,
            tooltip,
            width: value / maxValue,
        }
        nodes.set(uidOrCounter, targetNode);

        // Register the node's depth within the graph.
        if (levels.length <= depth) {
            levels.push([]);
        }
        levels[depth]?.push(uidOrCounter);

        // Now that the current UID has been used, increment it.
        uidCounter++;

        // Process node children.
        if (Array.isArray(children)) {
            children.forEach(sourceChildNode => {
                const targetChildNode = convertNode(
                    sourceChildNode,
                    depth + 1,
                    leftOffset
                );
                leftOffset += targetChildNode.width;
            });
        }

        return targetNode;
    }

    convertNode(rawData, 0, 0);

    const rootUid = rawData.id || '_0';

    return {
        height: levels.length,
        levels,
        nodes,
        root: rootUid,
    };
}

export function toFlameNode(
    accumulator: AbstractAccumulator,
    dictionary: MethodDictionary,
    isAlloc: boolean
): [RawData, number] {
    let name;
    let tooltip;

    if (accumulator.type === "thread") {
        name = accumulator.node.name;
    } else if (accumulator.type === "node") {

        const definition = getFromDictionary(dictionary, accumulator.node.name);

        if (definition.methodType === "native") {
            name = definition.fullName + ' (native)';
        } else {
            let className = definition.javaClassName ?? ""
            let methodName = definition.javaMethodName ?? ""
            let packageName = definition.javaPackageName ?? ""

            const nms = /^net\.minecraft\.server(?:\.v[0-9R_]+)?\.(.*)$/;
            packageName = simplifyPackageName(packageName, 'nms.', nms);

            const nm = /^net\.minecraft(?:\.v[0-9R_]+)?\.(.*)$/;
            packageName = simplifyPackageName(packageName, 'nm.', nm);

            const obc = /^org\.bukkit\.craftbukkit(?:\.v[0-9R_]+)?\.(.*)$/;
            packageName = simplifyPackageName(packageName, 'obc.', obc);

            name = `${packageName || ''}${className}.${methodName}()`;
            const formattedValue = isAlloc
                ? formatBytes(accumulator.node.units)
                : formatMilliseconds(accumulator.node.units);

            tooltip = `${definition.javaClassName}.${definition.javaMethodName}() - ${formattedValue}`;
        }
    } else {
        throw new Error('unknown type: ' + (accumulator as any).type);
    }

    const value = accumulator.node.units;
    const children = [];

    let depth = 1;

    const sortedChildren = ( accumulator.type === "thread" ? accumulator.node.nodes : accumulator.node.children )
        .values()
        .toArray()
        .sort((a, b) => b.units - a.units);

    for (const child of sortedChildren) {
        const [childData, childDepth] = toFlameNode(
            { node: child, type: "node" },
            dictionary,
            isAlloc,
        );
        depth = Math.max(depth, childDepth + 1);
        children.push(childData);
    }

    return [{ name, tooltip, value, children }, depth];
}

