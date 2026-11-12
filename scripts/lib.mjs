// Shared helpers for the approval script and the validator. No dependencies.
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
export const DATA = join(ROOT, 'data');
export const RECORDS_DIR = join(DATA, 'records');
export const INDEX_FILE = join(DATA, 'index.json');

export const LB_PER_KG = 2.2046;
export const MIN_INCREMENT_KG = 0.5;
export const VIDEO_HOSTS = ['youtube.com', 'www.youtube.com', 'm.youtube.com', 'youtu.be', 'instagram.com', 'www.instagram.com'];
export const EMAIL_RE = /[^\s@<>"']+@[^\s@<>"']+\.[a-z]{2,}/i;

export const RECORD_KEYS = [
  'id', 'handle', 'lift', 'weight_kg', 'entered_as', 'bodyweight_kg', 'bodyweight_proof',
  'division', 'group', 'class', 'adaptive', 'date', 'video', 'weighin_video',
  'approved', 'status', 'notes', 'example'
];

export function readJson(file) {
  return JSON.parse(readFileSync(file, 'utf8'));
}

export function writeJson(file, value) {
  writeFileSync(file, JSON.stringify(value, null, 2) + '\n');
}

export function loadConfig() {
  const { lifts } = readJson(join(DATA, 'lifts.json'));
  const divisions = readJson(join(DATA, 'divisions.json'));
  return { lifts, ...divisions };
}

export function recordFiles() {
  if (!existsSync(RECORDS_DIR)) return [];
  return readdirSync(RECORDS_DIR).filter(f => f.endsWith('.json')).sort();
}

export function loadRecords() {
  return recordFiles().map(f => readJson(join(RECORDS_DIR, f)));
}

// The index is every record in one file, sorted by id, so the site needs one request.
export function buildIndex(records) {
  const sorted = [...records].sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
  return { records: sorted };
}

export function writeIndex() {
  writeJson(INDEX_FILE, buildIndex(loadRecords()));
}

export function today() {
  return new Date().toISOString().slice(0, 10);
}

export function isIsoDate(s) {
  if (typeof s !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const d = new Date(s + 'T00:00:00Z');
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s;
}

// Weights are stored in kg, rounded DOWN to the nearest 0.5 kg.
export function toRecordKg(value, unit) {
  const kg = unit === 'lb' ? value / LB_PER_KG : value;
  return Math.floor(kg * 2 + 1e-9) / 2;
}

// Bodyweight is stored in kg to one decimal place.
export function toBodyweightKg(value, unit) {
  const kg = unit === 'lb' ? value / LB_PER_KG : value;
  return Math.round(kg * 10) / 10;
}

export function classFor(classes, group, bodyweightKg) {
  const list = classes[group] || [];
  for (const c of list) {
    if (c.max === null || bodyweightKg <= c.max) return c.id;
  }
  return null;
}

export function slug(s) {
  return String(s).toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 30) || 'lifter';
}

// A "table" is one lift in one division, group and class/category. Records compete inside a table.
export function tableKey(r) {
  const sub = r.division === 'bodyweight' ? r.class : r.division === 'adaptive' ? (r.adaptive && r.adaptive.category) : '';
  return [r.lift, r.division, r.group, sub || ''].join('|');
}

export function countsTowardsRecords(r) {
  return r.status !== 'removed';
}

// The standing record in a table: heaviest lift, earliest date winning a tie.
export function currentRecord(records, key) {
  let best = null;
  for (const r of records) {
    if (tableKey(r) !== key || !countsTowardsRecords(r)) continue;
    if (!best || r.weight_kg > best.weight_kg || (r.weight_kg === best.weight_kg && r.date < best.date)) best = r;
  }
  return best;
}

export function findEmail(value) {
  if (typeof value === 'string') return EMAIL_RE.test(value) ? value : null;
  if (Array.isArray(value)) {
    for (const v of value) { const hit = findEmail(v); if (hit) return hit; }
    return null;
  }
  if (value && typeof value === 'object') {
    for (const v of Object.values(value)) { const hit = findEmail(v); if (hit) return hit; }
  }
  return null;
}

export function videoHostOk(url) {
  try {
    const u = new URL(url);
    return u.protocol === 'https:' && VIDEO_HOSTS.includes(u.hostname);
  } catch {
    return false;
  }
}
