/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@services/firebase";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import ProgressBar from "@components/ProgressBar/ProgressBar";
import { ModuleCompletion } from "./ModuleCompletion";
import "./Module.css";

const SustainabilityBasicsModule: React.FC = () => {
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
      question: "Which of the following is NOT a pillar of sustainability?",
      answers: ["Environmental", "Social", "Economic", "Technological"],
      correctAnswer: "Technological",
    },
    {
      id: "q2",
      question: "What percentage of global greenhouse gas emissions come from food production?",
      answers: ["15%", "26%", "35%", "50%"],
      correctAnswer: "26%",
    },
    {
      id: "q3",
      question: "Which SDG focuses on climate action?",
      answers: ["SDG 7", "SDG 12", "SDG 13", "SDG 15"],
      correctAnswer: "SDG 13",
    },
    {
      id: "q4",
      question: "How much of total global emissions is contributed by deforestation?",
      answers: ["10%", "20%", "30%", "40%"],
      correctAnswer: "10%",
    },
    {
      id: "q5",
      question: "What is one simple action you can take to reduce waste?",
      answers: ["Use plastic bags", "Use reusable bags", "Use disposable cups", "Throw away food waste"],
      correctAnswer: "Use reusable bags",
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
          sustainabilityBasicsModule: true,
        };

        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          await updateDoc(userDocRef, { sustainabilityBasicsModule: true });
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
        <h1>Sustainability Basics</h1>
        <p>
          Welcome! Discover how sustainability impacts your life and what actions you can take to create a greener future.
        </p>
      </header>

      <section className="info-section">
  <div className="grid-container">
    <div className="green-box">
      <h2>What is Sustainability?</h2>
      <p>
        Sustainability ensures that we meet our current needs without
        compromising the ability of future generations to meet theirs. It
        revolves around three main pillars:
      </p>
      <ul>
        <li>
          <strong>Environmental:</strong> Protecting ecosystems and natural
          resources.
        </li>
        <li>
          <strong>Social:</strong> Promoting equity and improving quality of
          life.
        </li>
        <li>
          <strong>Economic:</strong> Encouraging responsible growth and
          reducing waste.
        </li>
      </ul>
      <p>
        For more on sustainability definitions, visit the{" "}
        <a
          href="https://www.epa.gov/sustainability"
          target="_blank"
          rel="noopener noreferrer"
        >
          EPA Sustainability Page
        </a>
        .
      </p>
    </div>

    <div className="green-box">
      <h2>The Environmental Pillar</h2>
      <p>This pillar focuses on preserving the planet's natural resources. Major aspects include:</p>
      <ul>
        <li>
          <strong>Climate Change:</strong> Reducing greenhouse gas emissions to prevent global warming.
        </li>
        <li>
          <strong>Deforestation:</strong> Protecting forests that absorb CO₂ and provide oxygen.
        </li>
        <li>
          <strong>Biodiversity:</strong> Conserving plant and animal species to maintain ecosystem balance.
        </li>
      </ul>
      <p>
        Learn more at the{" "}
        <a
          href="https://www.worldwildlife.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          WWF Deforestation Page
        </a>
        .
      </p>
    </div>

    <div className="green-box">
      <h2>The Social Pillar</h2>
      <p>Emphasizing quality of life for all communities, it involves:</p>
      <ul>
        <li>
          <strong>Equity:</strong> Ensuring fair treatment for everyone.
        </li>
        <li>
          <strong>Health and Safety:</strong> Promoting public health and reducing workplace hazards.
        </li>
        <li>
          <strong>Community Engagement:</strong> Encouraging participation in societal decisions.
        </li>
      </ul>
      <p>
        Visit the{" "}
        <a
          href="https://www.un.org/sustainabledevelopment/inequality/"
          target="_blank"
          rel="noopener noreferrer"
        >
          UN SDG 10 Page
        </a>{" "}
        to learn more.
      </p>
    </div>

    <div className="green-box">
      <h2>Global Challenges in Sustainability</h2>
      <p>
        Challenges include climate change, water scarcity, and waste
        management. Addressing these requires global cooperation. Learn more
        at the{" "}
        <a
          href="https://www.un.org/en/climatechange"
          target="_blank"
          rel="noopener noreferrer"
        >
          UN Climate Action Page
        </a>
        .
      </p>
    </div>
  </div>
</section>


      <section className="quiz-section">
      <div className="white-box">
        {isCompleted ? (
  <div>
    {progress === 100 ? (
      <>
        <h2>Congratulations!</h2>
        <p>You’ve completed the Energy Module!</p>
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


export default SustainabilityBasicsModule;
