" graha.vim — Syntax-Zuordnung fuer das Graha-Farbschema
"
" Arbeitet ausschliesslich mit den ANSI-Plaetzen 0–15, nimmt also die Farben
" aus dem Terminal. Damit gilt es unveraendert auf allen SSH-Zielen, egal ob
" dort Pratipada oder Ushas eingestellt ist, und braucht kein 256-Farb- oder
" Truecolor-Terminal.
"
" Ablage:  ~/.vim/colors/graha.vim   (bzw. ~/.config/nvim/colors/graha.vim)
" Aktiv:   colorscheme graha         (in .vimrc unter syntax on)
"
" Platzbelegung des Schemas:
"   1 Mangala rot     2 Budha gruen    3 Guru gold     4 Shani blau
"   5 Rahu magenta    6 Shukra cyan    8 Ketu grau     9 Surya kupfer

hi clear
if exists("syntax_on")
  syntax reset
endif
let g:colors_name = "graha"

" Grundflaeche: bewusst NONE, damit Terminal-Hintergrund und -Vordergrund
" durchschlagen (Transparenz, Theme-Wechsel hell/dunkel bleiben intakt).
hi Normal        ctermfg=NONE ctermbg=NONE cterm=NONE

" --- Grahas nach Naturell -------------------------------------------------
" Ketu, Loslösung: alles, was nicht ausgefuehrt wird
hi Comment       ctermfg=8    ctermbg=NONE cterm=NONE
hi SpecialComment ctermfg=8   ctermbg=NONE cterm=italic

" Mangala, Handlung: Steuerfluss und Schluesselwoerter
hi Statement     ctermfg=1    ctermbg=NONE cterm=NONE
hi Conditional   ctermfg=1    ctermbg=NONE cterm=NONE
hi Repeat        ctermfg=1    ctermbg=NONE cterm=NONE
hi Keyword       ctermfg=1    ctermbg=NONE cterm=NONE
hi Exception     ctermfg=1    ctermbg=NONE cterm=NONE
hi Label         ctermfg=1    ctermbg=NONE cterm=NONE

" Budha, Sprache: Zeichenketten
hi String        ctermfg=2    ctermbg=NONE cterm=NONE
hi Character     ctermfg=2    ctermbg=NONE cterm=NONE

" Guru, Lehre und Ausdehnung: Funktionen
hi Function      ctermfg=3    ctermbg=NONE cterm=NONE
hi Title         ctermfg=3    ctermbg=NONE cterm=bold

" Shani, Grenze und Struktur: Operatoren, Trennzeichen
hi Operator      ctermfg=4    ctermbg=NONE cterm=NONE
hi Delimiter     ctermfg=4    ctermbg=NONE cterm=NONE

" Surya, feste Groessen: Zahlen und Konstanten
hi Constant      ctermfg=9    ctermbg=NONE cterm=NONE
hi Number        ctermfg=9    ctermbg=NONE cterm=NONE
hi Float         ctermfg=9    ctermbg=NONE cterm=NONE
hi Boolean       ctermfg=9    ctermbg=NONE cterm=NONE

" Shukra, Form: Typen, Klassen, Strukturen
hi Type          ctermfg=6    ctermbg=NONE cterm=NONE
hi StorageClass  ctermfg=6    ctermbg=NONE cterm=NONE
hi Structure     ctermfg=6    ctermbg=NONE cterm=NONE
hi Typedef       ctermfg=6    ctermbg=NONE cterm=NONE

" Rahu, das Uneigentliche: Praeprozessor, Sonderzeichen, Makros
hi PreProc       ctermfg=5    ctermbg=NONE cterm=NONE
hi Include       ctermfg=5    ctermbg=NONE cterm=NONE
hi Define        ctermfg=5    ctermbg=NONE cterm=NONE
hi Macro         ctermfg=5    ctermbg=NONE cterm=NONE
hi Special       ctermfg=5    ctermbg=NONE cterm=NONE
hi SpecialChar   ctermfg=5    ctermbg=NONE cterm=NONE
hi Tag           ctermfg=5    ctermbg=NONE cterm=NONE

" Chandra: Bezeichner bleiben Grundtext, das haelt den Fliesstext ruhig
hi Identifier    ctermfg=NONE ctermbg=NONE cterm=NONE

" --- Oberflaeche ----------------------------------------------------------
hi LineNr        ctermfg=8    ctermbg=NONE cterm=NONE
hi CursorLineNr  ctermfg=3    ctermbg=NONE cterm=NONE
hi CursorLine    ctermfg=NONE ctermbg=0    cterm=NONE
hi CursorColumn  ctermfg=NONE ctermbg=0    cterm=NONE
hi ColorColumn   ctermfg=NONE ctermbg=0    cterm=NONE
hi SignColumn    ctermfg=8    ctermbg=NONE cterm=NONE
hi VertSplit     ctermfg=8    ctermbg=NONE cterm=NONE
hi StatusLine    ctermfg=15   ctermbg=0    cterm=NONE
hi StatusLineNC  ctermfg=8    ctermbg=0    cterm=NONE
hi TabLine       ctermfg=8    ctermbg=0    cterm=NONE
hi TabLineSel    ctermfg=15   ctermbg=NONE cterm=bold
hi TabLineFill   ctermfg=NONE ctermbg=0    cterm=NONE
hi Visual        ctermfg=NONE ctermbg=0    cterm=NONE
hi Search        ctermfg=0    ctermbg=3    cterm=NONE
hi IncSearch     ctermfg=0    ctermbg=6    cterm=NONE
hi MatchParen    ctermfg=6    ctermbg=NONE cterm=bold
hi Folded        ctermfg=8    ctermbg=NONE cterm=NONE
hi NonText       ctermfg=8    ctermbg=NONE cterm=NONE
hi SpecialKey    ctermfg=8    ctermbg=NONE cterm=NONE
hi Directory     ctermfg=6    ctermbg=NONE cterm=NONE
hi Question      ctermfg=2    ctermbg=NONE cterm=NONE
hi MoreMsg       ctermfg=2    ctermbg=NONE cterm=NONE
hi ModeMsg       ctermfg=3    ctermbg=NONE cterm=bold
hi Pmenu         ctermfg=NONE ctermbg=0    cterm=NONE
hi PmenuSel      ctermfg=0    ctermbg=6    cterm=NONE
hi PmenuSbar     ctermfg=NONE ctermbg=0    cterm=NONE
hi PmenuThumb    ctermfg=NONE ctermbg=8    cterm=NONE
hi WildMenu      ctermfg=0    ctermbg=3    cterm=NONE

" Warnung und Fehler: Mangala, das einzige echte Alarmrot
hi Error         ctermfg=1    ctermbg=NONE cterm=bold
hi ErrorMsg      ctermfg=1    ctermbg=NONE cterm=bold
hi WarningMsg    ctermfg=9    ctermbg=NONE cterm=NONE
hi Todo          ctermfg=0    ctermbg=3    cterm=NONE

" Diff
hi DiffAdd       ctermfg=2    ctermbg=NONE cterm=NONE
hi DiffChange    ctermfg=3    ctermbg=NONE cterm=NONE
hi DiffDelete    ctermfg=1    ctermbg=NONE cterm=NONE
hi DiffText      ctermfg=3    ctermbg=NONE cterm=bold

" Rechtschreibung
hi SpellBad      ctermfg=1    ctermbg=NONE cterm=underline
hi SpellCap      ctermfg=4    ctermbg=NONE cterm=underline
hi SpellRare     ctermfg=5    ctermbg=NONE cterm=underline
hi SpellLocal    ctermfg=6    ctermbg=NONE cterm=underline
