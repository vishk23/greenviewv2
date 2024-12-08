import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '@services/firebase';
import { collection, getDocs } from 'firebase/firestore';
import Slider from 'react-slick';
import './Main.css';
import EventCard from './EventCard';
import './EventCard.css';
import Footer from '@components/Footer/Footer';
import Map from '@features/Map/Map';
import CustomArrow from './arrow';

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
      title: "In the past 12 months, CDS averaged 42.13 tons of waste...",
      description: "Curious about your individual impact on the environment?",
      imageUrl: "/assets/CDS.gif"
    },
    {
      title: "In the past 12 months, Warren Towers averaged 253.35 tons of waste...",
      description: "Curious about your individual impact on the environment?",
      imageUrl: "/assets/warren.gif"
    },
    {
      title: "In the past 12 months, Stuvi averaged 266.8 tons of waste...",
      description: "Curious about your individual impact on the environment?",
      imageUrl: "/assets/StuVi_1.gif"
    },
    {
      title: "In the past 12 months, West averaged 254.52 tons of waste...",
      description: "Curious about your individual impact on the environment?",
      imageUrl: "/assets/west.gif"
    },
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

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true, // Disable default arrows
    prevArrow: <CustomArrow direction="left" />,
    nextArrow: <CustomArrow direction="right" />,
  };
  
  const eventSliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: false, // Disable default arrows
    prevArrow: <CustomArrow direction="left" />,
    nextArrow: <CustomArrow direction="right" />,
  };
  

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
              <div className="text-container">
                <h1>{slide.title}</h1>
                <p>{slide.description}</p>
                <button
                  className="take-quiz-button"
                  onClick={() => navigate('/score')}
                >
                  Take Quiz
                </button>
              </div>
              <div className="image-container">
                <img
                  src={slide.imageUrl}
                  alt={`Slide ${index + 1}`}
                />
              </div>
            </div>
          ))}
        </Slider>

        <Map />

      </div>

      <div className="events-section">
        <h2 className="events-title">Upcoming Events on Campus</h2>
        <Slider {...eventSliderSettings}>
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
      </div>

      <Footer />

    </div>
  );
};

export default MainPage;
