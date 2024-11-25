/* eslint-disable @typescript-eslint/no-unused-vars */
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [showHistory, setShowHistory] = useState(false);

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  // State for card flipping
  const [flippedStrengths, setFlippedStrengths] = useState<boolean[]>([]);
  const [flippedImprovements, setFlippedImprovements] = useState<boolean[]>([]);

  // Fetch Profile Data
  useEffect(() => {
    const fetchProfileData = async () => {
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const data = userDoc.data() as ProfileData;
          setProfileData(data);
          setName(data.name || "");
          setBio(data.bio || "");
          setPhoneNumber(data.phoneNumber || "");
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
          setFlippedStrengths(
            Array(data.structuredSummary.strengths.length).fill(false)
          );
          setFlippedImprovements(
            Array(data.structuredSummary.improvement.length).fill(false)
          );
        }
      }
    };
    fetchScoreData();
  }, [user]);

  const handleFlipCard = (index: number, type: "strength" | "improvement") => {
    if (type === "strength") {
      const newFlipped = [...flippedStrengths];
      newFlipped[index] = !newFlipped[index];
      setFlippedStrengths(newFlipped);
    } else {
      const newFlipped = [...flippedImprovements];
      newFlipped[index] = !newFlipped[index];
      setFlippedImprovements(newFlipped);
    }
  };

  const renderSummaryCards = (
    summary: { area: string; description: string }[],
    flippedState: boolean[],
    type: "strength" | "improvement"
  ) => {
    return (
      <div className="summary-cards">
        {summary.map((item, index) => (
          <div
            key={index}
            className={`card ${flippedState[index] ? "flipped" : ""}`}
            onClick={() => handleFlipCard(index, type)}
          >
            {!flippedState[index] ? (
              <div className="front">{item.area}</div>
            ) : (
              <div className="back">{item.description}</div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="profile-page">
      <h1 className="profile-title">Your Profile</h1>
      <div className="profile-card">
        <div className="profile-info">
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
        </div>
      </div>

      <h2>Strengths</h2>
      {scoreData?.structuredSummary.strengths &&
        renderSummaryCards(
          scoreData.structuredSummary.strengths,
          flippedStrengths,
          "strength"
        )}

      <h2>Improvement Areas</h2>
      {scoreData?.structuredSummary.improvement &&
        renderSummaryCards(
          scoreData.structuredSummary.improvement,
          flippedImprovements,
          "improvement"
        )}
    </div>
  );
};

export default Profile;
