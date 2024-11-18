/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { auth, db, model, structuredModel } from "@services/firebase";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
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

  const handleCircleClick = (circleName: string) => {
    setFlipped(flipped === circleName ? null : circleName); // Toggle flip
  };

  const handleQuestionClick = (question: string) => {
    addMessage({ sender: "user", text: question, needsResponse: true });
  };

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
              score: data.score || 0, // Default value if `score` is undefined
              scoreHistory: Array.isArray(data.scoreHistory)
                ? data.scoreHistory.map((history: any) => ({
                    answers: history.answers || [],
                    date: new Date(history.date || Date.now()), // Default to current date if not present
                    questions: history.questions || [],
                  }))
                : [], // Default to empty array if `scoreHistory` is undefined or not an array
              structuredSummary: {
                improvement: Array.isArray(data.structuredSummary?.improvement)
                  ? data.structuredSummary.improvement
                  : [], // Default to empty array if `improvement` is undefined or not an array
                strengths: Array.isArray(data.structuredSummary?.strengths)
                  ? data.structuredSummary.strengths
                  : [], // Default to empty array if `strengths` is undefined or not an array
              },
              userId: data.userId || "",
            } as MyScore;
          });
          setScoresList(scoresList);
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
    if (scoresList) {
      const userScore = scoresList.find((score) => score.id === userId);
      setScores(userScore ? userScore : null);
    }
  }, [scoresList]);

  useEffect(() => {
    const getQuestion = async () => {
      try {
        const qaPairs =
          scores?.scoreHistory[scores.scoreHistory.length - 1].questions.map(
            (question, i) => ({
              question,
              answer:
                scores?.scoreHistory[scores.scoreHistory.length - 1].answers[i],
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

        console.log(questionResult);

        const questionsArray = questionResult
          .split("\n") // Split by newline
          .map((line) => line.trim()) // Trim any leading/trailing spaces
          .filter((line) => line.includes("?")) // Keep only the lines that contain a question mark
          .map((line) => line.replace(/^(\d+\.\s\*\*|\*\*)/g, "")) // Remove numbering and formatting
          .map((line) => line.trim()); // Trim any remaining spaces

        setPotentialQuestions(questionsArray);
        console.log(questionsArray);
      } catch (error) {
        console.error("Error generating AI summary:", error);
      }
    };

    getQuestion();
  }, [scores]);

  return (
    <div className="summary-container">
      <h1 className="summary-title">Summary</h1>
      <div className="area-section">
        <div className="strengths-section">
          <h2 className="section-title"> Strengths </h2>
          {scores?.structuredSummary.strengths.map(({ area, description }) => (
            <div
              key={area} // Use area as the unique key
              className={`circle ${flipped === area ? "flipped" : ""}`}
              onClick={() => handleCircleClick(area)}
            >
              <div className="front">{area}</div> {/* Front text is the area */}
              {flipped === area && (
                <div className="back">{description}</div>
              )}{" "}
              {/* Back text is the description */}
            </div>
          ))}
        </div>

        <div className="strengths-section">
          <h2 className="section-title"> Improvement </h2>
          {scores?.structuredSummary.improvement.map(
            ({ area, description }) => (
              <div
                key={area} // Use area as the unique key
                className={`circle ${flipped === area ? "flipped" : ""}`}
                onClick={() => handleCircleClick(area)}
              >
                <div className="front">{area}</div>{" "}
                {/* Front text is the area */}
                {flipped === area && (
                  <div className="back">{description}</div>
                )}{" "}
                {/* Back text is the description */}
              </div>
            )
          )}
        </div>
      </div>
      <div className="change-section">
        <h2 className="change-title">Ready to make a change?</h2>
        <p className="change-description">
          Click one of our suggested questions below to get started, or ask us a
          question through the chat!
        </p>

        {/* Question */}
        <div className="question-buttons">
          {potentialQuestions.map((question, index) => (
            <button
              key={index}
              onClick={() => {
                handleQuestionClick(question);
                setIsVisible(true);
              }}
              className="question-button"
            >
              {question}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // return (
  //   <div className="summary-container">
  //     <h1 className="summary-title">Summary</h1>
  //     <div className="summary-content">
  //       <div className="strengths-section">
  //         <h2 className="section-title">Strengths</h2>
  //         <div
  //           className={`circle ${flipped === "electronics" ? "flipped" : ""}`}
  //           onClick={() => handleCircleClick("electronics")}
  //         >
  //           <div className="front">Electronics</div>
  //           {flipped === "electronics" && (
  //             <div className="back">
  //               You are efficient in managing electronics usage!
  //             </div>
  //           )}
  //         </div>
  //         <div
  //           className={`circle ${flipped === "water" ? "flipped" : ""}`}
  //           onClick={() => handleCircleClick("water")}
  //         >
  //           <div className="front">Water</div>
  //           {flipped === "water" && (
  //             <div className="back">
  //               You can improve water usage and conservation!
  //             </div>
  //           )}
  //         </div>
  //         <div
  //           className={`circle ${
  //             flipped === "transportation" ? "flipped" : ""
  //           }`}
  //           onClick={() => handleCircleClick("transportation")}
  //         >
  //           <div className="front">Transportation</div>
  //           {flipped === "transportation" && (
  //             <div className="back">
  //               Focus on sustainable transportation options!
  //             </div>
  //           )}
  //         </div>
  //       </div>
  //       <div className="improvements-section">
  //         <h2 className="section-title">Areas of Improvement</h2>
  //         <ul className="improvement-list">
  //           <li>Waste management</li>
  //           <li>Food choices</li>
  //           <li>Energy consumption</li>
  //         </ul>
  //       </div>
  //     </div>
  //     <div className="change-section">
  //       <h2 className="change-title">Ready to make a change?</h2>
  //       <p className="change-description">
  //         Click one of our suggested questions below to get started, or ask us a
  //         question through the chat!
  //       </p>

  //       {/* Question */}
  //       <div className="question-buttons">
  //         {potentialQuestions.map((question, index) => (
  //           <button
  //             key={index}
  //             onClick={() => {
  //               handleQuestionClick(question);
  //             }}
  //             className="question-button"
  //           >
  //             {question}
  //           </button>
  //         ))}
  //       </div>
  //     </div>
  //   </div>
  // );
};

export default Summary;
