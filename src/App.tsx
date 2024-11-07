import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Calendar from "./pages/Calendar";
import Score from "./pages/Score";
import Main from "./pages/Main";
import Summary from "./pages/Summary";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/main" element={<Main />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/home" element={<Home />} />
        <Route path="/score" element={<Score />} />
        <Route path="/summary" element={<Summary />} />
      </Routes>
    </>
  );
};

export default App;
