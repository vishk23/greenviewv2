// /src/components/Calendar/EventDetailsStyles.ts
import { CSSProperties } from 'react';

const EventDetailsStyles: Record<string, CSSProperties> = {
  eventDetails: {
    flex: 1,
    backgroundColor: '#d4edda',
    padding: '20px',
    borderLeft: '4px solid #3a5f3f',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    maxWidth: '300px',
    width: '100%',
    maxHeight: '100%',
    overflow: 'auto',
  },
  notifyButton: {
    marginTop: '10px',
    padding: '10px 20px',
    backgroundColor: '#8bc995',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
  },
  notifyOptions: {
    marginTop: '10px',
    padding: '10px',
    backgroundColor: '#f0f4f8',
    borderRadius: '5px',
  },
  confirmButton: {
    marginTop: '10px',
    padding: '5px 10px',
    backgroundColor: '#3a5f3f',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
  },
  closeButton: {
    backgroundColor: '#8bc995',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    fontSize: '16px',
    alignSelf: 'center',
    marginTop: '20px',
    width: '100%',
    maxWidth: '200px',
  },
};

export default EventDetailsStyles;
