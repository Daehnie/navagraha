import { defineConfig } from 'astro/config'

// Ausgeliefert wird unter der github.io-Adresse, daher site + base.
// Mit eigener Domain stattdessen:
//   site: 'https://navagraha.digitalspirit.io', base entfaellt
export default defineConfig({
  site: 'https://daehnie.github.io',
  base: '/navagraha',
  i18n: {
    defaultLocale: 'de',
    locales: ['de', 'en'],
    routing: { prefixDefaultLocale: false }
  }
})
