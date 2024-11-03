import React from "react";
import NavBar from "@components/NavBar/NavBar";
import Main from "@features/Main/Main";

const App: React.FC = () => {
  return (
    <div>
      <NavBar />
      <Main />
    </div>
  );
};

export default App;