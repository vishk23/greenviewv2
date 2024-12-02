import ProgressBar from "@components/ProgressBar/ProgressBar";
import React, { useState, useEffect, useCallback } from "react";
import "./Module.css";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@services/firebase";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { ModuleCompletion } from "./ModuleCompletion";

const EnergyModule: React.FC = () => {
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
      question: "What is the most energy-efficient type of light bulb?",
      answers: ["LED", "Incandescent", "Halogen", "Fluorescent"],
      correctAnswer: "LED",
    },
    {
      id: "q2",
      question: "What is 'phantom power'?",
      answers: [
        "Energy used by refrigerators",
        "Energy drawn by devices not in use",
        "Energy used by microwaves",
        "Energy used by light bulbs",
      ],
      correctAnswer: "Energy drawn by devices not in use",
    },
    {
      id: "q3",
      question: "Which appliance uses the most energy in a dorm?",
      answers: ["Laptop", "Microwave", "Refrigerator", "Fan"],
      correctAnswer: "Refrigerator",
    },
    {
      id: "q4",
      question: "How much energy can unplugging a fully charged laptop save in a week?",
      answers: ["1 kWh", "2.5 kWh", "3.5 kWh", "4.5 kWh"],
      correctAnswer: "4.5 kWh",
    },
    {
      id: "q5",
      question: "What is the recommended thermostat setting for winter energy efficiency?",
      answers: ["68°F", "72°F", "75°F", "78°F"],
      correctAnswer: "68°F",
    },
  ];

  const handleQuizSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const currentQuestionData = questions[currentQuestion];
    const userAnswer = quizAnswers[currentQuestionData.id];

    if (userAnswer === currentQuestionData.correctAnswer) {
      setQuizFeedback("Correct!");
      setProgress((prev) =>
        Math.min(prev === 0 ? 20 : prev + 20, 100)
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

  const saveCompletionStatus = useCallback(async () => {
    if (user && progress === 100 && !isCompleted) {
      try {
        const userDocRef = doc(db, "moduleCompletion", user.uid);
        const newCompletion: ModuleCompletion = {
          userId: user.uid,
          energyModule: true, // Adjust this for specific modules
        };
  
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          await updateDoc(userDocRef, { energyModule: true });
        } else {
          await setDoc(userDocRef, newCompletion);
        }
  
        setIsCompleted(true);
      } catch (error) {
        console.error("Error saving module completion status:", error);
      }
    }
  }, [user, progress, isCompleted]); 

  useEffect(() => {
    saveCompletionStatus();
  }, [progress, user, saveCompletionStatus]);

  return (
    <div className="module-page">
      <button className="back-button" onClick={() => navigate('/educational')}>
        &larr; Back to Educational Resources
      </button>

      <header>
        <h1>Energy Conservation in Dorms</h1>
        <p>Welcome to the Energy Conservation module! Learn how to save energy and reduce your carbon footprint in your dormitory.</p>
      </header>

      <section className="info-section grid-container">
        <div className="green-box">
          <h2>Why Conserve Energy?</h2>
          <p>
            Conserving energy in dorms is not only about cutting costs—it’s about reducing the environmental impact. Every kilowatt-hour of electricity saved helps to reduce carbon emissions, minimize reliance on fossil fuels, and contribute to a more sustainable campus.
          </p>
        </div>

        <div className="green-box">
          <h2>How Does Energy Usage Impact the Environment?</h2>
          <p>
            The energy we use in our dorms comes primarily from burning fossil fuels like coal, oil, and natural gas. These processes release carbon dioxide (CO₂), a greenhouse gas that contributes to climate change. Energy conservation helps to:
          </p>
          <ul>
            <li><strong>Reduce CO₂ Emissions:</strong> Burning less fuel means less CO₂ released into the atmosphere.</li>
            <li><strong>Decrease Resource Depletion:</strong> Fossil fuels are non-renewable and take millions of years to form.</li>
            <li><strong>Protect Ecosystems:</strong> Extracting and burning fossil fuels disrupts natural habitats and harms wildlife.</li>
          </ul>
        </div>

        <div className="green-box">
          <h2>Top Energy-Saving Tips for Dorm Life</h2>
          <p>Here are actionable steps to help you conserve energy in your dorm:</p>
          <ul>
            <li><strong>Lighting:</strong> Replace incandescent bulbs with LED lights, which use up to 75% less energy and last significantly longer.</li>
            <li><strong>Unplug Electronics:</strong> Devices like phone chargers and gaming consoles draw power even when not in use. Unplug them to prevent "phantom" energy consumption.</li>
            <li><strong>Thermostat Settings:</strong> In colder months, set your thermostat to 68°F (20°C) during the day and lower it at night. In warmer months, use fans instead of air conditioning when possible.</li>
            <li><strong>Efficient Use of Appliances:</strong> Only run the microwave or fridge when necessary. If you share appliances, coordinate with roommates to minimize usage.</li>
            <li><strong>Laundry:</strong> Wash clothes in cold water and dry them on a rack instead of using an electric dryer.</li>
          </ul>
        </div>

        <div className="green-box">
          <h2>Understanding Energy Metrics</h2>
          <p>
            Have you ever looked at your dorm’s electricity bill or energy usage report? Understanding the key metrics can help you identify areas where you can save:
          </p>
          <ul>
            <li><strong>kWh (Kilowatt-Hours):</strong> Measures energy use over time. The lower this number, the less energy you’re consuming.</li>
            <li><strong>Peak Hours:</strong> Times of day when energy demand is highest. Avoid using high-energy appliances during these periods.</li>
            <li><strong>Energy Star Ratings:</strong> Appliances with this label meet strict energy efficiency criteria, saving you money and reducing emissions.</li>
          </ul>
          <p>Learn more about energy-efficient appliances from the <a href="https://www.energystar.gov/" target="_blank" rel="noopener noreferrer">Energy Star Website</a>.</p>
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
                  <p>Apply these tips to reduce your carbon footprint and make your dorm more sustainable.</p>
                  <button onClick={() => navigate("/educational")}>Back to Educational Resources</button>
                </>
              ) : (
                <>
                  <h2>Oops!</h2>
                  <p>It seems like you didn’t get all the answers right. Try again to complete the module!</p>
                  <button onClick={() => navigate("/educational")}>Back to Educational Resources</button>
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
                  <button type="button" onClick={handlePrevious} disabled={currentQuestion === 0}>
                    Previous
                  </button>
                  <button type="submit" disabled={!quizAnswers[questions[currentQuestion].id]}>
                    Submit
                  </button>
                  <button type="button" onClick={handleNext} disabled={!quizFeedback}>
                    Next
                  </button>
                </div>
              </form>
              {quizFeedback && <p className="quiz-feedback">{quizFeedback}</p>}
            </>
          )}
        </div>
      </section>

      <section className="progress-section">
        <h2>Your Progress</h2>
        <ProgressBar points={progress} />
      </section>
    </div>
  );
};

export default EnergyModule;
