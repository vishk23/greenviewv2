import React from "react";

const Map: React.FC = () => {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      marginTop: '20px' 
    }}>
      <div style={{ 
        border: '4px solid green', 
        borderRadius: '16px', 
        padding: '0px'
      }}>
        <iframe 
          src="https://www.google.com/maps/d/u/2/embed?mid=1U1my31NeiARU4yofiQxAncflkKFuV1c&ehbc=2E312F&noprof=1" 
          width="1000"  
          height="720" 
          title="Campus Water Bottle Refill Stations"
          style={{ 
            border: 'none', 
            borderRadius: '8px'
          }}
        ></iframe>
      </div>
    </div>
  );
};

export default Map;
 