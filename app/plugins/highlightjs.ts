import { defineNuxtPlugin } from '#app'
import hljs from 'highlight.js'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.provide('highlight', (code: string, lang?: string) => {
    if (lang && hljs.getLanguage(lang)) {
      return hljs.highlight(code, { language: lang }).value
    }
    return hljs.highlightAuto(code).value
  })
})