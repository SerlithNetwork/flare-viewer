<script setup lang="ts">
type Props = {
  language: string;
  content: string;
};

const props = defineProps<Props>();

const color = useColorMode();
const highligher = await useHighlighter();

const html = computed(() => {
  const colorTheme =
    color.value === "dark" ? "catppuccin-macchiato" : "catppuccin-latte";
  return highligher.codeToHtml(props.content, {
    lang: props.language,
    theme: colorTheme,
    colorReplacements: {
      "catppuccin-macchiato": {
        "#24273a": "transparent",
      },
    },
  });
});
</script>

<template>
  <div v-html="html" class="text-wrap"></div>
</template>
