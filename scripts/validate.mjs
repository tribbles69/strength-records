#!/usr/bin/env node
// Checks every data file. Exits 1 and lists the problems if anything is wrong.
//   node scripts/validate.mjs              check everything
//   node scripts/validate.mjs --fix-index  rebuild data/index.json first, then check
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import {
  RECORDS_DIR, INDEX_FILE, RECORD_KEYS, readJson, loadConfig, recordFiles, buildIndex, writeIndex,
  isIsoDate, today, classFor, findEmail, videoHostOk
} from './lib.mjs';

export function validateRecord(r, cfg, fileName) {
  const errs = [];
  const bad = msg => errs.push(msg);
  if (!r || typeof r !== 'object' || Array.isArray(r)) return ['is not a JSON object'];

  for (const k of Object.keys(r)) if (!RECORD_KEYS.includes(k)) bad(`unknown field "${k}"`);
  for (const k of RECORD_KEYS) if (!(k in r)) bad(`missing field "${k}"`);
  if (errs.length) return errs;

  const removed = r.status === 'removed';
  const example = r.example === true;

  if (typeof r.id !== 'string' || !/^[a-z0-9][a-z0-9+-]*$/.test(r.id)) bad('id must be lowercase letters, digits and dashes');
  if (fileName && fileName !== `${r.id}.json`) bad(`file name must be ${r.id}.json`);

  if (typeof r.handle !== 'string') bad('handle must be text');
  else if (!removed && (r.handle.trim() === '' || r.handle.length > 40)) bad('handle must be 1 to 40 characters');
  else if (/[<>]/.test(r.handle)) bad('handle must not contain < or >');

  if (!cfg.lifts.some(l => l.id === r.lift)) bad(`unknown lift "${r.lift}"`);

  if (typeof r.weight_kg !== 'number' || !(r.weight_kg > 0) || r.weight_kg > 1500) bad('weight_kg must be a number between 0 and 1500');
  else if (Math.abs(r.weight_kg * 2 - Math.round(r.weight_kg * 2)) > 1e-9) bad('weight_kg must be a multiple of 0.5');

  if (!r.entered_as || typeof r.entered_as.value !== 'number' || !['kg', 'lb'].includes(r.entered_as.unit)) {
    bad('entered_as must be { "value": number, "unit": "kg" or "lb" }');
  }

  if (r.bodyweight_kg !== null && (typeof r.bodyweight_kg !== 'number' || r.bodyweight_kg < 20 || r.bodyweight_kg > 400)) {
    bad('bodyweight_kg must be null or a number between 20 and 400');
  }
  if (!['same-take', 'same-day', 'self-reported', null].includes(r.bodyweight_proof)) bad('bodyweight_proof must be same-take, same-day, self-reported or null');
  if ((r.bodyweight_kg === null) !== (r.bodyweight_proof === null)) bad('bodyweight_kg and bodyweight_proof must both be set or both be null');

  if (!cfg.divisions.some(d => d.id === r.division)) bad(`unknown division "${r.division}"`);
  if (!cfg.groups.some(g => g.id === r.group)) bad(`unknown group "${r.group}"`);

  if (r.division === 'bodyweight') {
    if (r.bodyweight_kg === null) bad('a bodyweight-class record needs bodyweight_kg');
    else {
      if (!['same-take', 'same-day'].includes(r.bodyweight_proof)) bad('a bodyweight-class record needs a weigh-in (same-take or same-day)');
      const expected = classFor(cfg.classes, r.group, r.bodyweight_kg);
      if (r.class !== expected) bad(`class should be "${expected}" for ${r.bodyweight_kg} kg in group "${r.group}"`);
    }
  } else if (r.class !== null) bad('class must be null outside the bodyweight division');

  if (r.division === 'adaptive') {
    const a = r.adaptive;
    if (!a || typeof a !== 'object') bad('an adaptive record needs adaptive { category, description }');
    else {
      if (!cfg.adaptive_categories.some(c => c.id === a.category)) bad(`unknown adaptive category "${a.category}"`);
      if (typeof a.description !== 'string' || (!removed && a.description.trim() === '') || a.description.length > 240) bad('adaptive description must be 1 to 240 characters');
      if (Object.keys(a).some(k => !['category', 'description'].includes(k))) bad('adaptive has an unknown field');
    }
  } else if (r.adaptive !== null) bad('adaptive must be null outside the adaptive division');

  if (!isIsoDate(r.date)) bad('date must be YYYY-MM-DD');
  else if (r.date > today()) bad('date is in the future');
  if (!isIsoDate(r.approved)) bad('approved must be YYYY-MM-DD');
  else if (isIsoDate(r.date) && r.approved < r.date) bad('approved is before the lift date');

  if (r.video === null) {
    if (!example && !removed) bad('video is required (only example or removed records may have none)');
  } else if (!videoHostOk(r.video)) bad('video must be an https YouTube or Instagram link');
  if (r.weighin_video !== null && !videoHostOk(r.weighin_video)) bad('weighin_video must be null or an https YouTube or Instagram link');
  if (r.bodyweight_proof === 'same-day' && r.weighin_video === null && !example && !removed) bad('a same-day weigh-in needs weighin_video');

  if (!cfg.statuses.includes(r.status)) bad(`unknown status "${r.status}"`);
  if (typeof r.notes !== 'string' || r.notes.length > 300) bad('notes must be text of at most 300 characters');
  if (removed && r.notes.trim() === '') bad('a removed record needs the reason in notes');
  if (typeof r.example !== 'boolean') bad('example must be true or false');

  const email = findEmail(r);
  if (email) bad('contains something that looks like an email address; emails are never published');

  return errs;
}

export function validateAll() {
  const problems = [];
  let cfg;
  try {
    cfg = loadConfig();
  } catch (e) {
    return { problems: [`data/lifts.json or data/divisions.json: ${e.message}`], count: 0 };
  }

  const ids = new Set();
  for (const l of cfg.lifts) {
    if (ids.has(l.id)) problems.push(`data/lifts.json: duplicate lift "${l.id}"`);
    ids.add(l.id);
    for (const k of ['id', 'name', 'short', 'equipment', 'start', 'movement', 'finish', 'camera']) {
      if (typeof l[k] !== 'string' || !l[k]) problems.push(`data/lifts.json: lift "${l.id}" is missing "${k}"`);
    }
    if (!Array.isArray(l.fails) || !l.fails.length) problems.push(`data/lifts.json: lift "${l.id}" needs a list of fails`);
  }

  const records = [];
  const seen = new Set();
  for (const f of recordFiles()) {
    let r;
    try {
      r = readJson(join(RECORDS_DIR, f));
    } catch (e) {
      problems.push(`data/records/${f}: not valid JSON (${e.message})`);
      continue;
    }
    for (const msg of validateRecord(r, cfg, f)) problems.push(`data/records/${f}: ${msg}`);
    if (r && seen.has(r.id)) problems.push(`data/records/${f}: duplicate id`);
    if (r) { seen.add(r.id); records.push(r); }
  }

  if (!existsSync(INDEX_FILE)) problems.push('data/index.json is missing; run: node scripts/validate.mjs --fix-index');
  else {
    let index;
    try { index = readJson(INDEX_FILE); } catch (e) { problems.push(`data/index.json: not valid JSON (${e.message})`); }
    if (index && JSON.stringify(index) !== JSON.stringify(buildIndex(records))) {
      problems.push('data/index.json does not match data/records; run: node scripts/validate.mjs --fix-index');
    }
  }
  return { problems, count: records.length };
}

const isMain = process.argv[1] && import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/').split('/').pop());
if (isMain) {
  if (process.argv.includes('--fix-index')) writeIndex();
  const { problems, count } = validateAll();
  if (problems.length) {
    console.error(`${problems.length} problem(s):`);
    for (const p of problems) console.error('  - ' + p);
    process.exit(1);
  }
  console.log(`OK: ${count} record file(s) valid, index in sync.`);
}
