import { defineNuxtPlugin } from '#app'
import hljs from 'highlight.js'
import createDOMPurify from 'dompurify'
import { JSDOM } from 'jsdom'

export default defineNuxtPlugin((nuxtApp) => {
  const window = new JSDOM('').window
  const DOMPurify = createDOMPurify(window)

  nuxtApp.provide('highlight', (code: string, language?: string): string => {
    const rawHtml = language && hljs.getLanguage(language)
      ? hljs.highlight(code, { language }).value
      : hljs.highlightAuto(code).value
    return DOMPurify.sanitize(rawHtml)
  })
})
