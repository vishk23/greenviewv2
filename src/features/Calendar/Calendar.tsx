
'use client';
import React, { useState } from 'react';
import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './Calendar.css';
import CustomToolbar from './CustomToolbar';
import { events, MyEvent } from './Events';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});


const MyCalendar: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<MyEvent | null>(null);
  const handleEventClick = (event: MyEvent) => {
    setSelectedEvent(event);
  };

  const formatICSDate = (date: Date): string => {
    const year = date.getUTCFullYear();
    const month = ('0' + (date.getUTCMonth() + 1)).slice(-2);
    const day = ('0' + date.getUTCDate()).slice(-2);
    const hours = ('0' + date.getUTCHours()).slice(-2);
    const minutes = ('0' + date.getUTCMinutes()).slice(-2);
    const seconds = ('0' + date.getUTCSeconds()).slice(-2);

    return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
  };

  const generateICS = () => {
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

  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'stretch',
      height: '80vh',
      margin: '50px auto',
      maxWidth: '900px',
      width: '100%',
    },
    calendarContainer: {
      flex: 3,
      height: '100%',
      minWidth: '700px',
      width: '100%',
    },
    eventDetails: {
      flex: 1,
      backgroundColor: '#d4edda',
      padding: '20px',
      borderLeft: '4px solid #3a5f3f',
      borderRadius: '8px',
      display: 'flex' as const,
      flexDirection: 'column' as const,
      justifyContent: 'space-between' as const,
      maxWidth: '300px',
      width: '100%',
      maxHeight: '100%',
      overflow: 'auto',
    },
    dateContainer: {
      textAlign: 'center' as const,
      marginBottom: '20px',
    },
    eventInfo: {
      marginTop: '20px',
      textAlign: 'left' as const,
      wordWrap: 'break-word' as const,
    },
    eventLocationTime: {
      marginTop: '10px',
    },
    icon: {
      fontSize: '20px',
      color: '#3a5f3f',
    },
    closeButton: {
      backgroundColor: '#8bc995',
      color: 'white',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '5px',
      fontSize: '16px',
      alignSelf: 'center',
      marginTop: '20px',
      width: '100%',
      maxWidth: '200px',
    },
    buttonContainer: {
      display: 'flex' as const,
      justifyContent: 'center' as const,
      position: 'relative' as const,
      bottom: '20px',
      width: '100%',
    },
    button: {
      width: '750px',
      padding: '10px 20px',
      backgroundColor: '#8bc995',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      fontSize: '16px',
      textAlign: 'center' as const,
      margin: '64px auto',
    },
    header: {
      marginBottom: '20px',
    },
    headerText: {
      fontSize: '48px',
      fontWeight: 'bold',
      color: '#3a5f3f',
      margin: '0',
    },
    pageContainer: {
      display: 'flex' as const,
      flexDirection: 'column' as const,
      alignItems: 'flex-start' as const,
      padding: '20px',
    },
  };




  const renderEventDetails = () => {
    if (!selectedEvent) {
      return null;
    }

    return (
      <div style={styles.eventDetails}>
        <div style={styles.dateContainer}>
          <h1 style={{ fontSize: '80px', color: '#3a5f3f', margin: '0', textAlign: 'center' }}>
            {selectedEvent.start.getDate()}
          </h1>
          <p style={{ fontSize: '24px', color: '#3a5f3f', margin: '0', textAlign: 'center' }}>
            {selectedEvent.start.toLocaleDateString('en-US', { month: 'long' }).toUpperCase()}
          </p>
          <p style={{ fontSize: '18px', color: '#3a5f3f', margin: '0', textAlign: 'center' }}>
            {selectedEvent.start.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase()}
          </p>
        </div>
        <hr style={{ border: '1px solid #3a5f3f', width: '100%' }} />
        <div style={styles.eventInfo}>
          <h2 style={{ fontSize: '24px', color: '#3a5f3f' }}>{selectedEvent.title}</h2>
          <div style={styles.eventLocationTime}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
              <span style={styles.icon}>📍</span>
              <p style={{ marginLeft: '10px', color: '#3a5f3f' }}>
                {selectedEvent.location}
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={styles.icon}>🕒</span>
              <p style={{ marginLeft: '10px', color: '#3a5f3f' }}>
                {selectedEvent.allDay
                  ? 'All Day'
                  : `${selectedEvent.start.toLocaleTimeString()} - ${selectedEvent.end.toLocaleTimeString()}`}
              </p>
            </div>
          </div>
        </div>

        <button onClick={() => setSelectedEvent(null)} style={styles.closeButton}>
          Close
        </button>
      </div>
    );
  };




  const [date, setDate] = useState(new Date());

  return (
    <div style={styles.pageContainer}>
      <header style={styles.header}>
        <h1 style={styles.headerText}>Events Calendar</h1>
      </header>

      <div style={styles.container}>
        <div style={styles.calendarContainer}>
          <BigCalendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: '100%' }}
            onSelectEvent={handleEventClick}
            views={['month']}
            defaultView="month"
            components={{
              toolbar: CustomToolbar,
            }}
            toolbar={true}
            popup={false}
            date={date}
            onNavigate={(newDate) => setDate(newDate)}
          />
          <div style={styles.buttonContainer}>
            <button
              onClick={generateICS}
              style={styles.button}
            >
              Download Calendar
            </button>
          </div>
        </div>
        {renderEventDetails()}
      </div>
    </div>
  );
};

export default MyCalendar;
