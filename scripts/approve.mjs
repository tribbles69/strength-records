#!/usr/bin/env node
// Turns an approved submission into data/records/<id>.json and rebuilds data/index.json.
//
//   node scripts/approve.mjs '<submission>'            write the record
//   node scripts/approve.mjs --dry-run '<submission>'  show what would be written
//   node scripts/approve.mjs --force '<submission>'    accept a lift that does not beat the record
//   SUBMISSION='<submission>' node scripts/approve.mjs (how the GitHub action passes it)
//
// <submission> is the "approval block" line from the submission email: one line of JSON
// holding the public fields only. "key: value" lines (one per line) work too.
// The email address is never part of it, and the script refuses anything that looks like one.
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import {
  RECORDS_DIR, MIN_INCREMENT_KG, loadConfig, loadRecords, writeJson, writeIndex, today, isIsoDate,
  toRecordKg, toBodyweightKg, classFor, slug, tableKey, currentRecord, findEmail
} from './lib.mjs';
import { validateRecord } from './validate.mjs';

const FIELDS = ['handle', 'lift', 'weight', 'weight_unit', 'bodyweight', 'bodyweight_unit', 'division', 'group',
  'adaptive_category', 'adaptive_description', 'date', 'video', 'weighin', 'weighin_video'];

function fail(msg) {
  console.error('NOT APPROVED: ' + msg);
  process.exit(1);
}

export function parseSubmission(text) {
  const raw = String(text || '').trim();
  if (!raw) throw new Error('no submission text given');
  const start = raw.indexOf('{');
  if (start !== -1 && raw.lastIndexOf('}') > start) {
    try {
      return JSON.parse(raw.slice(start, raw.lastIndexOf('}') + 1));
    } catch {
      throw new Error('the approval block is not complete JSON; copy the whole line, from { to }');
    }
  }
  const out = {};
  for (const line of raw.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z_ ]+?)\s*:\s*(.*)$/);
    if (!m) continue;
    const key = m[1].trim().toLowerCase().replace(/\s+/g, '_');
    if (FIELDS.includes(key)) out[key] = m[2].trim();
  }
  if (!Object.keys(out).length) throw new Error('could not find any fields; paste the approval block from the email');
  return out;
}

function num(value, name) {
  const n = Number(String(value).replace(',', '.').trim());
  if (!Number.isFinite(n) || n <= 0) throw new Error(`${name} must be a number above zero (got "${value}")`);
  return n;
}

function clean(v) {
  return v === undefined || v === null ? '' : String(v).trim();
}

export function buildRecord(input, cfg, existing, opts = {}) {
  const s = {};
  for (const k of Object.keys(input)) {
    if (k === 'email' || k === '_replyto') throw new Error('the submission includes an email field; paste the approval block only');
    if (!FIELDS.includes(k)) throw new Error(`unexpected field "${k}"`);
    s[k] = clean(input[k]);
  }
  if (findEmail(s)) throw new Error('something in the submission looks like an email address; emails are never published');

  const handle = clean(s.handle).replace(/^@+/, '');
  if (!handle) throw new Error('handle is missing');
  if (!cfg.lifts.some(l => l.id === s.lift)) throw new Error(`unknown lift "${s.lift}"`);
  const division = s.division;
  if (!cfg.divisions.some(d => d.id === division)) throw new Error(`unknown division "${division}"`);
  const group = s.group || 'all';
  if (!cfg.groups.some(g => g.id === group)) throw new Error(`unknown group "${group}"`);
  if (!isIsoDate(s.date)) throw new Error(`date must be YYYY-MM-DD (got "${s.date}")`);
  if (!s.video) throw new Error('video link is missing');

  const weightUnit = s.weight_unit === 'lb' ? 'lb' : 'kg';
  const weightValue = num(s.weight, 'weight');
  const weightKg = toRecordKg(weightValue, weightUnit);

  let bodyweightKg = null;
  let proof = null;
  if (s.bodyweight) {
    bodyweightKg = toBodyweightKg(num(s.bodyweight, 'bodyweight'), s.bodyweight_unit === 'lb' ? 'lb' : 'kg');
    proof = ['same-take', 'same-day'].includes(s.weighin) ? s.weighin : 'self-reported';
  }

  let cls = null;
  if (division === 'bodyweight') {
    if (bodyweightKg === null) throw new Error('a bodyweight-class entry needs a bodyweight');
    if (proof === 'self-reported') throw new Error('a bodyweight-class entry needs a weigh-in on video (same take or same day); without one it can only go in Open');
    cls = classFor(cfg.classes, group, bodyweightKg);
  }

  let adaptive = null;
  if (division === 'adaptive') {
    if (!s.adaptive_category) throw new Error('an adaptive entry needs a category');
    if (!s.adaptive_description) throw new Error('an adaptive entry needs the lifter\'s description');
    adaptive = { category: s.adaptive_category, description: s.adaptive_description };
  }

  const base = `${s.date}-${s.lift}-${slug(handle)}-${division}`;
  let id = base;
  for (let n = 2; existing.some(r => r.id === id); n++) id = `${base}-${n}`;

  const record = {
    id,
    handle,
    lift: s.lift,
    weight_kg: weightKg,
    entered_as: { value: weightValue, unit: weightUnit },
    bodyweight_kg: bodyweightKg,
    bodyweight_proof: proof,
    division,
    group,
    class: cls,
    adaptive,
    date: s.date,
    video: s.video,
    weighin_video: s.weighin_video || null,
    approved: opts.approved || today(),
    status: 'standing',
    notes: '',
    example: false
  };

  const errs = validateRecord(record, cfg, `${id}.json`);
  if (errs.length) throw new Error(errs.join('; '));

  const duplicate = existing.find(r => r.video === record.video && tableKey(r) === tableKey(record) && r.status !== 'removed');
  if (duplicate) throw new Error(`this video is already in the same table as ${duplicate.id}`);

  const standing = currentRecord(existing.filter(r => !r.example), tableKey(record));
  let beats = true;
  if (standing && record.weight_kg < standing.weight_kg + MIN_INCREMENT_KG) {
    beats = false;
    if (!opts.force) {
      throw new Error(`${record.weight_kg} kg does not beat the standing record of ${standing.weight_kg} kg (${standing.id}) by at least ${MIN_INCREMENT_KG} kg. Use --force to list it anyway.`);
    }
  }
  return { record, standing, beats };
}

const isMain = process.argv[1] && import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/').split('/').pop());
if (isMain) {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const force = args.includes('--force') || process.env.FORCE === 'true';
  const text = args.filter(a => !a.startsWith('--')).join('\n') || process.env.SUBMISSION || '';

  let result;
  try {
    result = buildRecord(parseSubmission(text), loadConfig(), loadRecords(), { force });
  } catch (e) {
    fail(e.message);
  }
  const { record, standing, beats } = result;
  const file = join(RECORDS_DIR, `${record.id}.json`);
  if (existsSync(file)) fail(`${record.id}.json already exists`);

  console.log(JSON.stringify(record, null, 2));
  if (!standing) console.log('\nFirst record in its table.');
  else if (beats) console.log(`\nBeats the standing record: ${standing.weight_kg} kg (${standing.id}), which becomes history.`);
  else console.log(`\nDoes not beat the standing record of ${standing.weight_kg} kg; listed as a verified lift because --force was used.`);

  if (dryRun) {
    console.log('\nDry run: nothing written.');
  } else {
    writeJson(file, record);
    writeIndex();
    console.log(`\nWrote data/records/${record.id}.json and rebuilt data/index.json.`);
  }
}
