import { Routes, Route } from "react-router-dom";
import NavBar from "@components/NavBar/NavBar";
import Chatbot from "@components/Chatbot/Chatbot";
import Calendar from "./pages/Calendar";
import Score from "./pages/Score";
import Main from "./pages/Home";
import Summary from "./pages/Summary";
import Leaderboard from "./features/Leaderboard/Leaderboard";
import Educational from "./pages/Educational";
import Profile from "./pages/Profile";
const App = () => {
  return (
    <>
      <NavBar />
      <Chatbot />
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/home" element={<Main />} />
        <Route path="/score" element={<Score />} />
        <Route path="/summary" element={<Summary />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/educational" element={<Educational />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </>
  );
};

export default App;
