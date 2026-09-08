# Navagraha

Ein Farbschema für Terminal und Editor, abgeleitet aus einem siderischen
Geburtshoroskop. Jede Farbe ist die klassische Farbe eines Grahas, ihre
Sättigung folgt seiner Stärke im Chart.

Vier Varianten:

| Variante  | Grund   | Helligkeit |
|-----------|---------|------------|
| Swati     | Vayu    | dunkel     |
| Pratipada | Prithvi | dunkel     |
| Ushas     | Prithvi | hell       |
| Tula      | Vayu    | hell       |

## Aufbau

    src/data/palette.json     einzige Farbquelle, Seite und Themes lesen daraus
    src/pages/                deutsche Seiten
    src/pages/en/             englische Seiten
    src/i18n/                 Wörterbücher und Helfer
    themes/                   fertige Theme-Dateien je Zielprogramm
    public/                   Icons

## Entwickeln

    npm install
    npm run dev

## Veröffentlichen

Der Workflow in `.github/workflows/deploy.yml` baut bei jedem Push auf `main`
und veröffentlicht über GitHub Pages. Einmalig unter Settings → Pages die
Quelle auf *GitHub Actions* stellen.

Für eine eigene Domain: `public/CNAME` mit der Domain anlegen und den
DNS-Eintrag darauf zeigen lassen. In `astro.config.mjs` steht `site` bereits
auf `navagraha.digitalspirit.io` — dort die tatsächliche Adresse eintragen.

Ohne eigene Domain stattdessen in `astro.config.mjs`:

    site: 'https://USER.github.io',
    base: '/navagraha'

In `src/pages/themes.astro` steht die Repo-Adresse als `USER` — dort den
eigenen GitHub-Namen eintragen, damit die Download-Links greifen.

## Sprachen

Deutsch ist Standard und liegt ohne Präfix unter `/`. Englisch liegt unter
`/en/`. Eine weitere Sprache: `src/i18n/<code>.json` anlegen, in
`src/i18n/utils.ts` eintragen, `src/pages/<code>/` mit denselben drei Seiten
anlegen und in `astro.config.mjs` bei `locales` ergänzen.
