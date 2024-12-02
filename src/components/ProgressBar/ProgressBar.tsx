import React from 'react';
import './ProgressBar.css';

interface ProgressBarProps {
  points: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ points }) => {
  return (
    <div className="progress-bar-container">
      <div 
        className="progress-bar" 
        style={{ width: `${points}%` }}
      />
    </div>
  );
};

export default ProgressBar;
