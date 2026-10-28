import test from 'node:test';
import assert from 'node:assert/strict';
import {makeSchedule, milestones, toCSV, toCalendar, foldLine} from '../core.mjs';

test('original anchor reproduces all seven archived planned dates', () => {
  const plan = makeSchedule('1969-08-01');
  assert.deepEqual(plan.rows.map(r => r.date), ['1969-08-01','1969-09-01','1969-09-15','1969-10-01','1969-10-15','1969-11-15','1969-12-15']);
  assert.deepEqual(plan.rows.map(r => r.gap), [0,31,14,16,14,31,30]);
  assert.equal(plan.rows.length, 7);
});
test('modern example crosses a year boundary without changing offsets', () => {
  const plan = makeSchedule('2026-11-01');
  assert.equal(plan.rows.at(-1).date, '2027-03-17');
  for (const row of plan.rows) assert.equal((Date.parse(row.date)-Date.parse(plan.start))/86400000, row.offset);
});
test('leap years and DST transitions use elapsed calendar days', () => {
  const leap = makeSchedule('2028-02-01');
  assert.equal(leap.rows[1].date, '2028-03-03');
  assert.equal(leap.rows.at(-1).date, '2028-06-16');
  assert.equal(makeSchedule('2027-02-01').rows[1].date, '2027-03-04');
  assert.equal(makeSchedule('2026-03-01').rows[1].date, '2026-04-01');
});
test('rejects impossible, noncanonical and out-of-bounds dates', () => {
  for (const start of ['', '2026-2-01', '2026-02-29', '1900-02-29', '2026-04-31', '2026-00-01', '2026-13-01', '1899-12-31', '9999-01-01', null]) assert.throws(() => makeSchedule(start), /date/i);
  assert.equal(makeSchedule('2000-02-29').rows[0].date, '2000-02-29');
});
test('project names are bounded and cannot inject calendar lines', () => {
  for (const name of ['', ' ', 'x'.repeat(101), 'Name\nBEGIN:VEVENT', 12]) assert.throws(() => makeSchedule('2026-01-01', name), /project name/);
});
test('CSV escapes quotes, commas and spreadsheet formula prefixes', () => {
  const csv = toCSV(makeSchedule('2026-01-01', '=HYPERLINK("x","y")'));
  assert.match(csv, /"'=HYPERLINK\(""x"",""y""\)"/);
  assert.equal(csv.trimEnd().split('\r\n').length, 8);
  assert.ok(csv.includes('"Original planned date"'));
});
test('calendar contains seven all-day events with exclusive next-day ends', () => {
  const cal = toCalendar(makeSchedule('2026-12-31'), new Date('2026-10-29T00:00:00Z'));
  assert.equal(cal.match(/BEGIN:VEVENT/g).length, 7);
  assert.match(cal, /DTSTART;VALUE=DATE:20261231\r\nDTEND;VALUE=DATE:20270101/);
  assert.match(cal, /DTSTAMP:20261029T000000Z/);
  assert.match(cal, /TRANSP:TRANSPARENT/);
  assert.ok(cal.endsWith('END:VCALENDAR\r\n'));
  assert.equal(cal.replaceAll('\r\n', '').includes('\n'), false);
});
test('calendar text escapes delimiters and UTF-8 folds without losing characters', () => {
  const project = 'Workshop, A; B\\C ' + '🌍'.repeat(30);
  const cal = toCalendar(makeSchedule('2026-01-01', project));
  const unfolded = cal.replace(/\r\n /g, '');
  assert.ok(unfolded.includes('Workshop\\, A\\; B\\\\C ' + '🌍'.repeat(30)));
  for (const line of cal.split('\r\n')) assert.ok(Buffer.byteLength(line) <= 75, line);
  const text = 'TEXT:' + 'é🌍'.repeat(40);
  assert.equal(foldLine(text).replace(/\r\n /g, ''), text);
});
test('UIDs are stable for repeated exports but distinguish project names', () => {
  const ids = project => toCalendar(makeSchedule('2026-01-01', project)).replace(/\r\n /g, '').match(/^UID:.*$/gm);
  assert.deepEqual(ids('A'), ids('A')); assert.notDeepEqual(ids('A'), ids('B'));
  assert.equal(new Set(ids('A')).size, 7);
});
test('highest supported anchor leaves room for the final event end date', () => {
  const plan = makeSchedule('9998-12-31');
  assert.equal(plan.rows.at(-1).date, '9999-05-16');
  assert.match(toCalendar(plan), /DTEND;VALUE=DATE:99990517/);
  assert.throws(() => toCalendar(plan, new Date('invalid')), /creation date/);
});
test('consumers cannot mutate the canonical archival milestone list', () => {
  assert.throws(() => { milestones[0].offset = 5; }, TypeError);
  const plan = makeSchedule('1969-08-01'); plan.rows[0].offset = 5;
  assert.equal(makeSchedule('1969-08-01').rows[0].offset, 0);
});
