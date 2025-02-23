import React, { useState, useEffect } from 'react';
import { db } from '@services/firebase';
import { doc, updateDoc, setDoc, getDoc, collection, addDoc } from 'firebase/firestore';
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
  const [userDetails, setUserDetails] = useState<{ name: string; phoneNumber: string } | null>(null);
  const [user] = useAuthState(auth);

  const notificationOptions = [
    { label: 'Day of Event', value: 'dayOf' },
    { label: '3 Days Before', value: 'threeDays' },
    { label: '1 Hour Before', value: 'oneHour' },
  ];

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const data = userDocSnap.data();
          setUserDetails({ name: data.displayName, phoneNumber: data.phoneNumber });
        } else {
          console.error('User details not found in Firebase.');
        }
      }
    };
    fetchUserDetails();
  }, [user]);

  const handleCheckboxChange = (value: string) => {
    setNotificationTimes((prev) =>
      prev.includes(value)
        ? prev.filter((option) => option !== value)
        : [...prev, value]
    );
  };

  const calculateNotificationTimes = () => {
    const notifications = notificationTimes.map((time) => {
      const eventStartTime = event.start.getTime();
      switch (time) {
        case 'dayOf':
          return new Date(eventStartTime).toISOString();
        case 'threeDays':
          return new Date(eventStartTime - 3 * 24 * 60 * 60 * 1000).toISOString();
        case 'oneHour':
          return new Date(eventStartTime - 60 * 60 * 1000).toISOString();
        default:
          return null;
      }
    });
    return notifications.filter(Boolean); // Remove null values
  };

  const handleConfirmNotifications = async () => {
    if (!event || !user) {
      console.error('Missing event or user data');
      alert('Unable to save notifications. Please try again.');
      return;
    }

    if (!userDetails?.name || !userDetails?.phoneNumber) {
      console.error('Missing user details:', userDetails);
      alert('Please ensure your profile is complete with name and phone number.');
      return;
    }

    const eventDocRef = doc(db, 'events', event.id);
    const notifDocRef = doc(db, 'calendarnotifs', event.id);
    const calculatedTimes = calculateNotificationTimes();

    try {
      // Update collections (existing code)
      await updateDoc(eventDocRef, {
        [`notifications.${user.uid}`]: {
          preferences: notificationTimes,
          calculatedTimes,
        },
      });

      // Only proceed with notification setup if we have valid user details
      await setDoc(
        notifDocRef,
        {
          [user.uid]: {
            name: userDetails.name,
            phoneNumber: userDetails.phoneNumber,
            preferences: notificationTimes,
            calculatedTimes,
          },
        },
        { merge: true }
      );

      // Add a single immediate confirmation message
      const messagesRef = collection(db, 'messages');
      await addDoc(messagesRef, {
        to: userDetails.phoneNumber,
        body: `Hi ${userDetails.name}, ${event.title} is on ${event.start.toLocaleDateString()}. Stay tuned for updates!`,
      });

      alert('Notification preferences saved!');
    } catch (error) {
      console.error('Error saving notifications:', error);
      alert('There was an error saving your preferences. Please ensure your profile is complete.');
    }
    setShowNotifyOptions(false);
  };

  return (
    <div style={EventDetailsStyles.eventDetails}>
      <h2 style={EventDetailsStyles.eventTitle}>{event.title}</h2>
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
