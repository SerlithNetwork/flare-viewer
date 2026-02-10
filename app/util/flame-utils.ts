import type {AbstractAccumulator, RawData} from "~/types/flame";
import type {MethodDictionary} from "~/types/protos";
import {getFromDictionary} from "~/util/merge-utils";
import {formatBytes, formatMilliseconds} from "~/util/unit-utils";




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

