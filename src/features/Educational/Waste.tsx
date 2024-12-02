/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@services/firebase";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import ProgressBar from "@components/ProgressBar/ProgressBar";
import { ModuleCompletion } from "./ModuleCompletion";
import "./Module.css";

const WasteModule: React.FC = () => {
  const [quizAnswers, setQuizAnswers] = useState<{ [key: string]: string }>({});
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const navigate = useNavigate();
  const [user] = useAuthState(auth);

  const questions = [
    {
      id: "q1",
      question: "Which of the following items is NOT recyclable?",
      answers: ["Paper", "Glass", "Plastic bags", "Cardboard"],
      correctAnswer: "Plastic bags",
    },
    {
      id: "q2",
      question: "What is the primary environmental concern with landfills?",
      answers: [
        "Methane emissions",
        "Noise pollution",
        "Visual clutter",
        "None of the above",
      ],
      correctAnswer: "Methane emissions",
    },
    {
      id: "q3",
      question: "Which of the following should NOT go in the compost bin?",
      answers: ["Fruit peels", "Coffee grounds", "Eggshells", "Plastic utensils"],
      correctAnswer: "Plastic utensils",
    },
    {
      id: "q4",
      question: 'What is "wishful recycling"?',
      answers: [
        "Recycling only when convenient",
        "Placing non-recyclables in the recycling bin",
        "Recycling items in perfect condition only",
        "None of the above",
      ],
      correctAnswer: "Placing non-recyclables in the recycling bin",
    },
    {
      id: "q5",
      question:
        "How much waste does the average college student produce per year?",
      answers: ["300 lbs", "500 lbs", "640 lbs", "800 lbs"],
      correctAnswer: "640 lbs",
    },
  ];

  const handleQuizSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const currentQuestionData = questions[currentQuestion];
    const userAnswer = quizAnswers[currentQuestionData.id];

    if (userAnswer === currentQuestionData.correctAnswer) {
      setQuizFeedback("Correct!");
      setProgress((prev) =>
        Math.min(prev === 0 ? 20 : prev + (100 * 0.2), 100)
      );
    } else {
      setQuizFeedback(
        `Oops! The correct answer is ${currentQuestionData.correctAnswer}.`
      );
    }
  };

  const handleAnswerChange = (value: string) => {
    setQuizAnswers((prev) => ({
      ...prev,
      [questions[currentQuestion].id]: value,
    }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setQuizFeedback(null);
    } else {
      setIsCompleted(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
      setQuizFeedback(null);
    }
  };

  const saveCompletionStatus = async () => {
    if (user && progress === 100 && !isCompleted) {
      try {
        const userDocRef = doc(db, "moduleCompletion", user.uid);
        const newCompletion: ModuleCompletion = {
          userId: user.uid,
          wasteModule: true,
        };

        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          await updateDoc(userDocRef, { wasteModule: true });
        } else {
          await setDoc(userDocRef, newCompletion);
        }

        setIsCompleted(true);
      } catch (error) {
        console.error("Error saving module completion status:", error);
      }
    }
  };

  useEffect(() => {
    saveCompletionStatus();
  }, [progress, user]);

  return (
    <div className="module-page">
      <button className="back-button" onClick={() => navigate("/educational")}>
        &larr; Back to Educational Resources
      </button>

      <header>
        <h1>Waste Reduction on Campus</h1>
        <p>
          Welcome to the Waste Reduction module! Learn how to minimize waste
          and properly dispose of it while on campus.
        </p>
      </header>

      <section className="info-section">
        <h2>Why Reducing Waste Matters</h2>
        <p>
          Waste has a significant environmental impact. When waste isn’t managed
          properly, it can pollute the air, water, and soil. By reducing waste,
          you can help:
        </p>
        <ul>
          <li>
            <strong>Reduce Landfill Use:</strong> Landfills produce methane, a
            potent greenhouse gas.
          </li>
          <li>
            <strong>Conserve Resources:</strong> Recycling and reusing
            materials reduce the need for raw resources.
          </li>
          <li>
            <strong>Prevent Pollution:</strong> Proper disposal of hazardous
            waste prevents toxins from leaching into the environment.
          </li>
        </ul>

        <h2>Types of Waste</h2>
        <p>On campus, waste typically falls into the following categories:</p>
        <ul>
          <li>
            <strong>Recyclable Waste:</strong> Items like paper, cardboard,
            glass, and certain plastics.
          </li>
          <li>
            <strong>Compostable Waste:</strong> Food scraps and other organic
            materials that can break down naturally.
          </li>
          <li>
            <strong>Hazardous Waste:</strong> Batteries, electronics, and
            chemicals that require special disposal methods.
          </li>
          <li>
            <strong>General Waste:</strong> Items that cannot be recycled or
            composted, such as certain types of packaging.
          </li>
        </ul>

        <h2>Practical Tips for Reducing Waste</h2>
        <ul>
          <li>
            <strong>Use Reusable Items:</strong> Carry a reusable water bottle,
            coffee cup, and shopping bag.
          </li>
          <li>
            <strong>Participate in Recycling Programs:</strong> Learn what can
            be recycled on your campus and use designated bins.
          </li>
          <li>
            <strong>Compost:</strong> If your campus has a composting program,
            make use of it for food scraps and organic waste.
          </li>
          <li>
            <strong>Buy in Bulk:</strong> Purchase items in bulk to reduce
            packaging waste.
          </li>
          <li>
            <strong>Donate:</strong> Instead of throwing away clothes or other
            items, donate them to campus or community drives.
          </li>
        </ul>

        <h2>Did You Know?</h2>
        <p>
          🌍 <strong>The average college student produces about 640 pounds of
          waste per year.</strong> Reducing even a fraction of that can make a
          big impact.
        </p>

        <h2>Common Recycling Mistakes</h2>
        <p>
          Misunderstanding recycling rules can lead to contamination, making
          entire batches of recyclables unusable. Avoid these common mistakes:
        </p>
        <ul>
          <li>
            <strong>Wishful Recycling:</strong> Placing non-recyclable items in
            the recycling bin, hoping they’ll get recycled anyway.
          </li>
          <li>
            <strong>Dirty Containers:</strong> Recycling dirty food containers
            can contaminate other recyclables.
          </li>
          <li>
            <strong>Plastic Bags:</strong> Most recycling programs don’t accept
            plastic bags. Use drop-off locations for proper recycling.
          </li>
        </ul>
        <p>
          Learn more about recycling best practices from the{" "}
          <a
            href="https://www.epa.gov/recycle"
            target="_blank"
            rel="noopener noreferrer"
          >
            EPA Recycling Page
          </a>
          .
        </p>
      </section>

      <section className="quiz-section">
      <div className="white-box">
        {isCompleted ? (
  <div>
    {progress === 100 ? (
      <>
        <h2>Congratulations!</h2>
        <p>You’ve completed the Waste Module!</p>
        <p>
          Apply these tips to reduce your carbon footprint and make your dorm
          more sustainable.
        </p>
        <button onClick={() => navigate("/educational")}>
          Back to Educational Resources
        </button>
      </>
    ) : (
      <>
        <h2>Oops!</h2>
        <p>
          It seems like you didn’t get all the answers right. Try again to
          complete the module!
        </p>
        <button onClick={() =>  navigate("/educational")}>
          Back to Educational Resources
        </button>
      </>
    )}
  </div>
) : (
  <>
    <h2>Quick Quiz</h2>
    <p>{questions[currentQuestion].question}</p>
    <form onSubmit={handleQuizSubmit}>
      {questions[currentQuestion].answers.map((answer, index) => (
        <label key={index}>
          <input
            type="radio"
            name="answer"
            value={answer}
            onChange={() => handleAnswerChange(answer)}
            checked={quizAnswers[questions[currentQuestion].id] === answer}
          />
          {answer}
        </label>
      ))}
      <div className="navigation-buttons">
        <button
          type="button"
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
        >
          Previous
        </button>
        <button
          type="submit"
          disabled={!quizAnswers[questions[currentQuestion].id]}
        >
          Submit
        </button>
        <button
          type="button"
          onClick={handleNext}
          disabled={!quizFeedback}
        >
          Next
        </button>
      </div>
    </form>
    {quizFeedback && <p className="quiz-feedback">{quizFeedback}</p>}
  </>
)}
         
        </div>
                  
      </section>
       {/* Progress Bar */}
       <section className="progress-section">
                <h2>Your Progress</h2>
                <ProgressBar points={progress} />
              </section>
    </div>
  );
};

export default WasteModule;




