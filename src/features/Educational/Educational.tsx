import React from 'react';
import './Educational.css';

const Educational: React.FC = () => {
  return (
    <div className="educational-page">
      <header className="header">
        <h1>Educational Resources</h1>
        <p>Learn more about sustainability and how you can make a difference.</p>
      </header>

      <section className="resources-section">
        <h2>Top Resources</h2>
        <div className="resources-grid">
          {/* Example of resource cards */}
          <div className="resource-card">
            <h3>Article Title</h3>
            <p>Brief description of the article or resource...</p>
            <a href="/" target="_blank" rel="noopener noreferrer">Read More</a>
          </div>
          <div className="resource-card">
            <h3>Video Title</h3>
            <p>Brief description of the video...</p>
            <a href="/" target="_blank" rel="noopener noreferrer">Watch Now</a>
          </div>
        </div>
      </section>

      <section className="learning-modules-section">
        <h2>Learning Modules</h2>
        <p>Interactive lessons to deepen your knowledge.</p>
        <div className="modules-grid">
          <div className="module-card">
            <h3>Module 1: Introduction to Sustainability</h3>
            <button>Start Module</button>
          </div>
          <div className="module-card">
            <h3>Module 2: Reducing Carbon Footprint</h3>
            <button>Start Module</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Educational;
