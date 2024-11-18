/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db, model, structuredModel } from "@services/firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import ProgressBar from "./ProgressBar";
import { useChatContext } from "../../contexts/ChatContext";
import "./Consolidated.css";

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
  structuredSummary?: any;
}

const Score: React.FC<ScoreProps> = ({
  score,
  totalQuestions,
  answers,
  questions,
}) => {
  const [user] = useAuthState(auth);
  const [previousScore, setPreviousScore] = useState<number | null>(null);
  const [message, setMessage] = useState<string>(
    "Great start! This is your first time taking the quiz."
  );
  const [isAIBoxVisible, setIsAIBoxVisible] = useState(false);
  const [aiResponse, setAiResponse] = useState<string>("");
  const [potentialQuestions, setPotentialQuestions] = useState<string[]>([]);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const { addMessage, setIsVisible } = useChatContext();
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const [structuredSummary, setStructuredSummary] = useState<any>(null);

  const maxScore = totalQuestions * 10;
  const percentageScore = (score / maxScore) * 100;

  const getFeedback = () => {
    if (percentageScore >= 80) return "Your GreenView is Clear";
    if (percentageScore >= 60) return "Your GreenView is Clouded";
    if (percentageScore >= 40) return "Your GreenView is Hazy";
    if (percentageScore >= 20) return "Your GreenView is Smoky";
    return "Your GreenView is Polluted";
  };

  const generateStructuredSummary = async (qaPairs: any) => {
    try {
      const chat = structuredModel.startChat({
        history: [
          {
            role: "user",
            parts: [
              {
                text: "Based on the provided quiz questions and answers, generate a JSON summary with 'strengths' and 'improvements' fields. Each item in these fields should have two elements: the name of the area and a description. Limit each list to a maximum of three items.",
              },
            ],
          },
        ],
        generationConfig: { maxOutputTokens: 300 },
      });

      const result = await chat.sendMessage(JSON.stringify(qaPairs));
      let structuredResponse = await result.response.text();

      console.log("Raw structured response:", structuredResponse);

      // Remove any backticks and code block markers from the response
      if (structuredResponse.startsWith("```json")) {
        structuredResponse = structuredResponse
          .replace(/```json|```/g, "")
          .trim();
      }

      console.log("Cleaned structured response:", structuredResponse);

      // Parse the cleaned response
      const parsedResponse = JSON.parse(structuredResponse);
      console.log("Parsed Structured Summary:", parsedResponse);

      // Enforce a maximum of 3 items for both strengths and improvement
      const normalizedResponse = {
        strengths: (parsedResponse.strengths || []).slice(0, 3),
        improvement: (parsedResponse.improvements || []).slice(0, 3),
      };

      console.log(
        "Normalized Structured Summary (Max 3 items):",
        normalizedResponse
      );

      return normalizedResponse;
    } catch (error) {
      console.error("Error generating structured summary:", error);
      return { strengths: [], improvement: [] };
    }
  };

  useEffect(() => {
    const runAIBoxLogic = async () => {
      if (
        !isAIBoxVisible &&
        !aiResponse &&
        score &&
        totalQuestions &&
        answers.length > 0 &&
        questions.length > 0
      ) {
        setIsSummaryLoading(true);
        try {
          const qaPairs = questions.map((q, i) => ({
            question: q.question,
            answer: q.answers[answers[i]],
          }));

          // Generate unstructured summary
          const chat = model.startChat({
            history: [
              {
                role: "user",
                parts: [
                  {
                    text: "Generate a sustainability summary and suggestions based on the following quiz questions and answers.",
                  },
                ],
              },
            ],
            generationConfig: { maxOutputTokens: 500 },
          });

          const result = await chat.sendMessage(JSON.stringify(qaPairs));
          const aiResponseText = await result.response.text();
          setAiResponse(aiResponseText);

          // Generate structured summary
          const structuredSummary = await generateStructuredSummary(qaPairs);
          setStructuredSummary(structuredSummary);

          // Save the structured summary to Firestore
          if (user && structuredSummary) {
            const userDocRef = doc(db, "scores", user.uid);
            await updateDoc(userDocRef, { structuredSummary });
          }

          // Generate potential questions
          const questionResult = await chat.sendMessage(
            "Based on the previous context, provide three practical questions that the user might want to ask a chatbot that is a sustainability expert. Only provide the questions."
          );
          const potentialQuestionsText = await questionResult.response.text();

          const questionsArray = potentialQuestionsText
            .split("\n")
            .filter((q) => q.trim())
            .map((q) => q.substring(0, q.indexOf("?") + 1));

          setPotentialQuestions(questionsArray.slice(0, 3));
        } catch (error) {
          console.error("Error generating AI summary:", error);
        } finally {
          setIsSummaryLoading(false);
        }
      }
    };

    // Run the function when score, totalQuestions, answers, or questions change
    if (score && totalQuestions && answers.length > 0 && questions.length > 0) {
      runAIBoxLogic();
    }
  }, [score, totalQuestions, answers, questions, isAIBoxVisible, aiResponse, user]);

  useEffect(() => {
    const saveScore = async () => {
      if (user) {
        const userDocRef = doc(db, "scores", user.uid);
        const newScoreEntry: ScoreEntry = {
          score,
          date: new Date(),
          answers: answers.map(
            (answerIndex, i) => questions[i].answers[answerIndex]
          ),
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
                ? `Great Job! Your score improved by ${
                    score - previous
                  } points!`
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
          }
        } catch (error) {
          console.error("Error saving score:", error);
        }
      }
    };

    saveScore();
  }, [user, score, answers, questions]);

  const handleQuestionClick = (question: string) => {
    addMessage({ sender: "user", text: question, needsResponse: true });
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
    <div>
      <div className="score-container">
        <div className="score-box">
          <ProgressBar points={percentageScore} />
          <span className="score-number">{getFeedback()}</span>
          <span className="job">{message}</span>
          <a href="summary" className="link">
            Click here to your summary!
          </a>
          {!notificationsEnabled ? (
            <button onClick={handleEnableNotifications}>
              Enable Notifications
            </button>
          ) : (
            <p>Notifications Enabled</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Score;
