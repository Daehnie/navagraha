import { defineConfig } from 'astro/config'

// Fuer GitHub Pages mit eigener Domain bleibt site auf der Domain stehen.
// Ohne eigene Domain stattdessen:
//   site: 'https://<user>.github.io', base: '/navagraha'
export default defineConfig({
  site: 'https://navagraha.digitalspirit.io',
  i18n: {
    defaultLocale: 'de',
    locales: ['de', 'en'],
    routing: { prefixDefaultLocale: false }
  }
})
