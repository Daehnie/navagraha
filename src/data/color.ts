// Was die Grafiken im Methodenteil messen. Die Werte stehen nirgends in
// palette.json — sie werden beim Bauen aus den Hexwerten gerechnet, damit
// keine Zahl auf der Seite von Hand gepflegt werden muss.

const zuLinear = (c: number) => c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4

const zuRGB = (hex: string): [number, number, number] => {
  const h = hex.replace('#', '')
  return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16) / 255) as [number, number, number]
}

const zuOklab = (hex: string) => {
  const [r, g, b] = zuRGB(hex).map(zuLinear)
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b)
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b)
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b)
  return [0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s,
          1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s,
          0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s]
}

const ausOklab = (L: number, a: number, b: number) => {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3
  const s = (L - 0.0894841775 * a - 1.2914855480 * b) ** 3
  return [ 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
          -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
          -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s]
}

/** Farbton in Grad und Saettigung als Anteil dessen, was bei dieser
 *  Helligkeit und diesem Farbton in sRGB ueberhaupt moeglich ist. Nur so
 *  lassen sich Toene untereinander vergleichen: Rot kann von Natur aus
 *  gesaettigter werden als Tuerkis. */
export function ton(hex: string) {
  const [L, a, b] = zuOklab(hex)
  const C = Math.hypot(a, b)
  const grad = (Math.atan2(b, a) * 180 / Math.PI + 360) % 360
  const bogen = grad * Math.PI / 180
  let lo = 0, hi = 0.5
  for (let i = 0; i < 32; i++) {
    const mit = (lo + hi) / 2
    const rgb = ausOklab(L, mit * Math.cos(bogen), mit * Math.sin(bogen))
    if (rgb.every(x => x >= -1e-4 && x <= 1 + 1e-4)) lo = mit; else hi = mit
  }
  return { grad, anteil: lo > 0 ? Math.min(1, C / lo) : 0 }
}

const helligkeit = (hex: string) => {
  const [r, g, b] = zuRGB(hex).map(zuLinear)
  return .2126 * r + .7152 * g + .0722 * b
}

export function kontrast(a: string, b: string) {
  const [hell, dunkel] = [helligkeit(a), helligkeit(b)].sort((x, y) => y - x)
  return (hell + .05) / (dunkel + .05)
}
