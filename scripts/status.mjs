#!/usr/bin/env node
// Changes a record's status, or deletes it, then rebuilds data/index.json.
//
//   node scripts/status.mjs <id> under-review "Disputed: depth at 0:14"
//   node scripts/status.mjs <id> evidence-unavailable "Video private since 2026-12-01"
//   node scripts/status.mjs <id> standing                 clears a review
//   node scripts/status.mjs <id> removed "Upheld dispute: lift was hitched"
//   node scripts/status.mjs <id> delete                   lifter asked for it to be taken down
//
// "removed" keeps a history line (date, weight, reason) and strips the handle, the videos
// and any adaptive description. "delete" removes the file outright.
import { existsSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';
import { RECORDS_DIR, readJson, writeJson, writeIndex, loadConfig, findEmail } from './lib.mjs';
import { validateRecord } from './validate.mjs';

const [id, status, ...rest] = process.argv.slice(2).length ? process.argv.slice(2) : [process.env.RECORD_ID, process.env.NEW_STATUS, process.env.REASON || ''];
const reason = rest.join(' ').trim();

function fail(msg) {
  console.error('NOT CHANGED: ' + msg);
  process.exit(1);
}

if (!id || !status) fail('usage: node scripts/status.mjs <id> <standing|under-review|evidence-unavailable|removed|delete> ["reason"]');
if (!/^[a-z0-9][a-z0-9+-]*$/.test(id)) fail('that does not look like a record id');
const file = join(RECORDS_DIR, `${id}.json`);
if (!existsSync(file)) fail(`no record called ${id}`);

if (status === 'delete') {
  unlinkSync(file);
  writeIndex();
  console.log(`Deleted data/records/${id}.json and rebuilt the index.`);
  process.exit(0);
}

const cfg = loadConfig();
if (!cfg.statuses.includes(status)) fail(`status must be one of: ${cfg.statuses.join(', ')}, or delete`);
if (status !== 'standing' && !reason) fail('give a short reason; it is shown on the site');
if (findEmail(reason)) fail('the reason looks like it contains an email address');

const record = readJson(file);
record.status = status;
record.notes = status === 'standing' ? '' : reason;
if (status === 'removed') {
  record.handle = '';
  record.video = null;
  record.weighin_video = null;
  if (record.adaptive) record.adaptive.description = '';
}

const errs = validateRecord(record, cfg, `${id}.json`);
if (errs.length) fail(errs.join('; '));
writeJson(file, record);
writeIndex();
console.log(`${id} is now "${status}". Index rebuilt.`);
