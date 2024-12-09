import { CSSProperties } from "react";

const EventDetailsStyles: Record<string, CSSProperties> = {
  eventDetails: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    padding: '20px',
    color: '#FFF8EB',
    backgroundColor: '#9FC37B',
    borderRadius: '8px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
  },
  eventTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  notifyButton: {
    marginTop: '15px',
    padding: '10px 15px',
    backgroundColor: '#6E9B56',
    color: 'white',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer',
  },
  notifyOptions: {
    marginTop: '10px',
    padding: '10px',
    backgroundColor: '#FFF8EB',
    borderRadius: '5px',
    color: '#000000',
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
    padding: '10px 15px',
    borderRadius: '5px',
    fontSize: '16px',
    marginTop: '20px',
    width: 'auto',
    alignSelf: 'center',
  },
};

export default EventDetailsStyles;
