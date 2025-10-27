export {}

declare module '#app' {
  interface NuxtApp {
    $highlight: (code: string, language?: string) => string
  }
}