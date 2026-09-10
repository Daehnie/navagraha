# bat

`bat` bringt eigene Themes mit festen Hexwerten mit. Dieses Schema geht
einen anderen Weg: das eingebaute ANSI-Theme nimmt die Farben vom Terminal
und folgt damit allen vier Varianten, ohne dass eine Datei nötig wäre.

## Einbauen

In die Shell-Konfiguration (`~/.zshrc`, `~/.bashrc`) aufnehmen:

    export BAT_THEME=ansi

Danach zeigt `bat` dieselben Farben wie das Terminal — und wechselt mit,
wenn dort die Variante wechselt.

## Warum keine eigene Datei

Ein eigenes bat-Theme müsste die Hexwerte einer einzigen Variante
festschreiben. Es würde dann nicht mehr mitwechseln, und bei einem Wechsel
von hell auf dunkel stünde die falsche Farbe im Terminal. Der Umweg über
ANSI ist hier die genauere Lösung, nicht die bequemere.

---

## English

`bat` ships themes with hard-coded hex values. This scheme takes another
route: the built-in ANSI theme reads its colours from the terminal and thus
follows all four variants without needing a file. Add
`export BAT_THEME=ansi` to your shell config. A dedicated bat theme would
freeze one variant's hex values and stop following the terminal — the
detour through ANSI is the more accurate answer here, not the lazier one.
