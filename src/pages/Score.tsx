import React from "react";
import NavBar from "@components/NavBar/NavBar";
import Questions from "@features/Questions/Questions";

const App: React.FC = () => {
  return (
    <div>
      <NavBar />
      <Questions />
    </div>
  );
};

export default App;