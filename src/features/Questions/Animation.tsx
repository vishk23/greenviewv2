import React, { useEffect, useState } from "react";
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
  // State to handle dynamic screen width
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  // Update screen width on window resize
  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="animation-container">
      {objects.map((obj, index) =>
        obj.group === 1 ? (
          <motion.div
            key={obj.id} // Added missing key prop
            initial={{
              x: obj.x,
              y: obj.y,
              clipPath: "inset(100% 0% 0% 0%)",
              opacity: 1,
            }}
            animate={{
              clipPath: "inset(0% 0% 0% 0%)",
              opacity: 1,
            }}
            transition={{ duration: 5, ease: "easeOut" }}
            style={{ position: "absolute", top: obj.y }}
          >
            <img
              src={obj.path}
              alt=""
              style={{ width: "700px", height: "auto" }}
            />
          </motion.div>
        ) : (
          <motion.div
            key={obj.id}
            initial={{ x: obj.x, y: obj.y }}
            animate={{
              x: screenWidth + 200,
              y: obj.oscillation,
            }}
            transition={{
              duration: obj.duration,
              ease: "linear",
              repeat: Infinity,
              repeatType: "loop",
              times: obj.times,
            }}
            style={{ position: "absolute", top: obj.y }}
          >
            <motion.img
              src={obj.path}
              alt=""
              style={{ width: 100, height: 100 }}
              initial={{ rotate: 0 }}
              animate={{ rotate: [-15, 15, -15] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        )
      )}
    </div>
  );
};

export default Animation;
