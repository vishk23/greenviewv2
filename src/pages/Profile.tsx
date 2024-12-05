/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState, PureComponent } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@services/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
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

interface ScoreEntry {
  score: number;
  date: any;
  answers: string[];
  questions: string[];
}

interface ProfileData {
  name: string;
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

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  // Fetch Profile Data
  useEffect(() => {
    const fetchProfileData = async () => {
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const data = userDoc.data() as ProfileData;
          console.log(data);
          setProfileData(data);
          setName(data.name || "");
          setBio(data.bio || "");
          setPhoneNumber(data.phoneNumber || "");
          setNotificationsEnabled(data.notificationsEnabled || false);
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
        name,
        bio,
        phoneNumber,
        email: profileData.email,
        notificationsEnabled: profileData.notificationsEnabled || false,
      });

      setProfileData({ ...profileData, name, bio, phoneNumber });
      setIsEditing(false);
    }
  };

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
            <h2>Read Me</h2>
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
          <div className="profile-title">
            <>
              {isEditing ? (
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              ) : (
                <h2>{profileData?.name || "Not set"}</h2>
              )}
            </>
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
        <div className="badges">
          <h2>Badges</h2>
          {/* ToDO: Add badges here */}
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
