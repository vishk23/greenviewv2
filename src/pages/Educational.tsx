import React from "react";
import NavBar from "@components/NavBar/NavBar";
import Educational from "@features/Educational/Educational";
const App: React.FC = () => {
  return (
    <div>
      <NavBar />
      <Educational />
    </div>
  );
};

export default App;