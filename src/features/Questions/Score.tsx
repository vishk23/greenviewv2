/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@services/firebase";
import {
  doc,
  updateDoc,
  getDoc,
  addDoc,
  collection,
  onSnapshot,
} from "firebase/firestore";
import ProgressBar from "@components/ProgressBar/ProgressBar";
import { useChatContext } from "@contexts/ChatContext";
import Leaderboard from "@features/Leaderboard/Leaderboard";
import CollapsibleBox from "@components/CollapsibleBox/CollapsibleBox";
import { generateAISummary } from "../../utils/aiUtils";
import { saveUserScore } from "../../utils/scoreUtils";
import { motion, AnimatePresence } from "framer-motion";
import "./Score.css";
import ReactMarkdown from "react-markdown";

interface ScoreProps {
  score: number;
  totalQuestions: number;
  answers: number[];
  questions: { question: string; answers: string[] }[];
}

interface StructuredSummaryItem {
  area: string;
  description: string;
}

interface StructuredSummary {
  strengths: StructuredSummaryItem[];
  improvement: StructuredSummaryItem[];
}

/**
 * Score component displays the quiz results, leaderboard, and personalized summary
 */
const Score: React.FC<ScoreProps> = ({
  score,
  totalQuestions,
  answers,
  questions,
}) => {
  // Auth state
  const [user] = useAuthState(auth);

  // Score and message state
  const [previousScore, setPreviousScore] = useState<number | null>(null);
  const [message, setMessage] = useState<string>(
    "Great start! This is your first time taking the quiz."
  );

  // Chat context for suggested questions
  const { addMessage, setIsVisible } = useChatContext();

  // AI-generated content state
  const [isGeneratingAI, setIsGeneratingAI] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [structuredSummary, setStructuredSummary] =
    useState<StructuredSummary | null>(null);
  const [aiResponse, setAiResponse] = useState<string>("");
  const [potentialQuestions, setPotentialQuestions] = useState<string[]>([]);

  const [flippedIndex, setFlippedIndex] = useState<number | null>(null);

  // Calculate score percentage
  const maxScore = totalQuestions * 10;
  const percentageScore = (score / maxScore) * 100;

  /**
   * Get feedback message based on score percentage
   */
  const getFeedback = () => {
    if (percentageScore >= 80) return "Your GreenView is Clear";
    if (percentageScore >= 60) return "Your GreenView is Clouded";
    if (percentageScore >= 40) return "Your GreenView is Hazy";
    if (percentageScore >= 20) return "Your GreenView is Smoky";
    return "Your GreenView is Polluted";
  };

  /**
   * Initialize score and generate AI summary
   */
  useEffect(() => {
    const initializeScore = async () => {
      if (!user) {
        console.log("No user found, skipping initialization");
        return;
      }

      console.log("=== STARTING AI GENERATION ===");
      console.log("Input data:", {
        questions,
        answers,
        selectedAnswers: questions.map((q, i) => ({
          question: q.question,
          selectedAnswer: q.answers[answers[i]],
        })),
      });

      setIsGeneratingAI(true);
      setHasError(false);

      try {
        console.log("Calling generateAISummary...");
        const aiResult = await generateAISummary(questions, answers);
        console.log("AI Generation Result:", aiResult);

        // Update state with AI results

        setAiResponse(aiResult.summary);
        setStructuredSummary(aiResult.structuredSummary);
        setPotentialQuestions(aiResult.suggestedQuestions);

        const scoreResult = await saveUserScore(
          user.uid,
          score,
          answers,
          questions,
          aiResult.structuredSummary
        );
        console.log("Score save result:", scoreResult);

        setPreviousScore(scoreResult.previousScore);
        setMessage(scoreResult.message);
      } catch (error) {
        console.error("Error in initializeScore:", error);
        setHasError(true);
      } finally {
        console.log("Finishing AI generation, setting isGeneratingAI to false");
        setIsGeneratingAI(false);
      }
    };

    initializeScore();
  }, [user, score, answers, questions]);

  /**
   * Handle clicking a suggested question
   */
  const handleQuestionClick = (question: string) => {
    addMessage({ sender: "user", text: question, needsResponse: true });
    setIsVisible(true);
  };

  const toggleFlip = (index: number | null) => {
    setFlippedIndex((prevIndex) => (prevIndex === index ? null : index)); // Flip or reset
  };

  const renderDescription = (index: number) => {
    if (structuredSummary == null) return "Error";
    if (index < 100) {
      return structuredSummary.strengths[index].description;
    } else {
      return structuredSummary.improvement[index - 100].description;
    }
  };

  /**
   * Render strengths and improvements sections
   */
  const renderStrengthsAndImprovements = () => {
    if (!structuredSummary) return null;
    return (
      <div className="summary-areas">
        <div className="summary-section">
          <h4>Strengths</h4>
          <div className="items-section">
            {structuredSummary.strengths.map((item, index) => (
              <div
                key={index}
                className="summary-item"
                onClick={() => toggleFlip(index)}
              >
                <h5>{item.area}</h5>
              </div>
            ))}
          </div>
        </div>
        <div className="summary-section">
          <h4>Areas for Improvement</h4>
          <div className="items-section">
            {structuredSummary.improvement.map((item, index) => (
              <div
                key={index}
                className="summary-item"
                onClick={() => toggleFlip(index + 100)}
              >
                <h5>{item.area}</h5>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  /**
   * Render suggested questions section
   */
  const renderSuggestedQuestions = () => {
    if (!potentialQuestions.length) return null;
    return (
      <div className="suggested-questions">
        <h4>Click to ask our Sustainability Expert Chatbot!</h4>
        <div className="questions-list">
          {potentialQuestions.map((question, index) => (
            <button
              key={index}
              onClick={() => handleQuestionClick(question)}
              className="question-button"
            >
              {question}
            </button>
          ))}
        </div>
      </div>
    );
  };

  /**
   * Render loading spinner
   */
  const renderLoadingSpinner = () => (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Analyzing your responses...</p>
    </div>
  );

  /**
   * Render error message
   */
  const renderError = () => (
    <div className="error-message">
      <p>Sorry, we couldn't generate your summary. Please try again later.</p>
    </div>
  );

  /**
   * Render summary content
   */
  const renderSummaryContent = () => {
    console.log("=== RENDERING SUMMARY ===");
    console.log("Current state:", {
      hasError,
      isGeneratingAI,
      structuredSummary,
      aiResponse,
      potentialQuestions,
      user: user?.uid,
    });

    if (hasError) {
      console.log("Rendering error state");
      return renderError();
    }
    if (isGeneratingAI) {
      console.log("Rendering loading state");
      return renderLoadingSpinner();
    }

    console.log("Rendering full summary with:", {
      hasStructuredSummary: !!structuredSummary,
      hasAiResponse: !!aiResponse,
      numQuestions: potentialQuestions.length,
    });

    return (
      <>
        {structuredSummary && <div>{renderStrengthsAndImprovements()}</div>}
        {renderSuggestedQuestions()}
        {aiResponse && (
          <div className="ai-response">
            <h4>Additional Insights</h4>
            <ReactMarkdown>{aiResponse}</ReactMarkdown>
          </div>
        )}
      </>
    );
  };

  // Add these state variables at the top with other states
  const [countdown, setCountdown] = useState<string>("");
  const [notificationSent, setNotificationSent] = useState(false);

  // Add this state at the top with other states
  const [lastQuizDate, setLastQuizDate] = useState<Date>(new Date());

  // Add function to find the relevant quiz date
  const findRelevantQuizDate = async (userId: string): Promise<Date> => {
    try {
      const userScoreRef = doc(db, "scores", userId);
      const scoreDoc = await getDoc(userScoreRef);

      if (scoreDoc.exists()) {
        const scoreData = scoreDoc.data();
        const scoreHistory = scoreData.scoreHistory || [];
        const now = new Date();
        const eightDaysAgo = new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000);

        // Filter scores within last 8 days and sort by date
        const recentScores = scoreHistory
          .filter((score: any) => score.date.toDate() > eightDaysAgo)
          .sort(
            (a: any, b: any) =>
              a.date.toDate().getTime() - b.date.toDate().getTime()
          );

        if (recentScores.length > 0) {
          // Return the oldest quiz date within the 8-day window
          return recentScores[0].date.toDate();
        }
      }

      // If no relevant quiz found, use current time
      return new Date();
    } catch (error) {
      console.error("Error finding relevant quiz date:", error);
      return new Date();
    }
  };

  // Update handleNotifyMe to use the relevant quiz date
  const handleNotifyMe = async () => {
    if (user) {
      try {
        setNotificationStatus("PENDING");

        // Enable notifications for the user
        const userDocRef = doc(db, "users", user.uid);
        await updateDoc(userDocRef, { notificationsEnabled: true });

        // Get user's phone number
        const userDoc = await getDoc(userDocRef);
        const phoneNumber = userDoc.data()?.phoneNumber;

        if (!phoneNumber) {
          setNotificationStatus("ERROR");
          return;
        }

        // Get the relevant quiz date
        const relevantQuizDate = await findRelevantQuizDate(user.uid);

        // Calculate dates based on the relevant quiz date
        const nextQuizDate = new Date(relevantQuizDate);
        nextQuizDate.setDate(nextQuizDate.getDate() + 6);
        const endWindow = new Date(relevantQuizDate);
        endWindow.setDate(endWindow.getDate() + 8);

        // Check if we're already past the window
        const now = new Date();
        if (now > endWindow) {
          // If past window, set new window starting from now
          nextQuizDate.setTime(now.getTime() + 6 * 24 * 60 * 60 * 1000);
          endWindow.setTime(now.getTime() + 8 * 24 * 60 * 60 * 1000);
        }

        const formatDate = (date: Date) => {
          return date.toLocaleDateString("en-US", {
            month: "numeric",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          });
        };

        const message = `${getFeedback()}! Retake between ${formatDate(
          nextQuizDate
        )} - ${formatDate(endWindow)} to build your streak!`;

        // Send message and store the reference
        const messageRef = await addDoc(collection(db, "messages"), {
          to: phoneNumber,
          body: message,
          scheduling: {
            sendAt: nextQuizDate.toISOString(),
          },
        });

        setMessageId(messageRef.id);
      } catch (error) {
        console.error("Error sending notification:", error);
        setNotificationStatus("ERROR");
      }
    }
  };

  // Update the countdown timer to use the relevant quiz date
  useEffect(() => {
    const updateCountdown = async () => {
      if (!user) return;

      const relevantQuizDate = await findRelevantQuizDate(user.uid);
      setLastQuizDate(relevantQuizDate);
    };

    updateCountdown();
  }, [user]);

  // Update the state type to match Twilio's status
  const [notificationStatus, setNotificationStatus] = useState<
    "PENDING" | "SUCCESS" | "ERROR" | null
  >(null);

  // Add state for the message ID to track
  const [messageId, setMessageId] = useState<string | null>(null);

  // Update the useEffect to monitor message status
  useEffect(() => {
    if (!messageId) return;

    const unsubscribe = onSnapshot(doc(db, "messages", messageId), (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        if (data.delivery?.state === "SUCCESS") {
          setNotificationStatus("SUCCESS");
        } else if (data.delivery?.state === "ERROR") {
          setNotificationStatus("ERROR");
        }
      }
    });

    return () => unsubscribe();
  }, [messageId]);

  // Check notification status on mount and send if enabled
  useEffect(() => {
    const checkAndSendNotification = async () => {
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists() && userDoc.data()?.notificationsEnabled) {
          handleNotifyMe();
        }
      }
    };

    checkAndSendNotification();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    console.log("Current notification status:", notificationStatus);
    console.log("Current message ID:", messageId);
  }, [notificationStatus, messageId]);

  useEffect(() => {
    //console.log('Current countdown:', countdown);
  }, [countdown]);

  // Update the useEffect for countdown calculation
  useEffect(() => {
    const calculateTimeLeft = () => {
      if (!lastQuizDate) return "";

      const nextQuizDate = new Date(lastQuizDate);
      nextQuizDate.setDate(nextQuizDate.getDate() + 6);

      const now = new Date();
      const difference = nextQuizDate.getTime() - now.getTime();

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      return `${days}:${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    };

    const timer = setInterval(() => {
      setCountdown(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [lastQuizDate]);

  // Make sure this useEffect runs when component mounts
  useEffect(() => {
    if (user) {
      findRelevantQuizDate(user.uid);
    }
  }, [user]);

  // Add this function to handle retake
  const handleRetake = () => {
    window.location.reload();
  };

  const getTitle = (index: number) => {
    if (structuredSummary == null) return "Error";
    if (index < 100) {
      return structuredSummary.strengths[index].area;
    } else {
      return structuredSummary.improvement[index - 100].area;
    }
  };

  const getSource = () => {
    if (percentageScore == null) return "";
    if (percentageScore >= 80) return "/statement/Clear.gif";
    if (percentageScore >= 60) return "/statement/Clouded.gif";
    if (percentageScore >= 40) return "/statement/Hazy.gif";
    if (percentageScore >= 20) return "/statement/Smoky.gif";
    return "/statement/Polluted.gif";
  };

  return (
    <div className="score-container">
      <div className="animation-cover">
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
      </div>
      <motion.div
        className="score-box"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 1.2,
          ease: "easeOut",
        }}
      >
        <div className="progress-bar-container">
          <div
            className="progress-bar"
            style={{
              width: `${percentageScore}%`,
              background:
                "linear-gradient(to right, #f2745f, rgb(159, 195, 123))",
            }}
          />
          <p>{percentageScore.toFixed(2)}/100 points</p>
        </div>
        <div className="score-status-message">{getFeedback()}</div>
        <div className="score-improvement-message">{message}</div>
        <div className="notification-section">
          <div className="retake-countdown">
            Retake quiz in {countdown} to build a streak
          </div>
          <div className="button-row">
            <button onClick={handleRetake} className="retake-button">
              Retake Quiz
            </button>
            {!notificationStatus ? (
              <button onClick={handleNotifyMe} className="notify-button">
                Notify Me
              </button>
            ) : (
              <div
                className={`notification-status ${notificationStatus.toLowerCase()}`}
              >
                {notificationStatus === "PENDING" && "Processing..."}
                {notificationStatus === "SUCCESS" && "Notification sent!"}
                {notificationStatus === "ERROR" && "Failed to send"}
              </div>
            )}
          </div>
        </div>
      </motion.div>
      <motion.div
        className="collapsible-sections"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 1.5,
          delay: 1,
          ease: "easeOut",
        }}
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <CollapsibleBox
          title="Leaderboard"
          defaultOpen={true}
          type="leaderboard"
        >
          <Leaderboard />
        </CollapsibleBox>

        <CollapsibleBox
          title="Your Summary"
          defaultOpen={true}
          isLoading={isGeneratingAI}
          hasError={hasError}
          type="summary"
        >
          {structuredSummary && (
            <div>
              {renderStrengthsAndImprovements()}
              {flippedIndex !== null && (
                <div className="description">
                  <div className="popup-title2">
                    <h2>{getTitle(flippedIndex)}</h2>
                    <button
                      onClick={() => setFlippedIndex(null)}
                      className="close-button"
                    >
                      <img
                        src="/icons/close.png"
                        className="close-button"
                        alt=""
                      />
                    </button>
                  </div>
                  <p>{renderDescription(flippedIndex)}</p>
                </div>
              )}
            </div>
          )}
          {renderSuggestedQuestions()}
          {aiResponse && (
            <div className="ai-response">
              <ReactMarkdown>{aiResponse}</ReactMarkdown>
            </div>
          )}
        </CollapsibleBox>
      </motion.div>
    </div>
  );
};

export default Score;
