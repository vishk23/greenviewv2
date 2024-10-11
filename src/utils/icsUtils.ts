// /src/utils/icsUtils.ts
export const formatICSDate = (date: Date): string => {
    const year = date.getUTCFullYear();
    const month = ('0' + (date.getUTCMonth() + 1)).slice(-2);
    const day = ('0' + date.getUTCDate()).slice(-2);
    const hours = ('0' + date.getUTCHours()).slice(-2);
    const minutes = ('0' + date.getUTCMinutes()).slice(-2);
    const seconds = ('0' + date.getUTCSeconds()).slice(-2);
  
    return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
  };
  
  export const generateICS = (events: any[]) => {
    let icsContent = 'BEGIN:VCALENDAR\nVERSION:2.0\n';
    events.forEach((event) => {
      icsContent += 'BEGIN:VEVENT\n';
      icsContent += `SUMMARY:${event.title}\n`;
      icsContent += `DTSTART:${formatICSDate(event.start)}\n`;
      icsContent += `DTEND:${formatICSDate(event.end)}\n`;
      icsContent += 'END:VEVENT\n';
    });
    icsContent += 'END:VCALENDAR';
  
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'events.ics';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  