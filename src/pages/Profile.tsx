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
  CartesianGrid,
  Tooltip,
  Legend,
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

  return (
    <div className="background123">
      <img
        src={getSource()}
        alt=""
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          pointerEvents: "none", // Allow clicks through the image
        }}
      />
      <div className="profile-page">
        <div className="profile-card">
          <div className="profile-info">
            <h2>{profileData?.name || "Not set"}</h2>
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

        <div className="score">
          <h2>{getFeedback()}</h2>
        </div>

        <div className="area-section">
          <div className="strengths-section">
            <h2>Strengths</h2>
            {scoreData?.structuredSummary.strengths &&
              renderSummaryCards(
                scoreData.structuredSummary.strengths,
                flippedStrengths,
                "strength"
              )}
          </div>

          <div className="strengths-section">
            <h2>Improvement Areas</h2>
            {scoreData?.structuredSummary.improvement &&
              renderSummaryCards(
                scoreData.structuredSummary.improvement,
                flippedImprovements,
                "improvement"
              )}
          </div>
        </div>

        <div className="score">
          <h2>Score History</h2>
        </div>

        <ResponsiveContainer width="90%" height="30%">
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
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Profile;
