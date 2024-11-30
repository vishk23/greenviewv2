import React from 'react';
import { useNavigate } from 'react-router-dom';
import Map from '@features/Map/Map';
import './Educational.css';

const Educational: React.FC = () => {
  const navigate = useNavigate();
  

  const modules = [
    { 
      id: '1', 
      title: 'Sustainability Basics', 
      description: 'Learn the fundamentals of sustainability and its importance in everyday life.' 
    },
    { 
      id: '2', 
      title: 'Energy Conservation in Dorms', 
      description: 'Learn simple ways to conserve energy in your residence hall, such as efficient use of heating, cooling, and lighting.' 
    },
    { 
      id: '3', 
      title: 'Waste Reduction While on Campus', 
      description: 'Understand how to properly recycle, compost, and reduce waste across BU’s campus.' 
    },
    
  ];
  const contact = [
    { 
      id: '1', 
      title: 'Get Involved: BU Sustainability Programs', 
      description: 'Discover ways to actively participate in BU’s sustainability initiatives, such as joining student-led eco clubs, attending events, or volunteering for campus-wide sustainability projects.' 
    },
  ];

  const handleModuleClick = (moduleId: string) => {
    navigate(`/module/${moduleId}`);
  };

  return (
    <div className="educational-page">
      <header className="educational-header">
        <h1>Educational Resources</h1>
        <p>Understanding sustainability is the first step towards a greener future. This section offers a range of resources to help you deepen your knowledge and take actionable steps towards a sustainable lifestyle.</p>
      </header>

      <section className="learning-modules-section">
        <h2>Learning Modules</h2>
        <div className="modules-grid">
          {modules.map((module) => (
            <div
              key={module.id}
              className="module-card"
              onClick={() => handleModuleClick(module.id)}
            >
              <h3>{module.title}</h3>
              <p>{module.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="featured-video-section">
        <h2>What is sustainability?</h2>
        <iframe
          width="560"
          height="315"
          src="https://www.youtube.com/embed/zx04Kl8y4dE"
          title="YouTube video player"

          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        
        ></iframe>
        <p>
          Want to explore more?{' '}
          <span className="link" onClick={() => navigate('/video-library')}>
            Check out our Video Library.
          </span>
        </p>
      </section>
      <section className="contact-section">
        <h2>Get Involved at BU!</h2>
        <div className="modules-grid">
          {contact.map((contact) => (
            <div
              key={contact.id}
              className="module-card"
              onClick={() => handleModuleClick(contact.id)}
            >
              <h3>{contact.title}</h3>
              <p>{contact.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="map-section">
        <h1>Have your own water bottle but don't know where to refill it?</h1>
        <p>Use the map below to explore BU's refill stations!</p>
        <Map />
      </section>
    </div>
  );
};

export default Educational;

