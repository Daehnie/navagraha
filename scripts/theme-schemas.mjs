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
  'editor.selectionBackground': ['hl_high', 'cc'],
  'editor.selectionHighlightBackground': ['hl_med', '99'],
  'editor.wordHighlightBackground': ['hl_med', '99'],
  'editor.findMatchBackground': ['guru', '55'],
  'editor.findMatchHighlightBackground': ['guru', '33'],
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
  'editorWidget.border': ['hl_high'],
  'editorSuggestWidget.background': ['surface'],
  'editorSuggestWidget.selectedBackground': ['hl_high'],
  'editorHoverWidget.background': ['surface'],
  'editorHoverWidget.border': ['hl_high'],
  'peekViewEditor.background': ['surface'],
  'peekViewResult.background': ['surface'],
  'editorGroupHeader.tabsBackground': ['base'],
  'editorGroup.border': ['hl_med'],
  'tab.activeBackground': ['base'],
  'tab.activeForeground': ['chandra_b'],
  'tab.inactiveBackground': ['surface'],
  'tab.inactiveForeground': ['ketu'],
  'tab.border': ['hl_low'],
  'tab.activeBorderTop': ['shukra'],
  'activityBar.background': ['base'],
  'activityBar.foreground': ['chandra'],
  'activityBar.inactiveForeground': ['ketu'],
  'activityBar.border': ['hl_med'],
  'activityBarBadge.background': ['shukra'],
  'activityBarBadge.foreground': ['base'],
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
  'input.background': ['surface'],
  'input.foreground': ['chandra'],
  'input.border': ['hl_high'],
  'input.placeholderForeground': ['ketu'],
  'dropdown.background': ['surface'],
  'dropdown.foreground': ['chandra'],
  'dropdown.border': ['hl_high'],
  'button.background': ['shukra'],
  'button.foreground': ['base'],
  'button.hoverBackground': ['shukra_b'],
  'badge.background': ['hl_high'],
  'badge.foreground': ['chandra'],
  'progressBar.background': ['shukra'],
  'scrollbarSlider.background': ['hl_high', '88'],
  'scrollbarSlider.hoverBackground': ['hl_high', 'cc'],
  'scrollbarSlider.activeBackground': ['ketu'],
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
}

// Namen der terminal.ansi*-Keys, index-gleich zu ANSI_SLOTS.
export const VSCODE_ANSI_NAMES = [
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
