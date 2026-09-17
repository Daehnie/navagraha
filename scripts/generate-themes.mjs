// Erzeugt alle Dateien unter themes/ aus src/data/palette.json.
// palette.json ist die einzige Farbquelle — die Ausgaben hier nie von Hand
// bearbeiten, sondern die Palette aendern und neu generieren.
//
// themes/vim/ bleibt unangetastet. themes/bat/navagraha.tmTheme wird erzeugt,
// enthaelt aber wie vim keine Hexwerte: beide nehmen die Farben ueber die
// ANSI-Plaetze vom Terminal.

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

import {
  VARIANT_ORDER, ANSI_SLOTS, ANSI_SLOT_LABELS, ANSI_SLOT_NAMES, TABBY_HEADER,
  TABBY_VARIANT_NOTES, TABBY_NAMED, ITERM_FIXED, VSCODE_COLORS,
  VSCODE_SEMANTIC, VSCODE_TOKEN_RULES, COTEDITOR_COLORS,
  COTEDITOR_SYSTEM_COLORS, APPLE_TERMINAL_FIXED,
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

// macOS liest einen Hexwert an mehreren Stellen nicht als sRGB, sondern als
// Generic RGB (NSColor calibrated): CotEditor speichert seine Themes so, das
// Terminal archiviert seine Farben so. Ungerechnet zeigte CotEditor jede Farbe
// 9 bis 22 Stufen heller. Die Umrechnung: sRGB linearisieren, Matrix aus den
// Primaerfarben der macOS-Profile "sRGB Profile" und "Generic RGB Profile"
// (beide auf D50), dann mit dem Mac-Gamma 461/256 codieren. Gegen die
// Umrechnung von macOS geprueft: hoechstens 1 Stufe, im Blaukanal nahe 0 bis
// zu 2.
const SRGB_TO_GENERIC = [
  [0.9748492, 0.0273096, -0.0021511],
  [-0.0200145, 1.054192, -0.0342235],
  [0.0016844, 0.0015574, 0.9967426],
]

// Die drei Komponenten in Generic RGB, jede von 0 bis 1.
const toGeneric = (hex) => {
  const lin = [1, 3, 5]
    .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((u) => (u <= 0.04045 ? u / 12.92 : ((u + 0.055) / 1.055) ** 2.4))
  return SRGB_TO_GENERIC
    .map((row) => row[0] * lin[0] + row[1] * lin[1] + row[2] * lin[2])
    .map((v) => Math.min(1, Math.max(0, v)) ** (256 / 461))
}

const toGenericRgb = (hex) => `#${toGeneric(hex)
  .map((v) => Math.round(v * 255).toString(16).padStart(2, '0'))
  .join('')}`

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

// --- Terminal von macOS ---------------------------------------------------

// Terminal.app legt jede Farbe als NSColor im Format von NSKeyedArchiver ab,
// base64 in einem <data>-Block. NSKeyedUnarchiver liest ein solches Archiv
// auch als XML-Plist, deshalb steht es hier lesbar da statt als Binaerformat.
// Der Farbraum ist NSCalibratedRGB, also Generic RGB.
const nsColorArchive = (hex) => {
  const rgb = `${toGeneric(hex).map((v) => v.toFixed(6)).join(' ')}\0`
  const archive = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<plist version="1.0"><dict>',
    '<key>$archiver</key><string>NSKeyedArchiver</string>',
    '<key>$version</key><integer>100000</integer>',
    '<key>$top</key><dict><key>root</key><dict><key>CF$UID</key><integer>1</integer></dict></dict>',
    '<key>$objects</key><array>',
    '<string>$null</string>',
    '<dict><key>$class</key><dict><key>CF$UID</key><integer>2</integer></dict>'
    + '<key>NSColorSpace</key><integer>1</integer>'
    + `<key>NSRGB</key><data>${Buffer.from(rgb, 'utf8').toString('base64')}</data></dict>`,
    '<dict><key>$classname</key><string>NSColor</string>'
    + '<key>$classes</key><array><string>NSColor</string><string>NSObject</string></array></dict>',
    '</array>',
    '</dict></plist>',
  ].join('\n')

  return Buffer.from(archive, 'utf8').toString('base64')
    .match(/.{1,68}/g)
    .map((line) => `\t${line}`)
    .join('\n')
}

function generateAppleTerminal() {
  mkdirSync(join(root, 'themes', 'apple-terminal'), { recursive: true })
  for (const key of VARIANT_ORDER) {
    const v = palette.variants[key]
    const entries = {}
    ANSI_SLOTS.forEach((colorKey, i) => {
      entries[`ANSI${ANSI_SLOT_NAMES[i]}Color`] = v.colors[colorKey]
    })
    for (const [terminalKey, colorKey] of Object.entries(APPLE_TERMINAL_FIXED)) {
      entries[terminalKey] = v.colors[colorKey]
    }

    // Terminal.app schreibt die Keys alphabetisch, name und type ans Ende.
    // Schrift, Fenstergroesse und Verhalten stehen bewusst nicht drin: das
    // Profil bringt Farben mit, sonst nichts.
    const body = Object.keys(entries).sort()
      .map((k) => `\t<key>${k}</key>\n\t<data>\n${nsColorArchive(entries[k])}\n\t</data>`)
      .join('\n')

    write('themes', 'apple-terminal', `Navagraha ${v.label}.terminal`,
      '<?xml version="1.0" encoding="UTF-8"?>\n'
      + '<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">\n'
      + '<plist version="1.0">\n<dict>\n'
      + body
      + `\n\t<key>name</key>\n\t<string>Navagraha ${v.label}</string>\n`
      + '\t<key>type</key>\n\t<string>Window Settings</string>\n'
      + '</dict>\n</plist>\n')
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
      colors[`terminal.ansi${ANSI_SLOT_NAMES[i]}`] = v.colors[colorKey]
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

// --- CotEditor ------------------------------------------------------------

// CotEditor zeigt den Dateinamen als Namen des Themes. Die Schluessel stehen
// alphabetisch wie in den mitgelieferten Themes.
function generateCotEditorThemes() {
  mkdirSync(join(root, 'themes', 'coteditor'), { recursive: true })
  for (const key of VARIANT_ORDER) {
    const v = palette.variants[key]
    const theme = {
      metadata: {
        description: `Navagraha ${v.label} · https://daehnie.github.io/navagraha/`,
        distributionURL: 'https://github.com/Daehnie/navagraha',
        license: 'MIT',
      },
    }
    for (const [name, [colorKey, alpha]] of Object.entries(COTEDITOR_COLORS)) {
      theme[name] = { color: withAlpha(toGenericRgb(v.colors[colorKey]), alpha) }
    }
    for (const [name, [colorKey, alpha]] of Object.entries(COTEDITOR_SYSTEM_COLORS)) {
      theme[name] = { color: withAlpha(toGenericRgb(v.colors[colorKey]), alpha), usesSystemSetting: false }
    }
    const sorted = Object.fromEntries(Object.keys(theme).sort().map((k) => [k, theme[k]]))
    write('themes', 'coteditor', `Navagraha ${v.label}.cottheme`, `${JSON.stringify(sorted, null, 2)}\n`)
  }
}

// --- Lauf -----------------------------------------------------------------

generateTabby()
generateIterm2()
generateAppleTerminal()
generateVscodeThemes()
updateVscodePackageJson()
generateBatTheme()
generateCotEditorThemes()

console.log(`themes/ aus palette.json erzeugt (${VARIANT_ORDER.length} Varianten).`)
