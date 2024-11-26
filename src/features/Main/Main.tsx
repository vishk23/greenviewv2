import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '@services/firebase';
import { collection, getDocs } from 'firebase/firestore';
import Slider from 'react-slick';
import './Main.css';
import { sliderSettings } from './SliderSetting';
import EventCard from './EventCard';
import './EventCard.css';
import  {EventSliderSettings} from './EventSliderSettings';
import Footer from '@components/Footer/Footer';


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

  const sliderRef = useRef<any>(null); // Use ref to access slider
  const [, setActiveSlide] = useState(0); // Track active slide

  const heroSlides: HeroSlide[] = React.useMemo(() => [
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
], []);

useEffect(() => {
  heroSlides.forEach((slide) => {
    const img = new Image();
    img.src = slide.imageUrl;
  });
}, [heroSlides]);

const handleBeforeChange = (current: number, next: number) => {
  setActiveSlide(next); // Update active slide index
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



  return (
    <div className="main-page">
      <div className="hero-slider">
      <Slider
          {...sliderSettings}
          ref={sliderRef}
          beforeChange={handleBeforeChange}
        >
          {heroSlides.map((slide, index) => (
            <div key={index} className="hero-slide">
              <div
                className="text-container"
                onClick={() => navigate('/score')} // Navigate to /score
              >
                <h1>{slide.title}</h1>
                <p>{slide.description}</p>
              </div>
              <div className="image-container">
                {/* Conditionally render GIF based on active slide */}
                <img
                  src={slide.imageUrl }
                  alt={`Slide ${index + 1}`}
                />
              </div>
            </div>
          ))}
        </Slider>




      </div>

      <div className="events-section">
        <h2 className="events-title">Upcoming Events on Campus</h2>
        <Slider {...EventSliderSettings}>
  {events.map((event) => (
    <EventCard
      key={event.id}
      date={event.start.toLocaleDateString([], { day: 'numeric' })}
      weekday={event.start.toLocaleDateString([], { weekday: 'long' })}
      title={event.title}
      location={event.location}
      time={`${event.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
             ${event.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
    />
  ))}
</Slider>

        <p className="calendar-text">Take a look at our calendar for more events happening around you!</p>
        <button onClick={() => navigate('/calendar')} className="calendar-button">
          Go to Calendar
        </button>
        <img src="/assets/bd09ad965a55332dbd5cc8216c02a37e.png" alt="Decorative" className="image-under-events" />
      </div>

      <Footer/>

    </div>

    
  );
};

export default MainPage;
