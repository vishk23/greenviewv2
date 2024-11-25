import React from 'react';

interface EventCardProps {
  date: string;
  weekday: string;
  title: string;
  location: string;
  time: string;
}

const EventCard: React.FC<EventCardProps> = ({ date, weekday, title, location, time }) => {
  return (
    <div className="event-card">
      <div className="event-date">
        <h1>{date}</h1>
        <p>{weekday.toUpperCase()}</p>
      </div>
      <div className="event-details">
        <h3>{title}</h3>
        <p>
          <i className="fas fa-map-marker-alt"></i> {location}
        </p>
        <p>
          <i className="far fa-clock"></i> {time}
        </p>
      </div>
    </div>
  );
};

export default EventCard;
