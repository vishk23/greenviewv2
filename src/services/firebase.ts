/* eslint-disable @typescript-eslint/no-unused-vars */
// /src/services/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

import { collection, getDocs, query, where } from "firebase/firestore";


import { getVertexAI, getGenerativeModel, Schema, SchemaType, FunctionDeclarationsTool, ObjectSchemaInterface } from "firebase/vertexai";

const firebaseConfig = {
  apiKey: "AIzaSyA76-eQ_ty741J84AZUJRVeQ-WF2xiPXbk",
  authDomain: "greenviewv2.firebaseapp.com",
  projectId: "greenviewv2",
  storageBucket: "greenviewv2.appspot.com",
  messagingSenderId: "531785495551",
  appId: "1:531785495551:web:08ab7fd8c889a7271badca",
  measurementId: "G-N94JNCJXMB"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      getAnalytics(app);
    }
  });
}
export const db = getFirestore(app);
// Initialize the Vertex AI service
const vertexAI = getVertexAI(app);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface EventQueryParams {
  startDate?: Date;
  endDate?: Date;
  location?: string;
  title?: string;
}

export async function fetchEvents() {
  try {
    const eventsCollection = collection(db, 'events');
    const eventSnapshot = await getDocs(eventsCollection);
    const eventsList = eventSnapshot.docs.map(doc => ({
      id: doc.id,
      title: doc.data().title,
      start: doc.data().start.toDate(),
      end: doc.data().end.toDate(),
      location: doc.data().location || 'Location not specified',
    }));
    console.log('Fetched all events:', eventsList);
    const eventsSummary = eventsList.map(event =>
      `Title: ${event.title}, Start: ${event.start}, End: ${event.end}, Location: ${event.location}`
    ).join('\n');
    return eventsSummary;
  } catch (error) {
    console.error("Error fetching events: ", error);
    return [];
  }
}

const fetchEventsTool: FunctionDeclarationsTool = {
  functionDeclarations: [
    {
      name: "fetchEvents",
      description: "Fetch all upcoming sustainability events from the calendar", // Minimal schema with no properties
    },
  ],
};

// Initialize the generative model with system instructions
export const model = getGenerativeModel(vertexAI, {
  model: "gemini-1.5-flash",
  // tools: [fetchEventsTool], // Uncomment this line if you want to use tools
  
  systemInstruction: `you do not need to know the date range to look for events. You are a sustainability expert chatbot designed to help students adopt more sustainable practices.you do NOT need a date range to check the calendar for events. Provide advice and tips on sustainability in a friendly and informative manner. Here are the susatainability events on the calendar, if the user asks for the events you can list them all:
  
  - Event: Earth Day
    - Start: 2025-04-22T04:00:00.000Z
    - End: 2025-04-22T04:00:00.000Z
    - Location: Location not specified
  
  - Event: World Water Day
    - Start: 2025-03-22T04:00:00.000Z
    - End: 2025-03-22T04:00:00.000Z
    - Location: Location not specified

  - Event: Sustainability Festival 2024 - BU Medical Campus
    - Start: 2024-09-11T15:00:00.000Z
    - End: 2024-09-11T18:00:00.000Z
    - Location: Talbot Green, BU Medical Campus

  - Event: World Environment Day
    - Start: 2024-06-05T04:00:00.000Z
    - End: 2024-06-05T04:00:00.000Z
    - Location: Location not specified

  - Event: International Day of Forests
    - Start: 2025-03-21T04:00:00.000Z
    - End: 2025-03-21T04:00:00.000Z
    - Location: Location not specified

  - Event: Earth Hour
    - Start: 2025-03-23T04:00:00.000Z
    - End: 2025-03-23T04:00:00.000Z
    - Location: Location not specified
  
  `
});
