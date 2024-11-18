/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Button from "@components/Button/Button";
import Score from "./Score";
import "./Consolidated.css";

interface QuestionsProps {
  spawnObject: (group: number) => void;
}

const Questions: React.FC<QuestionsProps> = ({ spawnObject }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [score, setScore] = useState<number | null>(null);
  const [isAnimation, setIsAnimation] = useState<boolean>(false);

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

  return (
    <div>
      {score === null ? (
        <div className="questions-container">
          <div className="white-box">
            <p className="question-number">
              Question {currentQuestion + 1} of {questions.length}
            </p>
            <h2>{questions[currentQuestion].question}</h2>
            <div className="answers-container">
              {questions[currentQuestion].answers.map((answer, index) => (
                <Button
                  key={index}
                  text={answer}
                  onClick={() => handleAnswerSelect(index)}
                  isSelected={answers[currentQuestion] === index}
                />
              ))}
            </div>
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
        <div className="score-container">
          <img
            src={getSource()}
            alt=""
            style={{ width: "100%", height: "100%" }}
            className="animation"
          />
          <Score
            score={score}
            totalQuestions={questions.length}
            answers={answers}
            questions={questions}
          />
        </div>
      )}
    </div>
  );
};

export default Questions;
