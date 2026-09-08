import de from './de.json'
import en from './en.json'

export const languages = { de: 'Deutsch', en: 'English' } as const
export type Lang = keyof typeof languages
export const defaultLang: Lang = 'de'

const dict = { de, en }

export function getLangFromUrl(url: URL): Lang {
  const [, seg] = url.pathname.split('/')
  return seg in dict ? (seg as Lang) : defaultLang
}

export function useTranslations(lang: Lang) {
  return dict[lang]
}

/** Baut einen Pfad in der aktiven Sprache: path('/palette', 'en') -> '/en/palette' */
export function path(p: string, lang: Lang) {
  return lang === defaultLang ? p : `/${lang}${p}`
}
