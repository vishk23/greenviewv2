import React from 'react';
import './ProgressBar.css';

interface ProgressBarProps {
  points: number; // The score from 0 to 100
}

const ProgressBar: React.FC<ProgressBarProps> = ({ points }) => {
  const normalizedPoints = Math.min(Math.max(points, 0), 100); // Clamp between 0 and 100
  const circleRadius = 45;
  const circumference = 2 * Math.PI * circleRadius;
  const offset = circumference - (normalizedPoints / 100) * circumference;

  return (
    <div className="progress-bar-container">
      <svg width="120" height="120" className="circular-progress">
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="red" />
            <stop offset="100%" stopColor="green" />
          </linearGradient>
        </defs>
        <circle
          className="background-circle"
          cx="60"
          cy="60"
          r={circleRadius}
          strokeWidth="10"
        />
        <circle
          className="progress-circle"
          cx="60"
          cy="60"
          r={circleRadius}
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <p className="points-text">{normalizedPoints}/100 points</p>
    </div>
  );
};

export default ProgressBar;
