import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@services/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import "./Profile.css";

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

interface ScoreData {
  score?: number;
  scoreHistory?: ScoreEntry[];
  structuredSummary: {
    improvement: {
      area: string;
      description: string;
    }[];
    strengths: {
      area: string;
      description: string;
    }[];
  };
}

const Profile: React.FC = () => {
  const [user] = useAuthState(auth);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [scoreData, setScoreData] = useState<ScoreData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    const fetchProfileData = async () => {
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const data = userDoc.data() as ProfileData;
          setProfileData(data);
          setName(data.name);
          setBio(data.bio);
          setPhoneNumber(data.phoneNumber || "");
        }
      }
    };

    fetchProfileData();
  }, [user]);

  useEffect(() => {
    const fetchScoreData = async () => {
      if (user) {
        const scoreDocRef = doc(db, "scores", user.uid);
        const scoreDoc = await getDoc(scoreDocRef);
        console.log(scoreDoc);
        if (scoreDoc.exists()) {
          setScoreData(scoreDoc.data() as ScoreData);
        }
      }
    };

    fetchScoreData();
  }, [user]);

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

  const getGreenViewStatus = (score: number | undefined) => {
    if (score === undefined) return "";
    if (score >= 80) return "Your GreenView is Clear";
    if (score >= 60) return "Your GreenView is Clouded ";
    if (score >= 40) return "Your GreenView is Hazy ";
    if (score >= 20) return "Your GreenView is Smoky ";
    return "Your GreenView is Polluted ";
  };

  const renderScoreHistory = (history: ScoreEntry[]) => (
    <div className={`score-history ${showHistory ? "visible" : "hidden"}`}>
      {history.map((entry, index) => (
        <div key={index} className="history-entry">
          <p>
            <strong>Date:</strong> {entry.date.toDate().toLocaleDateString()}
          </p>
          <p>
            <strong>Score:</strong> {entry.score}
          </p>
          <p>
            <strong>Questions:</strong> {entry.questions.join(", ")}
          </p>
          <p>
            <strong>Answers:</strong> {entry.answers.join(", ")}
          </p>
        </div>
      ))}
    </div>
  );

  return (
    <div className="profile-page">
      <h1 className="profile-title">Your Profile</h1>

      <div className="profile-card">
        <div className="profile-info">
          {isEditing ? (
            <>
              <label>
                Name:{" "}
                <input value={name} onChange={(e) => setName(e.target.value)} />
              </label>
              <label>
                Bio:{" "}
                <input value={bio} onChange={(e) => setBio(e.target.value)} />
              </label>
              <label>
                Phone:{" "}
                <input
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </label>
              <button className="save-btn" onClick={handleSaveProfile}>
                Save
              </button>
              <button
                className="cancel-btn"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <p>
                <strong>Name:</strong> {profileData?.name || "Not set"}
              </p>
              <p>
                <strong>Email:</strong> {profileData?.email || "Not set"}
              </p>
              <p>
                <strong>Bio:</strong> {profileData?.bio || "Not set"}
              </p>
              <p>
                <strong>Phone:</strong> {profileData?.phoneNumber || "Not set"}
              </p>
              <button className="edit-btn" onClick={() => setIsEditing(true)}>
                Edit Profile
              </button>
            </>
          )}
        </div>
      </div>

      <h2 className="statement">{getGreenViewStatus(scoreData?.score)}</h2>

      <div className="area-section">
        <div className="strengths-section">
          <h2 className="section-title"> Strengths </h2>
          {scoreData?.structuredSummary.strengths.map(({ area }) => (
            <div
              key={area} // Use area as the unique key
              className="rectangle"
            >
              <div className="front">{area}</div> {/* Front text is the area */}
              {/* Back text is the description */}
            </div>
          ))}
        </div>
        <div className="strengths-section">
          <h2 className="section-title"> Improvement </h2>
          {scoreData?.structuredSummary.improvement.map(({ area }) => (
            <div
              key={area} // Use area as the unique key
              className="rectangle"
            >
              <div className="front">{area}</div> {/* Front text is the area */}
              {/* Back text is the description */}
            </div>
          ))}
        </div>
      </div>

      <div className="badges-section">
        <h2>Badges</h2>
        <div className="badges-placeholder">Coming soon...</div>
      </div>

      <div className="score-section">
        <button
          className="toggle-history-btn"
          onClick={() => setShowHistory(!showHistory)}
        >
          {showHistory ? "Hide Score History" : "Show Score History"}
        </button>
        {showHistory &&
          scoreData?.scoreHistory &&
          renderScoreHistory(scoreData.scoreHistory)}
      </div>
    </div>
  );
};

export default Profile;
