import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@services/firebase";

interface ScoreEntry {
  score: number;
  date: Date;
  answers: string[];
  answerIndices: number[];
  questions: string[];
  structuredSummary?: any;
}

interface SaveScoreResult {
  previousScore: number | null;
  message: string;
}

/**
 * Saves the user's score to Firestore and returns the previous score and a message
 */
export const saveUserScore = async (
  userId: string,
  score: number,
  answers: number[],
  questions: { question: string; answers: string[] }[],
  structuredSummary: any
): Promise<SaveScoreResult> => {
  const userDocRef = doc(db, "scores", userId);
  const newScoreEntry: ScoreEntry = {
    score,
    date: new Date(),
    answers: answers.map((answerIndex, i) => questions[i].answers[answerIndex]),
    answerIndices: answers,
    questions: questions.map((q) => q.question),
    structuredSummary,
  };

  try {
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      const userData = userDoc.data();
      const previousScore = userData?.score ?? 0;

      const updatedHistory = userData?.scoreHistory
        ? [...userData.scoreHistory, newScoreEntry]
        : [newScoreEntry];

      await updateDoc(userDocRef, {
        score,
        lastUpdated: new Date(),
        scoreHistory: updatedHistory,
        structuredSummary,
      });

      const message = score > previousScore
        ? `Great Job! Your score improved by ${score - previousScore} points!`
        : score === previousScore
        ? "Your score remains the same. Keep going!"
        : "Keep going! You can improve your score!";

      return { previousScore, message };
    } else {
      await setDoc(userDocRef, {
        userId,
        score,
        lastUpdated: new Date(),
        scoreHistory: [newScoreEntry],
        structuredSummary,
      });

      return {
        previousScore: null,
        message: "Great start! This is your first time taking the quiz.",
      };
    }
  } catch (error) {
    console.error("Error saving score:", error);
    return {
      previousScore: null,
      message: "Error saving score. Please try again.",
    };
  }
}; 