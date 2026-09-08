# Navagraha: Theme-Generator + offene Punkte + Cleanup

## Context

`~/Documents/Claude/Navagraha` ist ein Astro-Projekt, das aus einer einzigen
Farbquelle (`src/data/palette.json`, 4 Varianten × 23 Farben) sowohl die
Website als auch Terminal-/Editor-Themes (vim, tabby, iTerm2, VS Code, bat)
speist. Die Themes unter `themes/` sind aktuell **von Hand** gepflegt und
müssen bei jeder Farbänderung manuell nachgezogen werden — das ist der erste
von drei in `CLAUDE.md` dokumentierten "Offenen Punkten" und der Hauptanlass
für diesen Plan.

Ein umfassender Review (3 parallele Explore-Agents + 1 Plan-Agent) hat
zusätzlich zwei Stellen gefunden, an denen Daten dupliziert statt aus
`palette.json`/i18n gelesen werden, entgegen der im Projekt selbst
dokumentierten Konvention. Alle Entscheidungen unten wurden mit dem Nutzer
abgestimmt:

- GitHub-User für den `USER`-Platzhalter: **Daehnie**
- `astro.config.mjs` `site`: bereits korrekt, **keine Änderung**
- Zusatzfunde (neutrals-Liste, i18n-Konformität): **beide in Scope**
- Tabby-Kommentare (Kontrastwerte): **weglassen**, gekürzt auf Rolle+Farbton
  (spart ~20 Zeilen ungenutzte WCAG-Berechnung; erzeugt beim ersten Lauf
  einen einmaligen, bewussten Diff, danach "zero diff")

Alle rechnerisch geprüften Werte in `themes/` stimmen aktuell exakt mit
`palette.json` überein — es gibt keinen bestehenden Drift zu reparieren, nur
den manuellen Prozess zu automatisieren.

## Phase 1 — Theme-Generator (Kernstück)

### Task 1.1: `scripts/theme-schemas.mjs` — reine Daten

Neue Datei mit den Mapping-Tabellen, 1:1 aus den echten Dateien transkribiert
(nicht aus der Beschreibung geraten):

- `ANSI_SLOTS` (16 Einträge, Reihenfolge: overlay, mangala, budha, guru,
  shani, rahu, shukra, subtle, ketu, surya, budha_b, guru_b, shani_b,
  rahu_b, shukra_b, chandra_b) — geteilt von tabby, iTerm2 und VS Code.
- `ANSI_SLOT_LABELS` (kurze Rollen-Labels für Tabby-Kommentare, z.B. `1 rot
  – Mangala`, ohne Kontrastzahl).
- `ITERM_FIXED` (11 semantische iTerm2-Keys → Palettenschlüssel, z.B.
  `'Background Color': 'base'`).
- `VSCODE_COLORS` (~120 Einträge `vscodeKey: [paletteKey, alpha?]`,
  transkribiert aus
  [graha-swati-color-theme.json](../themes/vscode/navagraha/themes/graha-swati-color-theme.json)
  — `terminal.ansi*`-Keys **nicht** hier, die kommen aus `ANSI_SLOTS`).
- `VSCODE_SEMANTIC` (~8 Einträge `semanticTokenKey: paletteKey`).
- `VSCODE_TOKEN_RULES` (13–15 Regeln `{name, paletteKey, scope[], fontStyle?}`).
- `VSCODE_PACKAGE_VARIANT_ORDER` = `['pratipada', 'ushas', 'swati', 'tula']`
  (echte Reihenfolge in `contributes.themes`, **weicht** von der Varianten-
  Reihenfolge in `palette.json` ab — muss hart kodiert werden, sonst
  schlägt der Zero-Diff-Test fehl).

**Referenzdateien zum Abschreiben** (exakt lesen, nicht schätzen):
[`palette.json`](../src/data/palette.json),
[`graha-swati-color-theme.json`](../themes/vscode/navagraha/themes/graha-swati-color-theme.json),
[`Navagraha Swati.itermcolors`](../themes/iterm2/Navagraha%20Swati.itermcolors),
[`navagraha.yaml`](../themes/tabby/navagraha.yaml).

### Task 1.2: `scripts/generate-themes.mjs` — Logik

Liest `palette.json` per `fs.readFileSync` + `JSON.parse` (kein
`import ... with { type: 'json' }`, portabler). Vier Generator-Funktionen:

- `generateTabby(palette)` → schreibt `themes/tabby/navagraha.yaml` (1 Datei,
  4 Varianten-Einträge, 16 ANSI-Farben je nach `ANSI_SLOTS`-Reihenfolge +
  5 benannte Farben: foreground=chandra, background=base, selection=hl_high,
  cursor=shukra, cursorAccent=base).
- `generateIterm2(palette)` → schreibt 4 `.itermcolors`-Plist-Dateien.
  Eigener Mini-XML-Writer (kein plist-Package nötig, Schema ist flach:
  `<dict>` aus `<dict>`s mit nur `<real>`/`<string>`-Blättern). Wichtig:
  jeder Farb-`<dict>` braucht **`Alpha Component` = `1.0`** (in den echten
  Dateien vorhanden), Float-Formatierung muss `0` → `"0.0"` und `1` →
  `"1.0"` erzwingen (nicht `Number.toString()` roh verwenden), und die 27
  Top-Level-Keys müssen alphabetisch sortiert ausgegeben werden.
- `generateVscodeThemes(palette)` → schreibt 4 Theme-JSONs aus
  `VSCODE_COLORS` + `ANSI_SLOTS` (für `terminal.ansi*`) + `VSCODE_SEMANTIC`
  + `VSCODE_TOKEN_RULES`, via `JSON.stringify(obj, null, 2) + '\n'`.
- `updateVscodePackageJson(palette)` → **liest** die bestehende
  `themes/vscode/navagraha/package.json`, überschreibt **ausschließlich**
  `contributes.themes` (Reihenfolge nach `VSCODE_PACKAGE_VARIANT_ORDER`),
  lässt `name`/`displayName`/`version`/`publisher`/etc. unangetastet. Kein
  Voll-Template — sonst geht ein manueller Versionsbump beim nächsten
  Generator-Lauf verloren.
- `vim/navagraha.vim` und `bat/README.md` bleiben **unangetastet** (keine
  Palette-Daten enthalten, arbeiten über Terminal-ANSI-Slots) — der
  Generator fasst sie nicht an, das ist eine bewusste Entscheidung, keine
  Lücke.

Kleine geteilte Helper: `hexToFloat`, `formatFloat`, `resolveColor(variant,
[key, alpha])`, `hexWithAlpha`.

### Task 1.3: In `package.json` verdrahten

```diff
   "scripts": {
     "dev": "astro dev",
-    "build": "astro build",
-    "preview": "astro preview"
+    "build": "node scripts/generate-themes.mjs && astro build",
+    "preview": "astro preview",
+    "generate:themes": "node scripts/generate-themes.mjs"
   },
```

`dev`/`preview` bleiben unverändert — [`Base.astro`](../src/layouts/Base.astro)
und [`themes.astro`](../src/pages/themes.astro) lesen ausschließlich
`src/data/palette.json` direkt, nie `themes/`-Output. Damit läuft
`themes/` bei jedem `npm run build` automatisch mit — die GitHub-Actions-
Pipeline ([`deploy.yml`](../.github/workflows/deploy.yml), `withastro/action@v3`
ruft nur `npm run build` auf) bleibt unverändert und hält `themes/`
trotzdem synchron.

**Checkpoint Phase 1** (vor Phase 2/3):
1. `node scripts/generate-themes.mjs` ausführen.
2. `git status --porcelain -- themes/` — erwartet: **ein** Diff nur in
   `themes/tabby/navagraha.yaml` (gekürzte Kommentare, keine Farbwerte
   geändert). Diff review, dann committen ("regenerate themes via
   generator script").
3. Generator erneut laufen lassen → `git status --porcelain -- themes/`
   jetzt **leer** (Zero-Diff-Test, ab hier die Regression-Baseline).
4. Propagation-Test: einen Farbwert in `palette.json` testweise ändern
   (z.B. `swati.colors.shukra`), Generator laufen lassen, `grep` auf den
   neuen Hex-Wert in `themes/tabby/navagraha.yaml`,
   `themes/iterm2/Navagraha Swati.itermcolors` und
   `themes/vscode/navagraha/themes/graha-swati-color-theme.json` — muss je
   ≥1 Treffer liefern. Danach `git checkout -- src/data/palette.json
   themes/`.
5. `npm run build` — Astro-Build muss weiterhin fehlerfrei durchlaufen.

## Phase 2 — `USER`-Platzhalter auflösen

### Task 2.1

In [`src/pages/themes.astro`](../src/pages/themes.astro) und
[`src/pages/en/themes.astro`](../src/pages/en/themes.astro) (Zeile 26 in
beiden): `const repo = 'https://github.com/USER/navagraha/tree/main/'` →
`const repo = 'https://github.com/Daehnie/navagraha/tree/main/'`.

**Verifikation:** `grep -rn "USER" src/` liefert keine Treffer mehr (die
`USER`-Erwähnung in `README.md` als Beispiel-Snippet bleibt bestehen, ist
kein echter Platzhalter). Dev-Server starten, `/themes` und `/en/themes`
öffnen, Download-Link-Ziel stichprobenartig prüfen.

## Phase 3 — Cleanup aus dem Review

### Task 3.1: `PaletteTable.astro` — vollständige `neutrals`-Liste

[`PaletteTable.astro`](../src/components/PaletteTable.astro) definiert aktuell
eine eigene, unvollständige Neutralwerte-Liste (5 von 7 Einträgen, `hl_low`
und `hl_med` fehlen) statt `palette.json`s eigenes `neutrals`-Array zu
verwenden. Ändern: die Liste durch `palette.neutrals` ersetzen (direkt aus
den Palettendaten lesen statt lokal zu duplizieren) — damit taucht jede
Neutralwert-Änderung in `palette.json` automatisch in der UI-Tabelle auf.

**Verifikation:** `/palette` (DE + EN) öffnen, Neutralwerte-Tabelle zeigt
jetzt 7 statt 5 Zeilen, `hl_low`/`hl_med` mit korrekten Hex-Werten je
Variante sichtbar.

### Task 3.2: `themes.astro` — Texte ins i18n-System verschieben

[`src/pages/themes.astro`](../src/pages/themes.astro) und
[`src/pages/en/themes.astro`](../src/pages/en/themes.astro) kodieren die
`tools`-Beschreibungen aktuell doppelt hart im Markup (de/en-Strings inline,
in beiden Dateien dupliziert) statt über `src/i18n/de.json` /
`src/i18n/en.json` zu laufen — das widerspricht der in `CLAUDE.md`
dokumentierten Konvention ("Texte stehen in i18n-JSON, nie fest im
Markup"). Ändern: Tool-Beschreibungen nach `de.json`/`en.json` unter einem
neuen `themes.tools.<key>`-Key verschieben, beide `themes.astro`-Dateien
lesen die Texte über `t` statt sie inline zu definieren. `tools`-Array
bleibt (Struktur: file-Pfade, Tool-Namen), nur die `de`/`en`-Beschreibungs-
Strings wandern raus.

**Verifikation:** `/themes` und `/en/themes` öffnen, Tool-Beschreibungen
zeigen weiterhin korrekten Text in jeweiliger Sprache. `grep -n "de:.*en:"
src/pages/themes.astro src/pages/en/themes.astro` sollte keine hart
kodierten Beschreibungs-Paare mehr zeigen.

### Task 3.3: `CLAUDE.md` "Offene Punkte" aktualisieren

Nach Abschluss von Phase 1+2: die ersten beiden Bullet-Points unter
"Offene Punkte" entfernen (Generator existiert jetzt, `USER`-Platzhalter
ist aufgelöst), den `site`-Hinweis ebenfalls entfernen (kein offener Punkt,
war nur eine Notiz). Falls nach Phase 1+2 nichts Offenes mehr übrig ist,
den ganzen Abschnitt entfernen.

## Verifikation gesamt

- `npm run build` läuft fehlerfrei durch (inkl. Theme-Generator-Vorlauf).
- `npm run dev`: `/`, `/palette`, `/themes` sowie `/en/`, `/en/palette`,
  `/en/themes` öffnen, alle 4 Varianten im Theme-Switcher durchklicken —
  keine visuellen Regressionen, Neutralwerte-Tabelle vollständig,
  Download-Links auf `/themes` zeigen auf `github.com/Daehnie/navagraha`.
- `git status --porcelain -- themes/` nach einem `npm run build` ist leer
  (Generator ist deterministisch und idempotent).
- Committen in sinnvollen, atomaren Schritten pro Phase (nicht ein
  Riesen-Commit).
