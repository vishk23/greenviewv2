import React from 'react';
import './Footer.css'; // Import CSS for styling the footer

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-team">
          <h2>GreenView: Who Are We?</h2>
          <p>
            At GreenView, our mission is to inspire sustainable habits and provide resources for a greener future.
            Our team is dedicated to empowering individuals to reduce waste, save energy, and live sustainably.
          </p>
          <div className="team-section">
            <h2>Meet The Team</h2>
            <div className="team-members">
              <div className="team-member">
                <img src="/assets/team/Abdullah.png" alt="Abdullah" className="team-photo" />
                <p>Abdullah - Software Engineer</p>
              </div>
              <div className="team-member">
                <img src="/assets/team/Ana.png" alt="Ana" className="team-photo" />
                <p>Ana - Software Engineer</p>
              </div>
              <div className="team-member">
                <img src="/assets/team/Maidah.png" alt="Maidah" className="team-photo" />
                <p>Maidah - Team Lead & Designer</p>
              </div>
              <div className="team-member">
                <img src="/assets/team/Sadiq.png" alt="Sadiq" className="team-photo" />
                <p>Sadiq - Software Engineer</p>
              </div>
              <div className="team-member">
                <img src="/assets/team/Vishnu.png" alt="Vishnu" className="team-photo" />
                <p>Vishnu - Software Engineer</p>
              </div>
              <div className="team-member">
                <img src="/assets/team/Wesley.png" alt="Wesley" className="team-photo" />
                <p>Wesley - Software Engineer</p>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-divider"></div>
        <div className="footer-notifications">
          <h3>Get Notifications</h3>
          <input type="text" placeholder="Phone" />
          <button>Sign Up</button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
