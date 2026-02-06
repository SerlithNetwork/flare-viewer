<script setup lang="ts">

import type {MethodDictionary} from "~/types/protos";
import type {AbstractNode} from "~/types/profiler";
type Props = {
  node: AbstractNode,
  dictionary: MethodDictionary,
}
const props = defineProps<Props>()
function toFlameNode(
    entry: AbstractNode,
    dictionary: MethodDictionary,
) {
  switch (entry.type) {
    case "time":
      break
    case "memory":
      break
    case "time_children":
      break
    case "memory_children":
      break
  }
}
function simplifyPackageName(
    packageName: string | undefined,
    prefix: string,
    regex: RegExp
) {
  if (!packageName) {
    return packageName;
  }
  let match = packageName.match(regex);
  if (match && match.length === 2) {
    packageName = prefix + match[1];
  }
  return packageName;
}

</script>

<template>

</template>

<style scoped>

</style>