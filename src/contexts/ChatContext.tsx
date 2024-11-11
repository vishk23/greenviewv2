import React, { createContext, useContext, useState, ReactNode } from "react";

type Message = { sender: string; text: string, needsResponse?: boolean; };

interface ChatContextType {
  messages: Message[];
  addMessage: (message: Message) => void;
  isVisible: boolean;
  setIsVisible: (visible: boolean) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  const addMessage = (message: Message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  return (
    <ChatContext.Provider value={{ messages, addMessage, isVisible, setIsVisible }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
};