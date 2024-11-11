import React, { useState } from 'react';
import YearSwiper from './YearSwiper';
import AnimationDisplay from './AnimationDisplay';
import './Animation.css';

const AnimationFrame = () => {
  const [currentYear, setCurrentYear] = useState(1);
  const [selectedVisual, setSelectedVisual] = useState(1); // Track the selected visual

  const handleYearChange = (year: number) => {
    setCurrentYear(year);
  };

  const handleVisualChange = (visualNumber: number) => {
    setSelectedVisual(visualNumber);
  };

  return (
    <div className="container">
      <header className="navbar">
        <div className="navLinks">
          <span onClick={() => handleVisualChange(1)} className={selectedVisual === 1 ? 'activeVisual' : ''}>MY VISUAL</span>
          <span onClick={() => handleVisualChange(2)} className={selectedVisual === 2 ? 'activeVisual' : ''}>VISUAL 2</span>
          <span onClick={() => handleVisualChange(3)} className={selectedVisual === 3 ? 'activeVisual' : ''}>VISUAL 3</span>
        </div>
      </header>
      <main className="mainContent">
        {selectedVisual === 1 && <AnimationDisplay year={currentYear} />}
        {selectedVisual === 2 && <div className="visualContainer">Visual 2 Content</div>}
        {selectedVisual === 3 && <div className="visualContainer">Visual 3 Content</div>}
        <YearSwiper onYearChange={handleYearChange} />
      </main>
      <footer className="footer">
        <button className="questionnaireButton">Button for Questionnaire</button>
      </footer>
    </div>
  );
};

export default AnimationFrame;