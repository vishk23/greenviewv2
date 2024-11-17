import React from 'react';
import './ProgressBar.css';

interface ProgressBarProps {
  progress: number; // Progress value between 0 and 100
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  return (
    <div className="progress-wrapper">
      <progress value={progress} max="100"></progress>
      <p>{progress}% completed</p>
    </div>
  );
};

export default ProgressBar;
