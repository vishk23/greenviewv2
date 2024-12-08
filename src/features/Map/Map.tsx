import React from "react";
import './Map.css';

const Map: React.FC = () => {
  return (
    <div className="map-container">
      <div className="map-frame">
        <iframe
          src="https://www.google.com/maps/d/u/2/embed?mid=1U1my31NeiARU4yofiQxAncflkKFuV1c&ehbc=2E312F&noprof=1"
          title="Campus Water Bottle Refill Stations"
          style={{
            border: 'none',
            borderRadius: '12px',
          }}
        ></iframe>
      </div>
    </div>
  );
};

export default Map;
