// Mapping-Tabellen fuer den Theme-Generator. Reine Daten, keine Logik.
// Jeder Wert verweist auf einen Farbschluessel in src/data/palette.json.

// Reihenfolge, in der die Varianten in tabby und im VS-Code-Manifest stehen.
// Weicht bewusst von der Schluesselreihenfolge in palette.json ab.
export const VARIANT_ORDER = ['pratipada', 'ushas', 'swati', 'tula']

// Die 16 ANSI-Plaetze. Geteilt von tabby, iTerm2 und den terminal.ansi*-Keys
// im VS-Code-Theme. Platz 9 ist Surya, nicht ein helleres Mangala.
export const ANSI_SLOTS = [
  'overlay', 'mangala', 'budha', 'guru', 'shani', 'rahu', 'shukra', 'subtle',
  'ketu', 'surya', 'budha_b', 'guru_b', 'shani_b', 'rahu_b', 'shukra_b', 'chandra_b',
]

// Kommentar-Beschriftung je ANSI-Platz in der tabby-Datei: [Farbname, Graha].
export const ANSI_SLOT_LABELS = [
  ['schwarz', 'Grundton'],
  ['rot', 'Mangala'],
  ['gruen', 'Budha'],
  ['gelb', 'Guru'],
  ['blau', 'Shani'],
  ['magenta', 'Rahu'],
  ['cyan', 'Shukra'],
  ['weiss', 'Chandra gedaempft'],
  ['hellschwarz', 'Ketu'],
  ['hellrot', 'Surya (Kupfer)'],
  ['hellgruen', 'Budha'],
  ['hellgelb', 'Guru'],
  ['hellblau', 'Shani'],
  ['hellmagenta', 'Rahu'],
  ['hellcyan', 'Shukra'],
  ['hellweiss', 'Chandra'],
]

// Kopfkommentar der tabby-Datei.
export const TABBY_HEADER = `# Navagraha – Tabby-Farbschemata (vier Varianten)
# Abgeleitet aus dem siderischen Geburtshoroskop (Lahiri): 23.05.1982, 19:47 MESZ, Wedel.
#
# Farbton der Akzente = klassische Graha-Farbe (BPHS)
# Saettigung          = Staerke des Grahas im Chart
# Vordergrund         = Chandra, exaltiert in Rohini
#
# Zwei Herleitungen fuer den Grundton, je hell und dunkel:
#   Pratipada / Ushas – Prithvi, aus der Erd-Gruppe im 8. und 12. Haus
#   Swati / Tula      – Vayu, aus dem Lagna (Tula) und Guru in Swati
#
# Einbau: Settings → Config file. Die vier Eintraege ab "- name:" unter
#         terminal: → customColorSchemes: einfuegen (fehlt die Liste noch,
#         beide Zeilen mit uebernehmen). Dann unter Settings → Color scheme
#         je eine Variante fuer Dark mode und Light mode waehlen.
#
# Alle Farben 1–15 liegen bei >= 4.5:1 gegen background, surface und overlay.
# Die ANSI-Plaetze tragen nur einen Farbton, keine Rolle – die Zuordnung zu
# Syntaxelementen steht in navagraha.vim bzw. im VS-Code-Theme.
# Platz 9 ist Surya (Kupfer), nicht ein helleres Mangala.`

// Kommentarzeile ueber jedem Varianten-Block in der tabby-Datei.
export const TABBY_VARIANT_NOTES = {
  pratipada: 'Erde  · dunkel · Grundton 76°  – Prithvi-Dominanz, 5 Grahas in Vrishabha und Kanya',
  ushas: 'Erde  · hell   · Grundton 76°  – dieselbe Herleitung, Ushas: die Morgenroete',
  swati: 'Luft  · dunkel · Grundton 255° – Lagna Tula, Guru in Swati, Gottheit Vayu',
  tula: 'Luft  · hell   · Grundton 255° – Lagna Tula, Vayu-Tattva',
}

// Benannte Farben eines tabby-Schemas, ausserhalb der 16 ANSI-Plaetze.
// selectionForeground wie 'Selected Text Color' in iTerm2: ohne ihn behaelt
// markierter Text seine ANSI-Farbe und liegt auf hl_high unter 4,5:1.
export const TABBY_NAMED = {
  foreground: 'chandra',
  background: 'base',
  selection: 'hl_high',
  selectionForeground: 'chandra_b',
  cursor: 'shukra',
  cursorAccent: 'base',
}

// iTerm2-Keys ausserhalb der 16 ANSI-Plaetze: paletteKey oder [paletteKey, alpha].
export const ITERM_FIXED = {
  'Background Color': 'base',
  // Das Badge liegt als grosser Schriftzug ueber dem Text; halbe Deckkraft wie
  // in iTerm2 selbst, sonst verdeckt es, was darunter steht.
  'Badge Color': ['surya', 0.5],
  'Bold Color': 'chandra_b',
  'Cursor Color': 'shukra',
  'Cursor Guide Color': 'hl_low',
  'Cursor Text Color': 'base',
  'Foreground Color': 'chandra',
  'Link Color': 'shani',
  // Ohne diesen Key faerbt iTerm2 Suchtreffer grellgelb. Die Schrift darauf
  // waehlt iTerm2 selbst (schwarz ab Helligkeit 0,5, sonst weiss); guru_b liegt
  // in allen Varianten weit genug davon weg: 10,9:1 dunkel, 9,5:1 hell.
  'Match Background Color': 'guru_b',
  'Selected Text Color': 'chandra_b',
  'Selection Color': 'hl_high',
  'Tab Color': 'surface',
}

// VS-Code-`colors`-Block: vscodeKey -> [paletteKey] oder [paletteKey, alpha].
// Die terminal.ansi*-Keys stehen hier nicht, die kommen aus ANSI_SLOTS und
// werden am Ende angehaengt (dort stehen sie auch in der echten Datei).
export const VSCODE_COLORS = {
  'editor.background': ['base'],
  'editor.foreground': ['chandra'],
  'editorLineNumber.foreground': ['ketu'],
  'editorLineNumber.activeForeground': ['guru'],
  'editorCursor.foreground': ['shukra'],
  // Treffer, Auswahl und ihre Raender stehen in VSCODE_SOLVED: ihre Deckkraft
  // haengt von der Variante ab.
  'editor.findMatchBorder': ['guru_b'],
  'editor.findRangeHighlightBackground': ['hl_low'],
  'editor.lineHighlightBackground': ['hl_low'],
  'editorIndentGuide.background1': ['hl_med'],
  'editorIndentGuide.activeBackground1': ['hl_high'],
  'editorWhitespace.foreground': ['hl_high'],
  'editorRuler.foreground': ['hl_med'],
  'editorBracketMatch.background': ['shukra', '33'],
  'editorBracketMatch.border': ['shukra'],
  // Klammern haben keine eigene Rolle in der Graha-Tabelle: sie sind Grundtext
  // wie auf der Seite. Ohne diese Keys faerbt VS Code sie mit eigenen Farben.
  'editorBracketHighlight.foreground1': ['chandra'],
  'editorBracketHighlight.foreground2': ['chandra'],
  'editorBracketHighlight.foreground3': ['chandra'],
  'editorBracketHighlight.foreground4': ['chandra'],
  'editorBracketHighlight.foreground5': ['chandra'],
  'editorBracketHighlight.foreground6': ['chandra'],
  'editorBracketHighlight.unexpectedBracket.foreground': ['mangala'],
  'editorBracketPairGuide.background1': ['hl_med'],
  'editorBracketPairGuide.background2': ['hl_med'],
  'editorBracketPairGuide.background3': ['hl_med'],
  'editorBracketPairGuide.background4': ['hl_med'],
  'editorBracketPairGuide.background5': ['hl_med'],
  'editorBracketPairGuide.background6': ['hl_med'],
  'editorBracketPairGuide.activeBackground1': ['hl_high'],
  'editorBracketPairGuide.activeBackground2': ['hl_high'],
  'editorBracketPairGuide.activeBackground3': ['hl_high'],
  'editorBracketPairGuide.activeBackground4': ['hl_high'],
  'editorBracketPairGuide.activeBackground5': ['hl_high'],
  'editorBracketPairGuide.activeBackground6': ['hl_high'],
  'editorError.foreground': ['mangala'],
  'editorWarning.foreground': ['surya'],
  'editorInfo.foreground': ['shani'],
  'editorHint.foreground': ['budha'],
  'editorGutter.addedBackground': ['budha'],
  'editorGutter.modifiedBackground': ['guru'],
  'editorGutter.deletedBackground': ['mangala'],
  'editorWidget.background': ['surface'],
  'editorWidget.border': ['line'],
  'editorSuggestWidget.background': ['surface'],
  'editorSuggestWidget.selectedBackground': ['hl_high'],
  'editorHoverWidget.background': ['surface'],
  'editorHoverWidget.border': ['line'],
  'peekViewEditor.background': ['surface'],
  'peekViewResult.background': ['surface'],
  // Die Reiterleiste ist overlay, der aktive Reiter base: er hat die Farbe des
  // Editors darunter und ist damit aus der Leiste ausgeschnitten, die nicht
  // gewaehlten sitzen auf ihr. overlay ist die hoechste Flaeche, gegen die ketu
  // noch 4,5:1 haelt (4,6 bis 4,7:1), die Leiste kann also nicht heller sein.
  'editorGroupHeader.tabsBackground': ['overlay'],
  'editorGroup.border': ['hl_med'],
  'tab.activeBackground': ['base'],
  'tab.activeForeground': ['chandra_b'],
  'tab.inactiveBackground': ['overlay'],
  'tab.inactiveForeground': ['ketu'],
  'tab.hoverBackground': ['hl_high'],
  'tab.hoverForeground': ['chandra_b'],
  'tab.border': ['hl_low'],
  'tab.activeBorderTop': ['shukra'],
  // Die moderne Darstellung ab VS Code 1.14x zeichnet Reiter ueber eigene
  // Schluessel und liest die tab.*-Farben eines Themes nicht: ohne diese
  // Eintraege sind aktiver und inaktive Reiter nicht zu unterscheiden. Einen
  // Rand oben kennt sie fuer Themes nicht, den traegt allein die Flaeche.
  'modernEditorTab.activeBackground': ['base'],
  'modernEditorTab.activeForeground': ['chandra_b'],
  'modernEditorTab.hoverBackground': ['hl_high'],
  'modernEditorTab.hoverForeground': ['chandra_b'],
  // Die Leiste ist ein Band in Shukra: der staerkste Punkt der Karte —
  // exaltiert in Revati, Atmakaraka, Lagnesha — rahmt das Fenster. Shukra ist
  // zugleich der Akzent; Fokusrand, Knopf und Cursor liegen auf neutralem Grund
  // und heben sich dort weiter ab. base auf Shukra erreicht 5,6 bis 5,9:1,
  // overlay fuer die nicht gewaehlten Symbole 4,6 bis 4,8:1. Die Plakette dreht
  // die Rollen um und traegt shukra, auf Shukra waere sie unsichtbar.
  'activityBar.background': ['shukra'],
  'activityBar.foreground': ['base'],
  'activityBar.inactiveForeground': ['overlay'],
  'activityBar.activeBorder': ['base'],
  'activityBar.border': ['shukra'],
  'activityBarBadge.background': ['base'],
  'activityBarBadge.foreground': ['shukra'],
  'sideBar.background': ['surface'],
  'sideBar.foreground': ['subtle'],
  'sideBar.border': ['hl_med'],
  'sideBarTitle.foreground': ['ketu'],
  'sideBarSectionHeader.background': ['surface'],
  'sideBarSectionHeader.foreground': ['subtle'],
  'list.activeSelectionBackground': ['hl_high'],
  'list.activeSelectionForeground': ['chandra_b'],
  'list.inactiveSelectionBackground': ['hl_med'],
  'list.hoverBackground': ['hl_med'],
  'list.highlightForeground': ['guru'],
  'list.errorForeground': ['mangala'],
  'statusBar.background': ['surface'],
  'statusBar.foreground': ['subtle'],
  'statusBar.border': ['hl_med'],
  'statusBar.debuggingBackground': ['surya'],
  'statusBar.debuggingForeground': ['base'],
  'statusBar.noFolderBackground': ['surface'],
  'statusBarItem.remoteBackground': ['shukra'],
  'statusBarItem.remoteForeground': ['base'],
  'titleBar.activeBackground': ['base'],
  'titleBar.activeForeground': ['chandra'],
  'titleBar.inactiveBackground': ['base'],
  'titleBar.inactiveForeground': ['ketu'],
  'titleBar.border': ['hl_med'],
  'panel.background': ['base'],
  'panel.border': ['hl_med'],
  'panelTitle.activeForeground': ['chandra'],
  'panelTitle.inactiveForeground': ['ketu'],
  // Das Feld liegt im Widget: gegen dessen surface sinkt es ein (dunkel) oder
  // hebt sich ab (hell), den Rand traegt line.
  'input.background': ['base'],
  'inputOption.activeBorder': ['shukra_b'],
  'inputOption.activeBackground': ['hl_high'],
  'inputOption.activeForeground': ['chandra_b'],
  'inputOption.hoverBackground': ['hl_med'],
  'input.foreground': ['chandra'],
  'input.border': ['line'],
  'input.placeholderForeground': ['ketu'],
  'dropdown.background': ['surface'],
  'dropdown.foreground': ['chandra'],
  'dropdown.border': ['line'],
  'button.background': ['shukra'],
  'button.foreground': ['base'],
  'button.hoverBackground': ['shukra_b'],
  'badge.background': ['hl_high'],
  'badge.foreground': ['chandra'],
  'progressBar.background': ['shukra'],
  // Der Griff liegt ueber der letzten, angeschnittenen Zeile. Bei 3:1 gegen den
  // Grund waere er fast deckend und der Text darunter nur noch ein Schatten;
  // mit 60 % bleibt er sichtbar (2,0 bis 2,2:1) und die Zeile lesbar.
  'scrollbarSlider.background': ['line', '99'],
  'scrollbarSlider.hoverBackground': ['line'],
  'scrollbarSlider.activeBackground': ['ketu'],
  'minimapSlider.background': ['line', '66'],
  'minimapSlider.hoverBackground': ['line', '99'],
  'minimapSlider.activeBackground': ['line', 'cc'],
  // Marken in der Minimap und der Uebersichtsleiste sind Grafik, keine Flaeche
  // hinter Text: sie duerfen so laut sein wie ein Akzent.
  'minimap.findMatchHighlight': ['guru_b'],
  'minimap.selectionHighlight': ['shani_b'],
  'minimap.selectionOccurrenceHighlight': ['shani'],
  'minimap.errorHighlight': ['mangala'],
  'minimap.warningHighlight': ['surya'],
  'minimapGutter.addedBackground': ['budha'],
  'minimapGutter.modifiedBackground': ['guru'],
  'minimapGutter.deletedBackground': ['mangala'],
  'editorOverviewRuler.findMatchForeground': ['guru_b'],
  'editorOverviewRuler.selectionHighlightForeground': ['shani_b'],
  'editorOverviewRuler.wordHighlightForeground': ['shani'],
  'editorOverviewRuler.wordHighlightStrongForeground': ['shani_b'],
  'editorOverviewRuler.errorForeground': ['mangala'],
  'editorOverviewRuler.warningForeground': ['surya'],
  'editorOverviewRuler.infoForeground': ['shani'],
  'editorOverviewRuler.addedForeground': ['budha'],
  'editorOverviewRuler.modifiedForeground': ['guru'],
  'editorOverviewRuler.deletedForeground': ['mangala'],
  'editorOverviewRuler.border': ['hl_med'],
  'focusBorder': ['shukra'],
  'foreground': ['chandra'],
  'widget.shadow': ['base', '80'],
  'textLink.foreground': ['shani'],
  'textLink.activeForeground': ['shani_b'],
  'gitDecoration.modifiedResourceForeground': ['guru'],
  'gitDecoration.deletedResourceForeground': ['mangala'],
  'gitDecoration.untrackedResourceForeground': ['budha'],
  'gitDecoration.ignoredResourceForeground': ['ketu'],
  'gitDecoration.conflictingResourceForeground': ['rahu'],
  'terminal.background': ['base'],
  'terminal.foreground': ['chandra'],
  // Wie selectionForeground in tabby: markierter ANSI-Text laege sonst unter 4,5:1.
  'terminal.selectionForeground': ['chandra_b'],
  'terminalCursor.foreground': ['shukra'],

  // Alles Weitere stand bisher bei VS Code: der Standard kennt die Palette nicht
  // und riss an mehreren Stellen die 4,5:1.
  //
  // Statusleiste. Der Standard fuer `prominent` ist Schwarz mit 50 % Deckkraft,
  // das gab in den hellen Varianten einen dunkelgrauen Block, auf dem die
  // Schrift bei 1,8:1 stand (das Feld "Fuer Sprachausgabe optimiert").
  'statusBarItem.prominentBackground': ['overlay'],
  'statusBarItem.prominentForeground': ['chandra_b'],
  'statusBarItem.prominentHoverBackground': ['hl_high'],
  'statusBarItem.prominentHoverForeground': ['chandra_b'],
  'statusBarItem.hoverBackground': ['hl_med'],
  'statusBarItem.hoverForeground': ['chandra_b'],
  'statusBarItem.activeBackground': ['hl_high'],
  'statusBarItem.errorBackground': ['mangala'],
  'statusBarItem.errorForeground': ['base'],
  'statusBarItem.errorHoverBackground': ['mangala_b'],
  'statusBarItem.errorHoverForeground': ['base'],
  'statusBarItem.warningBackground': ['surya'],
  'statusBarItem.warningForeground': ['base'],
  'statusBarItem.warningHoverBackground': ['surya_b'],
  'statusBarItem.warningHoverForeground': ['base'],
  'statusBarItem.offlineBackground': ['mangala'],
  'statusBarItem.offlineForeground': ['base'],
  // Treffer in Listen, Schnellwahl und Vorschlaegen. Auf der gewaehlten Zeile
  // (hl_high) kam guru nur auf 3,8:1, guru_b erreicht dort 5,8 bis 6,3:1.
  'list.focusHighlightForeground': ['guru_b'],
  'editorSuggestWidget.highlightForeground': ['guru'],
  'editorSuggestWidget.focusHighlightForeground': ['guru_b'],
  'pickerGroup.foreground': ['shani'],
  'pickerGroup.border': ['hl_med'],
  // CodeLens und Inlay-Hinweise standen in den hellen Varianten bei 2,6 bis
  // 2,8:1; Geistertext ist gedaempft gemeint, aber nicht unlesbar.
  'editorCodeLens.foreground': ['ketu'],
  'editorInlayHint.foreground': ['ketu'],
  'editorInlayHint.background': ['hl_low'],
  'editorGhostText.foreground': ['ketu'],
  'editorLink.activeForeground': ['shani_b'],
  'panelTitle.activeBorder': ['shukra'],
  'errorForeground': ['mangala'],
  'list.warningForeground': ['surya'],
  'notificationsErrorIcon.foreground': ['mangala'],
  'notificationsWarningIcon.foreground': ['surya'],
  'notificationsInfoIcon.foreground': ['shani'],
  'inputValidation.errorBackground': ['overlay'],
  'inputValidation.errorBorder': ['mangala'],
  'inputValidation.warningBackground': ['overlay'],
  'inputValidation.warningBorder': ['surya'],
  'inputValidation.infoBackground': ['overlay'],
  'inputValidation.infoBorder': ['shani'],
  'button.secondaryBackground': ['overlay'],
  'button.secondaryForeground': ['chandra_b'],
  'button.secondaryHoverBackground': ['hl_high'],
  // Git. "Hinzugefuegt" stand in den hellen Varianten bei 3,9:1.
  'gitDecoration.addedResourceForeground': ['budha'],
  'gitDecoration.renamedResourceForeground': ['budha'],
  'gitDecoration.stageModifiedResourceForeground': ['guru'],
  'gitDecoration.stageDeletedResourceForeground': ['mangala'],
  'gitDecoration.submoduleResourceForeground': ['rahu'],
  // Diff: die Uebersicht am Rand traegt keinen Text und darf voll gefaerbt sein.
  // Die Rinne neben den Zeilen dagegen traegt die Zeilennummern, sie steht in
  // VSCODE_SOLVED.
  'diffEditorOverview.insertedForeground': ['budha'],
  'diffEditorOverview.removedForeground': ['mangala'],
  'diffEditor.diagonalFill': ['hl_med'],
}

// VS Code legt die Treffer- und Auswahlflaechen hinter Text, ohne ihn
// umzufaerben: jedes Token behaelt seine Farbe. Eine Flaeche darf daher nur so
// weit getoent werden, dass noch der schwaechste Text darauf 4,5:1 haelt — und
// das sind gegen den Grund nur rund 1,3:1. Eine Flaeche allein ist also nie gut
// zu sehen. Sichtbar wird eine Stelle ueber Dinge, die keinen Text tragen: den
// Rand (3:1), die Marke in der Uebersichtsleiste und den Farbton. Deshalb
// stehen Suche (Guru) und Auswahl (Shani) auf verschiedenen Farbtoenen.
//
// Nur die Suche hat einen Rand. Faellt die Suche auf dasselbe Wort wie die
// Auswahl — VS Code belegt das Suchfeld damit vor —, liegen beide Markierungen
// uebereinander, und Gold und Blau mischen sich zu Grau. Mit Rand auf beiden
// ginge der Farbton der Suche verloren; so bleibt ihr goldener Rand stehen, und
// von der Auswahl faerbt sich nur die Flaeche.
//
// Die Deckkraft haengt von Variante und Farbton ab und wird beim Erzeugen
// gesucht, nicht von Hand gewaehlt:
//   { fill: farbe, share }  staerkste Toenung, unter der aller Text 4,5:1 haelt,
//                           mal share (Standard 1)
//   { edge: farbe, on }     schwaechste Deckkraft, bei der die Kante 3:1 gegen
//                           ihren Grund erreicht: 'base' oder ein anderer
//                           Schluessel aus dieser Tabelle, dessen Flaeche darunter liegt
// Reihenfolge zaehlt: ein Grund steht vor der Kante, die auf ihm liegt.
export const VSCODE_SOLVED = {
  'editor.findMatchBackground': { fill: 'guru' },
  'editor.findMatchHighlightBackground': { fill: 'guru', share: 0.55 },
  'editor.findMatchHighlightBorder': { edge: 'guru', on: 'editor.findMatchHighlightBackground' },
  'editor.selectionBackground': { fill: 'shani' },
  'editor.selectionHighlightBackground': { fill: 'shani', share: 0.55 },
  'editor.wordHighlightBackground': { fill: 'shani', share: 0.55 },
  'editor.hoverHighlightBackground': { fill: 'shani', share: 0.5 },
  'editor.rangeHighlightBackground': { fill: 'guru', share: 0.4 },
  // Markierter Text in Eingabefeldern und Webansichten.
  'selection.background': { fill: 'shani' },
  // Diff: eingefuegt gruen, entfernt rot, die Zeile halb so stark wie das Wort.
  // Beides liegt hinter Text und folgt derselben Regel wie die Suche.
  'diffEditor.insertedTextBackground': { fill: 'budha' },
  'diffEditor.removedTextBackground': { fill: 'mangala' },
  'diffEditor.insertedLineBackground': { fill: 'budha', share: 0.5 },
  'diffEditor.removedLineBackground': { fill: 'mangala', share: 0.5 },
  'diffEditorGutter.insertedLineBackground': { fill: 'budha' },
  'diffEditorGutter.removedLineBackground': { fill: 'mangala' },
}

// Englische Namen der ANSI-Plaetze, index-gleich zu ANSI_SLOTS. Geteilt von
// den terminal.ansi*-Keys im VS-Code-Theme und den ANSI*Color-Keys in den
// Profilen fuer das Terminal von macOS.
export const ANSI_SLOT_NAMES = [
  'Black', 'Red', 'Green', 'Yellow', 'Blue', 'Magenta', 'Cyan', 'White',
  'BrightBlack', 'BrightRed', 'BrightGreen', 'BrightYellow', 'BrightBlue',
  'BrightMagenta', 'BrightCyan', 'BrightWhite',
]

export const VSCODE_SEMANTIC = {
  parameter: 'chandra',
  property: 'shukra',
  type: 'shukra',
  class: 'shukra',
  enumMember: 'surya',
  function: 'guru',
  method: 'guru',
  namespace: 'shukra',
}

// TextMate-Regeln. Vim kennt ~10 Syntaxgruppen, VS Code einige hundert –
// die Annaeherung geschieht hier, nicht in den Terminal-Dateien.
export const VSCODE_TOKEN_RULES = [
  {
    name: 'Ketu – Kommentare',
    paletteKey: 'ketu',
    fontStyle: 'italic',
    scope: ['comment', 'punctuation.definition.comment', 'string.comment'],
  },
  {
    name: 'Chandra – Bezeichner, Variablen',
    paletteKey: 'chandra',
    scope: [
      'variable', 'variable.other', 'meta.definition.variable.name',
      'support.variable', 'string.other.link',
    ],
  },
  {
    name: 'Mangala – Schluesselwoerter, Steuerfluss',
    paletteKey: 'mangala',
    scope: [
      'keyword', 'keyword.control', 'storage', 'storage.type',
      'storage.modifier', 'keyword.other', 'markup.deleted',
    ],
  },
  {
    name: 'Budha – Zeichenketten',
    paletteKey: 'budha',
    scope: [
      'string', 'string.quoted', 'string.template',
      'punctuation.definition.string', 'constant.other.symbol',
      'markup.inline.raw',
    ],
  },
  {
    name: 'Guru – Funktionen, Selektoren',
    paletteKey: 'guru',
    scope: [
      'entity.name.function', 'support.function', 'meta.function-call',
      'variable.function', 'entity.name.section', 'markup.heading',
      'entity.other.attribute-name.class', 'entity.other.attribute-name.id',
    ],
  },
  {
    name: 'Shani – Operatoren',
    paletteKey: 'shani',
    scope: [
      'keyword.operator', 'keyword.operator.arithmetic',
      'keyword.operator.logical', 'keyword.operator.assignment',
      'keyword.operator.comparison', 'storage.type.function.arrow',
    ],
  },
  {
    // Der Doppelpunkt vor einem Typ trennt, er rechnet nicht; der Punkt in
    // g.longitude ebenso. Beide muessen hier stehen: ohne eigene Regel erbt der
    // Punkt in Math.abs() das Gold des umgebenden Funktionsaufrufs.
    name: 'Chandra – Satzzeichen, die wie Operatoren heissen',
    paletteKey: 'chandra',
    scope: ['keyword.operator.type.annotation', 'punctuation.accessor'],
  },
  {
    // variable.other.constant fehlt mit Absicht: die TypeScript-Grammatik nennt
    // so jede const-Variable, nicht nur echte Konstanten.
    name: 'Surya – Zahlen, Konstanten',
    paletteKey: 'surya',
    scope: [
      'constant.numeric', 'constant.language', 'constant.character',
      'keyword.other.unit', 'support.constant',
    ],
  },
  {
    name: 'Shukra – Typen, Klassen, Eigenschaftsnamen',
    paletteKey: 'shukra',
    scope: [
      'entity.name.type', 'entity.name.class', 'entity.other.inherited-class',
      'support.type', 'support.class', 'entity.name.namespace',
      'meta.type.annotation', 'storage.type.class',
      'support.type.property-name', 'entity.other.attribute-name',
      'meta.object-literal.key', 'variable.other.property',
    ],
  },
  {
    name: 'Rahu – Praeprozessor, At-Rules, Tags',
    paletteKey: 'rahu',
    scope: [
      'meta.preprocessor', 'keyword.control.directive',
      'keyword.control.at-rule', 'entity.name.tag',
      'constant.character.escape', 'meta.decorator',
      'punctuation.definition.template-expression',
    ],
  },
  {
    name: 'Mangala – ungueltig',
    paletteKey: 'mangala',
    fontStyle: 'bold',
    scope: ['invalid', 'invalid.illegal'],
  },
  {
    name: 'Ketu – veraltet',
    paletteKey: 'ketu',
    fontStyle: 'strikethrough',
    scope: ['invalid.deprecated'],
  },
  {
    name: 'Budha – eingefuegt',
    paletteKey: 'budha',
    scope: ['markup.inserted'],
  },
  {
    name: 'Markup – kursiv',
    paletteKey: 'chandra',
    fontStyle: 'italic',
    scope: ['markup.italic'],
  },
  {
    name: 'Markup – fett',
    paletteKey: 'chandra_b',
    fontStyle: 'bold',
    scope: ['markup.bold'],
  },
]

// CotEditor: zehn Syntaxkategorien, keine Schriftschnitte, keine Kategorie fuer
// Operatoren (die bleiben Grundtext). Werte wie bei VSCODE_COLORS:
// [paletteKey] oder [paletteKey, alpha].
export const COTEDITOR_COLORS = {
  text: ['chandra'],
  background: ['base'],
  invisibles: ['hl_high'],
  lineHighlight: ['hl_low'],
  keywords: ['mangala'],
  commands: ['guru'],
  types: ['shukra'],
  attributes: ['shukra'],
  variables: ['chandra'],
  values: ['surya'],
  numbers: ['surya'],
  strings: ['budha'],
  characters: ['rahu'],
  comments: ['ketu'],
}

// Diese drei koennten auf die Systemfarbe umschalten; Navagraha setzt eigene.
export const COTEDITOR_SYSTEM_COLORS = {
  selection: ['hl_high'],
  insertionPoint: ['shukra'],
  highlight: ['guru', '55'],
}

// Terminal von macOS: Keys ausserhalb der 16 ANSI-Plaetze.
export const APPLE_TERMINAL_FIXED = {
  BackgroundColor: 'base',
  TextColor: 'chandra',
  TextBoldColor: 'chandra_b',
  CursorColor: 'shukra',
  // Terminal.app kennt keine Vordergrundfarbe fuer markierten Text: was
  // markiert ist, behaelt seine ANSI-Farbe. Die Auswahl liegt deshalb nicht
  // auf hl_high wie in tabby und iTerm2 (dort 3,7 bis 3,9:1), sondern auf
  // overlay – der Ebene, gegen die jede Farbe der Palette auf 4,5:1 geloest
  // ist. Sichtbar bleibt sie: overlay ist eine der drei Flaechen, nicht eine
  // Toenung des Grundes.
  SelectionColor: 'overlay',
}

// Schalter, die entscheiden, welche Farbe ueberhaupt erscheint — deshalb
// stehen sie im Profil, obwohl es sonst nur Farben traegt. Terminal fuellt
// einen fehlenden Schluessel aus dem Standardprofil des Benutzers auf, ein
// Profil ohne sie sieht also bei jedem anders aus.
//
// UseBrightBold: fetter Text nimmt den hellen Platz seines Farbtons. Ohne den
// Schalter faerbt Terminal jeden fetten Text mit TextBoldColor und
// ueberschreibt damit die ANSI-Farbe — `ls` zeigte Verzeichnisse dann weiss
// statt tuerkis. Mit ihm gilt TextBoldColor nur noch fuer fetten Grundtext,
// wie 'Bold Color' in iTerm2. Platz 9 ist auch hier Surya: fettes Rot wird
// kupfern, nicht hellrot.
export const APPLE_TERMINAL_FLAGS = {
  UseBrightBold: true,
}

// Chrome-Theme: Manifest-Schluessel -> Palettenschluessel. Die Namen stammen
// aus kOverwritableColorTable in Chromiums browser_theme_pack.cc; was dort
// nicht steht, uebergeht Chrome stillschweigend.
//
// Die Ordnung der Flaechen ist dieselbe wie im Editor: der Rahmen ist die
// hinterste Ebene, die Werkzeugleiste liegt darauf, das Adressfeld darin —
// base, surface, overlay. Inaktive Tabs gehoeren zum Rahmen, der aktive
// traegt die Farbe der Werkzeugleiste; so trennt Chrome sie von sich aus.
//
// Die Schluessel fuer den Inkognito-Modus fehlen mit Absicht: Chrome zeichnet
// ihn dann in seinem eigenen Dunkelgrau, und er bleibt als solcher erkennbar.
// Mit der Palette eingefaerbt saehe ein Inkognito-Fenster in den hellen
// Varianten aus wie ein gewoehnliches.
export const CHROME_COLORS = {
  frame: 'base',
  frame_inactive: 'base',
  background_tab: 'base',
  background_tab_inactive: 'base',
  toolbar: 'surface',
  omnibox_background: 'overlay',
  button_background: 'overlay',
  ntp_background: 'base',
  ntp_header: 'surface',
  // Text wie im VS-Code-Theme: der aktive Tab hell, die uebrigen Ketu.
  tab_text: 'chandra_b',
  tab_background_text: 'ketu',
  tab_background_text_inactive: 'ketu',
  toolbar_text: 'chandra',
  bookmark_text: 'chandra',
  toolbar_button_icon: 'chandra',
  omnibox_text: 'chandra',
  ntp_text: 'chandra',
  ntp_link: 'shani',
}

// Nextcloud: CSS-Variable -> Palettenschluessel. `{ rgb }` schreibt das
// Tripel "r,g,b", das einige Variablen statt eines Hexwerts erwarten;
// `{ dark, light }` einen festen Wert je Modus. Die Namen stammen aus
// apps/theming/lib/Themes/DefaultTheme.php und DarkTheme.php; was dort nicht
// steht, kennt Nextcloud nicht.
//
// Nicht gesetzt bleiben die Variablen, die Nextcloud selbst aus einer anderen
// ableitet (`--color-main-background-blur`, `--color-scrollbar`,
// `--color-background-selection`, die `--color-primary-element-light*`) —
// sie folgen der Palette von allein. Ebenso der Schatten: er entsteht bei
// Nextcloud aus dem Grund seines eigenen Modus, und der stimmt, weil eine
// dunkle Variante nur im dunklen Design steht.
export const NEXTCLOUD_COLORS = {
  // Die drei Flaechen liegen wie im Editor: der Grund, die Flaeche darauf,
  // die darin.
  '--color-main-background': 'base',
  '--color-main-background-rgb': { rgb: 'base' },
  '--color-background-dark': 'surface',
  '--color-background-darker': 'overlay',
  '--color-background-plain': 'base',
  '--color-background-plain-text': 'chandra',

  // Die drei hl_*-Stufen in ihrer Ordnung: ueberfahren, gewaehlt, beides.
  '--color-background-hover': 'hl_low',
  '--color-primary-light': 'hl_med',
  '--color-primary-light-hover': 'hl_high',
  '--color-primary-light-text': 'chandra_b',

  // Ladeplatzhalter und Ladezeichen. Kein Text darauf.
  '--color-placeholder-light': 'surface',
  '--color-placeholder-dark': 'overlay',
  '--color-loading-light': 'hl_high',
  '--color-loading-dark': 'ketu',

  '--color-main-text': 'chandra',
  // Nextcloud verlangt von maxcontrast 4,5:1 gegen Grund *und* Ueberfahren.
  // subtle haelt das auf allen sechs Flaechen, am knappsten mit 4,66:1 auf
  // hl_high.
  '--color-text-maxcontrast': 'subtle',
  '--color-text-maxcontrast-default': 'subtle',
  // Auf der unscharfen Flaeche ist der Grund unbekannt; dort steht die
  // staerkste Textfarbe, nicht die gerade noch ausreichende.
  '--color-text-maxcontrast-background-blur': 'chandra',
  '--color-text-error': 'mangala',
  '--color-text-success': 'budha',

  // Kanten. maxcontrast ist bei Nextcloud die Kante des Bedienelements —
  // genau das, wofuer `line` da ist; die beiden anderen sind Fugen.
  '--color-border': 'hl_med',
  '--color-border-dark': 'hl_high',
  '--color-border-maxcontrast': 'line',

  // Zeichen der vier Meldungsarten, dieselbe Zuordnung wie im VS-Code-Theme.
  '--color-element-error': 'mangala',
  '--color-element-warning': 'surya',
  '--color-element-success': 'budha',
  '--color-element-info': 'shani',

  // Die Karte selbst bleibt eine Flaeche der Palette, ihre Art liest man an
  // Zeichen und Schrift. Ein eingefaerbter Grund waere eine Farbe, gegen die
  // niemand gemessen hat — auf surface und overlay steht jeder Graha ueber
  // 4,5:1.
  '--color-error': 'surface',
  '--color-error-hover': 'overlay',
  '--color-error-text': 'mangala',
  '--color-error-rgb': { rgb: 'surface' },
  '--color-warning': 'surface',
  '--color-warning-hover': 'overlay',
  '--color-warning-text': 'surya',
  '--color-warning-rgb': { rgb: 'surface' },
  '--color-success': 'surface',
  '--color-success-hover': 'overlay',
  '--color-success-text': 'budha',
  '--color-success-rgb': { rgb: 'surface' },
  '--color-info': 'surface',
  '--color-info-hover': 'overlay',
  '--color-info-text': 'shani',
  '--color-info-rgb': { rgb: 'surface' },

  '--color-favorite': 'guru',
  // Ein Treffer ist eine Auswahl: dieselbe Farbe, die in tabby, iTerm2 und
  // VS Code markiert.
  '--color-mark': 'hl_high',

  // Shukra traegt den Akzent wie ueberall sonst: Knopf, Schreibmarke, Fokus.
  '--color-primary': 'shukra',
  '--color-primary-text': 'base',
  '--color-primary-hover': 'shukra_b',
  '--color-primary-element': 'shukra',
  '--color-primary-element-hover': 'shukra_b',
  '--color-primary-element-text': 'base',
  // Abgeschaltete Schrift auf dem Akzent. overlay steht dort mit 4,6:1.
  '--color-primary-element-text-dark': 'overlay',

  // Keine Farben, sondern Filter fuer alte Bildzeichen. Sie drehen um, wenn
  // die Schrift auf dem Akzent dunkel ist — bei Navagraha traegt der Akzent
  // immer `base`, also in den dunklen Varianten.
  '--primary-invert-if-bright': { dark: 'invert(100%)', light: 'no' },
  '--primary-invert-if-dark': { dark: 'no', light: 'invert(100%)' },
  '--background-image-invert-if-bright': { dark: 'no', light: 'invert(100%)' },
}

// Nextcloud laesst jeden Benutzer zwischen hell, dunkel und "wie das System"
// waehlen, und diese Wahl ist eine Einstellung der Barrierefreiheit. Eine
// Datei traegt deshalb nicht eine Variante, sondern das helle und das dunkle
// Geschwister desselben Grundes.
export const NEXTCLOUD_PAIRS = [
  { key: 'prithvi', label: 'Prithvi', light: 'ushas', dark: 'pratipada' },
  { key: 'vayu', label: 'Vayu', light: 'tula', dark: 'swati' },
]

// Die Selektoren. Nextcloud haengt jedes gewaehlte Design als eigenes
// Attribut an <body> (`data-theme-dark`) und schreibt alle zusammen nach
// `data-themes`; wer nicht angemeldet ist, hat dort nichts stehen und folgt
// dem System. Die Regeln stehen auf `body[...]` und damit eine Stelle
// spezifischer als Nextclouds eigene `[data-theme-*]` und `:root` — so gilt
// die Palette, gleich in welcher Reihenfolge die Stilvorlagen geladen werden.
//
// `light-highcontrast` und `dark-highcontrast` fehlen mit Absicht: sie loesen
// auf 7:1, Navagraha auf 4,5:1. Eingefaerbt waeren sie nicht mehr, was ihr
// Name verspricht. Ein Attributselektor trifft nur den ganzen Namen, die
// beiden bleiben von `[data-theme-light]` also unberuehrt.
export const NEXTCLOUD_SELECTORS = {
  auto: ['body[data-themes=""]', 'body[data-theme-default]'],
  light: ['body[data-theme-light]'],
  dark: ['body[data-theme-dark]'],
}
