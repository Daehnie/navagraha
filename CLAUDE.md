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
vier VS-Code-Themes und `contributes.themes` im Extension-Manifest. Die
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

**Sättigung folgt der Stärke im Chart.** Shukra ist exaltiert und
Atmakaraka, hat also die kräftigste Farbe. Guru hat Dig Bala im Lagna. Rahu
bleibt blass, Mangala im zwölften Haus zurückgenommen.

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

Schrift auf der Seite: Serifen für Fließtext, `Monaspace Neon` für Code und
Werte. Die Seite trägt immer das gewählte Schema selbst.

Kein Framework für Interaktion. Der Variantenschalter und das Kopieren sind
`is:inline`-Skripte von wenigen Zeilen. So bleiben soll es.

`prefers-reduced-motion` wird respektiert, die Animation im Diagramm ist die
einzige der Seite.

Bedienbares ist mindestens 44 Pixel hoch. In der Kopfzeile geschieht das über
ein Pseudo-Element: die Fläche wächst, die Zeile nicht — sonst wäre die
schwebende Leiste auf dem Telefon ein Fünftel des Schirms.

Das Diagramm ist ein `role="img"`, seine Ziffern erreichen also keinen
Screenreader. Was es zeigt, steht deshalb daneben als Liste in `.vh` — aus
denselben Daten, und in beiden Ansichten des Umschalters gültig.

## Offene Punkte

- Der `cmd`-Block für Tabby in `src/pages/themes.astro` nennt die Menüpunkte
  auf Deutsch („Farbschema", „Darstellung") und steht so auch auf der
  englischen Seite. Entweder englische Menünamen ergänzen oder den Block
  ebenfalls nach `src/i18n/` ziehen.
