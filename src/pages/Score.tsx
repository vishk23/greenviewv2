import React, { useState } from "react";
import Questions from "@features/Questions/Questions";
import Animation from "@features/Questions/Animation";

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
    {
      id: number;
      group: number;
      x: number;
      y: number;
      path: string;
      duration: number;
      times: number[];
      oscillation: number[];
    }[]
  >([]);

  const spawnObject = (group: number) => {
    const min = (window.innerHeight / 6) * 5;
    const max = (window.innerHeight / 5) * 3;

    const timesOptions = [
      [0, 0.25, 0.5, 0.75, 1],
      [0, 0.5, 1, 1.5, 2],
      [0, 0.75, 1.5, 2.25, 3],
    ];

    const oscillationOptions = [
      [0, -100, 0, 100, 0],
      [0, 100, 0, -100, 0],
      [0, 50, 0, -50, 0],
      [0, 50, 0, -50, 0],
      [0, 75, 0, -75, 0],
      [0, -75, 0, 75, 0],
    ];

    function getRandomCount(): number {
      return Math.floor(Math.random() * 5) + 5;
    }

    function getRandomDuration(): number {
      return Math.random() * (20 - 7 + 1) + 7;
    }

    const getRandomTimes = () => {
      return timesOptions[Math.floor(Math.random() * timesOptions.length)];
    };

    const getRandomOscillation = () => {
      return oscillationOptions[
        Math.floor(Math.random() * oscillationOptions.length)
      ];
    };

    if (group === 1) {
      setObjects((prevObjects) => [
        ...prevObjects,
        {
          id: prevObjects.length + 1,
          group: group,
          x: window.innerWidth / 2,
          y: 0,
          path: source[group - 1],
          duration: getRandomDuration(),
          times: getRandomTimes(),
          oscillation: getRandomOscillation(),
        },
      ]);
    } else {
      setObjects((prevObjects) => [
        ...prevObjects,
        ...Array.from({ length: getRandomCount() }, (_, index) => ({
          id: prevObjects.length + index + 1,
          group: group,
          x: Math.floor(Math.random() * -500) - 200,
          y: Math.random() * (max - min) + min,
          path: source[group - 1],
          duration: getRandomDuration(),
          times: getRandomTimes(),
          oscillation: getRandomOscillation(),
        })),
      ]);
    }
    console.log(objects);
  };

  return (
    <div>
      <div style={{ position: "relative" }}>
        <Animation objects={objects} />
        <Questions spawnObject={spawnObject} />
      </div>
    </div>
  );
};

export default App;
