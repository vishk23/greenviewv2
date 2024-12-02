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
      description: 'Learn the fundamentals of sustainability and its importance in everyday life.' ,
      logo: '/icons/SustainabilityLogo.png'
  
    },
    { 
      id: '2', 
      title: 'Energy Conservation in Dorms', 
      description: 'Learn simple ways to conserve energy in your residence hall, such as efficient use of heating, cooling, and lighting.' ,
      logo: '/icons/EnergyLogo.png'
  
    },
    { 
      id: '3', 
      title: 'Waste Reduction While on Campus', 
      description: 'Understand how to properly recycle, compost, and reduce waste across BU’s campus.' ,
      logo: '/icons/WasteLLogo.png'
  
    },
    
  ];
  const contact = [
    { 
      id: '1', 
      title: 'Get Involved: BU Sustainability Programs', 
      },
  ];

  const handleModuleClick = (moduleId: string) => {
    navigate(`/module/${moduleId}`);
  };

  return (
    <div className="educational-page">
      <header className="educational-header">
      <h1 style={{ fontWeight: 'normal' }}>Educational Resources</h1>
      <p style={{fontSize: '20px'}}>Understanding sustainability is the first step towards a greener future. This section offers a range of resources to help you deepen your knowledge and take actionable steps towards a sustainable lifestyle.</p>
      </header>

      <section className="learning-modules-section">
      <h2 style={{ fontWeight: 'bold', textAlign: 'center' }}>
        Clarify your GreenView with our Green Guides
      </h2><br/><br/><br/>

      <div className="modules-grid">
          {modules.map((module) => (
            <div
              key={module.id}
              className="module-card"
              onClick={() => handleModuleClick(module.id)}
            >
              <div className="module-logo">
                {module.logo && <img src={module.logo} alt={`${module.title} logo`} />}
              </div>
              <div className="module-title">
              <h3 style={{ fontWeight: 'normal' }}>{module.title + '>'}</h3>
              </div>
              <p className="module-description">{module.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="featured-video-section">
      <h1 style={{ fontSize:'40px',fontWeight: 'normal',textAlign: 'center' }}>What is Sustainability?</h1>
  
      <div className="video-container">
      <iframe
        width="800"
        height="515"
        src="https://www.youtube.com/embed/zx04Kl8y4dE"
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      ></iframe>
    </div>

      <p className="centered-text">
        Want to explore more?{' '}
        <span className="link" onClick={() => navigate('/video-library')}>
          Check out our Video Library.
        </span>
      </p>

      </section>
      <section className="contact-section">
        <br/><br/><br/>
      <h1 style={{ fontSize:'40px',fontWeight: 'normal',textAlign: 'center' }}>Get Involved at BU!</h1>
      <p style={{fontSize: '20px'}}>Discover ways to actively participate in BU’s sustainability initiatives, such as joining student-led 
      eco clubs, attending events, or volunteering for campus-wide sustainability projects.</p>
     

      <div className="contact-button-container">
        {contact.map((contact) => (
          <button
            key={contact.id}
            className="join-button"
            onClick={() => handleModuleClick(contact.id)}
          >
            Join the Movement
          </button>
        ))}
      </div>
      </section>

      <section className="map-section">
      <h1 style={{ fontSize:'30px',fontWeight: 'normal',textAlign: 'center' }}>Have your own water bottle but don't know where to refill it?</h1>
      <p style={{fontSize: '20px',textAlign:'center'}}>Use the map below to explore BU's refill stations!</p>
     
        <Map />
      </section>
    </div>
  );
};

export default Educational;

