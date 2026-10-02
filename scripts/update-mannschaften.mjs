// Holt die aktuellen Mannschaften des 1. TFC Berlin von tfvb.de
// und schreibt sie nach src/data/mannschaften.json.
//
// Aufruf: node scripts/update-mannschaften.mjs
// Keine Abhängigkeiten, benötigt Node >= 22.

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const URL_VEREIN = 'https://tfvb.de/index.php/mitgliedervereine?task=verein_details&id=14';
const OUT_FILE = resolve(dirname(fileURLToPath(import.meta.url)), '../src/data/mannschaften.json');

// Reihenfolge der Ligen auf der Webseite (höchste zuerst); unbekannte Ligen kommen danach.
const LIGA_REIHENFOLGE = ['Landesliga', 'Verbandsliga', 'Bezirksliga', 'Kreisliga A', 'Kreisliga B', 'Kreisliga C'];

const ENTITIES = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ',
  auml: 'ä', ouml: 'ö', uuml: 'ü', Auml: 'Ä', Ouml: 'Ö', Uuml: 'Ü', szlig: 'ß',
  eacute: 'é', egrave: 'è', aacute: 'á', agrave: 'à', ccedil: 'ç', ndash: '–',
};

function decode(str) {
  return str
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&([a-zA-Z]+);/g, (m, name) => {
      if (!(name in ENTITIES)) throw new Error(`Unbekannte HTML-Entity: ${m}`);
      return ENTITIES[name];
    })
    .replace(/\s+/g, ' ')
    .trim();
}

const stripTags = (s) => s.replace(/<[^>]*>/g, '');

/** "2026/27" – ab Juli gilt das neue Spieljahr. */
function saison(now = new Date()) {
  const y = now.getFullYear();
  const start = now.getMonth() >= 6 ? y : y - 1;
  return `${start}/${String(start + 1).slice(2)}`;
}

function parseTeams(html) {
  const heading = html.indexOf('Aktuelle Mannschaften');
  if (heading === -1) throw new Error('Abschnitt "Aktuelle Mannschaften" nicht gefunden');

  // Überschriften-Tabelle schließen, danach folgt die Teamtabelle.
  const tableStart = html.indexOf('</table>', heading);
  const tableEnd = html.indexOf('</table>', tableStart + 1);
  if (tableStart === -1 || tableEnd === -1) throw new Error('Teamtabelle nicht gefunden');
  const table = html.slice(tableStart, tableEnd);

  const teams = [];
  for (const [, row] of table.matchAll(/<tr class="sectiontableentry\d">([\s\S]*?)<\/tr>/g)) {
    const cells = [...row.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/g)].map((m) => m[1]);
    if (cells.length < 3) throw new Error(`Unerwartete Zeilenstruktur: ${row.slice(0, 120)}`);

    const name = decode(stripTags(cells[0]));

    // z. B. "Kreisliga A Berlin, TFVB-Pokal, ..." oder "Relegation, Kreisliga A Berlin, ..."
    const wettbewerbe = decode(stripTags(cells[1])).split(',').map((s) => s.trim());
    const ligaEintrag = wettbewerbe.find((w) => /liga/i.test(w));
    if (!ligaEintrag) throw new Error(`Keine Liga für "${name}" gefunden: ${wettbewerbe.join(', ')}`);
    const liga = ligaEintrag.replace(/\s+Berlin$/, '');

    // Heimspielort: "Name<br /><small>Adresse</small><br /><small>Tisch</small>..."
    const [ortRoh, adresseRoh] = cells[2].split(/<br\s*\/?>/i);
    const heimspielort = decode(stripTags(ortRoh ?? ''));
    const adresse = decode(stripTags(adresseRoh ?? '')).replace(/\s*\([^)]*\)/g, '');
    if (!heimspielort || !adresse) throw new Error(`Heimspielort für "${name}" unvollständig`);

    teams.push({ name, liga, heimspielort, adresse });
  }
  return teams;
}

function gruppiere(teams) {
  const sortKey = (liga) => {
    const i = LIGA_REIHENFOLGE.indexOf(liga);
    return i === -1 ? LIGA_REIHENFOLGE.length : i;
  };
  const byLiga = new Map();
  for (const { liga, ...team } of teams) {
    if (!byLiga.has(liga)) byLiga.set(liga, []);
    byLiga.get(liga).push(team);
  }
  return [...byLiga.entries()]
    .sort(([a], [b]) => sortKey(a) - sortKey(b) || a.localeCompare(b, 'de'))
    .map(([name, ts]) => ({
      name,
      teams: ts.sort((a, b) => a.name.localeCompare(b.name, 'de', { sensitivity: 'base', numeric: true })),
    }));
}

const res = await fetch(URL_VEREIN, { headers: { 'User-Agent': 'tfcb.de-mannschaften-update' } });
if (!res.ok) throw new Error(`TFVB antwortete mit HTTP ${res.status}`);

const teams = parseTeams(await res.text());
// Plausibilitätsprüfung: lieber abbrechen als eine kaputte Seite veröffentlichen.
if (teams.length < 3) throw new Error(`Nur ${teams.length} Teams gefunden – Parser prüfen`);

const data = { saison: saison(), ligen: gruppiere(teams) };
const json = JSON.stringify(data, null, 2) + '\n';

let alt = '';
try { alt = await readFile(OUT_FILE, 'utf8'); } catch {}

if (alt === json) {
  console.log(`Keine Änderungen (${teams.length} Teams, Saison ${data.saison}).`);
} else {
  await mkdir(dirname(OUT_FILE), { recursive: true });
  await writeFile(OUT_FILE, json);
  console.log(`mannschaften.json aktualisiert: ${teams.length} Teams in ${data.ligen.length} Ligen, Saison ${data.saison}.`);
}
