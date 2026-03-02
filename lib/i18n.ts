export type Locale = 'tr' | 'en'

export const defaultLocale: Locale = 'tr'
export const locales: Locale[] = ['tr', 'en']

export function getLocaleFromPath(pathname: string): Locale {
  const segments = pathname.split('/')
  const firstSegment = segments[1]
  return locales.includes(firstSegment as Locale) ? (firstSegment as Locale) : defaultLocale
}
