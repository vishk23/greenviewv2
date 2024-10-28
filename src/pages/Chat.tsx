import React from 'react';
import NavBar from '@components/NavBar/NavBar'; // Import NavBar
import Chatbot from '../features/chatbot/Chatbot';

const ChatPage: React.FC = () => {
  return (
    <div>
      <NavBar /> {/* Add NavBar here */}
      <Chatbot />
    </div>
  );
};

export default ChatPage;
