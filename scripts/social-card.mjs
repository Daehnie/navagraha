// Erzeugt die Vorschaubilder fuer geteilte Links: public/og-de.png und
// public/og-en.png, je 1280 × 640. og-en.png ist zugleich die Social Preview
// des Repos; GitHub hat dafuer keine Schnittstelle, sie wird von Hand
// hochgeladen.
//
// Alles kommt aus den Quellen der Seite: Farben und Graha-Namen aus
// palette.json, das Codebeispiel aus CodePreview.astro, die Texte aus
// src/i18n/. Gezeichnet wird mit Chrome, weil das Bild dieselben Schriften
// braucht wie die Seite. Nach einer Farb- oder Textaenderung neu erzeugen:
// npm run og:image. Chrome wird am macOS-Standardort gesucht, sonst CHROME
// setzen.

import { execFileSync } from 'node:child_process'
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const sharp = createRequire(import.meta.url)('sharp')
const chrome = process.env.CHROME ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const read = (...p) => readFileSync(join(root, ...p), 'utf8')

// node_modules kann auch weiter oben liegen, etwa bei einem Worktree.
let modules = root
while (!existsSync(join(modules, 'node_modules', '@fontsource'))) {
  if (dirname(modules) === modules) throw new Error('@fontsource nicht gefunden')
  modules = dirname(modules)
}
const font = (pkg, file) => pathToFileURL(join(modules, 'node_modules', '@fontsource', pkg, 'files', file)).href

const palette = JSON.parse(read('src', 'data', 'palette.json'))
const colors = palette.variants.swati.colors
const code = read('src', 'components', 'CodePreview.astro').match(/<code>([\s\S]*?)<\/code>/)[1]

// Die Programme stehen hier von Hand; die Liste auf der Seite ist Markup.
const programs = ['VS Code', 'CotEditor', 'iTerm2', 'Tabby', 'Vim', 'bat', 'Anytype']

const card = (t) => `<!doctype html><meta charset="utf-8">
<style>
@font-face{font-family:Spectral;font-weight:400;src:url("${font('spectral', 'spectral-latin-400-normal.woff2')}")}
@font-face{font-family:Spectral;font-weight:400;src:url("${font('spectral', 'spectral-latin-ext-400-normal.woff2')}");unicode-range:U+0100-024F,U+1E00-1EFF}
@font-face{font-family:Spectral;font-weight:600;src:url("${font('spectral', 'spectral-latin-600-normal.woff2')}")}
@font-face{font-family:Mona;src:url("${font('monaspace-neon', 'monaspace-neon-latin-400-normal.woff2')}")}
:root{${Object.entries(colors).map(([k, v]) => `--${k}:${v};`).join('')}}
*{box-sizing:border-box;margin:0}
html,body{width:1280px;height:640px;overflow:hidden;background:var(--base);color:var(--chandra)}
body{padding:64px 72px;display:grid;grid-template-columns:1fr 560px;gap:56px;align-items:center;font-family:Spectral,serif}
h1{font-weight:600;font-size:88px;line-height:1;letter-spacing:-.01em;color:var(--chandra_b)}
.tag{margin-top:16px;font-size:36px;line-height:1.25}
.sub{margin-top:10px;font-size:24px;line-height:1.4;color:var(--subtle)}
.grahas{margin-top:36px;display:grid;grid-template-columns:repeat(3,auto);gap:14px 26px;justify-content:start}
.g{display:flex;align-items:center;gap:10px;font-size:22px}
.g i{width:20px;height:20px;border-radius:50%;display:block}
.pane{background:var(--surface);border:1px solid var(--hl_med);border-radius:14px;overflow:hidden}
.bar{display:flex;align-items:center;gap:8px;padding:12px 16px;border-bottom:1px solid var(--hl_med);color:var(--ketu);font:15px Mona,monospace}
.bar i{width:10px;height:10px;border-radius:50%;background:var(--hl_high);display:block}
pre{padding:20px 22px;font:17px/1.75 Mona,monospace}
.ketu{color:var(--ketu);font-style:italic}.chandra{color:var(--chandra)}.mangala{color:var(--mangala)}
.budha{color:var(--budha)}.guru{color:var(--guru)}.shukra{color:var(--shukra)}.shani{color:var(--shani)}
.surya{color:var(--surya)}.rahu{color:var(--rahu)}
.foot{position:absolute;left:72px;bottom:44px;font:16px Mona,monospace;color:var(--ketu)}
</style>
<div>
  <h1>Navagraha</h1>
  <p class="tag">${t.tagline}</p>
  <p class="sub">${t.og.lede}</p>
  <div class="grahas">${palette.grahas.map((g) => `<span class="g"><i style="background:var(--${g.key})"></i>${g.sa}</span>`).join('')}</div>
</div>
<div class="pane"><div class="bar"><i></i><i></i><i></i><span>dignity.ts</span></div><pre><code>${code}</code></pre></div>
<p class="foot">${programs.join(' · ')}</p>
`

const tmp = mkdtempSync(join(tmpdir(), 'navagraha-og-'))
try {
  for (const lang of ['de', 'en']) {
    const html = join(tmp, `${lang}.html`)
    const shot = join(tmp, `${lang}.png`)
    writeFileSync(html, card(JSON.parse(read('src', 'i18n', `${lang}.json`))))
    // Chrome beendet sich nach dem Bildschirmfoto nicht immer selbst; das
    // Bild ist dann trotzdem geschrieben.
    try {
      execFileSync(chrome, [
        '--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run',
        `--user-data-dir=${join(tmp, 'profil')}`, '--force-device-scale-factor=2',
        '--window-size=1280,640', '--virtual-time-budget=3000', `--screenshot=${shot}`,
        pathToFileURL(html).href,
      ], { stdio: 'ignore', timeout: 30000, killSignal: 'SIGKILL' })
    } catch (e) {
      if (!existsSync(shot)) throw e
    }
    await sharp(shot).resize(1280, 640).png({ compressionLevel: 9, effort: 10 })
      .toFile(join(root, 'public', `og-${lang}.png`))
    console.log(`public/og-${lang}.png erzeugt`)
  }
} finally {
  rmSync(tmp, { recursive: true, force: true })
}
