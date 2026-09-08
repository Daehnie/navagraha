import de from './de.json'
import en from './en.json'

export const languages = { de: 'Deutsch', en: 'English' } as const
export type Lang = keyof typeof languages
export const defaultLang: Lang = 'de'

const dict = { de, en }

/**
 * Basispfad ohne Schraegstrich am Ende: '' bei eigener Domain, sonst z. B.
 * '/navagraha'. Astro setzt absolute Pfade im Markup nicht selbst davor,
 * deshalb laufen alle internen Links und Assets ueber path() bzw. asset().
 */
export const base = import.meta.env.BASE_URL.replace(/\/$/, '')

/** Nimmt den Basispfad von einem Pfadnamen ab. */
export function stripBase(pathname: string) {
  return (pathname.startsWith(base) ? pathname.slice(base.length) : pathname) || '/'
}

/** Verweis auf eine Datei in public/: asset('/favicon.svg') */
export function asset(p: string) {
  return `${base}${p}`
}

export function getLangFromUrl(url: URL): Lang {
  const [, seg] = stripBase(url.pathname).split('/')
  return seg in dict ? (seg as Lang) : defaultLang
}

export function useTranslations(lang: Lang) {
  return dict[lang]
}

/** Baut einen Pfad in der aktiven Sprache: path('/palette', 'en') -> '/en/palette' */
export function path(p: string, lang: Lang) {
  return lang === defaultLang ? `${base}${p}` : `${base}/${lang}${p}`
}
