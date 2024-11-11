import { Routes, Route } from "react-router-dom";
import NavBar from "@components/NavBar/NavBar";
import Chatbot from "@components/Chatbot/Chatbot";
import Calendar from "./pages/Calendar";
import Score from "./pages/Score";
import Main from "./pages/Home";
import Summary from "./pages/Summary";
import Leaderboard from "./features/Leaderboard/Leaderboard";
import Educational from "./pages/Educational";
import SustainabilityBasicsModule from '@features/Educational/SustainabilityBasicsModule';
import Profile from "./pages/Profile";
import { ChatProvider } from "./contexts/ChatContext"; // Import ChatProvider

const App = () => {
  return (
    <ChatProvider> {/* Wrap everything in ChatProvider */}
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
        <Route path="/module/1" element={<SustainabilityBasicsModule />} />
        <Route path="/profile" element={<Profile />} />

      </Routes>
    </ChatProvider>
  );
};

export default App;
