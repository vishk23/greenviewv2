import React, { useState, useEffect } from 'react';
import { fetchLeaderboardData, LeaderboardEntry } from './fetchLeaderboardData';
import './Leaderboard.css';

const Leaderboard: React.FC = () => {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
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
    return <div>Loading...</div>; // You can style this or use a spinner component
  }

  return (
    <div className="leaderboard">
      <div className="leaderboard-header">
        <div className="header-item">RANK</div>
        <div className="header-item">NAME</div>
        <div className="header-item">SCORE</div>
        <div className="header-item">BADGE/TIER</div>
      </div>
      {displayedData.map((entry) => (
        <div key={entry.rank} className="leaderboard-row">
          <div className="row-item rank">#{entry.rank}</div>
          <div className="row-item name">{entry.name}</div>
          <div className="row-item score">{entry.score}</div>
          <div className="row-item badge">{entry.badge}</div>
        </div>
      ))}
      <button onClick={toggleShowAll} className="show-more-button">
        {showAll ? "Show Less" : "Show More"}
      </button>
    </div>
  );
};

export default Leaderboard;
