// /src/components/Calendar/CalendarStyles.ts
import { CSSProperties } from 'react';

const CalendarStyles: Record<string, CSSProperties> = {
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    height: '80vh',
    margin: '50px auto',
    maxWidth: '900px',
    width: '100%',
  },
  calendarContainer: {
    flex: 3,
    height: '100%',
    minWidth: '700px',
    width: '100%',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    position: 'relative',
    bottom: '20px',
    width: '100%',
  },
  button: {
    width: '750px',
    padding: '10px 20px',
    backgroundColor: '#8bc995',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    textAlign: 'center',
    margin: '64px auto',
  },
  header: {
    marginBottom: '20px',
  },
  headerText: {
    fontSize: '48px',
    fontWeight: 'bold',
    color: '#3a5f3f',
    margin: '0',
  },
  pageContainer: {
    display: 'flex',
    flexDirection: 'column' as const, // explicitly setting 'column'
    alignItems: 'flex-start',
    padding: '20px',
  },
};

export default CalendarStyles;
