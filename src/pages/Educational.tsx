import React from "react";
import NavBar from "@components/NavBar/NavBar";
import Educational from "@features/Educational/Educational";
import Map from "@features/Map/Map"
import { features } from "process";

const App: React.FC = () => {
  return (
    <div>
      <NavBar />
      <Educational />
      <Map />
    </div>
  );
};

export default App;
