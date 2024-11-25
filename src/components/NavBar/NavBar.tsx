import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth, db } from "@services/firebase";
import { loginWithEmail, registerWithEmail, logout } from "@services/authService";
import { doc, setDoc } from "firebase/firestore";
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
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const displayName = currentUser.displayName || currentUser.email?.split("@")[0] || "";
        setUserName(displayName);
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 100) {
        setHidden(true); // Hide navbar when scrolling down
      } else {
        setHidden(false); // Show navbar when scrolling up
      }
      lastScrollY = window.scrollY;
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
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
      const user = await registerWithEmail(email, password, username, phoneNumber);
  
      if (user) {
        // Save user data to Firestore if registration was successful
        await setDoc(doc(db, "users", user.uid), {
          username,
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
    <nav className={`navbar-main ${hidden ? "hidden" : ""}`}>
      <div className="navbar-left">
        <NavLink to="/" className="logo">
          <img src="/full_logo.png" alt="LOGO" style={{ width: '200px', height: 'auto' }} />
        </NavLink>
      </div>
      <div className="navbar-center">
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
      <div className="navbar-right">
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
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
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
};


export default NavBar;
