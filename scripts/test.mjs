#!/usr/bin/env node
// Tests for the approval script and the validator. Run: node scripts/test.mjs
import assert from 'node:assert/strict';
import { loadConfig, toRecordKg, toBodyweightKg, classFor, findEmail } from './lib.mjs';
import { parseSubmission, buildRecord } from './approve.mjs';
import { validateRecord, validateAll } from './validate.mjs';

const cfg = loadConfig();
let passed = 0;
function test(name, fn) {
  try { fn(); passed++; } catch (e) { console.error(`FAIL: ${name}\n  ${e.message}`); process.exitCode = 1; }
}
const good = {
  handle: '@ironmoth', lift: 'trap-bar-deadlift', weight: '302.5', weight_unit: 'kg', division: 'open', group: 'all',
  date: '2026-11-03', video: 'https://youtu.be/abcdefghijk'
};
const v2 = 'https://youtu.be/zzzzzzzzzzz';
const build = (over, existing = [], opts = {}) => buildRecord({ ...good, ...over }, cfg, existing, { approved: '2026-11-12', ...opts });

test('pounds are converted and rounded down to 0.5 kg', () => {
  assert.equal(toRecordKg(600, 'lb'), 272);
  assert.equal(toRecordKg(405, 'lb'), 183.5);
  assert.equal(toRecordKg(302.74, 'kg'), 302.5);
  assert.equal(toBodyweightKg(220, 'lb'), 99.8);
});
test('bodyweight classes include their upper limit', () => {
  assert.equal(classFor(cfg.classes, 'all', 90), '90');
  assert.equal(classFor(cfg.classes, 'all', 90.1), '100');
  assert.equal(classFor(cfg.classes, 'all', 140), '125+');
  assert.equal(classFor(cfg.classes, 'women', 49.9), '50');
  assert.equal(classFor(cfg.classes, 'women', 95), '90+');
});
test('a JSON approval block is parsed, even with text around it', () => {
  assert.equal(parseSubmission('approval_block: {"handle":"a","lift":"squat"} ').lift, 'squat');
});
test('"key: value" lines are parsed and the email line is ignored', () => {
  const s = parseSubmission('Handle: bob\nLift: squat\nEmail: bob@example.com\nWeight unit: lb');
  assert.deepEqual(s, { handle: 'bob', lift: 'squat', weight_unit: 'lb' });
});
test('a good open submission becomes a valid record', () => {
  const { record } = build({});
  assert.equal(record.id, '2026-11-03-trap-bar-deadlift-ironmoth-open');
  assert.equal(record.handle, 'ironmoth');
  assert.equal(record.weight_kg, 302.5);
  assert.deepEqual(validateRecord(record, cfg, record.id + '.json'), []);
});
test('an email address anywhere is refused', () => {
  assert.throws(() => build({ handle: 'me@example.com' }), /email/);
  assert.throws(() => buildRecord({ ...good, email: 'x@example.com' }, cfg, []), /email/);
  assert.ok(findEmail({ a: ['x', { b: 'hi a@b.co' }] }));
});
test('a bodyweight class needs a weigh-in on video', () => {
  assert.throws(() => build({ division: 'bodyweight', bodyweight: '98' }), /weigh-in/);
  const { record } = build({ division: 'bodyweight', bodyweight: '98.4', weighin: 'same-take' });
  assert.equal(record.class, '100');
  assert.throws(() => build({ division: 'bodyweight', bodyweight: '98.4', weighin: 'same-day' }), /weighin_video/);
});
test('an adaptive entry needs a category and a description', () => {
  assert.throws(() => build({ division: 'adaptive' }), /category/);
  assert.throws(() => build({ division: 'adaptive', adaptive_category: 'nope', adaptive_description: 'x' }), /unknown adaptive category/);
  const { record } = build({ division: 'adaptive', adaptive_category: 'upper-limb', adaptive_description: 'Lifting with a hook.' });
  assert.equal(record.adaptive.category, 'upper-limb');
});
test('only YouTube and Instagram https links are accepted', () => {
  assert.throws(() => build({ video: 'http://youtu.be/abc' }), /video/);
  assert.throws(() => build({ video: 'https://example.com/v' }), /video/);
  assert.throws(() => build({ video: 'javascript:alert(1)' }), /video/);
  build({ video: 'https://www.instagram.com/reel/abc/' });
});
test('a lift must beat the standing record by 0.5 kg unless forced', () => {
  const first = build({}).record;
  assert.throws(() => build({ handle: 'other', weight: '302.5', video: v2 }, [first]), /does not beat/);
  assert.equal(build({ handle: 'other', weight: '303', video: v2 }, [first]).beats, true);
  assert.equal(build({ handle: 'other', weight: '300', video: v2 }, [first], { force: true }).beats, false);
});
test('the same video cannot be entered twice in one table, and ids never clash', () => {
  const first = build({}).record;
  assert.throws(() => build({ weight: '310' }, [first]), /already/);
  assert.equal(build({ weight: '310', video: 'https://youtu.be/zzzzzzzzzzz' }, [first]).record.id, first.id + '-2');
});
test('future dates, bad lifts and unknown fields are refused', () => {
  assert.throws(() => build({ date: '2999-01-01' }), /future/);
  assert.throws(() => build({ lift: 'curl' }), /unknown lift/);
  assert.throws(() => buildRecord({ ...good, admin: 'yes' }, cfg, []), /unexpected field/);
});
test('the validator rejects tampered records', () => {
  const { record } = build({});
  assert.ok(validateRecord({ ...record, weight_kg: 302.3 }, cfg).length);
  assert.ok(validateRecord({ ...record, video: null }, cfg).length);
  assert.ok(validateRecord({ ...record, status: 'removed', notes: '' }, cfg).length);
  assert.ok(validateRecord({ ...record, extra: 1 }, cfg).length);
  assert.deepEqual(validateRecord({ ...record, status: 'removed', notes: 'Upheld dispute', handle: '', video: null }, cfg), []);
});
test('the data files in the repo are valid', () => {
  assert.deepEqual(validateAll().problems, []);
});

console.log(`${passed} test(s) passed${process.exitCode ? ', some FAILED' : ''}.`);
