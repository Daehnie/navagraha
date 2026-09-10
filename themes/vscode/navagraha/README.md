# Navagraha – VS Code

Vier Farbschemata aus einem siderischen Geburtshoroskop (Lahiri):
23. Mai 1982, 19:47 MESZ, Wedel.

| Erscheint in VS Code als | Grund   | Helligkeit | Herleitung des Grundtons                       |
|--------------------------|---------|------------|------------------------------------------------|
| Navagraha Swati          | Vayu    | dunkel     | Lagna Tula, Guru in Swati, Farbton 255°         |
| Navagraha Pratipada      | Prithvi | dunkel     | Erd-Gruppe in Vrishabha und Kanya, Farbton 76°  |
| Navagraha Ushas          | Prithvi | hell       | dieselbe                                        |
| Navagraha Tula           | Vayu    | hell       | dieselbe                                        |

Die neun Graha-Akzente sind in allen vier identisch hergeleitet; es
unterscheiden sich nur Grund, Fläche und Auflage.

## Einbauen

Diesen Ordner nach `~/.vscode/extensions/` kopieren:

    cp -R navagraha ~/.vscode/extensions/

VS Code neu starten, dann das Schema wählen:

    ⌘K ⌘T          (Windows und Linux: Strg+K Strg+T)

## Zuordnung

| Graha   | Rolle                          |
|---------|--------------------------------|
| Ketu    | Kommentare                     |
| Chandra | Bezeichner, Grundtext          |
| Mangala | Schlüsselwörter, Steuerfluss   |
| Budha   | Zeichenketten                  |
| Guru    | Funktionen, Selektoren         |
| Shani   | Operatoren                     |
| Surya   | Zahlen, Konstanten             |
| Shukra  | Typen, Eigenschaftsnamen       |
| Rahu    | Präprozessor, At-Rules, Tags   |

Vim und VS Code können nicht deckungsgleich sein: Vim kennt rund zehn
Syntaxgruppen, die TextMate-Grammatik einige hundert. Wo eine Kategorie auf
einer Seite fehlt, kann sie nicht dieselbe Farbe bekommen.

## Kontrast

Jede Farbe, die Text tragen kann, erreicht mindestens 4,5:1 gegen Grund,
Fläche und Auflage — nicht nur gegen den Hintergrund. Die Helligkeiten sind
dafür in OKLCH auf diesen Wert gerechnet, nicht ausgesucht.

---

## English

Four colour schemes derived from a sidereal birth chart. Copy this folder to
`~/.vscode/extensions/`, restart VS Code and pick one with `⌘K ⌘T`
(`Ctrl+K Ctrl+T` on Windows and Linux). They appear as *Navagraha Swati*,
*Navagraha Pratipada*, *Navagraha Ushas* and *Navagraha Tula*.

Every colour that can carry text meets at least 4.5:1 against ground,
surface and overlay — the lightness values were solved for, not chosen.
