# Todo: Theme-Generator + offene Punkte + Cleanup

Details siehe [plan.md](plan.md).

## Phase 1 — Theme-Generator

- [ ] 1.1 `scripts/theme-schemas.mjs` anlegen (ANSI_SLOTS, ANSI_SLOT_LABELS,
      ITERM_FIXED, VSCODE_COLORS, VSCODE_SEMANTIC, VSCODE_TOKEN_RULES,
      VSCODE_PACKAGE_VARIANT_ORDER — 1:1 aus echten Dateien transkribiert)
- [ ] 1.2 `scripts/generate-themes.mjs` anlegen (generateTabby,
      generateIterm2, generateVscodeThemes, updateVscodePackageJson +
      Helper hexToFloat/formatFloat/resolveColor/hexWithAlpha)
- [ ] 1.3 `package.json`: `build`-Script erweitern, `generate:themes`-Script
      hinzufügen
- [ ] Checkpoint 1a: Generator laufen lassen, Diff in
      `themes/tabby/navagraha.yaml` reviewen (nur gekürzte Kommentare, keine
      Farbwerte), committen
- [ ] Checkpoint 1b: Generator erneut laufen lassen → `git status
      --porcelain -- themes/` leer (Zero-Diff-Test)
- [ ] Checkpoint 1c: Propagation-Test (Farbe in palette.json ändern,
      generieren, grep auf neuen Hex-Wert in tabby/iterm2/vscode-Output,
      danach revert)
- [ ] Checkpoint 1d: `npm run build` läuft fehlerfrei

## Phase 2 — USER-Platzhalter

- [ ] 2.1 `src/pages/themes.astro` + `src/pages/en/themes.astro`: `USER` →
      `Daehnie` in der Repo-URL
- [ ] Verifikation: `grep -rn "USER" src/` liefert nichts mehr, Download-Link
      auf `/themes` zeigt auf github.com/Daehnie/navagraha

## Phase 3 — Cleanup

- [ ] 3.1 `PaletteTable.astro`: eigene neutrals-Liste durch `palette.neutrals`
      ersetzen (hl_low/hl_med ergänzen)
- [ ] Verifikation: `/palette` (DE+EN) zeigt 7 statt 5 Neutralwerte-Zeilen
- [ ] 3.2 `themes.astro` + `en/themes.astro`: hart kodierte de/en
      Tool-Beschreibungen nach `src/i18n/de.json`/`en.json` verschieben
      (neuer `themes.tools.<key>`-Key), Pages lesen über `t`
- [ ] Verifikation: `/themes` + `/en/themes` zeigen weiterhin korrekten Text,
      kein hart kodiertes de/en-Paar mehr im Code
- [ ] 3.3 `CLAUDE.md`: "Offene Punkte" aktualisieren (erledigte Punkte
      entfernen)

## Abschluss

- [ ] Gesamtverifikation laut plan.md (`npm run build`, `npm run dev` +
      alle 6 Seiten/Sprachen/4 Varianten durchklicken, `git status
      --porcelain -- themes/` leer)
- [ ] Commits pro Phase, nicht ein Riesen-Commit
