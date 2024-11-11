import React, { useEffect, useState } from 'react';
import './Animation.css';

interface AnimationDisplayProps {
  year: number;
}

const AnimationDisplay: React.FC<AnimationDisplayProps> = ({ year }) => {
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    
    setAnimatedValue(year * 10);
  }, [year]);

  return (
    <div className="visualContainer">
      <h2 className="animatedNumber">Value: {animatedValue}</h2>
    </div>
  );
};

export default AnimationDisplay;
