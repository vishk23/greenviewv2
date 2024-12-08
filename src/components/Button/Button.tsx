import React from 'react';
import './Button.css'; // Import your CSS file for styling

interface AnswerButtonProps {
  text: string; // Text to display on the button
  onClick: () => void; // Function to handle click event
  isSelected?: boolean; // Optional prop to indicate if the button is selected
  disabled?: boolean; // Optional prop to disable the button
  className?: string; // Add this line
}

const AnswerButton: React.FC<AnswerButtonProps> = ({ text, onClick, isSelected = false, disabled = false }) => {
  return (
    <button
      className={`answer-button ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
};

export default AnswerButton;
