// /src/components/Calendar/EventDetails.tsx
import React, { useState } from 'react';
import { db } from '@services/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@services/firebase';
import { MyEvent } from './Events';
import EventDetailsStyles from './EventDetailsStyles';

interface EventDetailsProps {
  event: MyEvent;
  onClose: () => void;
}

const EventDetails: React.FC<EventDetailsProps> = ({ event, onClose }) => {
  const [showNotifyOptions, setShowNotifyOptions] = useState(false);
  const [notificationTimes, setNotificationTimes] = useState<string[]>([]);
  const [user] = useAuthState(auth);

  const notificationOptions = [
    { label: 'Day of Event', value: 'dayOf' },
    { label: '3 Days Before', value: 'threeDays' },
    { label: '1 Hour Before', value: 'oneHour' }
  ];

  const handleCheckboxChange = (value: string) => {
    setNotificationTimes((prev) => 
      prev.includes(value)
        ? prev.filter((option) => option !== value)
        : [...prev, value]
    );
  };

  const handleConfirmNotifications = async () => {
    if (event && user) {
      const eventDocRef = doc(db, 'events', event.id);

      const updatedNotifications = {
        [`${user.uid}`]: {
          email: user.email,
          preferences: notificationTimes
        }
      };

      try {
        await updateDoc(eventDocRef, { notifications: updatedNotifications });
        alert('Notification preferences saved!');
      } catch (error) {
        console.error("Error saving notifications: ", error);
      }
    }
    setShowNotifyOptions(false);
  };

  return (
    <div style={EventDetailsStyles.eventDetails}>
      <h2 style={{ color: '#3a5f3f' }}>{event.title}</h2>
      <p>
        <strong>Date:</strong> {event.start.toLocaleDateString()} 
        {event.allDay ? '' : ` from ${event.start.toLocaleTimeString()} to ${event.end.toLocaleTimeString()}`}
      </p>
      {event.location && <p><strong>Location:</strong> {event.location}</p>}
      
      <button 
        onClick={() => setShowNotifyOptions(!showNotifyOptions)}
        style={EventDetailsStyles.notifyButton}
      >
        Notify Me
      </button>
      {showNotifyOptions && (
        <div style={EventDetailsStyles.notifyOptions}>
          {notificationOptions.map((option) => (
            <label key={option.value} style={{ display: 'block' }}>
              <input
                type="checkbox"
                checked={notificationTimes.includes(option.value)}
                onChange={() => handleCheckboxChange(option.value)}
              />
              {option.label}
            </label>
          ))}
          <button 
            onClick={handleConfirmNotifications}
            style={EventDetailsStyles.confirmButton}
          >
            Confirm
          </button>
        </div>
      )}
      
      <button onClick={onClose} style={EventDetailsStyles.closeButton}>
        Close
      </button>
    </div>
  );
};

export default EventDetails;
