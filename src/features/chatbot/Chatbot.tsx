import React, { useState } from 'react';
import { model } from '@services/firebase';

function Chatbot() {
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [input, setInput] = useState('');
  const [isRequestPending, setIsRequestPending] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isRequestPending) return;

    setIsRequestPending(true);

    // Add user message to chat history
    const newMessages = [...messages, { sender: 'user', text: input }];
    setMessages(newMessages); // No need for 'await' here

    console.log("Chat History:", newMessages);

    // Fetch response from the AI model
    const response = await fetchAIResponse(input, newMessages);
    setMessages([...newMessages, { sender: 'bot', text: response }]);

    setInput(''); // Clear input field
    setIsRequestPending(false); // Reset request status
  };

  const fetchAIResponse = async (userInput: string, chatHistory: { sender: string; text: string }[]): Promise<string> => {
    try {
      const chat = model.startChat({
        history: chatHistory.map((msg) => ({
          role: msg.sender === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }]
        })),
        generationConfig: {
          maxOutputTokens: 8192,
        },
      });

      // Send the user's input to the model and wait for a complete response
      const result = await chat.sendMessage(userInput);
      const response = await result.response;
      const botResponse = await response.text();

      console.log("Bot Response:", botResponse);

      if (!botResponse) {
        console.error("Received empty response from AI model.");
        return 'Sorry, I didn’t receive a response. Please try again.';
      }

      return botResponse;
    } catch (error) {
      console.error('Error fetching AI response:', error);
      return 'Sorry, something went wrong.';
    }
  };

  return (
    <div>
      <div className="chat-history">
        {messages.map((msg, index) => (
          <div key={index} className={msg.sender}>
            <strong>{msg.sender}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
}

export default Chatbot;
