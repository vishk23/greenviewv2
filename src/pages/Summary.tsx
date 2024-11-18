import Summary from "@features/Summary/Summary";
import Leaderboard from "../features/Leaderboard/Leaderboard";
import "./Summary.css";

const App = () => {
  return (
    <div className="container">
      <Leaderboard />
      <Summary />
    </div>
  );
};

export default App;
