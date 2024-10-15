import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@services/firebase";
import {
  loginWithEmail,
  registerWithEmail,
  logout,
} from "@services/authService";
import "./NavBar.css";

const links = [
  {
    name: "About Us",
    path: "/about",
  },
  {
    name: "Calendar",
    path: "/calendar",
  },
];

const NavBar: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  const handleLogin = async () => {
    try {
      await loginWithEmail(email, password);
      setShowPopup(false);
    } catch (error) {
      setErrorMessage("Login failed. Please try again.");
    }
  };

  const handleSignUp = async () => {
    try {
      await registerWithEmail(email, password);
      setShowPopup(false);
    } catch (error) {
      setErrorMessage("Sign-up failed. Please try again.");
    }
  };

  const togglePopup = () => setShowPopup(!showPopup);

  return (
    <div>
      <nav className="navbar">
        <div className="navbar-left">
          <NavLink to="/" className="logo">
            Logo
          </NavLink>
        </div>
        <div className="navbar-center">
          <ul className="nav-links">
            {links.map((link, index) => {
              return (
                <li key={index}>
                  <NavLink to={link.path} key={index} className="nav-link">
                    {link.name}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="navbar-right">
          {user ? (
            <div className="user-info">
              <span className="user-email">{user.email}</span>
              <button onClick={logout} className="logout-button">
                Logout
              </button>
            </div>
          ) : (
            <button onClick={togglePopup} className="popup-button">
              {showPopup ? "Close" : "Login / Sign Up"}
            </button>
          )}

          {showPopup && (
            <div className="auth-popup" id="auth-popup">
              <h3>{isSignUp ? "Sign Up" : "Login"}</h3>
              {errorMessage && <p className="error-message">{errorMessage}</p>}
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
              <button
                onClick={isSignUp ? handleSignUp : handleLogin}
                className="submit-button"
              >
                {isSignUp ? "Sign Up" : "Login"}
              </button>
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="toggle-signup"
              >
                {isSignUp
                  ? "Already have an account? Login"
                  : "Don't have an account? Sign Up"}
              </button>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default NavBar;
