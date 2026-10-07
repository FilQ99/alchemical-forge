# Kamień Cienia

Clicker w klimacie Metin2, własne grafiki i zasady. Czysty HTML/CSS/JS, bez budowania.

## Struktura
- `public/index.html` – szkielet strony
- `public/style.css` – cały wygląd
- `public/js/data.js` – dane gry (mapy, wrogowie, bonusy, sety, ceny, szanse dropu)
- `public/js/art.js` – lista grafik (`ASSETS`) i placeholdery SVG
- `public/js/engine.js` – zasady gry
- `public/js/ui.js` – interfejs, nawigacja, animacje
- `public/assets/` – grafiki WebP
- `DESIGN.md` – ustalenia projektowe, `PROMPTY-GRAFIK.md` – prompty do ChatGPT

## Uruchomienie lokalnie
`cd public && python3 -m http.server 8000` i otwórz http://localhost:8000

## Wdrożenie (Cloudflare Pages)
Build command: puste. Build output directory: `public`. Każdy push do `main` wdraża się sam.
