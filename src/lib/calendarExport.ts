import { ScheduleItem, Subject } from '@/types';

/**
 * Genera un archivo estándar iCalendar (.ics) descargable para importar
 * en Google Calendar, Apple Calendar, Outlook o el calendario del celular.
 */
export function generateScheduleIcs(schedule: ScheduleItem[], semesterWeeks = 16): string {
  const dayOffsetMap: Record<string, number> = {
    Domingo: 0,
    Lunes: 1,
    Martes: 2,
    Miércoles: 3,
    Jueves: 4,
    Viernes: 5,
    Sábado: 6,
  };

  // Calcular la fecha del próximo lunes para sincronización
  const now = new Date();
  const currentDay = now.getDay();
  const daysUntilMonday = (8 - currentDay) % 7 || 7;
  const nextMonday = new Date(now);
  nextMonday.setDate(now.getDate() + daysUntilMonday);

  const formatDateToIcs = (d: Date, timeStr: string): string => {
    const [hh, mm] = timeStr.split(':').map((n) => parseInt(n, 10));
    const dt = new Date(d);
    dt.setHours(hh || 0, mm || 0, 0, 0);

    const pad = (n: number) => n.toString().padStart(2, '0');
    const year = dt.getFullYear();
    const month = pad(dt.getMonth() + 1);
    const day = pad(dt.getDate());
    const hours = pad(dt.getHours());
    const minutes = pad(dt.getMinutes());
    const seconds = pad(dt.getSeconds());

    return `${year}${month}${day}T${hours}${minutes}${seconds}`;
  };

  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//MiSemaforo Quest//Horario Semestral PUJ//ES',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:Horario Semestre MiSemaforo',
    'X-WR-TIMEZONE:America/Bogota',
  ];

  schedule.forEach((item, index) => {
    const offset = (dayOffsetMap[item.dayOfWeek] ?? 1) - 1; // 0 para lunes
    const itemDate = new Date(nextMonday);
    itemDate.setDate(nextMonday.getDate() + offset);

    const startFormatted = formatDateToIcs(itemDate, item.startTime || '08:00');
    const endFormatted = formatDateToIcs(itemDate, item.endTime || '10:00');

    lines.push('BEGIN:VEVENT');
    lines.push(`UID:misemaforo-sched-${index}-${item.id}@misemaforo.edu.co`);
    lines.push(`DTSTAMP:${formatDateToIcs(now, '12:00')}Z`);
    lines.push(`DTSTART:${startFormatted}`);
    lines.push(`DTEND:${endFormatted}`);
    lines.push(`RRULE:FREQ=WEEKLY;COUNT=${semesterWeeks}`);
    lines.push(`SUMMARY:${item.subjectEmoji || '📚'} ${item.subjectName}`);
    lines.push(`DESCRIPTION:Clase universitaria registrada en MiSemaforo. Aula: ${item.room || 'Por definir'}`);
    if (item.room) {
      lines.push(`LOCATION:${item.room}`);
    }
    lines.push('STATUS:CONFIRMED');
    lines.push('BEGIN:VALARM');
    lines.push('TRIGGER:-PT15M'); // Recordatorio 15 minutos antes
    lines.push('ACTION:DISPLAY');
    lines.push(`DESCRIPTION:¡Clase de ${item.subjectName} en 15 minutos!`);
    lines.push('END:VALARM');
    lines.push('END:VEVENT');
  });

  lines.push('END:VCALENDAR');

  return lines.join('\r\n');
}

/**
 * Dispara la descarga del archivo .ics en el navegador del usuario
 */
export function downloadIcsFile(filename: string, icsContent: string) {
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
