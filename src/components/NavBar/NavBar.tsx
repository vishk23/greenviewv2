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
  const [showPopup, setShowPopup] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
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



  const handleLogin = async () => {
    try {
      await loginWithEmail(email, password);
      setShowPopup(false);
      setErrorMessage("");
    } catch (error) {
      setErrorMessage("Login failed. Please try again.");
    }
  };

  const handleSignUp = async () => {
    try {
      // Pass all required arguments to registerWithEmail
      const user = await registerWithEmail(email, password, displayName, phoneNumber);
  
      if (user) {
        // Save user data to Firestore if registration was successful
        await setDoc(doc(db, "users", user.uid), {
          username: displayName,
          email,
          phoneNumber,
          notificationsEnabled: false,
        });
        setShowPopup(false);
        setErrorMessage("");
      } else {
        setErrorMessage("Sign-up failed. Please try again.");
      }
    } catch (error) {
      setErrorMessage("Sign-up failed. Please try again.");
      console.error("Sign-up error:", error);
    }
  };
  
  

  const togglePopup = () => setShowPopup(!showPopup);

  const toggleDropdown = () => setShowDropdown(!showDropdown);

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
        {user ? (
          <div className="user-menu">
            <span className="user-name" onClick={toggleDropdown}>
              {userName} <span className="dropdown-icon">▼</span>
            </span>
            {showDropdown && (
              <div className="dropdown-menu">
                <NavLink to="/profile" className="dropdown-item" onClick={toggleDropdown}>
                  Profile
                </NavLink>
                <button onClick={logout} className="dropdown-item">
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <button onClick={togglePopup} className="popup-button">
            {showPopup ? "Close" : "Login / Sign Up"}
          </button>
        )}
        {showPopup && (
          <div className="auth-popup">
            <h3>{isSignUp ? "Sign Up" : "Login"}</h3>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            {isSignUp && (
              <>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Display Name"
                />
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Phone Number"
                />
              </>
            )}
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
            <button onClick={isSignUp ? handleSignUp : handleLogin} className="submit-button">
              {isSignUp ? "Sign Up" : "Login"}
            </button>
            <button onClick={() => setIsSignUp(!isSignUp)} className="toggle-signup">
              {isSignUp ? "Already have an account? Login" : "Don't have an account? Sign Up"}
            </button>
          </div>
        )}
      </div>
    </nav>
  );
  
  
}
export default NavBar