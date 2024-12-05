import React, { useEffect, useState } from "react";
import { Calendar as BigCalendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";
import CustomToolbar from "./CustomToolbar";
import EventDetails from "./EventDetails";
import { MyEvent } from "./Events";
import { db } from "@services/firebase";
import { collection, getDocs } from "firebase/firestore";
import CalendarStyles from "./CalendarStyles";
import { generateICS } from "../../utils/icsUtils";
import Footer from "@components/Footer/Footer";

const locales = { "en-US": enUS };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const MyCalendar: React.FC = () => {
  const [events, setEvents] = useState<MyEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<MyEvent | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsCollection = collection(db, "events");
        const eventSnapshot = await getDocs(eventsCollection);
        const eventsList = eventSnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title,
            start: data.start.toDate(),
            end: data.end.toDate(),
            allDay: data.allDay || false,
            location: data.location || "Location not specified",
            notifications: data.notifications || {},
          } as MyEvent;
        });
        setEvents(eventsList);
      } catch (error) {
        console.error("Error fetching events: ", error);
      }
    };

    fetchEvents();
  }, []);

  const handleEventClick = (event: MyEvent) => {
    setSelectedEvent(event);
  };

  const eventPropGetter = (event: MyEvent) => {
    const isSelected = selectedEvent && event.id === selectedEvent.id;
    return {
      style: {
        backgroundColor: isSelected ? "#F15824" : "#9FC37B",
        color: isSelected ? "#000000" : "rgba(255, 248, 235, 1)",
        borderRadius: "8px",
        padding: "5px",
      },
    };
  };

  return (
    <div style={CalendarStyles.pageContainer}>
      <header style={CalendarStyles.header}>
        <h1 style={CalendarStyles.headerText}>Events Calendar</h1>
      </header>
      <div style={CalendarStyles.container}>
        <div style={CalendarStyles.calendarContainer}>
          <BigCalendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: "100%" }}
            onSelectEvent={handleEventClick}
            eventPropGetter={eventPropGetter}
            views={["month"]}
            defaultView="month"
            components={{ toolbar: CustomToolbar }}
            toolbar={true}
            popup={false}
          />
          <div style={CalendarStyles.buttonContainer}>
            <button
              onClick={() => generateICS(events)}
              style={CalendarStyles.button}
            >
              Download Calendar
            </button>
          </div>
        </div>
        {selectedEvent && (
          <div style={CalendarStyles.eventDetailsContainer}>
            <EventDetails
              event={selectedEvent}
              onClose={() => setSelectedEvent(null)}
            />
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default MyCalendar;
