import {
  createHighlighter,
  type BundledLanguage,
  type BundledTheme,
  type HighlighterGeneric,
} from "shiki";

let highlighterPromise:
  | Promise<HighlighterGeneric<BundledLanguage, BundledTheme>>
  | undefined;

export default function () {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ["catppuccin-macchiato", "catppuccin-latte"],
      langs: ["yaml", "yml", "properties", "toml", "json", "json5"],
    });
  }
  return highlighterPromise;
}
