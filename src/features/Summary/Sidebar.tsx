// Sidebar.js
import React from "react";
import "./Sidebar.css";

interface SidebarProps {
  onSelectItem: (item: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onSelectItem }) => {
  return (
    <div className="sidebar">
      <ul>
        <li onClick={() => onSelectItem("Leaderboard")}>
          <img src="/icons/leaderboard.png" width="48px" alt="leaderboard" />
        </li>
        <li onClick={() => onSelectItem("Summary")}>
          <img src="/icons/leaderboard.png" width="48px" alt="summary" />
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
