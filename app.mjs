import {makeSchedule, toCSV, toCalendar} from './core.mjs';
import {$, download, renderRows, wireShare} from './share.mjs';
let current;
function update() {
  try {
    current = makeSchedule($('start').value, $('project').value);
    $('error').textContent = '';
    renderRows($('rows'), current.rows.map(row => [row.section, row.title, row.original, `+${row.offset} days`, row.date]));
    $('finish').textContent = current.rows.at(-1).date;
    $('status').textContent = `Seven exercise milestones from ${current.start} to ${current.rows.at(-1).date}; 136 elapsed calendar days. Dates are planned targets, not completion records.`;
    $('csv').disabled = false; $('calendar').disabled = false;
    const list = current.rows.map(row => {
      const item = document.createElement('li'), marker = document.createElement('strong'), label = document.createElement('span');
      marker.textContent = `Day ${row.offset}`; label.textContent = `${row.date} · ${row.title}`;
      item.append(marker, label); return item;
    });
    $('timeline').replaceChildren(...list);
  } catch (error) {
    current = null; $('error').textContent = error.message;
    $('rows').replaceChildren(); $('timeline').replaceChildren(); $('finish').textContent = '—';
    $('status').textContent = 'Correct the input to calculate exercise dates.';
    $('csv').disabled = true; $('calendar').disabled = true;
  }
}
for (const id of ['start', 'project']) $(id).addEventListener('input', update);
$('original').addEventListener('click', () => { $('start').value = '1969-08-01'; $('project').value = 'Historical timetable exercise'; update(); });
$('example').addEventListener('click', () => { $('start').value = '2026-11-01'; $('project').value = 'Community network exercise'; update(); });
$('csv').addEventListener('click', () => { if (current) download('rollout-exercise.csv', toCSV(current), 'text/csv;charset=utf-8'); });
$('calendar').addEventListener('click', () => {
  if (!current) return;
  try { download('rollout-exercise.ics', toCalendar(current), 'text/calendar;charset=utf-8'); }
  catch (error) { $('error').textContent = error.message; }
});
wireShare(); update();
