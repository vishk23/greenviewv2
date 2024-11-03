/* eslint-disable @typescript-eslint/no-unused-vars */
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@services/firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import ProgressBar from "./ProgressBar";
import "./Consolidated.css";

interface ScoreProps {
  score: number;
  totalQuestions: number;
  answers: number[];
  questions: { question: string; answers: string[] }[];
}

const Score: React.FC<ScoreProps> = ({ score, totalQuestions, answers, questions }) => {
  const [previousScore, setPreviousScore] = useState<number | null>(null);
  const [message, setMessage] = useState<string>(
    "Great start! This is your first time taking the quiz."
  );
  const [user] = useAuthState(auth);

  const maxScore = totalQuestions * 10;
  const percentageScore = (score / maxScore) * 100;

  useEffect(() => {
    if (user) {
      const fetchScore = async () => {
        const userDocRef = doc(db, "scores", user.uid);

        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const previous = userData.score;
          setPreviousScore(previous);

          if (score > previous) {
            setMessage(
              `Great Job! Your score improved by ${score - previous} points!`
            );
          } else if (score === previous) {
            setMessage("Your score remains the same. Keep going!");
          } else {
            setMessage("Keep going! You can improve your score!");
          }

          await updateDoc(userDocRef, {
            score: score,
            lastUpdated: new Date(),
            answers: answers.map((answerIndex, i) => questions[i].answers[answerIndex]),
            questions: questions.map(q => q.question),
          });
        } else {
          await setDoc(userDocRef, {
            userId: user.uid,
            score: score,
            lastUpdated: new Date(),
            answers: answers.map((answerIndex, i) => questions[i].answers[answerIndex]),
            questions: questions.map(q => q.question),
          });
          setMessage("Great start! This is your first time taking the quiz.");
        }
      };

      fetchScore().catch((error) =>
        console.error("Error fetching score:", error)
      );
    }
  }, [user, score, answers, questions]);

  return (
    <div className="score-container">
      <div className="score-box">
        <div className="progress-bar-wrapper">
          <ProgressBar points={percentageScore} />
        </div>
        <div className="score-display">
          <span className="score-number">{score}</span>
          <span className="job">{message}</span>
        </div>
      </div>
    </div>
  );
};

export default Score;
