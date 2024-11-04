import React, { useState } from "react";
import NavBar from "@components/NavBar/NavBar";
import Chatbot from "@components/Chatbot/Chatbot";
import Questions from "@features/Questions/Questions";
import Animation from "../features/Questions/Animation";

const source = [
  "/assets/smoke.gif",
  "/assets/trash1.png",
  "/assets/trash2.png",
  "/assets/trash3.png",
  "/assets/trash4.png",
  "/assets/trash5.png",
  "/assets/trash6.png",
  "/assets/trash7.png",
  "/assets/trash1.png",
  "/assets/trash2.png",
];

const App: React.FC = () => {
  const [objects, setObjects] = useState<
    { id: number; group: number; x: number; y: number; path: string }[]
  >([]);

  const spawnObject = (group: number) => {
    const min = (window.innerHeight / 6) * 5;
    const max = (window.innerHeight / 5) * 3;
    const count = Math.floor(Math.random() * 20) + 15;

    if (group === 1) {
      setObjects((prevObjects) => [
        ...prevObjects,
        {
          id: prevObjects.length + 1,
          group: group,
          x: 0,
          y: -window.innerHeight / 2,
          path: source[group - 1],
        },
      ]);
    } else {
      setObjects((prevObjects) => [
        ...prevObjects,
        ...Array.from({ length: count }, (_, index) => ({
          id: prevObjects.length + index + 1,
          group: group,
          x: Math.floor(Math.random() * -500) - 200,
          y: Math.random() * (max - min) + min,
          path: source[group - 1],
        })),
      ]);
    }
    console.log(objects);
  };

  return (
    <div>
      <NavBar />
      <div style={{ position: "relative" }}>
        <Animation objects={objects} />
        <Questions spawnObject={spawnObject} />
      </div>
      <Chatbot />
    </div>
  );
};

export default App;
