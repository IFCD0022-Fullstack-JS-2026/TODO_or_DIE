import { Scheduler } from 'calendarkit-pro';

const save = (next) => console.log(next);

const events = [
  { id: '1', title: 'Design review', start: new Date(2026, 9, 15, 10), end: new Date(2026, 9, 15, 11) },
  { id: '2', title: 'Offsite', start: new Date(2026, 9, 19), end: new Date(2026, 9, 21), allDay: true },
];

export function MyCalendar() {
  return (
    <div style={{ height: 720 }}>
      <Scheduler defaultEvents={events} onEventsChange={(next) => save(next)} />
    </div>
  );
}
