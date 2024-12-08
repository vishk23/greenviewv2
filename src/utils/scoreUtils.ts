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
  streak?: number;
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
      const currentStreak = userData?.streak ?? 0;
      const lastQuizDate = userData?.lastUpdated?.toDate();
      
      // Calculate days since last quiz
      const daysSinceLastQuiz = lastQuizDate 
        ? Math.floor((new Date().getTime() - lastQuizDate.getTime()) / (1000 * 60 * 60 * 24))
        : null;

      // Determine new streak
      let newStreak = currentStreak;
      if (daysSinceLastQuiz === null) {
        // First quiz
        newStreak = 1;
      } else if (daysSinceLastQuiz >= 6 && daysSinceLastQuiz <= 8) {
        // Quiz taken within 6-8 day window
        newStreak += 1;
      } else {
        // Reset streak if outside window
        newStreak = 1;
      }

      const updatedHistory = userData?.scoreHistory
        ? [...userData.scoreHistory, newScoreEntry]
        : [newScoreEntry];

      await updateDoc(userDocRef, {
        score,
        lastUpdated: new Date(),
        scoreHistory: updatedHistory,
        structuredSummary,
        streak: newStreak
      });

      let message = score > previousScore
        ? `Great Job! Your score improved by ${score - previousScore} points!`
        : score === previousScore
        ? "Your score remains the same. Keep going!"
        : "Keep going! You can improve your score!";

      // Add streak message
      if (newStreak > currentStreak) {
        message += ` 🔥 Streak increased to ${newStreak}!`;
      } else if (newStreak === 1 && currentStreak > 1) {
        message += ` Streak reset. Take the quiz every 6-8 days to build your streak!`;
      }

      return { previousScore, message, streak: newStreak };
    } else {
      // First time taking quiz
      await setDoc(userDocRef, {
        userId,
        score,
        lastUpdated: new Date(),
        scoreHistory: [newScoreEntry],
        structuredSummary,
        streak: 1
      });

      return {
        previousScore: null,
        message: "Great start! This is your first time taking the quiz. Come back in 6-8 days to build your streak!",
        streak: 1
      };
    }
  } catch (error) {
    console.error("Error saving score:", error);
    return {
      previousScore: null,
      message: "Error saving score. Please try again.",
      streak: 0
    };
  }
}; 