// Events.tsx
export interface MyEvent {
    id: string;
    title: string;
    start: Date;
    end: Date;
    allDay?: boolean;
    location?: string;
    notifications?: Record<string, { email: string; preferences: string[] }>;
  }
  