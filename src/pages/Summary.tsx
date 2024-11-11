import { useState } from "react";
import Sidebar from "@features/Summary/Sidebar";
import Summary from "@features/Summary/Summary";
import Leaderboard from "../features/Leaderboard/Leaderboard";
import "./Summary.css";

const App = () => {
  const [selectedItem, setSelectedItem] = useState("Leaderboard");

  const handleSelectItem = (item: string) => {
    setSelectedItem(item);
  };

  return (
    <div className="container">
      <Sidebar onSelectItem={handleSelectItem} />

      <div
        className={`component-container1  ${
          selectedItem === "Leaderboard" ? "show" : "hide"
        }`}
      >
        <Leaderboard />
      </div>
      <div
        className={`component-container2 ${
          selectedItem === "Summary" ? "show" : "hide"
        }`}
      >
        <Summary />
      </div>
    </div>
  );
};

export default App;
