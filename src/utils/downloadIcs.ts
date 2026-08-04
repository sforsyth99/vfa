interface IcsEvent {
  title: string;
  date: string;       // "YYYY-MM-DD"
  timeStart: string;  // "HH:MM" or "HH:MM:SS"
  timeEnd: string;    // "HH:MM" or "HH:MM:SS"
  location: string;
  description: string;
  filename: string;
  uid: string;
}

function fmtDateTime(date: string, time: string): string {
  const dateStr = date.replace(/-/g, '');
  const parts = time.split(':');
  const h = (parts[0] ?? '0').padStart(2, '0');
  const m = (parts[1] ?? '0').padStart(2, '0');
  const s = (parts[2] ?? '0').padStart(2, '0');
  return `${dateStr}T${h}${m}${s}`;
}

function dtstampNow(): string {
  const now = new Date();
  const p = (n: number) => n.toString().padStart(2, '0');
  return `${now.getUTCFullYear()}${p(now.getUTCMonth() + 1)}${p(now.getUTCDate())}T${p(now.getUTCHours())}${p(now.getUTCMinutes())}${p(now.getUTCSeconds())}Z`;
}

// RFC 5545 §3.1: fold lines longer than 75 octets
function foldLine(line: string): string {
  if (line.length <= 75) return line;
  const chunks = [line.slice(0, 75)];
  let i = 75;
  while (i < line.length) {
    chunks.push(' ' + line.slice(i, i + 74));
    i += 74;
  }
  return chunks.join('\r\n');
}

function escape(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/[,;]/g, (c) => `\\${c}`).replace(/\n/g, '\\n');
}

export function downloadIcs({ title, date, timeStart, timeEnd, location, description, filename, uid }: IcsEvent): void {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Victoria Festival of Authors//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${dtstampNow()}`,
    `DTSTART:${fmtDateTime(date, timeStart)}`,
    `DTEND:${fmtDateTime(date, timeEnd)}`,
    `SUMMARY:${escape(title)}`,
    `LOCATION:${escape(location)}`,
    `DESCRIPTION:${escape(description)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ];

  const ics = lines.map(foldLine).join('\r\n');

  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
