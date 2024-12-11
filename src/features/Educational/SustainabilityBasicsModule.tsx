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

const SustainabilityBasicsModule: React.FC = () => {
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
      title: "What is Sustainability?",
      content: "Sustainability ensures that we meet our current needs without compromising the ability of future generations to meet theirs. It revolves around three main pillars:",
      keyPoints: [
        "Environmental: Protecting natural resources and reducing environmental impact.",
        "Economic: Promoting practices that are financially viable and beneficial for long-term growth.",
        "Social: Supporting communities and ensuring social equity for present and future generations."
      ]
    },
    {
      title: "The Environmental Pillar",
      content: "This pillar focuses on preserving the planet's natural resources. Major aspects include:",
      keyPoints: [
        "Climate Change: Reducing greenhouse gas emissions to prevent global warming.",
        "Deforestation: Protecting forests that absorb CO₂ and provide oxygen.",
        "Biodiversity: Conserving plant and animal species to maintain ecosystem balance."
      ]
    },
    {
      title: "The Economic Pillar",
      content: "This pillar emphasizes sustainable economic growth and resource management. Major aspects include:",
      keyPoints: [
        "Sustainable Development: Encouraging growth that meets current needs without depleting future resources.",
        "Circular Economy: Promoting reuse, recycling, and reducing waste in production and consumption.",
        "Green Investments: Supporting eco-friendly businesses and innovations that align with sustainability goals."
      ]
    },
    {
      title: "The Social Pillar",
      content: "Emphasizing quality of life for all communities, it involves:",
      keyPoints: [
        "Equity: Ensuring fair treatment for everyone.",
        "Health and Safety: Promoting public health and reducing workplace hazards.",
        "Community Engagement: Encouraging participation in societal decisions."
      ]
    },
    {
      title: "Global Challenges in Sustainability",
      content: "Challenges include climate change, water scarcity, and waste management. Addressing these requires global cooperation.",
      keyPoints: [
        "Climate Change: Tackling the effects of global warming and reducing greenhouse gas emissions.",
        "Water Scarcity: Ensuring access to clean water for all and managing this finite resource.",
        "Waste Management: Reducing waste production and improving recycling and disposal methods."
      ]
    }
  ];

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

export default SustainabilityBasicsModule;










 


    
