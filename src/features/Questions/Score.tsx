/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db, model } from "@services/firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import ProgressBar from "./ProgressBar";
import { useChatContext } from "../../contexts/ChatContext";
import Leaderboard from '@features/Leaderboard/Leaderboard';
import "./Consolidated.css";
import ReactMarkdown from "react-markdown";

interface ScoreProps {
  score: number;
  totalQuestions: number;
  answers: number[];
  questions: { question: string; answers: string[] }[];
}

interface ScoreEntry {
  score: number;
  date: Date;
  answers: string[];
  questions: string[];
}

const Score: React.FC<ScoreProps> = ({
  score,
  totalQuestions,
  answers,
  questions,
}) => {
  const [user] = useAuthState(auth);
  const [previousScore, setPreviousScore] = useState<number | null>(null);
  const [message, setMessage] = useState<string>("Great start! This is your first time taking the quiz.");
  const [isAIBoxVisible, setIsAIBoxVisible] = useState(false);
  const [aiResponse, setAiResponse] = useState<string>("");
  const [potentialQuestions, setPotentialQuestions] = useState<string[]>([]);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const { addMessage, setIsVisible } = useChatContext();
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);

  const maxScore = totalQuestions * 10;
  const percentageScore = (score / maxScore) * 100;

  const getFeedback = () => {
    if (percentageScore >= 80) return "Your GreenView is Clear 🌍🌱";
    if (percentageScore >= 60) return "Your GreenView is Clouded ☁️☁️";
    if (percentageScore >= 40) return "Your GreenView is Hazy 🌫️🌫️";
    if (percentageScore >= 20) return "Your GreenView is Smoky 💨🏭";
    return "Your GreenView is Polluted ☣️⚠️";
  };

  const toggleAIBoxVisibility = async () => {
    const newVisibility = !isAIBoxVisible;
    setIsAIBoxVisible(newVisibility);
    
    if (newVisibility && !aiResponse) {
      setIsSummaryLoading(true);
      try {
        const qaPairs = questions.map((q, i) => ({
          question: q.question,
          answer: q.answers[answers[i]],
        }));

        const chat = model.startChat({
          history: [
            {
              role: "user",
              parts: [{ text: "Generate a sustainability summary and suggestions based on the following quiz questions and answers." }],
            }
          ],
          generationConfig: { maxOutputTokens: 500 },
        });

        const result = await chat.sendMessage(JSON.stringify(qaPairs));
        const aiResponseText = await result.response.text();
        setAiResponse(aiResponseText);

        const questionResult = await chat.sendMessage(
          "Based on the previous context, provide three practical questions that the user might want to ask a chat bot that is a sustainability expert. Only provide the questions, nothing else."
        );
        const potentialQuestionsText = await questionResult.response.text();

        const questionsArray = potentialQuestionsText
          .split("\n")
          .filter(q => q.trim())
          .map(q => {
            const questionEndIndex = q.indexOf('?') + 1;
            return q.substring(0, questionEndIndex);
          });

        setPotentialQuestions(questionsArray.slice(0, 3));
      } catch (error) {
        console.error("Error generating AI summary:", error);
      } finally {
        setIsSummaryLoading(false);
      }
    }
  };

  useEffect(() => {
    const saveScore = async () => {
      if (user) {
        const userDocRef = doc(db, "scores", user.uid);
        const newScoreEntry: ScoreEntry = {
          score,
          date: new Date(),
          answers: answers.map((answerIndex, i) => questions[i].answers[answerIndex]),
          questions: questions.map((q) => q.question),
        };

        try {
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
            const previous = userData?.score ?? 0;
            setPreviousScore(previous);

            const updatedHistory = userData?.scoreHistory
              ? [...userData.scoreHistory, newScoreEntry]
              : [newScoreEntry];

            await updateDoc(userDocRef, {
              score,
              lastUpdated: new Date(),
              scoreHistory: updatedHistory,
            });

            setMessage(
              score > previous
                ? `Great Job! Your score improved by ${score - previous} points!`
                : score === previous
                ? "Your score remains the same. Keep going!"
                : "Keep going! You can improve your score!"
            );
          } else {
            await setDoc(userDocRef, {
              userId: user.uid,
              score,
              lastUpdated: new Date(),
              scoreHistory: [newScoreEntry],
            });
            setMessage("Great start! This is your first time taking the quiz.");
          }
        } catch (error) {
          console.error("Error saving score:", error);
        }
      }
    };

    saveScore();
  }, [user, score, answers, questions]);

  const handleQuestionClick = (question: string) => {
    addMessage({ 
      sender: "user", 
      text: question,
      needsResponse: true  // Make sure this flag is set to true
    });
    setIsVisible(true);
    setIsAIBoxVisible(false);
  };
  

  const handleEnableNotifications = async () => {
    if (user) {
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, { notificationsEnabled: true });
      setNotificationsEnabled(true);
    }
  };

  return (
    <div className="score-container">
      <div className="score-box">
        <div className="progress-bar-wrapper">
          <ProgressBar points={percentageScore} />
        </div>
        <div className="score-display">
          <span className="score-number">{getFeedback()}</span>
          <span className="score-number">{getFeedback()}</span>
          <span className="job">{message}</span>
        </div>
        <button onClick={toggleAIBoxVisibility} className="link">
          Click here to see how to improve!
        </button>
      </div>

      {/* AI Summary Section */}
      {isAIBoxVisible && (
  <>
    {/* Backdrop for dimming the background */}
    <div className="backdrop" onClick={toggleAIBoxVisibility}></div>

    {/* AI Summary Box */}
    <div className="ai-box">
      <h3>Sustainability Summary</h3>
      {isSummaryLoading ? (
        <p>Loading summary...</p>
      ) : (
        <div className="markdown-content">
          <ReactMarkdown>{aiResponse}</ReactMarkdown>
        </div>
      )}

      {/* Potential Questions Section */}
      {!isSummaryLoading && (
        <div className="questions-section">
          <h4>Potential Questions</h4>
          <div className="potential-questions">
            {potentialQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => {
                  handleQuestionClick(question);
                  toggleAIBoxVisibility(); // Close the modal when a question is clicked
                }}
                className="question-button"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  </>
)}

      {/* Enable Notifications Section */}
      {!notificationsEnabled ? (
        <button onClick={handleEnableNotifications} className="enable-notifications-button">
          Enable Notifications
        </button>
      ) : (
        <p>Notifications Enabled</p>
      )}

      <Leaderboard />
    </div>
  );
};


export default Score;