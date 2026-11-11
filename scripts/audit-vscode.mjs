// Prueft die erzeugten VS-Code-Themes gegen die Regeln des Projekts:
//   Text auf seiner Flaeche      mindestens 4,5:1
//   Kanten und Grafik            mindestens 3:1
//   Aufgeloeste Flaechen         aller Text darauf 4,5:1, jede Kante 3:1
// und, wenn VS Code installiert ist, ob jeder Schluessel dort existiert — ein
// Tippfehler in einem Schluessel wirkt sonst stumm gar nicht.
//
//   npm run audit:vscode             nur Verstoesse und Zusammenfassung
//   npm run audit:vscode -- --alle   jedes Paar mit seinem Wert
//   npm run audit:vscode -- --dir X  Themes aus einem anderen Ordner
//
// Endet mit Status 1, wenn etwas verstoesst. Setzt voraus, dass
// `npm run generate:themes` gelaufen ist; liest nur, schreibt nichts.
//
// Bewusst nicht geprueft: der Griff des Scrollbalkens (liegt mit 2,0 bis 2,2:1
// unter 3:1, damit die angeschnittene letzte Zeile lesbar bleibt) und der
// Standardtext von VS Code in Bereichen, die das Theme nicht setzt.

import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { VARIANT_ORDER, VSCODE_SOLVED } from './theme-schemas.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const args = process.argv.slice(2)
const alle = args.includes('--alle')
const dirIdx = args.indexOf('--dir')
const themesDir = dirIdx === -1
  ? join(root, 'themes', 'vscode', 'navagraha', 'themes')
  : args[dirIdx + 1]

const palette = JSON.parse(readFileSync(join(root, 'src', 'data', 'palette.json'), 'utf8'))

// --- Farbrechnung ---------------------------------------------------------

const toRgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16))
const lin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
const luminance = (hex) => {
  const [r, g, b] = toRgb(hex).map((c) => lin(c / 255))
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
const contrast = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}
const mix = (fg, alpha, ground) => `#${toRgb(fg)
  .map((c, i) => Math.round(c * alpha + toRgb(ground)[i] * (1 - alpha)).toString(16).padStart(2, '0'))
  .join('')}`
// Ein Hexwert mit Deckkraft ("#rrggbbaa") ueber seinem Grund, sonst unveraendert.
const flat = (hex, ground) => (hex.length > 7 ? mix(hex.slice(0, 7), parseInt(hex.slice(7, 9), 16) / 255, ground) : hex)

// --- Was geprueft wird ----------------------------------------------------

// [Vordergrund, Grund, Beschreibung] — Text, mindestens 4,5:1.
const TEXT = [
  ['statusBar.foreground', 'statusBar.background', 'Statusleiste'],
  ['statusBarItem.prominentForeground', 'statusBarItem.prominentBackground', 'Statusleiste: Sprachausgabe'],
  ['statusBarItem.prominentHoverForeground', 'statusBarItem.prominentHoverBackground', 'Statusleiste: Sprachausgabe, Hover'],
  ['statusBarItem.hoverForeground', 'statusBarItem.hoverBackground', 'Statusleiste: Hover'],
  ['statusBarItem.hoverForeground', 'statusBarItem.activeBackground', 'Statusleiste: gedrueckt'],
  ['statusBarItem.remoteForeground', 'statusBarItem.remoteBackground', 'Statusleiste: Remote'],
  ['statusBarItem.errorForeground', 'statusBarItem.errorBackground', 'Statusleiste: Fehler'],
  ['statusBarItem.errorHoverForeground', 'statusBarItem.errorHoverBackground', 'Statusleiste: Fehler, Hover'],
  ['statusBarItem.warningForeground', 'statusBarItem.warningBackground', 'Statusleiste: Warnung'],
  ['statusBarItem.warningHoverForeground', 'statusBarItem.warningHoverBackground', 'Statusleiste: Warnung, Hover'],
  ['statusBarItem.offlineForeground', 'statusBarItem.offlineBackground', 'Statusleiste: Offline'],
  ['statusBar.debuggingForeground', 'statusBar.debuggingBackground', 'Statusleiste: Debuggen'],
  ['activityBar.foreground', 'activityBar.background', 'Aktivitaetsleiste aktiv'],
  ['activityBar.inactiveForeground', 'activityBar.background', 'Aktivitaetsleiste inaktiv'],
  ['activityBarBadge.foreground', 'activityBarBadge.background', 'Plakette'],
  ['button.foreground', 'button.background', 'Knopf'],
  ['button.foreground', 'button.hoverBackground', 'Knopf, Hover'],
  ['button.secondaryForeground', 'button.secondaryBackground', 'Zweitknopf'],
  ['button.secondaryForeground', 'button.secondaryHoverBackground', 'Zweitknopf, Hover'],
  ['modernEditorTab.activeForeground', 'modernEditorTab.activeBackground', 'Reiter aktiv'],
  ['tab.inactiveForeground', 'editorGroupHeader.tabsBackground', 'Reiter inaktiv'],
  ['modernEditorTab.hoverForeground', 'modernEditorTab.hoverBackground', 'Reiter, Hover'],
  ['list.activeSelectionForeground', 'list.activeSelectionBackground', 'Liste gewaehlt'],
  ['list.focusHighlightForeground', 'list.activeSelectionBackground', 'Liste gewaehlt: Treffer'],
  ['list.highlightForeground', 'sideBar.background', 'Liste: Treffer'],
  ['list.highlightForeground', 'list.hoverBackground', 'Liste, Hover: Treffer'],
  ['sideBar.foreground', 'list.hoverBackground', 'Seitenleiste, Hover'],
  ['sideBar.foreground', 'list.inactiveSelectionBackground', 'Seitenleiste, inaktiv gewaehlt'],
  ['sideBar.foreground', 'sideBar.background', 'Seitenleiste'],
  ['sideBarTitle.foreground', 'sideBar.background', 'Seitenleiste: Titel'],
  ['sideBarSectionHeader.foreground', 'sideBarSectionHeader.background', 'Seitenleiste: Abschnitt'],
  ['input.foreground', 'input.background', 'Eingabefeld'],
  ['input.placeholderForeground', 'input.background', 'Eingabefeld: Platzhalter'],
  ['inputOption.activeForeground', 'inputOption.activeBackground', 'Schalter aktiv'],
  ['dropdown.foreground', 'dropdown.background', 'Auswahlmenue'],
  ['editorSuggestWidget.highlightForeground', 'editorSuggestWidget.background', 'Vorschlag: Treffer'],
  ['editorSuggestWidget.focusHighlightForeground', 'editorSuggestWidget.selectedBackground', 'Vorschlag gewaehlt: Treffer'],
  ['pickerGroup.foreground', 'editorWidget.background', 'Schnellwahl: Gruppe'],
  ['editorLineNumber.foreground', 'editor.background', 'Zeilennummer'],
  ['editorLineNumber.activeForeground', 'editor.background', 'Zeilennummer aktiv'],
  ['editorLineNumber.foreground', 'diffEditorGutter.insertedLineBackground', 'Diff-Rinne eingefuegt: Zeilennummer'],
  ['editorLineNumber.foreground', 'diffEditorGutter.removedLineBackground', 'Diff-Rinne entfernt: Zeilennummer'],
  ['editorLineNumber.activeForeground', 'diffEditorGutter.removedLineBackground', 'Diff-Rinne entfernt: aktive Nummer'],
  ['editorLineNumber.foreground', 'editor.findMatchBackground', 'Zeilennummer unter Treffer'],
  ['editorCodeLens.foreground', 'editor.background', 'CodeLens'],
  ['editorInlayHint.foreground', 'editorInlayHint.background', 'Inlay-Hinweis'],
  ['editorGhostText.foreground', 'editor.background', 'Geistertext'],
  ['editorLink.activeForeground', 'editor.background', 'Link, aktiv'],
  ['textLink.foreground', 'editor.background', 'Link'],
  ['errorForeground', 'editor.background', 'Fehlertext'],
  ['errorForeground', 'sideBar.background', 'Fehlertext in der Seitenleiste'],
  ['list.errorForeground', 'sideBar.background', 'Fehler in Listen'],
  ['list.warningForeground', 'sideBar.background', 'Warnung in Listen'],
  ['gitDecoration.addedResourceForeground', 'sideBar.background', 'Git: hinzugefuegt'],
  ['gitDecoration.modifiedResourceForeground', 'sideBar.background', 'Git: geaendert'],
  ['gitDecoration.deletedResourceForeground', 'sideBar.background', 'Git: geloescht'],
  ['gitDecoration.untrackedResourceForeground', 'sideBar.background', 'Git: neu'],
  ['gitDecoration.conflictingResourceForeground', 'sideBar.background', 'Git: Konflikt'],
  ['gitDecoration.ignoredResourceForeground', 'sideBar.background', 'Git: ignoriert'],
  ['gitDecoration.submoduleResourceForeground', 'sideBar.background', 'Git: Submodul'],
  ['badge.foreground', 'badge.background', 'Zaehler'],
  ['titleBar.activeForeground', 'titleBar.activeBackground', 'Titelleiste'],
  ['titleBar.inactiveForeground', 'titleBar.inactiveBackground', 'Titelleiste, inaktiv'],
  ['panelTitle.activeForeground', 'panel.background', 'Bereich: Titel'],
  ['panelTitle.inactiveForeground', 'panel.background', 'Bereich: Titel, inaktiv'],
  ['terminal.foreground', 'terminal.background', 'Terminal'],
  ['foreground', 'editor.background', 'Grundtext'],
  ['editor.foreground', 'editor.background', 'Editortext'],
]

// [Kante, Grund, Beschreibung] — Grafik und Raender, mindestens 3:1.
const EDGE = [
  ['input.border', 'editorWidget.background', 'Eingabefeld im Widget'],
  ['input.border', 'sideBar.background', 'Eingabefeld in der Seitenleiste'],
  ['dropdown.border', 'editorWidget.background', 'Auswahlmenue'],
  ['editorWidget.border', 'editor.background', 'Widget'],
  ['inputOption.activeBorder', 'editorWidget.background', 'Schalter aktiv'],
  ['focusBorder', 'editor.background', 'Fokusrand'],
  ['editor.findMatchBorder', 'editor.background', 'aktueller Treffer'],
  ['editorOverviewRuler.findMatchForeground', 'editor.background', 'Uebersichtsleiste: Treffer'],
  ['editorOverviewRuler.selectionHighlightForeground', 'editor.background', 'Uebersichtsleiste: Auswahl'],
  ['editorOverviewRuler.errorForeground', 'editor.background', 'Uebersichtsleiste: Fehler'],
  ['editorOverviewRuler.warningForeground', 'editor.background', 'Uebersichtsleiste: Warnung'],
  ['minimap.findMatchHighlight', 'editor.background', 'Minimap: Treffer'],
  ['panelTitle.activeBorder', 'panel.background', 'Bereich: gewaehlter Titel'],
  ['inputValidation.errorBorder', 'editorWidget.background', 'Eingabefehler'],
  ['activityBar.activeBorder', 'activityBar.background', 'Aktivitaetsleiste: gewaehlt'],
  ['activityBarBadge.background', 'activityBar.background', 'Plakette gegen das Band'],
]

// Alles, was Text tragen kann; dieselbe Menge, gegen die die Palette selbst
// auf 4,5:1 geloest ist. Die Flaechen in VSCODE_SOLVED liegen hinter Text.
const TEXT_KEYS = ['chandra', 'chandra_b', 'ketu', 'mangala', 'surya', 'guru', 'budha', 'shukra', 'shani', 'rahu']

// --- Schluessel gegen VS Code ---------------------------------------------

const vscodeApp = process.env.VSCODE_APP ?? '/Applications/Visual Studio Code.app/Contents/Resources/app'
let known = null
if (existsSync(join(vscodeApp, 'out', 'vs', 'workbench', 'workbench.desktop.main.js'))) {
  known = new Set()
  const core = readFileSync(join(vscodeApp, 'out', 'vs', 'workbench', 'workbench.desktop.main.js'), 'utf8')
  for (const m of core.matchAll(/ue\("([A-Za-z.]+)"/g)) known.add(m[1])
  // Erweiterungen wie Git tragen ihre eigenen Farben ein.
  for (const e of readdirSync(join(vscodeApp, 'extensions'))) {
    const p = join(vscodeApp, 'extensions', e, 'package.json')
    if (!existsSync(p)) continue
    try { for (const c of JSON.parse(readFileSync(p, 'utf8')).contributes?.colors ?? []) known.add(c.id) } catch { /* kaputtes Manifest */ }
  }
}

// --- Lauf -----------------------------------------------------------------

let verstoesse = 0
console.log(known ? `VS Code gefunden: ${known.size} Farbschluessel zum Abgleich.` : 'VS Code nicht gefunden (VSCODE_APP setzen): Schluessel werden nicht abgeglichen.')

for (const key of VARIANT_ORDER) {
  const file = join(themesDir, `navagraha-${key}-color-theme.json`)
  if (!existsSync(file)) { console.error(`Fehlt: ${file}. Zuerst npm run generate:themes.`); process.exit(2) }
  const t = JSON.parse(readFileSync(file, 'utf8')).colors
  const c = palette.variants[key].colors
  const ground = t['editor.background']
  const bad = []
  const lines = []
  let geprueft = 0

  // 1. Schluessel kennt VS Code? Durchnummerierte (…foreground1) erzeugt VS Code
  //    im Code, die stehen nicht als Zeichenkette im Paket.
  if (known) {
    const unbekannt = Object.keys(t).filter((k) => !known.has(k) && !/\d$/.test(k) && !k.startsWith('terminal.ansi'))
    for (const k of unbekannt) bad.push(`unbekannter Schluessel ${k}`)
  }

  // 2. Text auf Flaeche
  for (const [fg, bg, name] of TEXT) {
    if (!t[fg] || !t[bg]) { lines.push(`  ·  ${name}: ${!t[fg] ? fg : bg} nicht gesetzt (Voreinstellung)`); continue }
    const g = flat(t[bg], ground)
    const r = contrast(flat(t[fg], g), g)
    geprueft++
    lines.push(`  ${r >= 4.5 ? '✓' : '✗'}  ${name.padEnd(38)} ${r.toFixed(2)}:1`)
    if (r < 4.5) bad.push(`${name}: ${r.toFixed(2)}:1 (${fg} auf ${bg})`)
  }

  // 3. Kanten
  for (const [fg, bg, name] of EDGE) {
    if (!t[fg] || !t[bg]) continue
    const g = flat(t[bg], ground)
    const r = contrast(flat(t[fg], g), g)
    geprueft++
    lines.push(`  ${r >= 3 ? '✓' : '✗'}  Kante ${name.padEnd(32)} ${r.toFixed(2)}:1`)
    if (r < 3) bad.push(`Kante ${name}: ${r.toFixed(2)}:1 (${fg} auf ${bg})`)
  }

  // 4. Aufgeloeste Flaechen und Kanten aus VSCODE_SOLVED
  const gruende = { base: c.base }
  for (const [k, spec] of Object.entries(VSCODE_SOLVED)) {
    if (!t[k]) { bad.push(`${k} aus VSCODE_SOLVED fehlt im Theme`); continue }
    if (spec.fill) {
      const fill = flat(t[k], c.base)
      gruende[k] = fill
      const worst = Math.min(...TEXT_KEYS.map((x) => contrast(c[x], fill)))
      geprueft++
      lines.push(`  ${worst >= 4.5 ? '✓' : '✗'}  Flaeche ${k.padEnd(36)} Text ≥ ${worst.toFixed(2)}:1`)
      if (worst < 4.5) bad.push(`Flaeche ${k}: schwaechster Text ${worst.toFixed(2)}:1`)
    } else {
      const g = gruende[spec.on]
      const r = contrast(flat(t[k], g), g)
      geprueft++
      lines.push(`  ${r >= 3 ? '✓' : '✗'}  Kante ${k.padEnd(38)} ${r.toFixed(2)}:1`)
      if (r < 3) bad.push(`Kante ${k}: ${r.toFixed(2)}:1 gegen ${spec.on}`)
    }
  }

  verstoesse += bad.length
  console.log(`\n${key.padEnd(10)} ${geprueft} Paare, ${bad.length ? `${bad.length} Verstoesse` : 'keine Verstoesse'}`)
  if (alle) console.log(lines.join('\n'))
  for (const b of bad) console.log(`  ✗  ${b}`)
}

console.log(verstoesse ? `\n${verstoesse} Verstoesse.` : '\nAlle Regeln eingehalten.')
process.exit(verstoesse ? 1 : 0)
