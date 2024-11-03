import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '@services/firebase';
import { collection, getDocs } from 'firebase/firestore';
import './Main.css';

interface Event {
  id: string;
  title: string;
  location: string;
  start: Date;
  end: Date;
}

const MainPage: React.FC = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsCollection = collection(db, 'events');
        const eventSnapshot = await getDocs(eventsCollection);
        const eventsList = eventSnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title,
            location: data.location || 'Location not specified',
            start: data.start.toDate(),
            end: data.end.toDate(),
          } as Event;
        });
        setEvents(eventsList);
      } catch (error) {
        console.error("Error fetching events: ", error);
      }
    };

    fetchEvents();
  }, []);

  const startQuiz = () => {
    navigate('/score');
  };

  return (
    <div className="main-page">
      {/* Image Container with Text Overlay */}
      <div className="image-container">
        <div className="overlay-text">
          <h1>This year, Warren Towers averaged X amount of waste...</h1>
          <p>Curious about your individual impact on the environment? Click here to take our Sustainability Quiz!</p>
          <button onClick={startQuiz} className="start-quiz-button">
            Take Quiz
          </button>
        </div>
      </div>

      {/* Upcoming Events Section */}
      <div className="events-section">
        <h2 className="events-title">Upcoming Events on Campus</h2>
        <div className="events-grid">
          {events.slice(0, 3).map((event) => (
            <div key={event.id} className="event-card">
              <h3>{event.title}</h3>
              <p>{event.location}</p>
              <p>{event.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {event.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
          ))}
        </div>
        <p className="calendar-text">Take a look at our calendar for more events happening around you!</p>
        <button onClick={() => navigate('/calendar')} className="calendar-button">
          Go to Calendar
        </button>
      </div>
    </div>
  );
};

export default MainPage;
