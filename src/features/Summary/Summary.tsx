/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { auth, db, model } from "@services/firebase";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { MyScore } from "./Scores";
import "./Summary.css";

const Summary: React.FC = () => {
  const [scores, setScores] = useState<MyScore | null>(null);
  const [aiResponse, setAiResponse] = useState<string>("");
  const [potentialQuestions, setPotentialQuestions] = useState<string[]>([]);
  const [user] = useAuthState(auth);
  const userId = user?.uid;

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
              answers: data.answers,
              lastUpdated: data.lastUpdated,
              questions: data.questions,
              score: data.score,
              userId: data.userId,
            } as MyScore;
          });
          const userScore = scoresList.find((score) => score.id === userId);
          setScores(userScore ? userScore : null);
        } catch (error) {
          console.error("Error fetching events: ", error);
        }
      };

      fetchScores().catch((error) =>
        console.error("Error fetching score:", error)
      );
    }
  }, [user]);

  useEffect(() => {
    const generateAISummary = async () => {
      try {
        // Prepare the questions and answers in a structured format
        const qaPairs =
          scores?.questions.map((question, i) => ({
            question,
            answer: scores?.answers[i],
          })) || [];

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
      } catch (error) {
        console.error("Error generating AI summary:", error);
      }
    };

    console.log(scores);
    if (scores != null) {
      generateAISummary();
    }
  }, [scores]);

  return (
    <div className="ai-box">
      <h3>Sustainability Summary</h3>
      <p>{aiResponse}</p>
      <h4>Potential Questions</h4>
      <div className="potential-questions">
        {potentialQuestions.map((question, index) => (
          <button key={index} style={{ marginTop: "10px" }}>
            {question}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Summary;
