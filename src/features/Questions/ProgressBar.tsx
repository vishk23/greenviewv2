import React from 'react';
import './Consolidated.css';

interface ProgressBarProps {
  points: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ points }) => {
  const progressPercentage = Math.min(points, 100);

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
