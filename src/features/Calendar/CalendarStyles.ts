import { CSSProperties } from 'react';

const CalendarStyles: Record<string, CSSProperties> = {
  pageContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    // padding: '20px',
    backgroundColor: '#FFF8EB',
    width: '100%',
  },
  header: {
    marginBottom: '20px',
  },
  headerText: {
    fontSize: '48px',
    fontWeight: 'bold',
    color: '#9FC37B',
    margin: '0',
  },
  container: {
    display: 'flex',
    alignItems: 'stretch',
    height: '80vh',
    maxWidth: '1200px',
    width: '100%',
    gap: '20px',
    margin: '0 auto',
    marginBottom: '100px'
  },  
  
  calendarContainer: {
    flex: 2,
    minWidth: '700px',
    width: '100%',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#FFF',
    borderRadius: '8px',
  },
  eventDetailsContainer: {
    flex: 1,
    maxWidth: '350px',
    padding: '20px',
    backgroundColor: '#9FC37B',
    color: '#FFF8EB',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    marginTop: '20px',
  },
  button: {
    padding: '12px 24px',
    backgroundColor: '#9FC37B',
    color: '#FFF8EB',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  footer: {
    marginTop: '20px',
    width: '100%',
    textAlign: 'center',
  },
};

export default CalendarStyles;
