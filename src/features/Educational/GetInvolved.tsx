import React from 'react';
import './GetInvolved.css';
import { useNavigate } from 'react-router-dom';

const GetInvolved: React.FC = () => {
  const organizations = [
    {name: 'BU Sustainability', contact:'https://www.instagram.com/sustainablebu/'},
    { name: 'BU Beekeeping', contact: 'https://www.instagram.com/BUBeekeeping' },
    { name: 'BUMC Climate Action Group', contact: 'https://www.instagram.com/BUMCClimateAction' },
    { name: 'Environmental Student Organization (ESO)', contact: 'https://www.instagram.com/bu.eso/' },
    { name: 'Global Environmental Brigades', contact: 'https://www.instagram.com/bu_geb/' }, // Email link
    { name: 'Net Impact Undergrad', contact: 'https://www.instagram.com/NetImpactBU' },
    { name: 'Outing Club', contact: 'https://www.instagram.com/BUOutingClub' },
    { name: 'Veg Club', contact: 'https://www.instagram.com/buvegclub/' },
  ];
  const navigate = useNavigate();

  return (
    <div className="get-involved-page">
  
      {/* Back Button */}
      <button className="back-button" onClick={() => navigate('/educational')}>
        &larr; Back to Educational Resources
      </button>

      <header>
        <h1>Get Involved</h1>
        <p>Explore student organizations at BU that focus on sustainability. Join a community that shares your passion for making a difference!</p>
      </header>

      <div className="organizations-grid">
        {organizations.map((org, index) => (
          <a
            key={index}
            href={org.contact}
            target="_blank"
            rel="noopener noreferrer"
            className="organization-card"
          >
            <h3>{org.name}</h3>
            <p>Contact them!</p>
          </a>
        ))}
      </div>
    </div>
  );
};

export default GetInvolved;
