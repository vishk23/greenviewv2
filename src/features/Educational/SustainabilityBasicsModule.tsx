import React, { useState } from 'react';
import './SustainabilityBasicsModule.css';

const SustainabilityBasicsModule: React.FC = () => {
  const [quizAnswer, setQuizAnswer] = useState('');
  const [quizFeedback, setQuizFeedback] = useState('');
  const [progress, setProgress] = useState(30); // Example starting progress

  const handleQuizSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quizAnswer.toLowerCase() === 'b') {
      setQuizFeedback('Correct! Food production accounts for 26% of global emissions.');
      setProgress((prev) => Math.min(prev + 20, 100)); // Increment progress
    } else {
      setQuizFeedback('Oops! The correct answer is B: 26%.');
    }
  };

  return (
    <div className="module-page">
      <h1>Sustainability Basics</h1>
      <p>Welcome to the Sustainability Basics module! Let's explore sustainability through fun activities, quizzes, and resources.</p>

      <section className="info-section">
        <h2>What is Sustainability?</h2>
        <p>
          Sustainability is about meeting the needs of the present without compromising the ability of future generations to meet their own needs.
        </p>
        <p>
          Learn more in these articles:
          <ul>
            <li><a href="https://www.epa.gov/sustainability" target="_blank" rel="noopener noreferrer">EPA: What is Sustainability?</a></li>
            <li><a href="https://www.un.org/sustainabledevelopment/sustainable-development-goals/" target="_blank" rel="noopener noreferrer">United Nations: Sustainable Development Goals</a></li>
            <li><a href="https://www.worldwildlife.org/topics/sustainability" target="_blank" rel="noopener noreferrer">WWF: What is Sustainability?</a></li>
          </ul>
        </p>
        <div className="fun-fact-card">
          🌱 <strong>Did you know?</strong> The global adoption of solar energy has reduced carbon emissions by over 1.5 billion tons annually.
        </div>
      </section>

      <section className="quiz-section">
        <h2>Quick Quiz</h2>
        <p>What percentage of global greenhouse gas emissions come from food production?</p>
        <form onSubmit={handleQuizSubmit}>
          <label>
            <input
              type="radio"
              name="quiz"
              value="a"
              onChange={(e) => setQuizAnswer(e.target.value)}
            />{' '}
            A) 10%
          </label>
          <label>
            <input
              type="radio"
              name="quiz"
              value="b"
              onChange={(e) => setQuizAnswer(e.target.value)}
            />{' '}
            B) 26%
          </label>
          <label>
            <input
              type="radio"
              name="quiz"
              value="c"
              onChange={(e) => setQuizAnswer(e.target.value)}
            />{' '}
            C) 50%
          </label>
          <label>
            <input
              type="radio"
              name="quiz"
              value="d"
              onChange={(e) => setQuizAnswer(e.target.value)}
            />{' '}
            D) 75%
          </label>
          <button type="submit">Submit</button>
        </form>
        {quizFeedback && <p className="quiz-feedback">{quizFeedback}</p>}
      </section>

      <section className="progress-section">
        <h2>Your Sustainability Journey</h2>
        <p>Track your progress as you complete modules and quizzes!</p>
        <progress value={progress} max="100"></progress>
        <p>{progress}% completed</p>
      </section>
    </div>
  );
};

export default SustainabilityBasicsModule;

