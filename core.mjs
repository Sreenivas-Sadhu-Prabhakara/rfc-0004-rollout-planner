const DAY = 86400000;
export const milestones = Object.freeze([
  { section: '2', title: 'Install communication gear', original: '1969-08-01', offset: 0 },
  { section: '3', title: 'Design and construct host–IMP interface', original: '1969-09-01', offset: 31 },
  { section: '4', title: 'Install IMP', original: '1969-09-15', offset: 45 },
  { section: '5', title: 'Debug host–IMP interface', original: '1969-10-01', offset: 61 },
  { section: '6', title: 'Test UCLA–SRI messages', original: '1969-10-15', offset: 75 },
  { section: '7', title: 'Test UCSB–SRI messages', original: '1969-11-15', offset: 106 },
  { section: '8', title: 'Test UTAH–SRI messages', original: '1969-12-15', offset: 136 }
].map(Object.freeze));

function parseDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) throw new Error('Enter a date in YYYY-MM-DD form.');
  const date = new Date(`${value}T00:00:00Z`);
  if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== value || value < '1900-01-01' || value > '9998-12-31') throw new Error('Choose a real date from 1900 through 9998.');
  return date.getTime();
}

export function makeSchedule(start, project = 'My rollout exercise') {
  const anchor = parseDate(start);
  if (typeof project !== 'string' || !project.trim() || project.length > 100 || /[\u0000-\u001f\u007f]/.test(project)) throw new Error('Enter a project name of 1–100 characters on one line.');
  return { project: project.trim(), start, rows: milestones.map((m, index) => ({ ...m, date: new Date(anchor + m.offset * DAY).toISOString().slice(0, 10), gap: index ? m.offset - milestones[index - 1].offset : 0 })) };
}

function csvCell(value) {
  // Prefix spreadsheet formula triggers, including a trigger after whitespace.
  const text = String(value);
  const safe = /^[\s]*[=+\-@]/.test(text) ? `'${text}` : text;
  return `"${safe.replace(/"/g, '""')}"`;
}

export function toCSV(schedule) {
  const rows = [['Project', 'RFC 4 item', 'Milestone (paraphrased)', 'Original planned date', 'Offset in days', 'Exercise date'], ...schedule.rows.map(row => [schedule.project, row.section, row.title, row.original, row.offset, row.date])];
  return rows.map(row => row.map(csvCell).join(',')).join('\r\n') + '\r\n';
}

function calendarText(value) { return value.replace(/\\/g, '\\\\').replace(/\r\n|\r|\n/g, '\\n').replace(/;/g, '\\;').replace(/,/g, '\\,'); }
// RFC 5545 line folding uses octets, not JavaScript string length.
export function foldLine(value) {
  let line = '', bytes = 0;
  const lines = [];
  for (const char of value) {
    const size = new TextEncoder().encode(char).length;
    if (bytes + size > 75) { lines.push(line); line = ' '; bytes = 1; }
    line += char; bytes += size;
  }
  lines.push(line);
  return lines.join('\r\n');
}

export function toCalendar(schedule, generatedAt = new Date()) {
  if (!(generatedAt instanceof Date) || !Number.isFinite(generatedAt.getTime()) || generatedAt.getUTCFullYear() < 1900 || generatedAt.getUTCFullYear() > 9999) throw new Error('Invalid calendar creation date.');
  const stamp = generatedAt.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//RFC Community Labs//Rollout Planner//EN', 'CALSCALE:GREGORIAN'];
  for (const row of schedule.rows) {
    const nextDay = new Date(new Date(`${row.date}T00:00:00Z`).getTime() + DAY).toISOString().slice(0, 10);
    lines.push('BEGIN:VEVENT', `UID:${encodeURIComponent(schedule.project)}-${row.section}-${row.date}@rfc-0004-rollout-planner.local`, `DTSTAMP:${stamp}`, `DTSTART;VALUE=DATE:${row.date.replaceAll('-', '')}`, `DTEND;VALUE=DATE:${nextDay.replaceAll('-', '')}`, `SUMMARY:${calendarText(`${schedule.project}: ${row.title}`)}`, `DESCRIPTION:${calendarText(`Educational date-shift exercise inspired by RFC 4 item ${row.section}. Original planned date: ${row.original}. Not an actual 1969 completion record or a recommended project duration.`)}`, 'TRANSP:TRANSPARENT', 'END:VEVENT');
  }
  lines.push('END:VCALENDAR');
  return lines.map(foldLine).join('\r\n') + '\r\n';
}
