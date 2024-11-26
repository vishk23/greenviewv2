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
          <div className="team">
            <h3>Meet The Team</h3>
            <div className="team-list">
              <div className="team-column">
                <div className="team-member">
                  <img src="/path-to-image-maidah.png" alt="Maidah" />
                  <span>Maidah - Team Lead & Designer</span>
                </div>
                <div className="team-member">
                  <img src="/path-to-image-sadiq.png" alt="Sadiq" />
                  <span>Sadiq - Software Engineer</span>
                </div>
                <div className="team-member">
                  <img src="/path-to-image-abdullah.png" alt="Abdullah" />
                  <span>Abdullah - Software Engineer</span>
                </div>
              </div>
              <div className="team-column">
                <div className="team-member">
                  <img src="/path-to-image-ana.png" alt="Ana" />
                  <span>Ana - Software Engineer</span>
                </div>
                <div className="team-member">
                  <img src="/path-to-image-vishnu.png" alt="Vishnu" />
                  <span>Vishnu - Software Engineer</span>
                </div>
                <div className="team-member">
                  <img src="/path-to-image-wesley.png" alt="Wesley" />
                  <span>Wesley - Software Engineer</span>
                </div>
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
