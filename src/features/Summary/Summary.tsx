/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { auth, db, model, structuredModel } from "@services/firebase";
import { useEffect, useState } from "react";
import { collection, getDocs, doc, getDoc, updateDoc, addDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { MyScore } from "./Scores";
import { useChatContext } from "../../contexts/ChatContext";
import "./Summary.css";

const Summary: React.FC = () => {
  const [scoresList, setScoresList] = useState<MyScore[] | null>(null);
  const [scores, setScores] = useState<MyScore | null>(null);
  const [potentialQuestions, setPotentialQuestions] = useState<string[]>([]);
  const [user] = useAuthState(auth);
  const userId = user?.uid;
  const [flipped, setFlipped] = useState<string | null>(null);
  const { addMessage, setIsVisible } = useChatContext();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  const handleCircleClick = (circleName: string) => {
    setFlipped(flipped === circleName ? null : circleName);
  };

  const handleQuestionClick = (question: string) => {
    addMessage({ sender: "user", text: question, needsResponse: true });
    setIsVisible(true);
  };

  // Function to send SMS notification
  const sendSMSNotification = async (score: number) => {
    if (user) {
      try {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const phoneNumber = userDoc.data()?.phoneNumber;
          if (phoneNumber) {
            await addDoc(collection(db, "messages"), {
              to: phoneNumber,
              body: `Your current score is ${score}. Stay tuned for more updates and fun facts!`,
            });
            console.log("SMS sent successfully.");
          }
        }
      } catch (error) {
        console.error("Error sending SMS:", error);
      }
    }
  };

  // Fetch scores from Firestore
  useEffect(() => {
    if (user) {
      const fetchScores = async () => {
        try {
          const scoresCollection = collection(db, "scores");
          const scoresSnapshot = await getDocs(scoresCollection);
          const scoresList = scoresSnapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              score: data.score || 0,
              scoreHistory: Array.isArray(data.scoreHistory)
                ? data.scoreHistory.map((history: any) => ({
                    answers: history.answers || [],
                    date: new Date(history.date || Date.now()),
                    questions: history.questions || [],
                  }))
                : [],
              structuredSummary: {
                improvement: Array.isArray(data.structuredSummary?.improvement)
                  ? data.structuredSummary.improvement
                  : [],
                strengths: Array.isArray(data.structuredSummary?.strengths)
                  ? data.structuredSummary.strengths
                  : [],
              },
              userId: data.userId || "",
            } as MyScore;
          });
          setScoresList(scoresList);
        } catch (error) {
          console.error("Error fetching events:", error);
        }
      };

      fetchScores().catch((error) =>
        console.error("Error fetching score:", error)
      );
    }
  }, [user]);

  // Find the current user's score
  useEffect(() => {
    if (scoresList) {
      const userScore = scoresList.find((score) => score.id === userId);
      setScores(userScore ? userScore : null);
    }
  }, [scoresList]);

  // Generate questions using AI model
  useEffect(() => {
    const getQuestion = async () => {
      try {
        const qaPairs =
          scores?.scoreHistory[scores.scoreHistory.length - 1].questions.map(
            (question, i) => ({
              question,
              answer: scores?.scoreHistory[scores.scoreHistory.length - 1].answers[i],
            })
          ) || [];

        const chat = model.startChat({
          history: [
            {
              role: "user",
              parts: [
                {
                  text: "Based on the following quiz questions and answers, provide three practical questions that the user might want to ask a chatbot that is a sustainability expert. Only provide the questions.",
                },
              ],
            },
          ],
          generationConfig: { maxOutputTokens: 500 },
        });

        const result = await chat.sendMessage(JSON.stringify(qaPairs));
        const questionResult = await result.response.text();

        const questionsArray = questionResult
          .split("\n")
          .map((line) => line.trim())
          .filter((line) => line.includes("?"))
          .map((line) => line.replace(/^(\d+\.\s\*\*|\*\*)/g, ""))
          .map((line) => line.trim());

        setPotentialQuestions(questionsArray);
      } catch (error) {
        console.error("Error generating AI summary:", error);
      }
    };

    getQuestion();
  }, [scores]);

  // Handle enabling notifications
  const handleEnableNotifications = async () => {
    if (user) {
      try {
        const userDocRef = doc(db, "users", user.uid);
        await updateDoc(userDocRef, { notificationsEnabled: true });
        setNotificationsEnabled(true);

        // Send an initial SMS notification
        if (scores) {
          await sendSMSNotification(scores.score);
        }
      } catch (error) {
        console.error("Error enabling notifications:", error);
      }
    }
  };

  return (
    <div className="summary-container">
      <h1 className="summary-title">Summary</h1>
      <div className="area-section">
        <div className="strengths-section">
          <h2 className="section-title"> Strengths </h2>
          {scores?.structuredSummary.strengths.map(({ area, description }) => (
            <div
              key={area}
              className={`circle ${flipped === area ? "flipped" : ""}`}
              onClick={() => handleCircleClick(area)}
            >
              <div className="front">{area}</div>
              {flipped === area && <div className="back">{description}</div>}
            </div>
          ))}
        </div>

        <div className="strengths-section">
          <h2 className="section-title"> Improvement </h2>
          {scores?.structuredSummary.improvement.map(({ area, description }) => (
            <div
              key={area}
              className={`circle ${flipped === area ? "flipped" : ""}`}
              onClick={() => handleCircleClick(area)}
            >
              <div className="front">{area}</div>
              {flipped === area && <div className="back">{description}</div>}
            </div>
          ))}
        </div>
      </div>
      <div className="change-section">
        <h2 className="change-title">Ready to make a change?</h2>
        <p className="change-description">
          Click one of our suggested questions below to get started, or ask us a question through the chat!
        </p>
        <div className="question-buttons">
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

export default Summary;
