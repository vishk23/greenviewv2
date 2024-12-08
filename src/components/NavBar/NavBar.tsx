import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth, db } from "@services/firebase";
import { loginWithEmail, registerWithEmail, logout } from "@services/authService";
import { doc, setDoc, getDoc } from "firebase/firestore";
import "./NavBar.css";

const links = [
  { name: "Home", path: "/home" },
  { name: "Calendar", path: "/calendar" },
  { name: "Sustainability Score", path: "/score" },
  { name: "Educational Resources", path: "/educational" },
];

const NavBar: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userName, setUserName] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(true);

  const toggleNavbar = () => {
    setIsCollapsed(!isCollapsed);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Fetch user data from Firestore to get displayName
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserName(userData.displayName || "User");
        }
      }
    });

    return unsubscribe;
  }, []);

  return (
    <nav className="navbar-main">
      <div className="navbar-left">
        <div className="navbar-header">
          <NavLink to="/" className="logo">
            <img src="/full_logo.png" alt="LOGO" style={{ width: '120px', height: 'auto' }} />
          </NavLink>
          {/* Hamburger button */}
          <button className="navbar-toggle" onClick={toggleNavbar}>
            ☰
          </button>
        </div>
      </div>
      <div className={`navbar-center ${isCollapsed ? "collapsed" : ""}`}>
        <ul className="nav-links">
          {links.map((link, index) => (
            <li key={index}>
              <NavLink to={link.path} className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                {link.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
      <div className={`navbar-right ${isCollapsed ? "hidden-mobile" : ""}`}>
        <NavLink to="/profile" className="profile-link">
          {user ? userName : "Login / Sign Up"}
        </NavLink>
      </div>
    </nav>
  );
}

export default NavBar