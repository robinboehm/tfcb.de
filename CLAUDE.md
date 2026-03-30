# TFC Berlin Website (tfcb.de)

## Projekt
Vereinswebseite für den 1. TFC Berlin e.V. (1. Tischfußballclub Berlin) – ältester Tischfußballverein Berlins, gegründet 2006.
Live unter: https://tfcb.de | Repo: git@github.com:robinboehm/tfcb.de.git

## Tech Stack
- **Astro 6.x** – Static Site Generator, reines CSS (kein Tailwind)
- **GitHub Actions** → **GitHub Pages** (Branch: `main` → auto-deploy)
- Node.js **≥ 22.12.0** erforderlich (Astro 6 Anforderung)
- Google Fonts: Inter

## Befehle
- `npm run dev` – Lokaler Dev-Server auf http://localhost:4321
- `npm run build` – Produktionsbuild nach `dist/`
- Immer vor dem Push: `npm run build` ausführen

## Struktur
- `src/components/` – Alle Sektionskomponenten (Header, Hero, UeberUns, Mannschaften, Vorstand, Kontakt, Footer)
- `src/pages/index.astro` – Hauptseite (assembliert alle Komponenten)
- `src/pages/impressum.astro` – Impressum (DSGVO)
- `src/styles/global.css` – CSS-Variablen und globale Styles
- `public/logo.png` – Vereinslogo (unveränderbar laut Satzung §2)
- `public/vorstand/` – Vorstandsfotos (franziska.jpg, viet.jpg, leonie.jpg, robin.jpg, jessica.jpg)

## Design-Tokens
- `--color-bg-dark: #0a0a0a` / `--color-bg-light: #f5f5f5`
- `--color-green: #4CAF50` / `--color-green-dark: #2d8a30`
- Vereinsfarben laut Satzung: **Schwarz & Grün**

## Vereinsdaten (aktuell)
- **Adresse:** 1. TFC Berlin e.V., c/o Robin Böhm, Koppenstraße 82, 10243 Berlin
- **E-Mail:** info@tfcb.de
- **Registergericht:** Amtsgericht Berlin (Charlottenburg) VR 25451
- **Vorstand (gewählt Januar 2026):** Franziska Busch (1. Vors.) · Viet Duc Hoang (2. Vors.) · Leonie Fuchs (Kassenwärtin) · Robin Böhm (Schriftführer) · Jessica Clausen (Beisitzerin)
- **Heimspielort:** Platzwart, Audre-Lorde-Str. 27, 10997 Berlin-Kreuzberg
- **Verband:** TFVB – https://tfvb.de (aktuelle Mannschaften: https://tfvb.de/index.php/mitgliedervereine?task=verein_details&id=14)

## Gotchas
- `astro.config.mjs`: `site: 'https://tfcb.de'`, `base: '/'` – bei Änderungen alle Asset-Pfade prüfen
- Logo darf laut Satzung §2 nicht verändert werden
- GitHub Pages Source muss auf "GitHub Actions" gesetzt sein (nicht "Deploy from branch")
