export interface MyEvent {
    title: string;
    allDay?: boolean;
    start: Date;
    end: Date;
    location?: string;
  }
  
  export const events: MyEvent[] = [
    // Event 1: IMAP Fall Workshop
    {
      title: 'IMAP Fall Workshop - Shifting Scales: How investors balance financial, environmental, and social risks',
      allDay: false,
      start: new Date(2024, 9, 18, 8, 0),  // October 18, 2024, 8:00 am
      end: new Date(2024, 9, 18, 13, 0),   // October 18, 2024, 1:00 pm
      location: 'BU Campus',               // Location added
    },
  
    // Event 2: The Price is Wrong Book Talk
    {
      title: 'The Price is Wrong: Why Capitalism Won’t Save the Planet',
      allDay: false,
      start: new Date(2024, 9, 21, 16, 0), // October 21, 2024, 4:00 pm
      end: new Date(2024, 9, 21, 18, 0),   // October 21, 2024, 6:00 pm
      location: 'Boston University Institute for Global Sustainability, 111 Cummington Mall Suite 149, Boston, MA 02215', // Hybrid location
    },
  
    // Event 3: Research on Tap
    {
      title: 'Research on Tap: Climate Change and Clean Energy',
      allDay: false,
      start: new Date(2024, 11, 5, 16, 0), // December 5, 2024, 4:00 pm
      end: new Date(2024, 11, 5, 18, 0),   // December 5, 2024, 6:00 pm
      location: 'Kilachand Center Eichenbaum Colloquium Room, Room 101, 610 Commonwealth Ave, Boston, MA 02215', // Location added
    },
  
    // Global Events Without Specific Times
    {
      title: 'World Environment Day',
      allDay: true,
      start: new Date(2024, 5, 5), // June 5, 2024
      end: new Date(2024, 5, 5),
    },
    {
      title: 'Global Recycling Day',
      allDay: true,
      start: new Date(2024, 2, 18), // March 18, 2024
      end: new Date(2024, 2, 18),
    },
    {
      title: 'World Water Day',
      allDay: true,
      start: new Date(2024, 2, 22), // March 22, 2024
      end: new Date(2024, 2, 22),
    },
    {
      title: 'Earth Day',
      allDay: true,
      start: new Date(2024, 3, 22), // April 22, 2024
      end: new Date(2024, 3, 22),
    },
    {
      title: 'International Compost Week',
      allDay: true,
      start: new Date(2024, 4, 5), // May 5–11, 2024
      end: new Date(2024, 4, 11),
    },
    {
      title: 'World Habitat Day',
      allDay: true,
      start: new Date(2024, 9, 7), // October 7, 2024
      end: new Date(2024, 9, 7),
    },
    {
      title: 'International Astronomy Day',
      allDay: true,
      start: new Date(2024, 9, 12), // October 12, 2024
      end: new Date(2024, 9, 12),
    },
    {
      title: 'World Food Day',
      allDay: true,
      start: new Date(2024, 9, 16), // October 16, 2024
      end: new Date(2024, 9, 16),
    },
    {
      title: 'International Mountain Day',
      allDay: true,
      start: new Date(2024, 11, 11), // December 11, 2024
      end: new Date(2024, 11, 11),
    }, {
      title: 'World Wildlife Day',
      allDay: true,
      start: new Date(2025, 2, 3),  // March 3, 2025
      end: new Date(2025, 2, 3),
    },
    {
      title: 'International Day of Action for Rivers',
      allDay: true,
      start: new Date(2025, 2, 14),  // March 14, 2025
      end: new Date(2025, 2, 14),
    },
    {
      title: 'Global Recycling Day',
      allDay: true,
      start: new Date(2025, 2, 18),  // March 18, 2025
      end: new Date(2025, 2, 18),
    },
    {
      title: 'International Day of Forests',
      allDay: true,
      start: new Date(2025, 2, 21),  // March 21, 2025
      end: new Date(2025, 2, 21),
    },
    {
      title: 'World Wood Day',
      allDay: true,
      start: new Date(2025, 2, 21),  // March 21, 2025
      end: new Date(2025, 2, 21),
    },
    {
      title: 'World Water Day',
      allDay: true,
      start: new Date(2025, 2, 22),  // March 22, 2025
      end: new Date(2025, 2, 22),
    },
    {
      title: 'Earth Hour',
      allDay: true,
      start: new Date(2025, 2, 23),  // March 23, 2025
      end: new Date(2025, 2, 23),
    },
    {
      title: 'Earth Day',
      allDay: true,
      start: new Date(2025, 3, 22),  // April 22, 2025
      end: new Date(2025, 3, 22),
    },
    {
      title: 'Sustainability Festival 2024 - BU Medical Campus',
      allDay: false,
      start: new Date(2024, 8, 11, 11, 0), // September 11, 2024, 11:00 am
      end: new Date(2024, 8, 11, 14, 0),   // September 11, 2024, 2:00 pm
      location: 'Talbot Green, BU Medical Campus',
    },
    {
      title: 'Sustainability Festival 2024 - Charles River Campus',
      allDay: false,
      start: new Date(2024, 8, 18, 11, 0), // September 18, 2024, 11:00 am
      end: new Date(2024, 8, 18, 14, 0),   // September 18, 2024, 2:00 pm
      location: 'George Sherman Union Plaza, Charles River Campus',
    },
  
  ];