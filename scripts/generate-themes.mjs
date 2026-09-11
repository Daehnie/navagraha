// Erzeugt alle Dateien unter themes/ aus src/data/palette.json.
// palette.json ist die einzige Farbquelle — die Ausgaben hier nie von Hand
// bearbeiten, sondern die Palette aendern und neu generieren.
//
// themes/vim/ bleibt unangetastet. themes/bat/navagraha.tmTheme wird erzeugt,
// enthaelt aber wie vim keine Hexwerte: beide nehmen die Farben ueber die
// ANSI-Plaetze vom Terminal.

import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

import {
  VARIANT_ORDER, ANSI_SLOTS, ANSI_SLOT_LABELS, TABBY_HEADER,
  TABBY_VARIANT_NOTES, TABBY_NAMED, ITERM_FIXED, VSCODE_COLORS,
  VSCODE_ANSI_NAMES, VSCODE_SEMANTIC, VSCODE_TOKEN_RULES,
} from './theme-schemas.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const read = (...p) => readFileSync(join(root, ...p), 'utf8')
const write = (...args) => {
  const content = args.pop()
  writeFileSync(join(root, ...args), content)
}

const palette = JSON.parse(read('src', 'data', 'palette.json'))

// --- Helfer ---------------------------------------------------------------

// Plist schreibt 0 und 1 mit Dezimalpunkt, JS nicht.
const formatFloat = (n) => {
  const s = n.toString()
  return s.includes('.') ? s : `${s}.0`
}

const component = (hex, offset) =>
  formatFloat(parseInt(hex.slice(offset, offset + 2), 16) / 255)

const withAlpha = (hex, alpha) => (alpha ? hex + alpha : hex)

// --- tabby ----------------------------------------------------------------

function generateTabby() {
  const blocks = VARIANT_ORDER.map((key) => {
    const v = palette.variants[key]
    const named = Object.entries(TABBY_NAMED)
      .map(([field, colorKey]) => `      ${field}: "${v.colors[colorKey]}"`)
      .join('\n')
    const colors = ANSI_SLOTS.map((colorKey, i) => {
      const [name, graha] = ANSI_SLOT_LABELS[i]
      const slot = String(i).padStart(2)
      return `        - "${v.colors[colorKey]}"  # ${slot} ${name.padEnd(11)} – ${graha}`
    }).join('\n')

    return [
      `    # ${TABBY_VARIANT_NOTES[key]}`,
      `    - name: "Navagraha ${v.label}"`,
      named,
      '      colors:',
      colors,
    ].join('\n')
  })

  const body = `${TABBY_HEADER}\n\nterminal:\n  customColorSchemes:\n${blocks.join('\n\n')}\n`
  write('themes', 'tabby', 'navagraha.yaml', body)
}

// --- iTerm2 ---------------------------------------------------------------

function itermColorDict(hex, alpha = 1) {
  return [
    '\t<dict>',
    '\t\t<key>Alpha Component</key>',
    `\t\t<real>${formatFloat(alpha)}</real>`,
    '\t\t<key>Blue Component</key>',
    `\t\t<real>${component(hex, 5)}</real>`,
    '\t\t<key>Color Space</key>',
    '\t\t<string>sRGB</string>',
    '\t\t<key>Green Component</key>',
    `\t\t<real>${component(hex, 3)}</real>`,
    '\t\t<key>Red Component</key>',
    `\t\t<real>${component(hex, 1)}</real>`,
    '\t</dict>',
  ].join('\n')
}

function generateIterm2() {
  for (const key of VARIANT_ORDER) {
    const v = palette.variants[key]
    const entries = {}
    ANSI_SLOTS.forEach((colorKey, i) => {
      entries[`Ansi ${i} Color`] = { hex: v.colors[colorKey] }
    })
    for (const [itermKey, value] of Object.entries(ITERM_FIXED)) {
      const [colorKey, alpha] = [].concat(value)
      entries[itermKey] = { hex: v.colors[colorKey], alpha }
    }

    // iTerm2 schreibt die Keys alphabetisch, also "Ansi 10" vor "Ansi 2".
    const body = Object.keys(entries).sort()
      .map((k) => `\t<key>${k}</key>\n${itermColorDict(entries[k].hex, entries[k].alpha)}`)
      .join('\n')

    write('themes', 'iterm2', `Navagraha ${v.label}.itermcolors`,
      '<?xml version="1.0" encoding="UTF-8"?>\n'
      + '<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">\n'
      + `<plist version="1.0">\n<dict>\n${body}\n</dict>\n</plist>\n`)
  }
}

// --- VS Code --------------------------------------------------------------

function generateVscodeThemes() {
  for (const key of VARIANT_ORDER) {
    const v = palette.variants[key]

    const colors = {}
    for (const [vscodeKey, [colorKey, alpha]] of Object.entries(VSCODE_COLORS)) {
      colors[vscodeKey] = withAlpha(v.colors[colorKey], alpha)
    }
    ANSI_SLOTS.forEach((colorKey, i) => {
      colors[`terminal.ansi${VSCODE_ANSI_NAMES[i]}`] = v.colors[colorKey]
    })

    const theme = {
      name: `Navagraha ${v.label}`,
      type: v.mode,
      semanticHighlighting: true,
      semanticTokenColors: Object.fromEntries(
        Object.entries(VSCODE_SEMANTIC).map(([token, colorKey]) => [token, v.colors[colorKey]]),
      ),
      colors,
      tokenColors: VSCODE_TOKEN_RULES.map((rule) => ({
        name: rule.name,
        scope: rule.scope,
        settings: {
          foreground: v.colors[rule.paletteKey],
          ...(rule.fontStyle ? { fontStyle: rule.fontStyle } : {}),
        },
      })),
    }

    write('themes', 'vscode', 'navagraha', 'themes', `navagraha-${key}-color-theme.json`,
      JSON.stringify(theme, null, 2))
  }
}

// Nur contributes.themes und die Farbe von galleryBanner werden erzeugt.
// Alles andere — vor allem version — bleibt so stehen, wie es in der Datei steht.
function updateVscodePackageJson() {
  const path = ['themes', 'vscode', 'navagraha', 'package.json']
  const pkg = JSON.parse(read(...path))

  // Das Icon ist in Swati gezeichnet, der Banner traegt deshalb dessen Grund.
  pkg.galleryBanner = { color: palette.variants.swati.colors.base, theme: 'dark' }

  pkg.contributes.themes = VARIANT_ORDER.map((key) => {
    const v = palette.variants[key]
    return {
      label: `Navagraha ${v.label}`,
      uiTheme: v.mode === 'dark' ? 'vs-dark' : 'vs',
      path: `./themes/navagraha-${key}-color-theme.json`,
    }
  })

  write(...path, JSON.stringify(pkg, null, 2))
}

// --- bat ------------------------------------------------------------------

// bat liest eine Theme-Farbe mit Deckkraft 00 als ANSI-Platz (Nummer im
// Rotkanal) und mit 01 als Standardfarbe des Terminals. So folgt das Theme wie
// vim der Variante im Terminal. Die Scopes sind dieselben wie im VS-Code-Theme,
// damit beide nicht auseinanderlaufen. Chandra hat keinen eigenen Platz: er ist
// der Vordergrund des Terminals.
const batColor = (paletteKey) => {
  const slot = ANSI_SLOTS.indexOf(paletteKey)
  return slot === -1 ? '#00000001' : `#${slot.toString(16).padStart(2, '0')}000000`
}

function generateBatTheme() {
  const dict = (entries, indent) => [
    `${indent}<dict>`,
    ...entries.map(([k, v]) => `${indent}\t<key>${k}</key>\n${indent}\t<string>${v}</string>`),
    `${indent}</dict>`,
  ].join('\n')

  const global = [
    '\t\t<dict>',
    '\t\t\t<key>settings</key>',
    dict([
      ['background', '#00000001'],
      ['foreground', '#00000001'],
      ['gutter', '#00000001'],
      ['gutterForeground', batColor('ketu')],
    ], '\t\t\t'),
    '\t\t</dict>',
  ].join('\n')

  const rules = VSCODE_TOKEN_RULES.map((rule) => [
    '\t\t<dict>',
    '\t\t\t<key>name</key>',
    `\t\t\t<string>${rule.name}</string>`,
    '\t\t\t<key>scope</key>',
    `\t\t\t<string>${rule.scope.join(', ')}</string>`,
    '\t\t\t<key>settings</key>',
    dict([
      ['foreground', batColor(rule.paletteKey)],
      ...(rule.fontStyle ? [['fontStyle', rule.fontStyle]] : []),
    ], '\t\t\t'),
    '\t\t</dict>',
  ].join('\n'))

  write('themes', 'bat', 'navagraha.tmTheme',
    '<?xml version="1.0" encoding="UTF-8"?>\n'
    + '<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">\n'
    + '<!-- Navagraha fuer bat. Farben als ANSI-Plaetze (#RR000000) oder\n'
    + '     Terminal-Standard (#00000001), erzeugt aus scripts/theme-schemas.mjs. -->\n'
    + '<plist version="1.0">\n<dict>\n'
    + '\t<key>name</key>\n\t<string>Navagraha</string>\n'
    + '\t<key>settings</key>\n\t<array>\n'
    + [global, ...rules].join('\n')
    + '\n\t</array>\n</dict>\n</plist>\n')
}

// --- Lauf -----------------------------------------------------------------

generateTabby()
generateIterm2()
generateVscodeThemes()
updateVscodePackageJson()
generateBatTheme()

console.log(`themes/ aus palette.json erzeugt (${VARIANT_ORDER.length} Varianten).`)
