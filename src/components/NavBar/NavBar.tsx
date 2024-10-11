// /src/components/NavBar/NavBar.tsx
import React, { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@services/firebase";
import { loginWithEmail, registerWithEmail, logout } from "@services/authService";

const NavBar: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  const handleLogin = async () => {
    try {
      await loginWithEmail(email, password);
      setShowPopup(false); // Close popup after login
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const handleSignUp = async () => {
    try {
      await registerWithEmail(email, password);
      setShowPopup(false); // Close popup after sign-up
    } catch (error) {
      console.error("Sign-up failed", error);
    }
  };

  const togglePopup = () => setShowPopup(!showPopup);

  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', backgroundColor: '#3a5f3f' }}>
      <h1 style={{ color: '#f8f4e1' }}>MyApp</h1>
      {user ? (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ color: '#f8f4e1', marginRight: '1rem' }}>{user.email}</span>
          <button onClick={logout} style={{ padding: '0.5rem', backgroundColor: '#91b494', color: 'white', border: 'none', borderRadius: '4px' }}>
            Logout
          </button>
        </div>
      ) : (
        <button onClick={togglePopup} style={{ padding: '0.5rem', backgroundColor: '#8bc995', color: 'white', border: 'none', borderRadius: '4px' }}>
          {showPopup ? "Close" : "Login / Sign Up"}
        </button>
      )}

      {showPopup && (
        <div style={{ position: 'absolute', top: '60px', right: '10px', padding: '1rem', backgroundColor: '#f8f4e1', borderRadius: '8px', boxShadow: '0px 4px 8px rgba(0,0,0,0.2)' }}>
          <h3 style={{ margin: '0 0 1rem 0' }}>{isSignUp ? "Sign Up" : "Login"}</h3>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            style={{ display: 'block', marginBottom: '0.5rem', padding: '0.5rem', width: '100%' }}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            style={{ display: 'block', marginBottom: '0.5rem', padding: '0.5rem', width: '100%' }}
          />
          <button
            onClick={isSignUp ? handleSignUp : handleLogin}
            style={{ padding: '0.5rem', backgroundColor: '#8bc995', color: 'white', border: 'none', borderRadius: '4px', width: '100%' }}
          >
            {isSignUp ? "Sign Up" : "Login"}
          </button>
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            style={{ marginTop: '0.5rem', background: 'none', border: 'none', color: '#3a5f3f', textDecoration: 'underline', cursor: 'pointer' }}
          >
            {isSignUp ? "Already have an account? Login" : "Don't have an account? Sign Up"}
          </button>
        </div>
      )}
    </nav>
  );
};

export default NavBar;