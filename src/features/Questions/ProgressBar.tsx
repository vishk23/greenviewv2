import React from 'react';
import './ProgressBar.css';

interface ProgressBarProps {
  points: number; // the score from 0 to 100
}

const ProgressBar: React.FC<ProgressBarProps> = ({ points }) => {
  const progressPercentage = Math.min(points, 100); // Ensures it does not exceed 100

  return (
    <div className="progress-bar-container">
      <div
        className="progress-bar"
        style={{
          width: `${progressPercentage}%`,
        }}
      ></div>
      <p>{points}/100 points</p>
    </div>
  );
};

export default ProgressBar;
