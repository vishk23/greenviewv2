import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./CollapsibleBox.css";

interface CollapsibleBoxProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  isLoading?: boolean;
  hasError?: boolean;
  type?: 'leaderboard' | 'summary';
}

/**
 * A reusable collapsible box component with animation
 * @param title - The header title of the box
 * @param children - The content to be displayed inside the box
 * @param defaultOpen - Whether the box should be open by default
 * @param isLoading - Whether the content is loading
 * @param hasError - Whether there was an error loading the content
 * @param type - The type of content (leaderboard or summary)
 */
const CollapsibleBox: React.FC<CollapsibleBoxProps> = ({ 
  title, 
  children, 
  defaultOpen = false,
  isLoading = false,
  hasError = false,
  type = 'summary'
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const renderContent = () => {
    if (hasError) {
      return (
        <div className="error-message">
          <p>Sorry, we couldn't load this content. Please try again later.</p>
        </div>
      );
    }
    
    if (isLoading) {
      return (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading...</p>
        </div>
      );
    }

    return children;
  };

  return (
    <div className={`collapsible-box ${!isOpen ? 'collapsed' : ''} ${type}`}>
      <button 
        className="collapsible-header" 
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3>{title}</h3>
        <span>{isOpen ? '▼' : '▶'}</span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0, transformOrigin: "top" }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="collapsible-content"
          >
            {renderContent()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CollapsibleBox; 