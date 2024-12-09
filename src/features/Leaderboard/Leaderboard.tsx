import React, { useState, useEffect } from "react";
import { fetchLeaderboardData, LeaderboardEntry } from "./fetchLeaderboardData";
import { motion, AnimatePresence } from "framer-motion";
import "./Leaderboard.css";

const Leaderboard: React.FC = () => {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>(
    []
  );
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLeaderboardData = async () => {
      setLoading(true);
      const data = await fetchLeaderboardData();
      setLeaderboardData(data);
      setLoading(false);
    };

    loadLeaderboardData();
  }, []);

  const displayedData = showAll ? leaderboardData : leaderboardData.slice(0, 5);

  const toggleShowAll = () => {
    setShowAll((prev) => !prev);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <motion.div
      className="leaderboard"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="leaderboard-header">
        <div className="header-item">RANK</div>
        <div className="header-item">NAME</div>
        <div className="header-item">SCORE</div>
        <div className="header-item">STREAK 🔥</div>
      </div>

      <AnimatePresence>
        {displayedData.map((entry, index) => (
          <motion.div
            key={entry.rank}
            className="leaderboard-row"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: showAll ? 0 : index * 0.1 }}
          >
            <div className="row-item rank">#{entry.rank}</div>
            <div className="row-item name">{entry.name}</div>
            <div className="row-item score">{Math.round(entry.score)}</div>
            <div className="row-item streak">{entry.streak}</div>
          </motion.div>
        ))}
      </AnimatePresence>

      <button onClick={toggleShowAll} className="show-more-button">
        {showAll ? "Show Less" : "Show More"}
      </button>
    </motion.div>
  );
};

export default Leaderboard;
