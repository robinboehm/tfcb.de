# TFC Berlin Website Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Erstelle eine moderne Vereinswebseite für den 1. TFC Berlin e.V. mit Astro, deployed via GitHub Actions auf GitHub Pages.

**Architecture:** Single-Page-Anwendung mit Anchor-Navigation. Split-Design: dunkler Header/Hero, helle Content-Sektionen, dunkler Footer. Alle Inhalte statisch in Astro-Komponenten.

**Tech Stack:** Astro 4.x, reines CSS (keine Tailwind), Google Fonts (Inter), GitHub Actions, GitHub Pages

---

## Inhaltsdaten (Referenz für alle Tasks)

### Vereinsdaten
- Name: 1. TFC Berlin (1. Tischfußballclub Berlin) e.V.
- Gegründet: 2006
- E-Mail: info@tfcb.de
- Adresse: c/o Robin Böhm | Koppenstraße 82 | 10243 Berlin
- Registergericht: Amtsgericht Berlin (Charlottenburg) VR 25451

### Vorstand (gewählt Januar 2025)
- Franziska Busch — 1. Vorsitzende
- Viet Duc Hoang — 2. Vorsitzender
- Leonie Fuchs — Kassenwärtin
- Robin Böhm — Schriftführer
- Jessica Clausen — Beisitzerin

### Mannschaften (aktuell 2025/26)
| Team | Liga | Heimspielort |
|------|------|--------------|
| BSU | Landesliga | Platzwart, Audre-Lorde-Str. 27, 10997 Berlin-Kreuzberg |
| 1.TFC Berlin Kreuzberg 36 II | Landesliga | Kickerfreude, Siemensstraße 26, 10551 Berlin-Moabit |
| ZIGZAG Ahtag | Landesliga | Platzwart, Audre-Lorde-Str. 27, 10997 Berlin-Kreuzberg |
| TFC Berlin II | Verbandsliga | Platzwart, Audre-Lorde-Str. 27, 10997 Berlin-Kreuzberg |
| ZIGZAG Babärz | Verbandsliga | Platzwart, Audre-Lorde-Str. 27, 10997 Berlin-Kreuzberg |
| Pink Unicorns | Bezirksliga | Platzwart, Audre-Lorde-Str. 27, 10997 Berlin-Kreuzberg |
| Flora Soft | Kreisliga A | Studentisches Café Flora, Philippstr. 13, 10115 Berlin |
| Flora Softer | Kreisliga B | Studentisches Café Flora, Philippstr. 13, 10115 Berlin |
| Gernhart Reinbolzen | Kreisliga A | Platzwart, Audre-Lorde-Str. 27, 10997 Berlin-Kreuzberg |
| kick.eriki | Kreisliga A | Kickerfreude, Siemensstraße 26, 10551 Berlin-Moabit |
| Kommando Erwin Kostedde | Kreisliga B | Platzwart, Audre-Lorde-Str. 27, 10997 Berlin-Kreuzberg |
| Pli-Pla-Platzwart | Kreisliga A | Platzwart, Audre-Lorde-Str. 27, 10997 Berlin-Kreuzberg |
| Megapeng | Kreisliga B | Pörx, Fürbringer Str. 29, 10961 Berlin-Kreuzberg |

### Design-Tokens
```
--color-bg-dark: #0a0a0a
--color-bg-light: #f5f5f5
--color-green: #4CAF50
--color-green-dark: #2d8a30
--color-green-light: #6fcf72
--color-text-light: #ffffff
--color-text-dark: #1a1a1a
--color-text-muted: #666666
--font-family: 'Inter', system-ui, sans-serif
```

---

## Task 1: Astro-Projekt initialisieren

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`
- Create: `src/pages/index.astro`
- Create: `src/layouts/Layout.astro`

**Step 1: Astro-Projekt erstellen**

```bash
cd /Users/robinboehm/development/tfcb.de
npm create astro@latest . -- --template minimal --no-git --install --typescript strict
```

Wenn nach "overwrite" gefragt wird: `yes`

**Step 2: Verifizieren**

```bash
npm run dev
```
Erwartung: Dev-Server startet auf http://localhost:4321

**Step 3: astro.config.mjs für GitHub Pages konfigurieren**

Inhalt von `astro.config.mjs`:
```js
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://robinboehm.github.io',
  base: '/tfcb.de',
});
```

> **Hinweis:** Sobald eine Custom Domain (tfcb.de) konfiguriert ist, `site` auf `'https://tfcb.de'` und `base` auf `'/'` ändern.

**Step 4: Commit**

```bash
git init
git add .
git commit -m "feat: initialize Astro project"
```

---

## Task 2: GitHub Repository verbinden und Actions-Workflow anlegen

**Files:**
- Create: `.github/workflows/deploy.yml`
- Create: `public/CNAME` (für spätere Custom Domain)

**Step 1: Remote hinzufügen**

```bash
git remote add origin git@github.com:robinboehm/tfcb.de.git
```

**Step 2: GitHub Actions Workflow anlegen**

Datei: `.github/workflows/deploy.yml`
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist/

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

**Step 3: CNAME-Datei für spätere Custom Domain anlegen**

Datei: `public/CNAME`
```
tfcb.de
```

**Step 4: Commit und Push**

```bash
git add .
git commit -m "feat: add GitHub Actions deploy workflow"
git push -u origin main
```

**Step 5: GitHub Pages aktivieren**
- Gehe zu https://github.com/robinboehm/tfcb.de/settings/pages
- Source: "GitHub Actions"
- Speichern

---

## Task 3: Globales CSS und Layout-Komponente

**Files:**
- Create: `src/styles/global.css`
- Modify: `src/layouts/Layout.astro`

**Step 1: Globales CSS anlegen**

Datei: `src/styles/global.css`:
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap');

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

:root {
  --color-bg-dark: #0a0a0a;
  --color-bg-dark-2: #141414;
  --color-bg-light: #f5f5f5;
  --color-bg-light-2: #ffffff;
  --color-green: #4CAF50;
  --color-green-dark: #2d8a30;
  --color-green-light: #6fcf72;
  --color-text-light: #ffffff;
  --color-text-dark: #1a1a1a;
  --color-text-muted-dark: #999999;
  --color-text-muted-light: #555555;
  --font-family: 'Inter', system-ui, -apple-system, sans-serif;
  --max-width: 1100px;
  --section-padding: 5rem 1.5rem;
}

html {
  scroll-behavior: smooth;
  font-family: var(--font-family);
}

body {
  background: var(--color-bg-dark);
  color: var(--color-text-light);
  line-height: 1.6;
}

a {
  color: var(--color-green);
  text-decoration: none;
}

a:hover {
  color: var(--color-green-light);
}

.container {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 1.5rem;
}

.section-dark {
  background: var(--color-bg-dark);
  color: var(--color-text-light);
  padding: var(--section-padding);
}

.section-light {
  background: var(--color-bg-light);
  color: var(--color-text-dark);
  padding: var(--section-padding);
}

.section-dark-2 {
  background: var(--color-bg-dark-2);
  color: var(--color-text-light);
  padding: var(--section-padding);
}

.section-title {
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 900;
  margin-bottom: 0.5rem;
  letter-spacing: -0.02em;
}

.section-subtitle {
  font-size: 1.1rem;
  opacity: 0.7;
  margin-bottom: 3rem;
}

.section-title-green {
  color: var(--color-green);
}
```

**Step 2: Layout.astro**

Datei: `src/layouts/Layout.astro`:
```astro
---
import '../styles/global.css';

interface Props {
  title?: string;
  description?: string;
}

const {
  title = '1. TFC Berlin e.V. – 1. Tischfußballclub Berlin',
  description = 'Ältester Tischfußballverein Berlins. Gegründet 2006 in Berlin-Kreuzberg.',
} = Astro.props;
---

<!doctype html>
<html lang="de">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content={description} />
    <title>{title}</title>
    <link rel="icon" type="image/png" href="/logo.png" />
  </head>
  <body>
    <slot />
  </body>
</html>
```

**Step 3: Commit**

```bash
git add src/styles/global.css src/layouts/Layout.astro
git commit -m "feat: add global CSS and Layout component"
```

---

## Task 4: Header / Navigation

**Files:**
- Create: `src/components/Header.astro`

**Step 1: Header-Komponente anlegen**

Datei: `src/components/Header.astro`:
```astro
---
---

<header class="header">
  <div class="container header-inner">
    <a href="#hero" class="header-logo">
      <img src="/logo.png" alt="1. TFC Berlin e.V." height="48" />
    </a>
    <nav class="nav">
      <a href="#ueber-uns">Über uns</a>
      <a href="#mannschaften">Mannschaften</a>
      <a href="#vorstand">Vorstand</a>
      <a href="#kontakt">Kontakt</a>
    </nav>
    <button class="nav-toggle" aria-label="Menü öffnen">☰</button>
  </div>
</header>

<style>
  .header {
    position: sticky;
    top: 0;
    z-index: 100;
    background: rgba(10, 10, 10, 0.95);
    backdrop-filter: blur(8px);
    border-bottom: 1px solid rgba(76, 175, 80, 0.2);
    padding: 0.75rem 0;
  }

  .header-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }

  .header-logo img {
    display: block;
    transition: opacity 0.2s;
  }

  .header-logo:hover img {
    opacity: 0.8;
  }

  .nav {
    display: flex;
    gap: 2rem;
    align-items: center;
  }

  .nav a {
    color: var(--color-text-light);
    font-weight: 500;
    font-size: 0.95rem;
    letter-spacing: 0.02em;
    transition: color 0.2s;
    text-transform: uppercase;
  }

  .nav a:hover {
    color: var(--color-green);
  }

  .nav-toggle {
    display: none;
    background: none;
    border: none;
    color: var(--color-text-light);
    font-size: 1.5rem;
    cursor: pointer;
  }

  @media (max-width: 640px) {
    .nav { display: none; }
    .nav-toggle { display: block; }
  }
</style>
```

**Step 2: Commit**

```bash
git add src/components/Header.astro
git commit -m "feat: add sticky header with navigation"
```

---

## Task 5: Hero-Sektion

**Files:**
- Create: `src/components/Hero.astro`
- Action: Logo-Bild als `public/logo.png` speichern (wurde vom User bereitgestellt)

**Step 1: Logo-Datei speichern**

Das Logo-Bild (PNG mit weißem Hintergrund) vom User als `public/logo.png` speichern.
Alternativ: SVG-Version anfragen falls vorhanden.

**Step 2: Hero-Komponente**

Datei: `src/components/Hero.astro`:
```astro
---
---

<section id="hero" class="hero">
  <div class="hero-bg"></div>
  <div class="container hero-content">
    <img src="/logo.png" alt="1. TFC Berlin e.V." class="hero-logo" />
    <h1 class="hero-title">1. Tischfußballclub Berlin</h1>
    <p class="hero-subtitle">
      Ältester Tischfußballverein Berlins &middot; Gegründet 2006 &middot; 13 Mannschaften
    </p>
    <div class="hero-cta">
      <a href="#mannschaften" class="btn btn-primary">Unsere Mannschaften</a>
      <a href="#kontakt" class="btn btn-outline">Kontakt</a>
    </div>
  </div>
</section>

<style>
  .hero {
    position: relative;
    min-height: 100svh;
    display: flex;
    align-items: center;
    background: var(--color-bg-dark);
    overflow: hidden;
  }

  .hero-bg {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 60% 60% at 50% 40%, rgba(76, 175, 80, 0.12) 0%, transparent 70%);
    pointer-events: none;
  }

  .hero-content {
    position: relative;
    text-align: center;
    padding-top: 4rem;
    padding-bottom: 4rem;
  }

  .hero-logo {
    width: min(280px, 60vw);
    height: auto;
    margin-bottom: 2rem;
    filter: drop-shadow(0 0 40px rgba(76, 175, 80, 0.3));
  }

  .hero-title {
    font-size: clamp(2rem, 6vw, 4rem);
    font-weight: 900;
    letter-spacing: -0.03em;
    color: var(--color-text-light);
    margin-bottom: 1rem;
    line-height: 1.1;
  }

  .hero-subtitle {
    font-size: clamp(1rem, 2.5vw, 1.25rem);
    color: var(--color-text-muted-dark);
    margin-bottom: 2.5rem;
    font-weight: 400;
  }

  .hero-cta {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
  }

  .btn {
    display: inline-block;
    padding: 0.85rem 2rem;
    border-radius: 4px;
    font-weight: 600;
    font-size: 1rem;
    transition: all 0.2s;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .btn-primary {
    background: var(--color-green);
    color: #fff;
  }

  .btn-primary:hover {
    background: var(--color-green-dark);
    color: #fff;
  }

  .btn-outline {
    border: 2px solid rgba(255,255,255,0.3);
    color: var(--color-text-light);
  }

  .btn-outline:hover {
    border-color: var(--color-green);
    color: var(--color-green);
  }
</style>
```

**Step 3: Commit**

```bash
git add src/components/Hero.astro public/logo.png
git commit -m "feat: add hero section with logo"
```

---

## Task 6: Über-uns-Sektion

**Files:**
- Create: `src/components/UeberUns.astro`

**Step 1: UeberUns-Komponente**

Datei: `src/components/UeberUns.astro`:
```astro
---
---

<section id="ueber-uns" class="section-dark-2">
  <div class="container">
    <h2 class="section-title">Über <span class="section-title-green">uns</span></h2>
    <p class="section-subtitle">Tischfußball in Berlin seit 2006</p>

    <div class="about-grid">
      <div class="about-text">
        <p>
          Der <strong>1. TFC Berlin e.V.</strong> ist der älteste Tischfußballverein Berlins.
          Seit unserer Gründung im Jahr 2006 bringen wir Spielerinnen und Spieler aus ganz
          Berlin zusammen – von Anfängerinnen bis zu Bundesligaspielerinnen.
        </p>
        <p>
          Mit aktuell <strong>13 Mannschaften</strong> in fünf Ligen – von der Landesliga
          bis zur Kreisliga – sind wir einer der größten und aktivsten Tischfußballvereine
          in Berlin. Wir sind Mitglied im
          <a href="https://tfvb.de" target="_blank" rel="noopener">Tischfußballverband Berlin (TFVB)</a>.
        </p>
        <p>
          Unsere Heimspiele und Trainings finden überwiegend im
          <strong>Platzwart</strong> in Berlin-Kreuzberg statt.
          Wir freuen uns immer über neue Mitglieder und Interessierte!
        </p>
        <a href="#kontakt" class="btn-link">Jetzt Kontakt aufnehmen →</a>
      </div>

      <div class="about-stats">
        <div class="stat">
          <span class="stat-number">2006</span>
          <span class="stat-label">Gegründet</span>
        </div>
        <div class="stat">
          <span class="stat-number">13</span>
          <span class="stat-label">Mannschaften</span>
        </div>
        <div class="stat">
          <span class="stat-number">5</span>
          <span class="stat-label">Ligen</span>
        </div>
        <div class="stat">
          <span class="stat-number">BER</span>
          <span class="stat-label">Kreuzberg</span>
        </div>
      </div>
    </div>

    <div class="heimspielort">
      <h3>Hauptheimspielbetrieb</h3>
      <p>
        <strong>Platzwart</strong><br />
        Audre-Lorde-Str. 27 (ehem. Manteuffelstr. 110)<br />
        10997 Berlin-Kreuzberg
      </p>
    </div>
  </div>
</section>

<style>
  .about-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
    align-items: start;
    margin-bottom: 3rem;
  }

  .about-text p {
    margin-bottom: 1.25rem;
    color: rgba(255,255,255,0.85);
    line-height: 1.8;
  }

  .about-text strong {
    color: var(--color-text-light);
  }

  .btn-link {
    color: var(--color-green);
    font-weight: 600;
    font-size: 1rem;
    transition: color 0.2s;
  }

  .btn-link:hover {
    color: var(--color-green-light);
  }

  .about-stats {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
  }

  .stat {
    background: rgba(76, 175, 80, 0.08);
    border: 1px solid rgba(76, 175, 80, 0.2);
    border-radius: 8px;
    padding: 1.5rem;
    text-align: center;
  }

  .stat-number {
    display: block;
    font-size: 2.5rem;
    font-weight: 900;
    color: var(--color-green);
    line-height: 1;
    margin-bottom: 0.5rem;
  }

  .stat-label {
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--color-text-muted-dark);
  }

  .heimspielort {
    background: rgba(255,255,255,0.04);
    border-left: 3px solid var(--color-green);
    border-radius: 0 8px 8px 0;
    padding: 1.5rem 2rem;
  }

  .heimspielort h3 {
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--color-green);
    margin-bottom: 0.75rem;
  }

  .heimspielort p {
    color: rgba(255,255,255,0.85);
    line-height: 1.8;
  }

  @media (max-width: 768px) {
    .about-grid { grid-template-columns: 1fr; gap: 2rem; }
  }
</style>
```

**Step 2: Commit**

```bash
git add src/components/UeberUns.astro
git commit -m "feat: add about section with stats"
```

---

## Task 7: Mannschaften-Sektion

**Files:**
- Create: `src/components/Mannschaften.astro`

**Step 1: Mannschaften-Komponente**

Datei: `src/components/Mannschaften.astro`:
```astro
---
const ligen = [
  {
    name: 'Landesliga',
    teams: [
      { name: 'BSU', heimspielort: 'Platzwart', adresse: 'Audre-Lorde-Str. 27, 10997 Berlin-Kreuzberg' },
      { name: '1.TFC Berlin Kreuzberg 36 II', heimspielort: 'Kickerfreude', adresse: 'Siemensstraße 26, 10551 Berlin-Moabit' },
      { name: 'ZIGZAG Ahtag', heimspielort: 'Platzwart', adresse: 'Audre-Lorde-Str. 27, 10997 Berlin-Kreuzberg' },
    ]
  },
  {
    name: 'Verbandsliga',
    teams: [
      { name: 'TFC Berlin II', heimspielort: 'Platzwart', adresse: 'Audre-Lorde-Str. 27, 10997 Berlin-Kreuzberg' },
      { name: 'ZIGZAG Babärz', heimspielort: 'Platzwart', adresse: 'Audre-Lorde-Str. 27, 10997 Berlin-Kreuzberg' },
    ]
  },
  {
    name: 'Bezirksliga',
    teams: [
      { name: 'Pink Unicorns', heimspielort: 'Platzwart', adresse: 'Audre-Lorde-Str. 27, 10997 Berlin-Kreuzberg' },
    ]
  },
  {
    name: 'Kreisliga A',
    teams: [
      { name: 'Flora Soft', heimspielort: 'Studentisches Café Flora', adresse: 'Philippstr. 13, 10115 Berlin' },
      { name: 'Gernhart Reinbolzen', heimspielort: 'Platzwart', adresse: 'Audre-Lorde-Str. 27, 10997 Berlin-Kreuzberg' },
      { name: 'kick.eriki', heimspielort: 'Kickerfreude', adresse: 'Siemensstraße 26, 10551 Berlin-Moabit' },
      { name: 'Pli-Pla-Platzwart', heimspielort: 'Platzwart', adresse: 'Audre-Lorde-Str. 27, 10997 Berlin-Kreuzberg' },
    ]
  },
  {
    name: 'Kreisliga B',
    teams: [
      { name: 'Flora Softer', heimspielort: 'Studentisches Café Flora', adresse: 'Philippstr. 13, 10115 Berlin' },
      { name: 'Kommando Erwin Kostedde', heimspielort: 'Platzwart', adresse: 'Audre-Lorde-Str. 27, 10997 Berlin-Kreuzberg' },
      { name: 'Megapeng', heimspielort: 'Pörx', adresse: 'Fürbringer Str. 29, 10961 Berlin-Kreuzberg' },
    ]
  },
];
---

<section id="mannschaften" class="section-light">
  <div class="container">
    <h2 class="section-title" style="color: var(--color-text-dark)">
      Unsere <span style="color: var(--color-green-dark)">Mannschaften</span>
    </h2>
    <p class="section-subtitle" style="color: var(--color-text-muted-light)">
      13 Teams in 5 Ligen – Saison 2025/26
    </p>

    {ligen.map(liga => (
      <div class="liga-block">
        <h3 class="liga-title">{liga.name}</h3>
        <div class="teams-grid">
          {liga.teams.map(team => (
            <div class="team-card">
              <div class="team-name">{team.name}</div>
              <div class="team-location">
                <span class="team-venue">{team.heimspielort}</span>
                <span class="team-address">{team.adresse}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
</section>

<style>
  .liga-block {
    margin-bottom: 2.5rem;
  }

  .liga-title {
    font-size: 0.8rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--color-green-dark);
    border-bottom: 2px solid var(--color-green-dark);
    padding-bottom: 0.5rem;
    margin-bottom: 1rem;
  }

  .teams-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1rem;
  }

  .team-card {
    background: var(--color-bg-light-2);
    border: 1px solid rgba(0,0,0,0.08);
    border-radius: 8px;
    padding: 1.25rem 1.5rem;
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  .team-card:hover {
    border-color: var(--color-green-dark);
    box-shadow: 0 2px 12px rgba(45, 138, 48, 0.12);
  }

  .team-name {
    font-weight: 700;
    font-size: 1rem;
    color: var(--color-text-dark);
    margin-bottom: 0.5rem;
  }

  .team-location {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
  }

  .team-venue {
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--color-green-dark);
  }

  .team-address {
    font-size: 0.8rem;
    color: var(--color-text-muted-light);
  }
</style>
```

**Step 2: Commit**

```bash
git add src/components/Mannschaften.astro
git commit -m "feat: add teams section with all 13 teams grouped by league"
```

---

## Task 8: Vorstand-Sektion

**Files:**
- Create: `src/components/Vorstand.astro`

**Step 1: Vorstand-Komponente**

Datei: `src/components/Vorstand.astro`:
```astro
---
const vorstand = [
  { name: 'Franziska Busch', rolle: '1. Vorsitzende' },
  { name: 'Viet Duc Hoang', rolle: '2. Vorsitzender' },
  { name: 'Leonie Fuchs', rolle: 'Kassenwärtin' },
  { name: 'Robin Böhm', rolle: 'Schriftführer' },
  { name: 'Jessica Clausen', rolle: 'Beisitzerin' },
];
---

<section id="vorstand" class="section-dark">
  <div class="container">
    <h2 class="section-title">
      Unser <span class="section-title-green">Vorstand</span>
    </h2>
    <p class="section-subtitle">Gewählt im Januar 2025</p>

    <div class="vorstand-grid">
      {vorstand.map(person => (
        <div class="person-card">
          <div class="person-avatar">
            {person.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div class="person-info">
            <div class="person-name">{person.name}</div>
            <div class="person-rolle">{person.rolle}</div>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>

<style>
  .vorstand-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1.5rem;
  }

  .person-card {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(76, 175, 80, 0.15);
    border-radius: 12px;
    padding: 2rem 1.5rem;
    text-align: center;
    transition: border-color 0.2s, background 0.2s;
  }

  .person-card:hover {
    border-color: var(--color-green);
    background: rgba(76, 175, 80, 0.06);
  }

  .person-avatar {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background: rgba(76, 175, 80, 0.15);
    border: 2px solid var(--color-green);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 1.25rem;
    color: var(--color-green);
    margin: 0 auto 1rem;
  }

  .person-name {
    font-weight: 700;
    font-size: 1rem;
    margin-bottom: 0.35rem;
  }

  .person-rolle {
    font-size: 0.85rem;
    color: var(--color-text-muted-dark);
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }
</style>
```

**Step 2: Commit**

```bash
git add src/components/Vorstand.astro
git commit -m "feat: add board/Vorstand section"
```

---

## Task 9: Kontakt-Sektion

**Files:**
- Create: `src/components/Kontakt.astro`

**Step 1: Kontakt-Komponente**

Datei: `src/components/Kontakt.astro`:
```astro
---
---

<section id="kontakt" class="section-light">
  <div class="container">
    <h2 class="section-title" style="color: var(--color-text-dark)">
      <span style="color: var(--color-green-dark)">Kontakt</span>
    </h2>
    <p class="section-subtitle" style="color: var(--color-text-muted-light)">
      Fragen, Mitspielen, Mitgliedschaft — wir freuen uns von euch zu hören.
    </p>

    <div class="kontakt-grid">
      <div class="kontakt-card">
        <div class="kontakt-icon">✉</div>
        <h3>E-Mail</h3>
        <a href="mailto:info@tfcb.de">info@tfcb.de</a>
      </div>

      <div class="kontakt-card">
        <div class="kontakt-icon">📍</div>
        <h3>Vereinsadresse</h3>
        <address>
          1. TFC Berlin e.V.<br />
          c/o Robin Böhm<br />
          Koppenstraße 82<br />
          10243 Berlin
        </address>
      </div>

      <div class="kontakt-card">
        <div class="kontakt-icon">⚖</div>
        <h3>Registergericht</h3>
        <p>Amtsgericht Berlin (Charlottenburg)<br />VR 25451</p>
      </div>

      <div class="kontakt-card">
        <div class="kontakt-icon">🏓</div>
        <h3>Verband</h3>
        <a href="https://tfvb.de" target="_blank" rel="noopener">Tischfußballverband Berlin (TFVB)</a>
      </div>
    </div>
  </div>
</section>

<style>
  .kontakt-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 1.5rem;
  }

  .kontakt-card {
    background: var(--color-bg-light-2);
    border: 1px solid rgba(0,0,0,0.08);
    border-radius: 12px;
    padding: 2rem;
    transition: border-color 0.2s;
  }

  .kontakt-card:hover {
    border-color: var(--color-green-dark);
  }

  .kontakt-icon {
    font-size: 2rem;
    margin-bottom: 1rem;
  }

  .kontakt-card h3 {
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--color-text-muted-light);
    margin-bottom: 0.5rem;
  }

  .kontakt-card a,
  .kontakt-card address,
  .kontakt-card p {
    color: var(--color-text-dark);
    font-style: normal;
    line-height: 1.7;
    font-size: 0.95rem;
  }

  .kontakt-card a {
    color: var(--color-green-dark);
    font-weight: 500;
  }

  .kontakt-card a:hover {
    color: var(--color-green);
  }
</style>
```

**Step 2: Commit**

```bash
git add src/components/Kontakt.astro
git commit -m "feat: add contact section"
```

---

## Task 10: Footer

**Files:**
- Create: `src/components/Footer.astro`

**Step 1: Footer-Komponente**

Datei: `src/components/Footer.astro`:
```astro
---
const year = new Date().getFullYear();
---

<footer class="footer">
  <div class="container footer-inner">
    <div class="footer-logo">
      <img src="/logo.png" alt="1. TFC Berlin e.V." height="40" />
    </div>
    <div class="footer-links">
      <a href="#ueber-uns">Über uns</a>
      <a href="#mannschaften">Mannschaften</a>
      <a href="#vorstand">Vorstand</a>
      <a href="#kontakt">Kontakt</a>
      <a href="/impressum">Impressum</a>
    </div>
    <div class="footer-copy">
      &copy; {year} 1. TFC Berlin e.V. &middot; Mitglied im
      <a href="https://tfvb.de" target="_blank" rel="noopener">TFVB</a>
    </div>
  </div>
</footer>

<style>
  .footer {
    background: #050505;
    border-top: 1px solid rgba(76, 175, 80, 0.15);
    padding: 3rem 0 2rem;
  }

  .footer-inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
    text-align: center;
  }

  .footer-links {
    display: flex;
    gap: 2rem;
    flex-wrap: wrap;
    justify-content: center;
  }

  .footer-links a {
    color: var(--color-text-muted-dark);
    font-size: 0.9rem;
    transition: color 0.2s;
  }

  .footer-links a:hover {
    color: var(--color-green);
  }

  .footer-copy {
    color: var(--color-text-muted-dark);
    font-size: 0.8rem;
  }

  .footer-copy a {
    color: var(--color-green);
  }
</style>
```

**Step 2: Commit**

```bash
git add src/components/Footer.astro
git commit -m "feat: add footer"
```

---

## Task 11: Impressum-Seite (DSGVO)

**Files:**
- Create: `src/pages/impressum.astro`

**Step 1: Impressum-Seite**

Datei: `src/pages/impressum.astro`:
```astro
---
import Layout from '../layouts/Layout.astro';
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';
---

<Layout title="Impressum – 1. TFC Berlin e.V." description="Impressum des 1. TFC Berlin e.V.">
  <Header />
  <main class="impressum-main section-dark">
    <div class="container">
      <h1 class="section-title">Impressum</h1>

      <h2>Angaben gemäß § 5 TMG</h2>
      <p>
        1. TFC Berlin (1. Tischfußballclub Berlin) e.V.<br />
        c/o Robin Böhm<br />
        Koppenstraße 82<br />
        10243 Berlin
      </p>

      <h2>Registereintrag</h2>
      <p>
        Eingetragen im Vereinsregister.<br />
        Registergericht: Amtsgericht Berlin (Charlottenburg)<br />
        Registernummer: VR 25451
      </p>

      <h2>Kontakt</h2>
      <p>E-Mail: <a href="mailto:info@tfcb.de">info@tfcb.de</a></p>

      <h2>Vertretungsberechtigter Vorstand</h2>
      <p>
        Franziska Busch (1. Vorsitzende)<br />
        Viet Duc Hoang (2. Vorsitzender)
      </p>

      <h2>Streitschlichtung</h2>
      <p>
        Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:
        <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener">
          https://ec.europa.eu/consumers/odr/
        </a>.<br />
        Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer
        Verbraucherschlichtungsstelle teilzunehmen.
      </p>
    </div>
  </main>
  <Footer />
</Layout>

<style>
  .impressum-main {
    padding-top: 6rem;
    min-height: 80vh;
  }

  .impressum-main h2 {
    font-size: 1.1rem;
    color: var(--color-green);
    margin-top: 2rem;
    margin-bottom: 0.5rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .impressum-main p {
    color: rgba(255,255,255,0.8);
    line-height: 1.8;
    margin-bottom: 0.5rem;
  }

  .impressum-main .section-title {
    margin-bottom: 2rem;
  }
</style>
```

**Step 2: Commit**

```bash
git add src/pages/impressum.astro
git commit -m "feat: add Impressum page"
```

---

## Task 12: Hauptseite zusammensetzen

**Files:**
- Modify: `src/pages/index.astro`

**Step 1: index.astro mit allen Komponenten**

Datei: `src/pages/index.astro`:
```astro
---
import Layout from '../layouts/Layout.astro';
import Header from '../components/Header.astro';
import Hero from '../components/Hero.astro';
import UeberUns from '../components/UeberUns.astro';
import Mannschaften from '../components/Mannschaften.astro';
import Vorstand from '../components/Vorstand.astro';
import Kontakt from '../components/Kontakt.astro';
import Footer from '../components/Footer.astro';
---

<Layout>
  <Header />
  <main>
    <Hero />
    <UeberUns />
    <Mannschaften />
    <Vorstand />
    <Kontakt />
  </main>
  <Footer />
</Layout>
```

**Step 2: Build testen**

```bash
npm run build
```
Erwartung: `dist/` Verzeichnis wird erstellt, keine Fehler.

**Step 3: Dev-Preview prüfen**

```bash
npm run dev
```
Alle Sektionen prüfen: Hero, Über uns, Mannschaften, Vorstand, Kontakt, Footer.

**Step 4: Commit und Push**

```bash
git add src/pages/index.astro
git commit -m "feat: assemble main page with all sections"
git push origin main
```

**Step 5: GitHub Actions prüfen**
- Öffne https://github.com/robinboehm/tfcb.de/actions
- Warte bis der Deploy-Workflow grün ist
- Seite unter https://robinboehm.github.io/tfcb.de/ prüfen

---

## Task 13: Logo-Datei einfügen

**Files:**
- Create: `public/logo.png`

**Step 1:** Das Logo-PNG (vom User bereitgestellt) unter `public/logo.png` speichern.

**Step 2:** Commit

```bash
git add public/logo.png
git commit -m "feat: add club logo"
git push origin main
```

---

## Checkliste nach Abschluss

- [ ] `npm run build` läuft fehlerfrei durch
- [ ] Alle 13 Teams korrekt und vollständig aufgelistet
- [ ] Vorstand mit allen 5 Personen
- [ ] Kontakt mit Adresse, E-Mail, Registergericht
- [ ] Impressum vorhanden
- [ ] GitHub Actions Workflow deployed erfolgreich
- [ ] Logo korrekt angezeigt
- [ ] Mobile-Ansicht funktioniert (Nav-Toggle)
