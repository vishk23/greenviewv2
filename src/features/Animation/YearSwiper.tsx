import React, { useState } from 'react';
import './Animation.css'; 

interface YearSwiperProps {
  onYearChange: (year: number) => void;
}

const YearSwiper: React.FC<YearSwiperProps> = ({ onYearChange }) => {
  const [selectedYear, setSelectedYear] = useState(1);

  const handleYearChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const year = parseInt(event.target.value, 10);
    setSelectedYear(year);
    onYearChange(year);
  };

  return (
    <div className="yearSwiper">
      <input
        type="range"
        min="1"
        max="20"
        value={selectedYear}
        onChange={handleYearChange}
        className="slider"
      />
      <div className="yearLabel">Year: {selectedYear}</div>
    </div>
  );
};

export default YearSwiper;
