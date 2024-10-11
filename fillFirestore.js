// fillFirestore.js
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const events = [
  {
    title: 'IMAP Fall Workshop - Shifting Scales: How investors balance financial, environmental, and social risks',
    allDay: false,
    start: new Date(2024, 9, 18, 8, 0),
    end: new Date(2024, 9, 18, 13, 0),
    location: 'BU Campus',
  },
  {
    title: 'The Price is Wrong: Why Capitalism Won’t Save the Planet',
    allDay: false,
    start: new Date(2024, 9, 21, 16, 0),
    end: new Date(2024, 9, 21, 18, 0),
    location: 'Boston University Institute for Global Sustainability, 111 Cummington Mall Suite 149, Boston, MA 02215',
  },
  {
    title: 'Research on Tap: Climate Change and Clean Energy',
    allDay: false,
    start: new Date(2024, 11, 5, 16, 0),
    end: new Date(2024, 11, 5, 18, 0),
    location: 'Kilachand Center Eichenbaum Colloquium Room, Room 101, 610 Commonwealth Ave, Boston, MA 02215',
  },
  {
    title: 'World Environment Day',
    allDay: true,
    start: new Date(2024, 5, 5),
    end: new Date(2024, 5, 5),
  },
  {
    title: 'Global Recycling Day',
    allDay: true,
    start: new Date(2024, 2, 18),
    end: new Date(2024, 2, 18),
  },
  {
    title: 'World Water Day',
    allDay: true,
    start: new Date(2024, 2, 22),
    end: new Date(2024, 2, 22),
  },
  {
    title: 'Earth Day',
    allDay: true,
    start: new Date(2024, 3, 22),
    end: new Date(2024, 3, 22),
  },
  {
    title: 'International Compost Week',
    allDay: true,
    start: new Date(2024, 4, 5),
    end: new Date(2024, 4, 11),
  },
  {
    title: 'World Habitat Day',
    allDay: true,
    start: new Date(2024, 9, 7),
    end: new Date(2024, 9, 7),
  },
  {
    title: 'International Astronomy Day',
    allDay: true,
    start: new Date(2024, 9, 12),
    end: new Date(2024, 9, 12),
  },
  {
    title: 'World Food Day',
    allDay: true,
    start: new Date(2024, 9, 16),
    end: new Date(2024, 9, 16),
  },
  {
    title: 'International Mountain Day',
    allDay: true,
    start: new Date(2024, 11, 11),
    end: new Date(2024, 11, 11),
  },
  {
    title: 'World Wildlife Day',
    allDay: true,
    start: new Date(2025, 2, 3),
    end: new Date(2025, 2, 3),
  },
  {
    title: 'International Day of Action for Rivers',
    allDay: true,
    start: new Date(2025, 2, 14),
    end: new Date(2025, 2, 14),
  },
  {
    title: 'Global Recycling Day',
    allDay: true,
    start: new Date(2025, 2, 18),
    end: new Date(2025, 2, 18),
  },
  {
    title: 'International Day of Forests',
    allDay: true,
    start: new Date(2025, 2, 21),
    end: new Date(2025, 2, 21),
  },
  {
    title: 'World Wood Day',
    allDay: true,
    start: new Date(2025, 2, 21),
    end: new Date(2025, 2, 21),
  },
  {
    title: 'World Water Day',
    allDay: true,
    start: new Date(2025, 2, 22),
    end: new Date(2025, 2, 22),
  },
  {
    title: 'Earth Hour',
    allDay: true,
    start: new Date(2025, 2, 23),
    end: new Date(2025, 2, 23),
  },
  {
    title: 'Earth Day',
    allDay: true,
    start: new Date(2025, 3, 22),
    end: new Date(2025, 3, 22),
  },
  {
    title: 'Sustainability Festival 2024 - BU Medical Campus',
    allDay: false,
    start: new Date(2024, 8, 11, 11, 0),
    end: new Date(2024, 8, 11, 14, 0),
    location: 'Talbot Green, BU Medical Campus',
  },
  {
    title: 'Sustainability Festival 2024 - Charles River Campus',
    allDay: false,
    start: new Date(2024, 8, 18, 11, 0),
    end: new Date(2024, 8, 18, 14, 0),
    location: 'George Sherman Union Plaza, Charles River Campus',
  },
];


async function addEvents() {
  const eventsCollection = db.collection('events');
  for (const event of events) {
    await eventsCollection.add({
      ...event,
      start: admin.firestore.Timestamp.fromDate(event.start),
      end: admin.firestore.Timestamp.fromDate(event.end),
    });
    console.log(`Added event: ${event.title}`);
  }
  console.log("All events have been added.");
}

addEvents().catch((error) => {
  console.error("Error adding events: ", error);
});
