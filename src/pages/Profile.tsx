/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState, PureComponent } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@services/firebase";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import "./Profile.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getFirestore } from "firebase/firestore";
import {
  loginWithEmail,
  registerWithEmail,
  logout,
} from "@services/authService";

interface ScoreEntry {
  score: number;
  date: any;
  answers: string[];
  questions: string[];
}

interface ProfileData {
  displayName: string;
  email: string;
  bio: string;
  phoneNumber?: string;
  notificationsEnabled?: boolean;
}

interface StructuredSummary {
  improvement: {
    area: string;
    description: string;
  }[];
  strengths: {
    area: string;
    description: string;
  }[];
}

interface ScoreData {
  score?: number;
  scoreHistory?: ScoreEntry[];
  structuredSummary: StructuredSummary;
}

interface StreakData {
  streak?: number;
}

interface ModuleData {
  energyModule?: boolean;
  wasteModule?: boolean;
  sustainabilityBasicsModule: boolean;
}

const Profile: React.FC = () => {
  const [user] = useAuthState(auth);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [scoreData, setScoreData] = useState<ScoreData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [updated, setUpdated] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [showHistory, setShowHistory] = useState(false);
  const [flippedIndex, setFlippedIndex] = useState<number | null>(null);

  // Auth states
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [streak, setStreak] = useState(0);
  const [energy, setEnergy] = useState(false);
  const [waste, setWaste] = useState(false);
  const [sustainability, setSustainability] = useState(false);

  // Fetch Profile Data
  useEffect(() => {
    const fetchProfileData = async () => {
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const data = userDoc.data() as ProfileData;
          setProfileData(data);
          setDisplayName(data.displayName || "");
          setPhoneNumber(data.phoneNumber || "");
          setNotificationsEnabled(data.notificationsEnabled || false);
        }

        const scoresDocRef = doc(db, "scores", user.uid);
        const scoreDoc = await getDoc(scoresDocRef);
        if (scoreDoc.exists()) {
          const data = scoreDoc.data() as StreakData;
          setStreak(data.streak || 0);
        }

        const moduleDocRef = doc(db, "moduleCompletion", user.uid);
        const moduleDoc = await getDoc(moduleDocRef);
        if (moduleDoc.exists()) {
          const data = moduleDoc.data() as ModuleData;
          setEnergy(data.energyModule || false);
          setWaste(data.wasteModule || false);
          setSustainability(data.sustainabilityBasicsModule || false);
        }
      }
    };
    fetchProfileData();
  }, [user]);

  // Fetch Score Data
  useEffect(() => {
    const fetchScoreData = async () => {
      if (user) {
        const scoreDocRef = doc(db, "scores", user.uid);
        const scoreDoc = await getDoc(scoreDocRef);
        if (scoreDoc.exists()) {
          const data = scoreDoc.data() as ScoreData;
          setScoreData(data);
        }
      }
    };
    fetchScoreData();
  }, [user]);

  const getSource = () => {
    if (scoreData?.score == null) return "";
    if (scoreData?.score >= 80) return "/statement/Clear.gif";
    if (scoreData?.score >= 60) return "/statement/Clouded.gif";
    if (scoreData?.score >= 40) return "/statement/Hazy.gif";
    if (scoreData?.score >= 20) return "/statement/Smoky.gif";
    return "/statement/Polluted.gif";
  };

  const getFeedback = () => {
    if (scoreData?.score == null) return "";
    if (scoreData?.score >= 80) return "Your GreenView is Clear";
    if (scoreData?.score >= 60) return "Your GreenView is Clouded";
    if (scoreData?.score >= 40) return "Your GreenView is Hazy";
    if (scoreData?.score >= 20) return "Your GreenView is Smoky";
    return "Your GreenView is Polluted";
  };

  const handleEnableNotifications = async () => {
    if (user) {
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, {
        notificationsEnabled: !notificationsEnabled,
      });
      setNotificationsEnabled(!notificationsEnabled);
      setUpdated(true);
    }
  };

  const renderDescription = (index: number) => {
    if (index < 100) {
      return scoreData?.structuredSummary.strengths[index].description;
    } else {
      return scoreData?.structuredSummary.improvement[index - 100].description;
    }
  };

  const toggleFlip = (index: number | null) => {
    setFlippedIndex((prevIndex) => (prevIndex === index ? null : index)); // Flip or reset
  };

  const handleSaveProfile = async () => {
    if (user && profileData) {
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, {
        displayName,
        phoneNumber,
        email: profileData.email,
        notificationsEnabled: profileData.notificationsEnabled || false,
      });

      setProfileData({ ...profileData, displayName, phoneNumber });
      setIsEditing(false);
    }
  };

  const handleLogin = async () => {
    try {
      await loginWithEmail(email, password);
      setErrorMessage("");
    } catch (error) {
      setErrorMessage("Login failed. Please try again.");
    }
  };

  const handleSignUp = async () => {
    try {
      const user = await registerWithEmail(
        email,
        password,
        displayName,
        phoneNumber
      );

      if (user) {
        await setDoc(doc(db, "users", user.uid), {
          displayName,
          email,
          phoneNumber,
          notificationsEnabled: false,
          bio: "",
        });
        setErrorMessage("");
      } else {
        setErrorMessage("Sign-up failed. Please try again.");
      }
    } catch (error) {
      setErrorMessage("Sign-up failed. Please try again.");
      console.error("Sign-up error:", error);
    }
  };

  if (!user) {
    return (
      <div className="auth-container">
        <div className="auth-box">
          <h2>{isSignUp ? "Create Account" : "Login"}</h2>
          {errorMessage && <p className="error-message">{errorMessage}</p>}

          {isSignUp && (
            <>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Display Name"
                className="auth-input"
              />
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Phone Number"
                className="auth-input"
              />
            </>
          )}

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="auth-input"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="auth-input"
          />

          <button
            onClick={isSignUp ? handleSignUp : handleLogin}
            className="auth-button"
          >
            {isSignUp ? "Sign Up" : "Login"}
          </button>

          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="auth-toggle"
          >
            {isSignUp
              ? "Already have an account? Login"
              : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="background123">
      <img
        src={getSource()}
        alt=""
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          pointerEvents: "none",
        }}
      />
      {flippedIndex !== null && (
        <div className="popup">
          <div className="popup-title">
            <h2>
              {flippedIndex < 100
                ? scoreData?.structuredSummary.strengths[flippedIndex].area
                : scoreData?.structuredSummary.improvement[flippedIndex - 100]
                    .area}
            </h2>
            <button onClick={() => setFlippedIndex(null)}>
              <img
                src="/icons/close.png"
                alt=""
                className="close-popup-button"
                width="24px"
              />
            </button>
          </div>
          <div className="popup-description">
            <p>{renderDescription(flippedIndex)}</p>
          </div>
        </div>
      )}
      <div className="profile-page">
        <div className="profile-info">
          <div className="profile-header">
            <div className="profile-title">
              {isEditing ? (
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
              ) : (
                <h2>{profileData?.displayName || "Not set"}</h2>
              )}
              <button
                onClick={() => {
                  if (isEditing) {
                    handleSaveProfile();
                  }
                  setIsEditing((prev) => !prev);
                }}
              >
                <img className="edit-button" src="/icons/edit.png" alt="Edit" />
              </button>
            </div>
            <button onClick={logout} className="logout-button">
              Logout
            </button>
          </div>
          <p style={isEditing ? { marginTop: 8 } : {}}>
            <strong>Email: </strong>
            {profileData?.email || "Not set"}
          </p>
          <p>
            <strong>Phone: </strong>
            {isEditing ? (
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            ) : (
              profileData?.phoneNumber || "Not set"
            )}
          </p>

          <div className="notification-section">
            <button
              onClick={() => handleEnableNotifications()}
              className="notification"
            >
              {notificationsEnabled ? (
                <p>Disable Notifications</p>
              ) : (
                <p>Enable Notifications</p>
              )}
            </button>
            {updated && <p> * Updated Successfully</p>}
          </div>
        </div>
        <div className="statement">
          <h2>{getFeedback()}</h2>
        </div>
        <div className="area">
          <div className="area-section">
            <h2>Strengths</h2>
            <div className="card-section">
              {scoreData ? (
                scoreData.structuredSummary.strengths.map((item, index) => (
                  <div
                    key={index}
                    className={`card ${
                      flippedIndex === index ? "flipped" : ""
                    }`}
                    onClick={() => toggleFlip(index)}
                  >
                    {item.area}
                  </div>
                ))
              ) : (
                <p>Please take the quiz to see your Data!</p>
              )}
            </div>
          </div>
          <div className="area-section">
            <h2>Area of Improvements</h2>
            <div className="card-section">
              {scoreData ? (
                scoreData.structuredSummary.improvement.map((item, index) => (
                  <div
                    key={index + 100}
                    className={`card ${
                      flippedIndex === index + 100 ? "flipped" : ""
                    }`}
                    onClick={() => toggleFlip(index + 100)}
                  >
                    {item.area}
                  </div>
                ))
              ) : (
                <p>Please take the quiz to see your Data!</p>
              )}
            </div>
          </div>
        </div>
        <div className="area">
          <div className="badges">
            <h2>Badges</h2>
            <div className="badges-section">
              {energy && (
                <div className="badges-icon">
                  <img src="/badges/energy.png" alt="" width="32px" />
                </div>
              )}
              {waste && (
                <div className="badges-icon">
                  <img src="/badges/energy.png" alt="" width="32px" />
                </div>
              )}
              {sustainability && (
                <div className="badges-icon">
                  <img src="/badges/energy.png" alt="" width="32px" />
                </div>
              )}
            </div>
          </div>
          <div className="badges">
            <h2>Weekly View</h2>
            <div className="badges-section">
              {streak !== 0 && <div className="badges-icon">{streak}</div>}
            </div>
          </div>
        </div>
        <div className="history">
          <h2>
            History{" "}
            {showHistory ? (
              <button
                onClick={() => setShowHistory(false)}
                className="expand-popup-button"
              >
                &lt;
              </button>
            ) : (
              <button
                onClick={() => setShowHistory(true)}
                className="expand-popup-button"
              >
                &gt;
              </button>
            )}
          </h2>
        </div>
        {showHistory ? (
          <ResponsiveContainer width="80%" height="30%" minHeight="240px">
            <LineChart
              width={500}
              height={300}
              data={
                scoreData && scoreData.scoreHistory
                  ? scoreData.scoreHistory.map((entry) => ({
                      date: entry.date, // Convert date to Date object
                      score: entry.score, // Keep the score as it is
                    }))
                  : []
              }
              margin={{
                top: 5,
                right: 0,
                left: 40,
                bottom: 0,
              }}
            >
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#F06D3C"
                activeDot={{ r: 8 }}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
};

export default Profile;
