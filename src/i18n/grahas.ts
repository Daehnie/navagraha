// Beschriftung der Grahas: was in palette.json als Schluessel steht, heisst
// hier auf Deutsch und Englisch. Tabelle und Diagramm lesen dieselbe Quelle,
// damit dieselbe Stellung nicht an zwei Orten zweierlei heisst.
type Paar = { de: string; en: string }
export type Sprache = 'de' | 'en'

export const roles: Record<string, Paar> = {
  surya:   { de: 'Zahlen und Konstanten', en: 'Numbers and constants' },
  chandra: { de: 'Bezeichner und Grundtext', en: 'Identifiers and body text' },
  mangala: { de: 'Schlüsselwörter und Steuerfluss', en: 'Keywords and control flow' },
  budha:   { de: 'Zeichenketten', en: 'Strings' },
  guru:    { de: 'Funktionen und Selektoren', en: 'Functions and selectors' },
  shukra:  { de: 'Typen und Eigenschaftsnamen', en: 'Types and property names' },
  shani:   { de: 'Operatoren', en: 'Operators' },
  rahu:    { de: 'Präprozessor, At-Rules, Tags', en: 'Preprocessor, at-rules, tags' },
  ketu:    { de: 'Kommentare', en: 'Comments' }
}

// Der Sanskritname allein sagt niemandem, welcher Planet gemeint ist. Rahu und
// Ketu haben keinen: sie sind die beiden Knoten der Mondbahn.
export const names: Record<string, Paar> = {
  surya:   { de: 'Sonne', en: 'Sun' },
  chandra: { de: 'Mond', en: 'Moon' },
  mangala: { de: 'Mars', en: 'Mars' },
  budha:   { de: 'Merkur', en: 'Mercury' },
  guru:    { de: 'Jupiter', en: 'Jupiter' },
  shukra:  { de: 'Venus', en: 'Venus' },
  shani:   { de: 'Saturn', en: 'Saturn' },
  rahu:    { de: 'aufsteigender Mondknoten', en: 'ascending lunar node' },
  ketu:    { de: 'absteigender Mondknoten', en: 'descending lunar node' }
}

export const hues: Record<string, Paar> = {
  surya:   { de: 'kupferrot', en: 'copper red' },
  chandra: { de: 'weiß', en: 'white' },
  mangala: { de: 'blutrot', en: 'blood red' },
  budha:   { de: 'grasgrün', en: 'grass green' },
  guru:    { de: 'goldgelb', en: 'golden yellow' },
  shukra:  { de: 'weiß-schillernd', en: 'iridescent white' },
  shani:   { de: 'dunkelblau', en: 'dark blue' },
  rahu:    { de: 'rauchig', en: 'smoky' },
  ketu:    { de: 'aschgrau', en: 'ash grey' }
}

export const signs: Record<string, Paar> = {
  Vrishabha: { de: 'Stier', en: 'Taurus' },
  Mithuna:   { de: 'Zwillinge', en: 'Gemini' },
  Kanya:     { de: 'Jungfrau', en: 'Virgo' },
  Tula:      { de: 'Waage', en: 'Libra' },
  Dhanu:     { de: 'Schütze', en: 'Sagittarius' },
  Mina:      { de: 'Fische', en: 'Pisces' }
}

// Diese vier sind der Grund, warum manche Farben kraeftiger ausfallen als
// andere. Sie stehen deshalb abgesetzt und nicht im Fliesstext der Zelle.
export const dignities: Record<string, Paar> = {
  exalted:    { de: 'exaltiert', en: 'exalted' },
  retrograde: { de: 'retrograd', en: 'retrograde' },
  digbala:    { de: 'Dig Bala', en: 'dig bala' },
  atmakaraka: { de: 'Atmakaraka', en: 'atmakaraka' }
}

export const ord = (n: number, l: Sprache) => l === 'en'
  ? `${n}${['th','st','nd','rd'][n % 10 < 4 && (n < 11 || n > 13) ? n % 10 : 0]} house`
  : `${n}. Haus`

// "Waage, 1. Haus" — die Stellung in einem Stueck, wie sie Tabelle und
// Diagrammbeschreibung beide brauchen.
export const stand = (g: { sign: string; house: number }, l: Sprache) =>
  `${signs[g.sign][l]}, ${ord(g.house, l)}`
