/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@components/Button/Button";
import Score from "./Score";
import "./Consolidated.css";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth, db } from "@services/firebase";
import { loginWithEmail, registerWithEmail } from "@services/authService";
import { doc, setDoc, getDoc } from "firebase/firestore";

interface QuestionsProps {
  spawnObject: (group: number) => void;
}

const Questions: React.FC<QuestionsProps> = ({ spawnObject }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [score, setScore] = useState<number | null>(null);
  const [isAnimation, setIsAnimation] = useState<boolean>(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [previousAnswers, setPreviousAnswers] = useState<number[]>([]);
  const [pulseColor, setPulseColor] = useState<string | null>(null);
  const [lastQuizDate, setLastQuizDate] = useState<string | null>(null);
  const [previousScore, setPreviousScore] = useState<number | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setShowAuthForm(false);
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const fetchPreviousAnswers = async () => {
      if (user) {
        const userDocRef = doc(db, "scores", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const data = userDoc.data();
          if (data.scoreHistory && data.scoreHistory.length > 0) {
            const lastScoreHistory = data.scoreHistory[data.scoreHistory.length - 1];
            setPreviousAnswers(lastScoreHistory.answerIndices || []);
            setPreviousScore(lastScoreHistory.score || null);
            
            const date = lastScoreHistory.date?.toDate().toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            });
            setLastQuizDate(date);
          }
        }
      }
    };

    fetchPreviousAnswers();
  }, [user]);

  const handleLogin = async () => {
    try {
      await loginWithEmail(email, password);
      setShowAuthForm(false);
      setErrorMessage("");
      setHasStarted(true);
    } catch (error) {
      setErrorMessage("Login failed. Please try again.");
    }
  };

  const handleSignUp = async () => {
    try {
      const user = await registerWithEmail(
        email,
        password,
        displayName,
        phoneNumber
      );
      if (user) {
        await setDoc(doc(db, "users", user.uid), {
          displayName,
          email,
          phoneNumber,
          notificationsEnabled: false,
        });
        setShowAuthForm(false);
        setErrorMessage("");
        setHasStarted(true);
      } else {
        setErrorMessage("Sign-up failed. Please try again.");
      }
    } catch (error) {
      setErrorMessage("Sign-up failed. Please try again.");
      console.error("Sign-up error:", error);
    }
  };

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const phoneNumber = value.replace(/\D/g, "");

    // Format the number
    if (phoneNumber.length <= 3) {
      return phoneNumber;
    } else if (phoneNumber.length <= 6) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    } else if (phoneNumber.length <= 10) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(
        3,
        6
      )}-${phoneNumber.slice(6)}`;
    }
    // Limit to 10 digits
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(
      3,
      6
    )}-${phoneNumber.slice(6, 10)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedNumber = formatPhoneNumber(e.target.value);
    setPhoneNumber(formattedNumber);
  };

  const questions = [
    {
      question: "How do you usually get around campus?",
      answers: [
        "WALKING OR BIKING",
        "BU BUS, T, OR CARPOOL",
        "UBER OR DRIVING YOURSELF",
      ],
      points: [24.72, 13.06, 0],
      animations: [false, true, true],
    },
    {
      question: "How do you usually get your drinking water on campus?",
      answers: [
        "I ALWAYS USE A REUSABLE WATER BOTTLE",
        "USE WATER FOUNTAINS",
        "BUY BOTTLED WATER/DRINKS",
      ],
      points: [0.52, 0.52, 0],
      animations: [false, false, true],
    },
    {
      question:
        "How often do you separate your waste (e.g., recycling, compost, trash)?",
      answers: ["ALMOST ALL THE TIME", "OCCASIONALLY", "NEVER"],
      points: [17.13, 9.51, 0],
      animations: [false, true, true],
    },
    {
      question: "How long do your showers usually last?",
      answers: [
        "ALWAYS UNDER 5 MINUTES",
        "USUALLY UNDER 10 MINUTES",
        "I'M NOT SURE, BUT LONGER THAN 10 MIN",
      ],
      points: [6.34, 3.17, 0],
      animations: [false, true, true],
    },
    {
      question: "How often do you buy second-hand or sustainable fashion?",
      answers: [
        "ALMOST EVERYTHING I OWN IS THRIFTED",
        "HERE AND THERE",
        "I USUALLY BUY FAST FASHION BRANDS",
      ],
      points: [24.91, 15.92, 0],
      animations: [false, true, true],
    },
    {
      question: "How often do you get takeout or eat out?",
      answers: [
        "I RARELY GET TAKEOUT, I EAT AT HOME/DINING",
        "EVERY ONCE IN A WHILE",
        "I GET TAKEOUT OR EAT OUT PRETTY OFTEN",
      ],
      points: [15.04, 8.18, 0],
      animations: [false, true, true],
    },
    {
      question: "Do you usually choose ChooseToReuse?",
      answers: ["YES", "NO"],
      points: [3.8, 0],
      animations: [false, true],
    },
    {
      question:
        "How often do you unplug your electronic devices when not in use?",
      answers: ["ALWAYS", "SOMETIMES", "RARELY"],
      points: [1.46, 0.57, 0],
      animations: [false, true, true],
    },
    {
      question:
        "How often do you air-dry your clothes instead of using a dryer?",
      answers: ["ALWAYS", "SOMETIMES", "NEVER"],
      points: [5.44, 2.72, 0],
      animations: [false, true, true],
    },
    {
      question:
        "How often do you delete unnecessary emails and unsubscribe from newsletters?",
      answers: ["ALWAYS", "SOMETIMES", "NEVER"],
      points: [0.76, 0.37, 0],
      animations: [false, true, true],
    },
  ];

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getSource = () => {
    if (score == null) return "";
    if (score >= 80) return "/statement/Clear.gif";
    if (score >= 60) return "/statement/Clouded.gif";
    if (score >= 40) return "/statement/Hazy.gif";
    if (score >= 20) return "/statement/Smoky.gif";
    return "/statement/Polluted.gif";
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestion] = answerIndex;
    setAnswers(updatedAnswers);

    // Get previous answer index directly
    const previousAnswerIndex = previousAnswers[currentQuestion];

    // Log the actual choices

    if (previousAnswerIndex !== undefined) {
      if (answerIndex < previousAnswerIndex) {
        // Pulse green (better choice - lower index means better answer)

        setPulseColor("green");
      } else if (answerIndex > previousAnswerIndex) {
        // Pulse red (worse choice - higher index means worse answer)

        setPulseColor("red");
      } else {
        setPulseColor(null);
      }
    }

    setIsAnimation(questions[currentQuestion].animations[answerIndex]);
  };

  const calculateScore = () => {
    let totalScore = 0;
    answers.forEach((answerIndex, questionIndex) => {
      totalScore += questions[questionIndex].points[answerIndex];
    });

    totalScore = Math.round(totalScore * 100) / 100;
    if (totalScore > 100) {
      totalScore = 100;
    }

    setScore(totalScore);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateScore();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
    setIsAnimation(false);
  };

  useEffect(() => {
    if (isAnimation) {
      spawnObject(currentQuestion);
    }
  }, [currentQuestion]);

  const getStatusText = (previousScore: number | null) => {
    if (previousScore === null) return "Curious about your impact\non the environment\naround you?";
    if (previousScore >= 80) return "Your GreenView is Clear!";
    if (previousScore >= 60) return "Your GreenView is Clouded";
    if (previousScore >= 40) return "Your GreenView is Hazy";
    if (previousScore >= 20) return "Your GreenView is Smoky";
    return "Your GreenView is Polluted";
  };

  return (
    <>
      {!hasStarted ? (
        <div className="questions-container">
          <motion.div
            className={`white-box start-screen ${
              showAuthForm ? "with-auth" : ""
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {!showAuthForm ? (
              <>
                <h1>
                  {getStatusText(previousScore)}
                </h1>
                {previousAnswers.length > 0 ? (
                  <>
                    <p>See if your sustainability habits have changed!</p>
                    <p className="last-quiz-date">
                      You last took the quiz on {lastQuizDate}
                    </p>
                    <button 
                      className="start-button"
                      onClick={() => user ? setHasStarted(true) : setShowAuthForm(true)}
                    >
                      RETAKE QUIZ
                    </button>
                  </>
                ) : (
                  <>
                    <p>Take our quiz to find your sustainability score!</p>
                    <button 
                      className="start-button"
                      onClick={() => user ? setHasStarted(true) : setShowAuthForm(true)}
                    >
                      START QUIZ
                    </button>
                  </>
                )}
              </>
            ) : (
              <div className="auth-form">
                <h3>{isSignUp ? "Sign Up" : "Login"}</h3>
                {errorMessage && (
                  <p className="error-message">{errorMessage}</p>
                )}
                {isSignUp && (
                  <>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Display Name"
                    />
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={handlePhoneChange}
                      placeholder="Phone Number (XXX) XXX-XXXX"
                      maxLength={14}
                    />
                  </>
                )}
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                />
                <button
                  onClick={isSignUp ? handleSignUp : handleLogin}
                  className="auth-submit"
                >
                  {isSignUp ? "Sign Up" : "Login"}
                </button>
                <span 
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="auth-toggle"
                >
                  {isSignUp ? "Already have an account? Login" : "Don't have an account? Sign Up"}
                </span>
              </div>
            )}
          </motion.div>
        </div>
      ) : score === null ? (
        <div className="questions-container">
          <div className={`white-box-score ${
            pulseColor === "green" ? "pulse-green" : 
            pulseColor === "red" ? "pulse-red" : ""
          }`}>
            <p className="question-number">
              Question {currentQuestion + 1} of {questions.length}
            </p>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestion}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <h2>{questions[currentQuestion].question}</h2>
                <div className="answers-container">
                  {questions[currentQuestion].answers.map((answer, index) => (
                    <Button
                      key={index}
                      text={answer}
                      onClick={() => handleAnswerSelect(index)}
                      isSelected={answers[currentQuestion] === index}
                      className={`answer-option ${
                        pulseColor === "green" ? "pulse-green" : 
                        pulseColor === "red" ? "pulse-red" : ""
                      }`}
                    />
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
            <div className="buttons">
              <button
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                style={{ textTransform: "uppercase" }}
              >
                Previous
              </button>
              <button
                onClick={handleNext}
                disabled={answers[currentQuestion] === undefined}
                style={{ textTransform: "uppercase" }}
              >
                {currentQuestion === questions.length - 1 ? "Submit" : "Next"}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <Score
          score={score}
          totalQuestions={questions.length}
          answers={answers}
          questions={questions}
        />
      )}
    </>
  );
};

export default Questions;
