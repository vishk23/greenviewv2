import React, { useState } from 'react';
import Button from 'components/Button'; // Import your reusable Button component
import Score from './Score'; // Import the Score component
import './Questions.css'; // Import the CSS for the Questions container

const Questions: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]); // Track user's answers
  const [score, setScore] = useState<number | null>(null); // Final score

  // Quiz questions with uppercase answers
  const questions = [
    {
      question: "How do you usually get around campus?",
      answers: ["WALKING OR BIKING", "BU BUS, T, OR CARPOOL", "UBER OR DRIVING YOURSELF"],
      points: [24.72, 13.06, 0], // Points for each answer
    },
    {
      question: "How do you usually get your drinking water on campus?",
      answers: ["I ALWAYS USE A REUSABLE WATER BOTTLE", "USE WATER FOUNTAINS", "BUY BOTTLED WATER/DRINKS"],
      points: [0.52, 0.52, 0], // Points for each answer
    },
    {
      question: "How often do you separate your waste (e.g., recycling, compost, trash)?",
      answers: ["ALMOST ALL THE TIME", "OCCASIONALLY", "NEVER"],
      points: [17.13, 9.51, 0], // Points for each answer
    },
    {
      question: "How long do your showers usually last?",
      answers: ["ALWAYS UNDER 5 MINUTES", "USUALLY UNDER 10 MINUTES", "I'M NOT SURE, BUT LONGER THAN 10 MIN"],
      points: [6.34, 3.17, 0], // Points for each answer
    },
    {
      question: "How often do you buy second-hand or sustainable fashion?",
      answers: ["ALMOST EVERYTHING I OWN IS THRIFTED", "HERE AND THERE", "I USUALLY BUY FAST FASHION BRANDS"],
      points: [24.91, 15.92, 0], // Points for each answer
    },
    {
      question: "How often do you get takeout or eat out?",
      answers: ["I RARELY GET TAKEOUT, I EAT AT HOME/DINING", "EVERY ONCE IN A WHILE", "I GET TAKEOUT OR EAT OUT PRETTY OFTEN"],
      points: [15.04, 8.18, 0], // Points for each answer
    },
    {
      question: "Do you usually choose ChooseToReuse?",
      answers: ["YES", "NO"],
      points: [3.8, 0], // Points for each answer
    },
    {
      question: "How often do you unplug your electronic devices when not in use?",
      answers: ["ALWAYS", "SOMETIMES", "RARELY"],
      points: [1.46, 0.57, 0], // Points for each answer
    },
    {
      question: "How often do you air-dry your clothes instead of using a dryer?",
      answers: ["ALWAYS", "SOMETIMES", "NEVER"],
      points: [5.44, 2.72, 0], // Points for each answer
    },
    {
      question: "How often do you delete unnecessary emails and unsubscribe from newsletters?",
      answers: ["ALWAYS", "SOMETIMES", "NEVER"],
      points: [0.76, 0.37, 0], // Points for each answer
    },
  ];

  // Function to handle answer selection
  const handleAnswerSelect = (answerIndex: number) => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestion] = answerIndex; // Save the selected answer
    setAnswers(updatedAnswers);
  };

  // Function to calculate score when quiz is completed
  const calculateScore = () => {
    let totalScore = 0;
    answers.forEach((answerIndex, questionIndex) => {
      totalScore += questions[questionIndex].points[answerIndex];
    });
  
    // Round the total score to 2 decimal places
    totalScore = Math.round(totalScore * 100) / 100;
  
    // If the score exceeds 100, set it to 100
    if (totalScore > 100) {
      totalScore = 100;
    }
  
    setScore(totalScore); // Set the final score
  };
  

  // Handle "Next" button click
  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateScore(); // Calculate score when the last question is reached
    }
  };

  // Handle "Previous" button click
  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  return (
    <div className="questions-container">
      {score === null ? (
        <div className="white-box">
          {/* Display question number */}
          <p className="question-number">Question {currentQuestion + 1} of {questions.length}</p>

          {/* Display the current question */}
          <h2>{questions[currentQuestion].question}</h2>

          {/* Render answer options as buttons */}
          <div className="answers-container">
            {questions[currentQuestion].answers.map((answer, index) => (
              <Button
                key={index}
                text={answer} // Answer options already in uppercase
                onClick={() => handleAnswerSelect(index)}
                isSelected={answers[currentQuestion] === index} // Highlight if selected
              />
            ))}
          </div>

          {/* Navigation buttons for Previous and Next */}
          <div className="buttons">
            <button 
              onClick={handlePrevious} 
              disabled={currentQuestion === 0}
              style={{ textTransform: 'uppercase' }} // Uppercase style for button
            >
              Previous
            </button>
            <button 
              onClick={handleNext} 
              disabled={answers[currentQuestion] === undefined}
              style={{ textTransform: 'uppercase' }} // Uppercase style for button
            >
              {currentQuestion === questions.length - 1 ? 'Submit' : 'Next'}
            </button>
          </div>
        </div>
      ) : (
        <Score score={score} totalQuestions={questions.length} />
      )}
    </div>
  );
};

export default Questions;

