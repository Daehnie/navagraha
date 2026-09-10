# Vim

Ein Farbschema für Vim, das seine Farben nicht selbst setzt, sondern über
die ANSI-Plätze vom Terminal nimmt. Es wechselt deshalb mit, wenn das
Terminal die Variante wechselt — eine Datei für alle vier.

## Einbauen

    cp navagraha.vim ~/.vim/colors/

Dann in der `~/.vimrc`:

    colorscheme navagraha

Für Neovim gehört die Datei nach `~/.config/nvim/colors/`.

## Eine Abweichung, die man kennen sollte

Platz 9 der ANSI-Palette trägt in diesem Schema Surya (Kupfer), nicht ein
helleres Mangala. Programme, die „bright red" für Fehler nehmen, zeigen
deshalb Kupferorange. In `navagraha.vim` liegt `Error` aus diesem Grund auf
Platz 1 statt auf Platz 9.

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

---

## English

A Vim colour scheme that sets no colours of its own: it reads the ANSI
slots from the terminal and therefore follows whichever variant the
terminal is using. Copy `navagraha.vim` to `~/.vim/colors/` (or
`~/.config/nvim/colors/` for Neovim) and add `colorscheme navagraha` to
your config. Note that slot 9 carries Surya (copper) rather than a brighter
red, so `Error` is mapped to slot 1 instead.
