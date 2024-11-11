import React from 'react';
import { useNavigate } from 'react-router-dom';
import Map from '@features/Map/Map';
import './Educational.css';

const Educational: React.FC = () => {
  const navigate = useNavigate();

  const modules = [
    { id: '1', title: 'Sustainability Basics', description: 'Learn the fundamentals of sustainability and its importance.' },
    { id: '2', title: 'Energy Conservation', description: 'Discover ways to reduce energy consumption in daily life.' },
    { id: '3', title: 'Waste Reduction', description: 'Explore strategies to minimize waste and recycle effectively.' },
  ];

  const handleModuleClick = (moduleId: string) => {
    navigate(`/module/${moduleId}`);
  };

  return (
    <div className="educational-page">
      <header className="educational-header">
        <h1>Educational Resources</h1>
        <p>Explore interactive modules to enhance your sustainability knowledge.</p>
      </header>

      <section className="learning-modules-section">
        <h2>Learning Modules</h2>
        <div className="modules-grid">
          {modules.map((module) => (
            <div
              key={module.id}
              className="module-card"
              onClick={() => handleModuleClick(module.id)} // Handle click to navigate
            >
              <h3>{module.title}</h3>
              <p>{module.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="map-section">
        <h2>Have your own water bottle but don't know where to refill it?</h2>
        <p>Use the map below to explore BU's refill stations!</p>
        <div className="map-container">
          <Map />
        </div>
      </section>
    </div>
  );
};

export default Educational;

