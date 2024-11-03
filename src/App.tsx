import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Calendar from "./pages/Calendar";
import Score from "./pages/Score";
import Chat from "./pages/Chat";
import Main from "./pages/Main";


const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/main" element={<Main />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/home" element={<Home />} />
        <Route path="/score" element={<Score />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </>
  );
};

export default App;
