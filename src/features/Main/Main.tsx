import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '@services/firebase';
import { collection, getDocs } from 'firebase/firestore';
import Slider from 'react-slick';
import './Main.css';
import { sliderSettings } from './SliderSetting';

interface Event {
  id: string;
  title: string;
  location: string;
  start: Date;
  end: Date;
}

interface HeroSlide {
  title: string;
  description: string;
  imageUrl: string;
}

const MainPage: React.FC = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);

  const heroSlides: HeroSlide[] = [
    {
        title: "In the past 12 months, Warren Towers averaged 253.35 tones of waste...",
        description: `Curious about your individual impact on the environment?
        Click here to take our Sustainability Quiz!`,
        imageUrl: "/assets/Warren-animation.gif"
    },
    {
        title: "In the past 12 months, Stuvi averaged 266.8 tones of waste...",
        description: `Curious about your individual impact on the environment?
        Click here to take our Sustainability Quiz!`,
        imageUrl: "/assets/StuVi-animation.gif"
    },
    {
        title: "In the past 12 months, West averaged 254.52 tones of waste...",
        description: `Curious about your individual impact on the environment?
        Click here to take our Sustainability Quiz!`,
        imageUrl: "/assets/West-animation.gif"
    }
];


  const heroSliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
  };

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

        // Get current date
        const now = new Date();

        // Filter and sort events by start date
        const futureEvents = eventsList
          .filter(event => event.start > now) // Only future events
          .sort((a, b) => a.start.getTime() - b.start.getTime());

        setEvents(futureEvents);
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
      <div className="hero-slider">
        <Slider {...heroSliderSettings}>
          {heroSlides.map((slide, index) => (
            <div key={index} className="image-container">
              <div className="title-text">
                <h1>{slide.title}</h1>
                <p>{slide.description}</p>
                <button onClick={startQuiz} className="start-quiz-button">
                  Take Quiz
                </button>
              </div>
              <img src={slide.imageUrl} alt={`Slide ${index + 1}`} />
            </div>
          ))}
        </Slider>
      </div>

      <div className="events-section">
        <h2 className="events-title">Upcoming Events on Campus</h2>
        <Slider {...sliderSettings}>
          {events.map((event) => (
            <div key={event.id} className="event-card">
              <h3>{event.title}</h3>
              <p>{event.location}</p>
              <p>
                {event.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{' '}
                {event.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          ))}
        </Slider>
        <p className="calendar-text">Take a look at our calendar for more events happening around you!</p>
        <button onClick={() => navigate('/calendar')} className="calendar-button">
          Go to Calendar
        </button>
      </div>
    </div>
  );
};

export default MainPage;
