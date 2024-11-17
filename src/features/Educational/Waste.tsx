import React, { useState } from 'react';
import './Waste.css';
import { useNavigate } from 'react-router-dom';

const WasteModule: React.FC = () => {
  const [quizAnswers, setQuizAnswers] = useState<{ [key: string]: string }>({});
  const [quizFeedback, setQuizFeedback] = useState<{ [key: string]: string }>({});
  const [progress, setProgress] = useState(10);
  const navigate = useNavigate();

  const handleQuizSubmit = (e: React.FormEvent, questionId: string, correctAnswer: string) => {
    e.preventDefault();
    if (quizAnswers[questionId]?.toLowerCase() === correctAnswer) {
      setQuizFeedback((prev) => ({ ...prev, [questionId]: 'Correct!' }));
      setProgress((prev) => Math.min(prev + 18, 100));
    } else {
      setQuizFeedback((prev) => ({ ...prev, [questionId]: `Oops! The correct answer is ${correctAnswer.toUpperCase()}.` }));
    }
  };

  const handleAnswerChange = (questionId: string, value: string) => {
    setQuizAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  return (
    <div className="module-page">
        <button className="back-button" onClick={() => navigate('/educational')}>
        &larr; Back to Educational Resources
      </button>
      <header>
        <h1>Waste Reduction on Campus</h1>
        <p>Welcome to the Waste Reduction module! Learn how to minimize waste and properly dispose of it while on campus.</p>
      </header>

      <section className="info-section">
        <h2>Why Reducing Waste Matters</h2>
        <p>
          Waste has a significant environmental impact. When waste isn’t managed properly, it can pollute the air, water, and soil. By reducing waste, you can help:
        </p>
        <ul>
          <li><strong>Reduce Landfill Use:</strong> Landfills produce methane, a potent greenhouse gas.</li>
          <li><strong>Conserve Resources:</strong> Recycling and reusing materials reduce the need for raw resources.</li>
          <li><strong>Prevent Pollution:</strong> Proper disposal of hazardous waste prevents toxins from leaching into the environment.</li>
        </ul>

        <h2>Types of Waste</h2>
        <p>
          On campus, waste typically falls into the following categories:
        </p>
        <ul>
          <li><strong>Recyclable Waste:</strong> Items like paper, cardboard, glass, and certain plastics.</li>
          <li><strong>Compostable Waste:</strong> Food scraps and other organic materials that can break down naturally.</li>
          <li><strong>Hazardous Waste:</strong> Batteries, electronics, and chemicals that require special disposal methods.</li>
          <li><strong>General Waste:</strong> Items that cannot be recycled or composted, such as certain types of packaging.</li>
        </ul>

        <h2>Practical Tips for Reducing Waste</h2>
        <p>
          Here are some simple steps you can take to reduce waste on campus:
        </p>
        <ul>
          <li><strong>Use Reusable Items:</strong> Carry a reusable water bottle, coffee cup, and shopping bag.</li>
          <li><strong>Participate in Recycling Programs:</strong> Learn what can be recycled on your campus and use designated bins.</li>
          <li><strong>Compost:</strong> If your campus has a composting program, make use of it for food scraps and organic waste.</li>
          <li><strong>Buy in Bulk:</strong> Purchase items in bulk to reduce packaging waste.</li>
          <li><strong>Donate:</strong> Instead of throwing away clothes or other items, donate them to campus or community drives.</li>
        </ul>

        <h2>Did You Know?</h2>
        <p>
          🌍 <strong>The average college student produces about 640 pounds of waste per year.</strong> Reducing even a fraction of that can make a big impact.
        </p>

        <h2>Common Recycling Mistakes</h2>
        <p>
          Misunderstanding recycling rules can lead to contamination, making entire batches of recyclables unusable. Avoid these common mistakes:
        </p>
        <ul>
          <li><strong>Wishful Recycling:</strong> Placing non-recyclable items in the recycling bin, hoping they’ll get recycled anyway.</li>
          <li><strong>Dirty Containers:</strong> Recycling dirty food containers can contaminate other recyclables.</li>
          <li><strong>Plastic Bags:</strong> Most recycling programs don’t accept plastic bags. Use drop-off locations for proper recycling.</li>
        </ul>
        <p>
          Learn more about recycling best practices from the <a href="https://www.epa.gov/recycle" target="_blank" rel="noopener noreferrer">EPA Recycling Page</a>.
        </p>
      </section>

      <section className="quiz-section">
        <h2>Quick Quiz</h2>
        <p>Test your knowledge with these questions:</p>

        {/* Question 1 */}
        <div>
          <p><strong>1. Which of the following items is NOT recyclable?</strong></p>
          <form onSubmit={(e) => handleQuizSubmit(e, 'q1', 'c')}>
            <label><input type="radio" name="q1" value="a" onChange={(e) => handleAnswerChange('q1', e.target.value)} /> A) Paper</label>
            <label><input type="radio" name="q1" value="b" onChange={(e) => handleAnswerChange('q1', e.target.value)} /> B) Glass</label>
            <label><input type="radio" name="q1" value="c" onChange={(e) => handleAnswerChange('q1', e.target.value)} /> C) Plastic bags</label>
            <label><input type="radio" name="q1" value="d" onChange={(e) => handleAnswerChange('q1', e.target.value)} /> D) Cardboard</label>
            <button type="submit">Submit</button>
          </form>
          {quizFeedback['q1'] && <p className="quiz-feedback">{quizFeedback['q1']}</p>}
        </div>

        {/* Question 2 */}
        <div>
          <p><strong>2. What is the primary environmental concern with landfills?</strong></p>
          <form onSubmit={(e) => handleQuizSubmit(e, 'q2', 'a')}>
            <label><input type="radio" name="q2" value="a" onChange={(e) => handleAnswerChange('q2', e.target.value)} /> A) Methane emissions</label>
            <label><input type="radio" name="q2" value="b" onChange={(e) => handleAnswerChange('q2', e.target.value)} /> B) Noise pollution</label>
            <label><input type="radio" name="q2" value="c" onChange={(e) => handleAnswerChange('q2', e.target.value)} /> C) Visual clutter</label>
            <label><input type="radio" name="q2" value="d" onChange={(e) => handleAnswerChange('q2', e.target.value)} /> D) None of the above</label>
            <button type="submit">Submit</button>
          </form>
          {quizFeedback['q2'] && <p className="quiz-feedback">{quizFeedback['q2']}</p>}
        </div>

        {/* Question 3 */}
        <div>
          <p><strong>3. Which of the following should NOT go in the compost bin?</strong></p>
          <form onSubmit={(e) => handleQuizSubmit(e, 'q3', 'd')}>
            <label><input type="radio" name="q3" value="a" onChange={(e) => handleAnswerChange('q3', e.target.value)} /> A) Fruit peels</label>
            <label><input type="radio" name="q3" value="b" onChange={(e) => handleAnswerChange('q3', e.target.value)} /> B) Coffee grounds</label>
            <label><input type="radio" name="q3" value="c" onChange={(e) => handleAnswerChange('q3', e.target.value)} /> C) Eggshells</label>
            <label><input type="radio" name="q3" value="d" onChange={(e) => handleAnswerChange('q3', e.target.value)} /> D) Plastic utensils</label>
            <button type="submit">Submit</button>
          </form>
          {quizFeedback['q3'] && <p className="quiz-feedback">{quizFeedback['q3']}</p>}
        </div>

        {/* Question 4 */}
        <div>
          <p><strong>4. What is "wishful recycling"?</strong></p>
          <form onSubmit={(e) => handleQuizSubmit(e, 'q4', 'b')}>
            <label><input type="radio" name="q4" value="a" onChange={(e) => handleAnswerChange('q4', e.target.value)} /> A) Recycling only when convenient</label>
            <label><input type="radio" name="q4" value="b" onChange={(e) => handleAnswerChange('q4', e.target.value)} /> B) Placing non-recyclables in the recycling bin</label>
            <label><input type="radio" name="q4" value="c" onChange={(e) => handleAnswerChange('q4', e.target.value)} /> C) Recycling items in perfect condition only</label>
            <label><input type="radio" name="q4" value="d" onChange={(e) => handleAnswerChange('q4', e.target.value)} /> D) None of the above</label>
            <button type="submit">Submit</button>
          </form>
          {quizFeedback['q4'] && <p className="quiz-feedback">{quizFeedback['q4']}</p>}
        </div>

        {/* Question 5 */}
        <div>
          <p><strong>5. How much waste does the average college student produce per year?</strong></p>
          <form onSubmit={(e) => handleQuizSubmit(e, 'q5', 'c')}>
            <label><input type="radio" name="q5" value="a" onChange={(e) => handleAnswerChange('q5', e.target.value)} /> A) 300 lbs</label>
            <label><input type="radio" name="q5" value="b" onChange={(e) => handleAnswerChange('q5', e.target.value)} /> B) 500 lbs</label>
            <label><input type="radio" name="q5" value="c" onChange={(e) => handleAnswerChange('q5', e.target.value)} /> C) 640 lbs</label>
            <label><input type="radio" name="q5" value="d" onChange={(e) => handleAnswerChange('q5', e.target.value)} /> D) 800 lbs</label>
            <button type="submit">Submit</button>
          </form>
          {quizFeedback['q5'] && <p className="quiz-feedback">{quizFeedback['q5']}</p>}
        </div>
      </section>

      <section className="progress-section">
        <h2>Your Waste Reduction Journey</h2>
        <div className="progress-wrapper">
          <progress value={progress} max="100"></progress>
          <p>{progress}% completed</p>
        </div>
      </section>
    </div>
  );
};

export default WasteModule;
