import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@services/firebase";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import ProgressBar from "@components/ProgressBar/ProgressBar";
import "./Module.css";

interface Section {
  title: string;
  content: string;
  keyPoints?: string[];
}

const WasteModule: React.FC = () => {
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
      title: "Why Reducing Waste Matters",
      content: "Waste has a significant environmental impact. When waste isn’t managed properly, it can pollute the air, water, and soil. By reducing waste,you can help:",
      keyPoints:[
        "Reduce Landfill Use: Landfills produce methane, apotent greenhouse gas.",
        "Conserve Resources:  Recycling and reusing materials reduce the need for raw resources.",
        "Prevent Poulltion: Proper disposal of hazardous waste prevents toxins from leaching into the environment."
      ]
    },
    {
      title: "Types of Waste",
      content: "On campus, waste typically falls into the following categories:",
      keyPoints: [
        "Recyclable Waste: Items like paper, cardboard, glass, and certain plastics.",
        "Compostable Waste: Food scraps and other organic materials that can break down naturally.",
        "Hazardous Waste: Batteries, electronics, and chemicals that require special disposal methods.",
        "General Waste: Items that cannot be recycled or composted, such as certain types of packaging."
      ]
    },
    {
      title: "Practical Tips for Reducing Waste",
      content: "Adopt these practical steps to minimize waste on campus and contribute to a greener environment:",
      keyPoints: [
        "Use Reusable Items: Carry a reusable water bottle, coffee cup, and shopping bag.",
        "Participate in Recycling Programs: Learn what can be recycled on your campus and use designated bins.",
        "Compost: If your campus has a composting program, make use of it for food scraps and organic waste.",
        "Buy in Bulk: Purchase items in bulk to reduce packaging waste.",
        "Donate: Instead of throwing away clothes or other items, donate them to campus or community drives."
      ]
    },
    {
      title: "Common Recycling Mistakes",
      content: "Misunderstanding recycling rules can lead to contamination, making entire batches of recyclables unusable. Avoid these common mistakes:",
      keyPoints: [
        "Wishful Recycling: Placing non-recyclable items in the recycling bin, hoping they’ll get recycled anyway.",
        "Dirty Containers: Recycling dirty food containers can contaminate other recyclables.",
        "Plastic Bags: Most recycling programs don’t accept plastic bags. Use drop-off locations for proper recycling."
      ]
    },
    {
      title: "Learn More About Recycling",
      content: "Discover additional tips and guidelines to improve your recycling habits:",
      keyPoints: [
        "Visit the EPA Recycling Page for comprehensive information on recycling best practices: https://www.epa.gov/recycle"
      ]
    }
    
    
  ];

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
    <div className="module-container">
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

export default WasteModule;

