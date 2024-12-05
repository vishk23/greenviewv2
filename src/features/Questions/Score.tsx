/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@services/firebase";
import { doc, updateDoc } from "firebase/firestore";
import ProgressBar from "@components/ProgressBar/ProgressBar";
import { useChatContext } from "@contexts/ChatContext";
import Leaderboard from "@features/Leaderboard/Leaderboard";
import CollapsibleBox from "@components/CollapsibleBox/CollapsibleBox";
import { generateAISummary } from "../../utils/aiUtils";
import { saveUserScore } from "../../utils/scoreUtils";
import { motion, AnimatePresence } from "framer-motion";

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
  console.log("=== SCORE COMPONENT INITIALIZATION ===");
  console.log("User answers:", answers);
  console.log("Questions:", questions);
  console.log(
    "Selected answers:",
    questions.map((q, i) => ({
      question: q.question,
      selectedAnswer: q.answers[answers[i]],
    }))
  );

  // Auth state
  const [user] = useAuthState(auth);

  // Score and message state
  const [previousScore, setPreviousScore] = useState<number | null>(null);
  const [message, setMessage] = useState<string>(
    "Great start! This is your first time taking the quiz."
  );

  // Notification state
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

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
        console.log("Updating state with AI results...");
        setAiResponse(aiResult.summary);
        setStructuredSummary(aiResult.structuredSummary);
        setPotentialQuestions(aiResult.suggestedQuestions);

        console.log("Saving score to database...");
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
   * Enable notifications for the user
   */
  const handleEnableNotifications = async () => {
    if (user) {
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, { notificationsEnabled: true });
      setNotificationsEnabled(true);
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
        <div className="summary-section">
          <h4>Areas for Improvement</h4>
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
    );
  };

  /**
   * Render suggested questions section
   */
  const renderSuggestedQuestions = () => {
    if (!potentialQuestions.length) return null;
    return (
      <div className="suggested-questions">
        <h4>Suggested Questions</h4>
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
            <p>{aiResponse}</p>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="score-container">
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
        <span className="score-number">{getFeedback()}</span>
        <span className="job">{message}</span>
        {!notificationsEnabled ? (
          <button onClick={handleEnableNotifications}>
            Enable Notifications
          </button>
        ) : (
          <p>Notifications Enabled</p>
        )}
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
                  <div className="popup-title">
                    <h2>Read Me</h2>
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
              <h4>Additional Insights</h4>
              <p>{aiResponse}</p>
            </div>
          )}
        </CollapsibleBox>
      </motion.div>
    </div>
  );
};

export default Score;
