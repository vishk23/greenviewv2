import { Routes, Route } from "react-router-dom";
import Calendar from "./pages/Calendar";
import Score from "./pages/Score";
import Main from "./pages/Home";
import Summary from "./pages/Summary";
import Leaderboard from "./features/Leaderboard/Leaderboard";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/home" element={<Main />} />
        <Route path="/score" element={<Score />} />
        <Route path="/summary" element={<Summary />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Routes>
    </>
  );
};

export default App;
