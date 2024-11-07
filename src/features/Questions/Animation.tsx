import React from "react";
import { motion } from "framer-motion";
import "./Animation.css";

interface AnimationProps {
  objects: {
    id: number;
    group: number;
    x: number;
    y: number;
    path: string;
    duration: number;
    times: number[];
    oscillation: number[];
  }[];
}

const Animation: React.FC<AnimationProps> = ({ objects }) => {
  const screenWidth = window.innerWidth;

  return (
    <div className="animation-container">
      {objects.map((obj, index) =>
        obj.group === 1 ? (
          <motion.div
            initial={{
              x: obj.x,
              y: obj.y,
              clipPath: "inset(100% 0% 0% 0%)",
              opacity: 1,
            }} // Start with clipping the entire image
            animate={{ clipPath: "inset(0% 0% 0% 0%)", opacity: 1 }}
            transition={{ duration: 5, ease: "easeOut" }}
          >
            <img
              src={obj.path}
              alt=""
              style={{ width: "700px", height: "auto" }} // Set width to fill the container
            />
          </motion.div>
        ) : (
          <motion.div
            key={index}
            initial={{ x: obj.x, y: obj.y }} // Start from left off-screen
            animate={{
              x: screenWidth - obj.x + 200, // Move to right off-screen
              y: obj.oscillation, // Oscillate up and down
            }}
            transition={{
              duration: obj.duration, // Adjust the speed of movement
              ease: "linear", // Linear movement for smooth constant speed
              repeat: Infinity,
              repeatType: "loop",
              times: obj.times, // Specify times for oscillation
            }}
            style={{ position: "absolute", top: obj.y }} // You can adjust this based on your design
          >
            <motion.img
              src={obj.path}
              style={{ width: 100, height: 100 }}
              initial={{ rotate: 0 }}
              animate={{ rotate: [-15, 15, -15] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeIn" }}
            />
          </motion.div>
        )
      )}
    </div>
  );
};

export default Animation;
