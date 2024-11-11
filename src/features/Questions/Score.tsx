/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db, model } from "@services/firebase";
import { doc, getDoc, setDoc, updateDoc, collection, addDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import ProgressBar from "./ProgressBar";
import { useNavigate } from "react-router-dom";
import "./Consolidated.css";

interface ScoreProps {
  score: number;
  totalQuestions: number;
  answers: number[];
  questions: { question: string; answers: string[] }[];
}

const Score: React.FC<ScoreProps> = ({
  score,
  totalQuestions,
  answers,
  questions,
}) => {
  const [isAIBoxVisible, setIsAIBoxVisible] = useState(false);
  const [previousScore, setPreviousScore] = useState<number | null>(null);
  const [message, setMessage] = useState<string>(
    "Great start! This is your first time taking the quiz."
  );
  const [aiResponse, setAiResponse] = useState<string>("");
  const [potentialQuestions, setPotentialQuestions] = useState<string[]>([]);
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  const maxScore = totalQuestions * 10;
  const percentageScore = (score / maxScore) * 100;

  const toggleAIBoxVisibility = () => {
    setIsAIBoxVisible((prev) => !prev);
  };

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
  
          // Update the document, including the email field
          await updateDoc(userDocRef, {
            score: score,
            lastUpdated: new Date(),
            email: user.email, // Add email here
            answers: answers.map(
              (answerIndex, i) => questions[i].answers[answerIndex]
            ),
            questions: questions.map((q) => q.question),
          });
        } else {
          // Create the document with email when it doesn't exist
          await setDoc(userDocRef, {
            userId: user.uid,
            email: user.email, // Add email here
            score: score,
            lastUpdated: new Date(),
            answers: answers.map(
              (answerIndex, i) => questions[i].answers[answerIndex]
            ),
            questions: questions.map((q) => q.question),
          });
          setMessage("Great start! This is your first time taking the quiz.");
        }
      };
  
      fetchScore().catch((error) =>
        console.error("Error fetching score:", error)
      );
    }
  }, [user, score, answers, questions]);
  

  useEffect(() => {
    const generateAISummary = async () => {
      try {
        // Prepare the questions and answers in a structured format
        const qaPairs = questions.map((q, i) => ({
          question: q.question,
          answer: q.answers[answers[i]],
        }));

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
            {
              role: "model",
              parts: [{ text: "Please provide the questions and answers." }],
            },
            {
              role: "user",
              parts: [{ text: JSON.stringify(qaPairs) }],
            },
          ],
          generationConfig: {
            maxOutputTokens: 500,
          },
        });

        const result = await chat.sendMessage(
          "Please provide a summary and suggestions."
        );
        const response = await result.response;
        const aiResponseText = await response.text();

        setAiResponse(aiResponseText);

        // Generate potential questions
        const questionResult = await chat.sendMessage(
          "Please provide the three most practical questions the user might have based on this information."
        );
        const questionResponse = await questionResult.response;
        const potentialQuestionsText = await questionResponse.text();

        // Split the response into lines and skip the first line
        const potentialQuestions = potentialQuestionsText
          .split("\n")
          .slice(1) // Skip the first line
          .filter((q) => q.trim() !== "");

        setPotentialQuestions(potentialQuestions.slice(0, 3)); // Limit to 3 questions
        console.log(potentialQuestions);
      } catch (error) {
        console.error("Error generating AI summary:", error);
      }
    };

    generateAISummary();
  }, [answers, questions]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setNotificationsEnabled(userDoc.data().notificationsEnabled || false);
        }
      }
    };

    fetchUserData();
  }, [user]);

  const handleEnableNotifications = async () => {
    if (user) {
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, { notificationsEnabled: true });
      setNotificationsEnabled(true);

      // Add a document to the messages collection to trigger the Twilio extension
      const userDoc = await getDoc(userDocRef);
      const phoneNumber = userDoc.data()?.phoneNumber;
      if (phoneNumber) {
        await addDoc(collection(db, "messages"), {
          to: phoneNumber,
          body: `Your current score is ${score}. Stay tuned for more updates and fun facts!`,
        });
      }
    }
  };

  const handleSendToChatbot = (question: string) => {};

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
        <span>
          <a href="#" onClick={toggleAIBoxVisibility} className="link">
            Click here
          </a>
          &nbsp; to see how to improve!
        </span>
      </div>

      <div
        className="ai-box"
        style={{ visibility: isAIBoxVisible ? "visible" : "hidden" }}
      >
        <h3>Sustainability Summary</h3>
        <p>{aiResponse}</p>
        <h4>Potential Questions</h4>
        <div className="potential-questions">
          {potentialQuestions.map((question, index) => (
            <button
              key={index}
              onClick={() => handleSendToChatbot(question)}
              style={{ marginTop: "10px" }}
            >
              {question}
            </button>
          ))}
        </div>
      </div>

      {!notificationsEnabled ? (
        <button onClick={handleEnableNotifications}>
          Enable Notifications for Updates and Fun Facts
        </button>
      ) : (
        <p>Notifications Enabled</p>
      )}
    </div>
  );
};

export default Score;
