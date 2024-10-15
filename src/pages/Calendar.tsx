import React from "react";
import NavBar from "@components/NavBar/NavBar";
import CalendarPage from "@features/Calendar/CalendarPage";

const App: React.FC = () => {
  return (
    <div>
      <NavBar />
      <CalendarPage />
    </div>
  );
};

export default App;
