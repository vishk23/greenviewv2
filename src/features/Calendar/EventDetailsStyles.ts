// /src/components/Calendar/EventDetailsStyles.ts
import { CSSProperties } from 'react';

const EventDetailsStyles: Record<string, CSSProperties> = {
  eventDetails: {
    margin: '5px 0px',
    color: '#FFF8EB',
    flex: 1,
    backgroundColor: '#9FC37B',
    padding: '20px',
    border: '4px solid #9FC37B',
    borderTopRightRadius: '4px',
    borderBottomRightRadius: '4px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    maxWidth: '400px',
    width: '100%',
    maxHeight: '100%',
    overflow: 'auto',
  },
  notifyButton: {
    marginTop: '10px',
    padding: '10px 20px',
    backgroundColor: '#6E9B56',
    color: 'white',
    border: '#000000',
    borderRadius: '5px',
    fontSize: '16px',
  },
  notifyOptions: {
    marginTop: '10px',
    padding: '10px',
    backgroundColor: '#FFF8EB',
    borderRadius: '5px',
  },
  confirmButton: {
    marginTop: '10px',
    padding: '5px 10px',
    backgroundColor: '#6E9B56',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
  },
  closeButton: {
    backgroundColor: '#6E9B56',
    color: '#FFF8EB',
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
