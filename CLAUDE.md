# Navagraha

Farbschema für Terminal und Editor, abgeleitet aus einem siderischen
Geburtshoroskop. Astro-Seite plus generierte Theme-Dateien.

## Befehle

```bash
npm install
npm run dev       # lokaler Server
npm run build     # statische Ausgabe nach dist/
npm run preview   # dist/ ausliefern
```

Deploy läuft über `.github/workflows/deploy.yml` bei jedem Push auf `main`.

## Architektur

`src/data/palette.json` ist die einzige Farbquelle. Alles andere liest daraus:

- `src/layouts/Base.astro` erzeugt daraus die CSS-Variablen als
  `html[data-theme="<variante>"] { --<name>: <hex> }`
- `src/components/PaletteTable.astro` rendert die Tabelle
- `themes/` enthält die generierten Dateien je Zielprogramm

Wie ein Graha auf Deutsch und Englisch heißt, in welchem Zeichen und Haus er
steht, steht in `src/i18n/grahas.ts`. Tabelle und Diagramm lesen dieselbe
Quelle, damit dieselbe Stellung nicht an zwei Orten zweierlei heißt.

`src/components/CopyToast.astro` ist die einzige Kopierstelle der Seite: ein
Klick-Delegat auf `[data-copy]` plus die Rückmeldung. Ein neuer Knopf braucht
nur `data-copy` und, wenn er etwas Kurzes zeigen soll, `data-toast`.

Die Grafiken im Methodenteil — `HueWheel`, `Strength`, `Grounds`,
`ContrastSpan` und die aufklappbare Messtabelle `ContrastTable` — rechnen
ihre Werte beim Bauen aus `palette.json`, über `src/data/color.ts`. Keine Zahl auf der Seite wird von Hand gepflegt; wer
eine Farbe ändert, ändert die Grafiken mit. `ton()` misst die Sättigung als
Anteil dessen, was bei dieser Helligkeit und diesem Farbton in sRGB möglich
ist — nur so lassen sich Töne vergleichen, denn Rot kann von Natur aus
gesättigter werden als Türkis.

`HueWheel`, `Strength` und `ContrastTable` hängen an der Variante und
rendern deshalb alle vier Sätze; sichtbar ist der, den `html[data-theme]`
auswählt. Was das
Diagramm zeigt, unterscheidet sich je Variante, und eine Grafik, die etwas
anderes behauptet als der Bildschirm, wäre schlimmer als keine.

`src/components/Derivation.astro` ist der Abschnitt, der die Kette zeigt:
Stand im Horoskop, Farbe, Rolle im Code. Diagramm, Tafel und Codezeile hängen
an einem Zustand — dem Attribut `data-graha` am Abschnitt. Wer die Auswahl
ändert, feuert `navagraha:graha` auf `document`; `Chart.astro` und der
Abschnitt hören darauf und markieren, keiner ruft den anderen direkt.
Markiert wird durch Hervorheben, nie durch Dämpfen der übrigen: ein
abgeblendetes Kürzel wäre Text unter 4,5:1, und die Regel gilt auch für
Diagrammbeschriftung.

Wird eine Farbe geändert, gehört sie in `palette.json` — nie in eine
Theme-Datei oder ins CSS. Die Dateien unter `themes/` sind Ausgabe, keine
Quelle.

`scripts/generate-themes.mjs` baut sie: tabby, die vier iTerm2-Dateien, die
vier VS-Code-Themes sowie `contributes.themes` und die Farbe von
`galleryBanner` im Extension-Manifest. Die
Zuordnungstabellen stehen daneben in `scripts/theme-schemas.mjs`. Der
Generator läuft bei jedem `npm run build` mit, einzeln über
`npm run generate:themes`. Nach einer Farbänderung gehören die neu erzeugten
Dateien mit in den Commit.

`themes/vim/` und `themes/bat/` fasst der Generator nicht an: beide enthalten
keine Hexwerte, sondern nehmen die Farben über die ANSI-Plätze vom Terminal.

### Varianten

Vier Stück, in `palette.json` unter `variants`:

| Schlüssel   | Grund   | Modus  |
|-------------|---------|--------|
| `swati`     | Vayu    | dunkel |
| `pratipada` | Prithvi | dunkel |
| `ushas`     | Prithvi | hell   |
| `tula`      | Vayu    | hell   |

Die neun Graha-Akzente sind in allen vier gleich hergeleitet und
unterscheiden sich nur durch die Kontrastlösung. Es unterscheiden sich
ausschließlich die Neutralwerte (`base`, `surface`, `overlay`, `subtle`,
`hl_*`) sowie `chandra`.

### Sprachen

Deutsch ist Standard und liegt ohne Präfix unter `/`. Englisch unter `/en/`.
Jede Seite existiert doppelt: `src/pages/x.astro` und `src/pages/en/x.astro`,
wobei die englische Fassung nur die Importpfade um eine Ebene tiefer legt.
Texte stehen in `src/i18n/de.json` und `en.json` — nie fest im Markup.

Neue Sprache: JSON anlegen, in `src/i18n/utils.ts` in `languages` und `dict`
eintragen, Seitenordner anlegen, in `astro.config.mjs` bei `locales` ergänzen.

## Regeln, die das Schema tragen

Diese sind der Kern des Projekts. Wer eine Farbe anfasst, muss sie kennen.

**Farbton kommt aus der klassischen Graha-Zuordnung**, nicht aus Geschmack:
Surya kupferrot, Chandra weiß, Mangala blutrot, Budha grasgrün, Guru
goldgelb, Shukra weiß-schillernd, Shani dunkelblau, Rahu rauchig, Ketu
aschgrau.

**Sättigung folgt der Stärke im Chart, soweit der Farbton es zulässt.**
Shukra (exaltiert, Atmakaraka) und Guru (Dig Bala im Lagna) stehen in allen
vier Varianten am Anschlag dessen, was bei ihrer Helligkeit möglich ist; in
den beiden hellen Varianten stößt Surya mit an, weil dort weniger Spielraum
bleibt. Rahu und Ketu bleiben blass.

Die Regel hat zwei Grenzen, und beide stehen so auch auf der Seite. Wo
Farbton und Stärke sich widersprechen, gewinnt der Farbton: Chandra ist
exaltiert und trotzdem fast ungesättigt, weil er weiß ist. Und sie greift
nicht überall — Mangala liegt trotz zwölftem Haus im Mittelfeld, wo Shani
aus demselben Haus im unteren Drittel bleibt. Die Werte stehen in der
Grafik `Strength`, gerechnet aus `palette.json`. Wer eine Farbe ändert,
sieht dort nach, ob eine Aussage im Text dadurch falsch wird.

**Kontrast ist gelöst, nicht gewählt.** Jede Farbe, die Text tragen kann,
erreicht mindestens 4,5:1 gegen `base`, `surface` *und* `overlay`. Die
Helligkeit wurde per Suche in OKLCH auf diesen Wert gebracht. Ein neuer Wert
muss dieselbe Prüfung bestehen — nicht nur gegen den Hintergrund.

**`line` trägt keinen Text, sondern Kanten**, und ist deshalb auf 3:1 gegen
dieselben drei Ebenen gelöst — der Wert, den WCAG für die Begrenzung von
Bedienelementen und für Grafik verlangt, die man zum Verstehen braucht. Er
steht an den Rändern der Schalter, am Rahmen der Farbfelder und am Raster
des Diagramms. Die `hl_*`-Werte taugen dafür nicht: sie sind
Auswahlfarben für den Editor und liegen bewusst bei 1,2 bis 1,6:1. `line`
ist der einzige Palettenwert, der nur die Seite betrifft — kein Schema in
`scripts/theme-schemas.mjs` greift ihn ab.

Dekorative Linien bleiben davon unberührt: die Trennstriche zwischen
Abschnitten und Tabellenzeilen und der Rahmen der Codefläche stehen weiter
auf `hl_low`/`hl_med`. 3:1 überall hieße, jede Fuge so laut zu machen wie
eine Bedienkante.

**ANSI-Plätze tragen nur einen Farbton, keine Rolle.** Platz 1 heißt „rot",
nicht „Schlüsselwörter". Welches Sprachelement welche Farbe bekommt,
entscheidet der Editor. Die Zuordnung steht in `themes/vim/navagraha.vim`
und im VS-Code-Theme, nicht in den Terminal-Dateien.

**Abweichung von der Konvention:** Platz 9 ist Surya (Kupfer), nicht ein
helleres Mangala. Programme, die „bright red" für Fehler nehmen, zeigen
daher Kupferorange. In `navagraha.vim` liegt `Error` deshalb auf Platz 1.

## Zuordnung Graha zu Syntax

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

Vim und VS Code können nicht deckungsgleich sein: vim kennt rund zehn
Syntaxgruppen, VS Codes TextMate-Grammatik einige hundert. Wo eine Kategorie
auf einer Seite fehlt, kann sie nicht dieselbe Farbe bekommen. Annäherung
geschieht pro Sprache, nicht pauschal.

## Stil

### Schrift

Beide Schriften liegen als Paket im Projekt (`@fontsource/spectral`,
`@fontsource/monaspace-neon`, beide SIL OFL) und werden mitgebaut. Es wird
nichts von fremden Servern nachgeladen — die Seite holt sich von außen
nichts, und das soll so bleiben. Eingebunden sind nur die Schnitte, die
wirklich vorkommen: Spectral 400 und 600, jeweils `latin` und `latin-ext`,
sowie Monaspace Neon 400 `latin`. Zusammen 127 KB. `latin-ext` ist nicht
verzichtbar: Sūrya und Śukra tragen ihre Diakritika dort.

Kursive Kommentare im Code entstehen durch die Schräglage des Browsers
(`font-synthesis`). Ein eigener kursiver Schnitt von Monaspace kostete
47 KB für zwei Zeilen.

**Die Wahl ist wie die Farben aus dem Chart abgeleitet, nicht erfunden.**
Für Schriften gibt es keine klassische Zuordnung wie für Farben; erfunden
wäre eine Tabelle „Graha X ⇒ Schrift Y". Stattdessen greifen zwei Regeln,
die die Tradition wirklich kennt:

- **Der Lagnesha bestimmt die äußere Erscheinung.** Das Lagna ist Tula,
  sein Herrscher ist Shukra — in diesem Chart exaltiert in Revati und
  Atmakaraka, also der stärkste Punkt der Karte. Die Schrift, die das
  Gesicht der Seite ist, gehört damit unter Shukra: Verfeinerung, Maß,
  Schönheit. Typografisch heißt das eine humanistische Antiqua
  kalligrafischer Herkunft mit weichen Bogenübergängen und mittlerem
  Strichkontrast — und wegen des Luftzeichens keine schweren Schnitte.
  Spectral erfüllt das und ist für den Bildschirm gezeichnet.
- **Budha regiert Schrift, Zeichen und Sprache.** Er steht in Vrishabha im
  achten Haus, retrograd — nach innen gewendet, technisch, zurückgenommen.
  Das ist die Schrift für Code, und dafür steht Monaspace Neon.

Eine neue Schrift muss dieselbe Prüfung bestehen: erst die Herleitung, dann
der Entwurf. Wer nur den Geschmack ändert, ändert das Projekt.

### Sonstiges

Die Seite trägt immer das gewählte Schema selbst.

Kein Framework für Interaktion. Der Variantenschalter und das Kopieren sind
`is:inline`-Skripte von wenigen Zeilen. So bleiben soll es.

Der Rahmen (`.wrap`) misst 76rem. Der Fließtext bleibt trotzdem bei 62
Zeichen — die Breite ist nicht für längere Zeilen da, sondern dafür, dass im
Methodenteil ab 72rem Argument und Beleg nebeneinander stehen können
(`.teil` mit `.wort` und `.beleg`). Darunter fallen sie in die Reihenfolge
zurück, in der man liest: erst der Satz, dann seine Grafik. Die Schwelle
liegt bei 72rem, weil der Textspalte darunter keine 60 Zeichen mehr
blieben, und Lesbarkeit vor Flächennutzung geht. Zwischen zwei `.teil`
steht doppelt so viel Raum (`--s9`) wie die Fuge zwischen Satz und Grafik
(`--s7`) — bei gleichem Abstand las sich die Bildunterschrift einer Grafik,
als gehöre sie zur nächsten darunter.

Kopfzeile und Fußzeile teilen sich die Arbeit: oben nur Marke und drei
Seiten, damit die Leiste auf dem Telefon einzeilig bleibt; unten Sprache,
Quelle, Lizenz und der Urheber. Der Sprachumschalter steht deshalb im Fuß,
nicht im Kopf. Bei zwei Sprachen sind zwei Links besser als ein Menü — ab
etwa vier lohnt sich das Aufklappen.

`src/pages/themes.astro` ist eine Galerie, keine Anleitung: sie sagt, wofür
es etwas gibt und wo es liegt. Wie eingebaut wird, steht im README neben
den Dateien unter `themes/`. Jede Portierung braucht eins, zweisprachig,
mit den Menüpunkten des jeweiligen Programms in seiner eigenen Sprache.

Ein README zeigt, was es ist, nicht wie es gebaut ist: oben ein Screenshot,
darunter zwei, drei Sätze, bei den Themes dann das Einbauen. Herleitung,
Regeln und Aufbau stehen auf der Seite und in dieser Datei, nicht im README.
Die Screenshots liegen als `screenshot.png` neben ihrem README, die der
Seite hell und dunkel unter `docs/`. VS Code, Tabby, iTerm2 und Vim zeigen
als Galerie alle vier Varianten mit demselben Inhalt
(`screenshot-<variante>.png`). Sie sind von Hand aufgenommen und
veralten, wenn sich eine Farbe ändert — danach neu aufnehmen.

`prefers-reduced-motion` wird respektiert, die Animation im Diagramm ist die
einzige der Seite. Sie startet erst, wenn das Diagramm in den Blick kommt —
es steht nicht mehr im ersten Bild. Ohne Skript bleibt sie aus und die
Kürzel stehen einfach da; das ist der gewollte Ausfall.

Farbwechsel laufen in einem Takt. Der Variantenschalter blendet die ganze
Seite über eine View Transition (`.blende` in `global.css`); während der
Blende sind alle eigenen Übergänge aus. Vorher hatte jede Fläche ihren
eigenen, und der Grund blendete, während Kopfzeile, Code und Diagramm
sprangen. Eine neue gefärbte Fläche braucht deshalb keinen Übergang für
den Variantenwechsel. Eine Graha-Wahl ändert Diagramm, Tafel und Codezeile
gemeinsam in 200 ms — wer dort etwas ergänzt, hält diesen Takt.

Bedienbares ist mindestens 44 Pixel hoch. In der Kopfzeile geschieht das über
ein Pseudo-Element: die Fläche wächst, die Zeile nicht — sonst wäre die
schwebende Leiste auf dem Telefon ein Fünftel des Schirms.

Das Diagramm ist ein `role="img"`, seine Ziffern erreichen also keinen
Screenreader. Was es zeigt, steht deshalb daneben als Liste in `.vh` — aus
denselben Daten, und in beiden Ansichten des Umschalters gültig.

## Offene Punkte

Zurzeit keine.
