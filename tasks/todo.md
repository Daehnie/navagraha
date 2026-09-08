# Todo: Theme-Generator + offene Punkte + Cleanup

Details siehe [plan.md](plan.md). **Alle Punkte erledigt.**

## Phase 1 — Theme-Generator

- [x] 1.1 `scripts/theme-schemas.mjs` angelegt (VARIANT_ORDER, ANSI_SLOTS,
      ANSI_SLOT_LABELS, TABBY_*, ITERM_FIXED, VSCODE_COLORS,
      VSCODE_ANSI_NAMES, VSCODE_SEMANTIC, VSCODE_TOKEN_RULES)
- [x] 1.2 `scripts/generate-themes.mjs` angelegt (tabby, iTerm2, VS-Code-
      Themes, Extension-Manifest)
- [x] 1.3 `package.json`: `build` erweitert, `generate:themes` ergänzt
- [x] Checkpoint 1a: einmaliger Diff nur in `themes/tabby/navagraha.yaml`
      (Kommentare gekürzt, kein Farbwert geändert), committet
- [x] Checkpoint 1b: Zero-Diff-Test grün — Generator ist idempotent
- [x] Checkpoint 1c: Propagation-Test grün (tabby/iTerm2/VS Code), Reset sauber
- [x] Checkpoint 1d: `npm run build` fehlerfrei

## Phase 2 — USER-Platzhalter

- [x] 2.1 `USER` → `Daehnie` in beiden themes.astro
- [x] Verifikation: keine `USER`-Treffer mehr in `src/`, Links im Browser
      geprüft (github.com/Daehnie/navagraha/...)

## Phase 3 — Cleanup

- [x] 3.1 `PaletteTable.astro` liest die Liste aus `palette.neutrals`
- [x] Verifikation: `/palette` zeigt 7 statt 5 Zeilen (DE + EN)
- [x] 3.2 Tool-Beschreibungen nach `src/i18n/de.json` / `en.json` verschoben
- [x] Verifikation: DE/EN-Texte korrekt getrennt, keine hart kodierten Paare
- [x] 3.3 `CLAUDE.md` aktualisiert (Generator dokumentiert, erledigte Punkte
      entfernt)

## Zusätzlich, außerhalb des ursprünglichen Plans

- [x] Site-brechenden Bug in `Base.astro:37` behoben: `set:html` wurde als
      Element statt als Direktive geschrieben, dadurch landete literal
      `{vars}` im HTML und **keine** Palettenvariable wurde je definiert.
      Im Browser verifiziert: alle 4 Varianten liefern jetzt die Werte
      aus `palette.json`.

## Abschluss

- [x] Gesamtverifikation: Build grün, 6 Seiten, `themes/` nach Build
      unverändert, Varianten im Browser durchgeschaltet
- [x] Commits pro Phase

## Neu aufgenommener offener Punkt

- [ ] Tabby-`cmd`-Block in `themes.astro` nennt Menüpunkte auf Deutsch
      („Farbschema", „Darstellung") und steht so auch auf der englischen
      Seite (siehe CLAUDE.md, Offene Punkte)
