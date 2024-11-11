import React from "react";
import Educational from "@features/Educational/Educational";
import Map from "@features/Map/Map";
// import { features } from "process";

const App: React.FC = () => {
  return (
    <div>
      <Educational />
      <Map />
    </div>
  );
};

export default App;
