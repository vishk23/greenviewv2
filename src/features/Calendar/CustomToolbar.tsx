import React from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomToolbar = (toolbar: any) => {
  const goToBack = () => {
    toolbar.onNavigate('PREV');
  };

  const goToNext = () => {
    toolbar.onNavigate('NEXT');
  };

  const goToToday = () => {
    toolbar.onNavigate('TODAY');
  };

  const label = () => {
    const date = new Date(toolbar.date);
    const month = date.toLocaleString('en-US', { month: 'long' });
    const year = date.getFullYear();
    return `${month} ${year}`;
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', backgroundColor: '#c2d6c1', color: '#3a5f3f' }}>
      <span style={{ fontSize: '18px', fontWeight: 'bold' }}>
        {label()}
      </span>


      <div>
        <button onClick={goToBack} style={{ marginRight: '10px', padding: '5px 10px', backgroundColor: '#8bc995', color: 'white', borderRadius: '4px', border: 'none' }}>
          Back
        </button>
        <button onClick={goToToday} style={{ marginRight: '10px', padding: '5px 10px', backgroundColor: '#8bc995', color: 'white', borderRadius: '4px', border: 'none' }}>
          Today
        </button>
        <button onClick={goToNext} style={{ padding: '5px 10px', backgroundColor: '#8bc995', color: 'white', borderRadius: '4px', border: 'none' }}>
          Next
        </button>
      </div>
    </div>
  );
};

export default CustomToolbar;
