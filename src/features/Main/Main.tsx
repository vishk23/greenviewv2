import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Main.css';

const MainPage: React.FC = () => {
  const navigate = useNavigate();

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
          <div className="event-card">
            <h3>Sustainability Festival</h3>
            <p>Beach Plaza</p>
            <p>10AM - 2PM</p>
          </div>
          <div className="event-card">
          <h3>Sustainability Talk</h3>
            <p>CAS 231</p>
            <p>6 PM</p>
          </div>
          <div className="event-card">
            <h3>Sustainability Workshop</h3>
            <p>Community Center</p>
            <p>1PM - 3PM</p>
          </div>
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
