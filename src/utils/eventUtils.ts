import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from '@services/firebase';

interface EventQueryParams {
  startDate?: Date;
  endDate?: Date;
  location?: string;
  title?: string;
}

export async function fetchUpcomingEvents(params: EventQueryParams = {}) {
  try {
    const eventsCollection = collection(db, 'events');
    let q = query(eventsCollection);

    if (params.startDate) {
      q = query(q, where('start', '>=', params.startDate));
    }
    if (params.endDate) {
      q = query(q, where('end', '<=', params.endDate));
    }
    if (params.location) {
      q = query(q, where('location', '==', params.location));
    }
    if (params.title) {
      q = query(q, where('title', '==', params.title));
    }

    const eventSnapshot = await getDocs(q);
    const eventsList = eventSnapshot.docs.map(doc => ({
      id: doc.id,
      title: doc.data().title,
      start: doc.data().start.toDate(),
      end: doc.data().end.toDate(),
      location: doc.data().location || 'Location not specified',
    }));
    console.log(eventsList);
    return eventsList;
  } catch (error) {
    console.error("Error fetching events: ", error);
    return [];
  }
}