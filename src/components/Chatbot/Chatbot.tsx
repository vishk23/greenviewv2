/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { model } from "@services/firebase";
import { useLocation } from "react-router-dom";
import "./Chatbot.css";

function Chatbot() {
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>(
    []
  );
  const [input, setInput] = useState("");
  const [isRequestPending, setIsRequestPending] = useState(false);
  const location = useLocation();
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    // Check if there's a prefilled message from the URL
    const params = new URLSearchParams(location.search);
    const prefilledMessage = params.get("message");
    if (prefilledMessage) {
      setMessages([{ sender: "user", text: prefilledMessage }]);
      handleSend(prefilledMessage);
    }
  }, [location]);

  const handleSend = async (messageText = input) => {
    if (!messageText.trim() || isRequestPending) return;

    setIsRequestPending(true);

    // Add user message to chat history
    const newMessages = [...messages, { sender: "user", text: messageText }];
    setMessages(newMessages);

    // Fetch response from the AI model
    const response = await fetchAIResponse(messageText, newMessages);
    setMessages([...newMessages, { sender: "bot", text: response }]);

    setInput(""); // Clear input field
    setIsRequestPending(false); // Reset request status
  };

  const fetchAIResponse = async (
    userInput: string,
    chatHistory: { sender: string; text: string }[]
  ): Promise<string> => {
    try {
      const chat = model.startChat({
        history: chatHistory.map((msg) => ({
          role: msg.sender === "user" ? "user" : "model",
          parts: [{ text: msg.text }],
        })),
        generationConfig: {
          maxOutputTokens: 8192,
        },
      });

      const result = await chat.sendMessage(userInput);
      const response = await result.response;
      const botResponse = await response.text();

      return (
        botResponse || "Sorry, I didn’t receive a response. Please try again."
      );
    } catch (error) {
      console.error("Error fetching AI response:", error);
      return "Sorry, something went wrong.";
    }
  };

  return (
    <div>
      {showPopup ? (
        <div className="chat-container">
          <div className="chat-history">
            {messages.length === 0 ? (
              <div className="empty-chat-message">
                Hey There! <br /> How can I help you today?
              </div>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={
                    msg.sender === "bot" ? "message-bot" : "message-user"
                  }
                >
                  <strong>{msg.sender}:</strong> {msg.text}
                </div>
              ))
            )}
          </div>
          <div className="message-input">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend(undefined)}
            />
            <button
              className="send-button"
              onClick={() => handleSend(undefined)}
            >
              ^
            </button>
          </div>
          <button className="close-button" onClick={() => setShowPopup(false)}>
            Close
          </button>
        </div>
      ) : (
        <button className="open-chat-button" onClick={() => setShowPopup(true)}>
          Open Chat
        </button>
      )}
    </div>
  );
}

export default Chatbot;
