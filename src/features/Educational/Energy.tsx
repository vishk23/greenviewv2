import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@services/firebase";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import ProgressBar from "@components/ProgressBar/ProgressBar";
import "./Energy.css";

interface Section {
  title: string;
  content: string;
  keyPoints?: string[];
}

const EnergyModule: React.FC = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const [hasCompletedReading, setHasCompletedReading] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<{ [key: string]: string }>({});
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const navigate = useNavigate();
  const [user] = useAuthState(auth);

  const sections: Section[] = [
    {
      title: "Why Conserve Energy?",
      content: "Conserving energy in dorms is not only about cutting costs—it's about reducing the environmental impact. Every kilowatt-hour of electricity saved helps to reduce carbon emissions, minimize reliance on fossil fuels, and contribute to a more sustainable campus.",
    },
    {
      title: "Energy Usage Impact",
      content: "The energy we use in dorms comes primarily from burning fossil fuels like coal, oil, and natural gas. These processes release carbon dioxide (CO₂), a greenhouse gas that contributes to climate change.",
      keyPoints: [
        "Reduce CO₂ Emissions: Burning less fuel means less CO₂ released into the atmosphere.",
        "Decrease Resource Depletion: Fossil fuels are non-renewable and take millions of years to form.",
        "Protect Ecosystems: Extracting and burning fossil fuels disrupts natural habitats and harms wildlife."
      ]
    },
    {
      title: "Energy-Saving Tips",
      content: "Here are actionable steps to help you conserve energy in your dorm:",
      keyPoints: [
        "Replace incandescent bulbs with LED lights, which use up to 75% less energy.",
        "Unplug devices when not in use to prevent 'phantom' energy consumption.",
        "Set thermostat to 68°F in winter, lower at night. Use fans instead of AC when possible.",
        "Only run full loads of laundry and use cold water when possible.",
        "Use natural light during the day and task lighting instead of overhead lights."
      ]
    }
  ];

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
      question: "Which appliance typically uses the most energy in a dorm?",
      answers: ["Laptop", "Microwave", "Refrigerator", "Fan"],
      correctAnswer: "Refrigerator",
    },
    {
      id: "q4",
      question: "What is the recommended thermostat setting for winter energy efficiency?",
      answers: ["68°F", "72°F", "75°F", "78°F"],
      correctAnswer: "68°F",
    }
  ];

  const handleAnswerChange = (value: string) => {
    setQuizAnswers((prev) => ({
      ...prev,
      [questions[currentQuestion].id]: value,
    }));
    setQuizFeedback(null);
  };

  const handleQuizSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const currentQuestionData = questions[currentQuestion];
    const userAnswer = quizAnswers[currentQuestionData.id];

    if (userAnswer === currentQuestionData.correctAnswer) {
      setQuizFeedback("Correct!");
      setProgress((prev) => Math.min(prev + 25, 100));
    } else {
      setQuizFeedback(`Incorrect. The correct answer is ${currentQuestionData.correctAnswer}.`);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setQuizFeedback(null);
    } else if (progress === 100) {
      setIsCompleted(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
      setQuizFeedback(null);
      setQuizFeedback(null);
    }
  };

  useEffect(() => {
    if (user && progress === 100 && !isCompleted) {
      const saveCompletion = async () => {
        try {
          const userDocRef = doc(db, "moduleCompletion", user.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            await updateDoc(userDocRef, { energyModule: true });
          } else {
            await setDoc(userDocRef, {
              userId: user.uid,
              energyModule: true,
            });
          }
        } catch (error) {
          console.error("Error saving completion status:", error);
        }
      };
      
      saveCompletion();
    }
  }, [progress, user, isCompleted]);

  return (
    <div className="energy-container">
      <div className="progress-container">
        <ProgressBar points={progress} />
      </div>

      <motion.div 
        className="content-box"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {!hasCompletedReading ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSection}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <h2>{sections[currentSection].title}</h2>
              <p>{sections[currentSection].content}</p>
              
              {sections[currentSection]?.keyPoints && (
                <ul className="key-points">
                  {sections[currentSection]?.keyPoints?.map((point, index) => (
                    <motion.li 
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.2 }}
                    >
                      {point}
                    </motion.li>
                  ))}
                </ul>
              )}

              <div className="navigation-buttons">
                <button
                  onClick={() => setCurrentSection(prev => prev - 1)}
                  disabled={currentSection === 0}
                >
                  Previous
                </button>
                
                <div className="progress-dots">
                  {sections.map((_, index) => (
                    <div 
                      key={index}
                      className={`dot ${currentSection === index ? 'active' : ''}`}
                      onClick={() => setCurrentSection(index)}
                    />
                  ))}
                </div>

                <button
                  onClick={() => {
                    if (currentSection === sections.length - 1) {
                      setHasCompletedReading(true);
                    } else {
                      setCurrentSection(prev => prev + 1);
                    }
                  }}
                >
                  {currentSection === sections.length - 1 ? 'Start Quiz' : 'Next'}
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        ) : (
          isCompleted ? (
            <div className="finish-screen">
              <h2>Congratulations!</h2>
              <p>You've completed the Energy Conservation Module!</p>
              <button onClick={() => navigate('/educational')}>
                Back to Educational Resources
              </button>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestion}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <h2>Question {currentQuestion + 1} of {questions.length}</h2>
                <p>{questions[currentQuestion].question}</p>

                <div className="answers-container">
                  {questions[currentQuestion].answers.map((answer, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div
                        className={`answer-option ${quizAnswers[questions[currentQuestion].id] === answer ? 'selected' : ''}`}
                        onClick={() => handleAnswerChange(answer)}
                      >
                        {answer}
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="navigation-buttons">
                  <button
                    onClick={handlePrevious}
                    disabled={currentQuestion === 0}
                  >
                    Previous
                  </button>
                  
                  <button
                    onClick={(e) => {
                      if (!quizFeedback) {
                        handleQuizSubmit(e);
                      } else {
                        if (currentQuestion === questions.length - 1 && progress === 100) {
                          setIsCompleted(true);
                        } else {
                          handleNext();
                        }
                      }
                    }}
                    disabled={!quizAnswers[questions[currentQuestion].id]}
                  >
                    {!quizFeedback 
                      ? 'Submit' 
                      : currentQuestion === questions.length - 1 && progress === 100 
                        ? 'Finish' 
                        : 'Next'
                    }
                  </button>
                </div>

                {quizFeedback && (
                  <motion.p 
                    className={`quiz-feedback ${quizFeedback.includes('Correct') ? 'correct' : 'incorrect'}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {quizFeedback}
                  </motion.p>
                )}
              </motion.div>
            </AnimatePresence>
          )
        )}
      </motion.div>
    </div>
  );
};

export default EnergyModule;
