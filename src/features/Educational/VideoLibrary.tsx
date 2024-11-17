import React from 'react';
import './VideoLibrary.css';
import { useNavigate } from 'react-router-dom';

const VideoLibrary: React.FC = () => {
  const videos = [
    { id: '1', title: '12 Eco-Friendly Habits for a More Sustainable Life', url: 'https://www.youtube.com/embed/_u0nQYw2Dl4' },
    { id: '2', title: 'How to Recycle Correctly | Sustainability Tips | WWF', url: 'https://www.youtube.com/embed/BnwdpR_2idA' },
    { id: '3', title: 'What Really Happens to the Plastic You Throw Away - Emma Bryce', url: 'https://www.youtube.com/embed/_6xlNyWPpB8' },
    { id: '4', title: 'Sustainability in Everyday Life', url: 'https://www.youtube.com/embed/kZIrIQDf1nQ' },
    { id: '5', title: '8 Sustainability Ideas That Will Change the World', url: 'https://www.youtube.com/embed/sMqtwbKc8EA' },
    { id: '6', title: 'Zero Waste: The Future of Sustainability', url: 'https://www.youtube.com/embed/pF72px2R3Hg' },
  ];
  const navigate = useNavigate();

  return (
    <div className="video-library-page">
        <button className="back-button" onClick={() => navigate('/educational')}>
        &larr; Back to Educational Resources
      </button>
      <header>
        <h1>Video Library</h1>
        <p>Explore our collection of sustainability videos below.</p>
      </header>
      <div className="videos-grid">
        {videos.map((video) => (
          <div key={video.id} className="video-card">
            <iframe
              src={video.url}
              title={video.title}
              allowFullScreen
            ></iframe>
            <h3>{video.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoLibrary;