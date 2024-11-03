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
          background: `linear-gradient(to right,  #f2745f, #9fc37b)`, // Green to Red gradient
        }}
      ></div>
      <p>{points}/100 points</p>
    </div>
  );
};

export default ProgressBar;
