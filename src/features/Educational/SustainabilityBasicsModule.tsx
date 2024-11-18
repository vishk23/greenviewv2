/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import './SustainabilityBasicsModule.css';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@services/firebase';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { ModuleCompletion } from './ModuleCompletion'; // Assuming this is where the model is defined

const SustainabilityBasicsModule: React.FC = () => {
  const [quizAnswers, setQuizAnswers] = useState<{ [key: string]: string }>({});
  const [quizFeedback, setQuizFeedback] = useState<{ [key: string]: string }>({});
  const [progress, setProgress] = useState(10);
  const [isCompleted, setIsCompleted] = useState(false);
  const navigate = useNavigate();
  const [user] = useAuthState(auth);

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

  const saveCompletionStatus = async () => {
    if (user && progress === 100 && !isCompleted) {
        try {
            const userDocRef = doc(db, 'moduleCompletion', user.uid);
            
            const newCompletion: ModuleCompletion = {
              userId: user.uid,
              sustainabilityBasicsModule: true,
              };

        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          await updateDoc(userDocRef, {
            sustainabilityBasicsModule: true,
            });
        } else {
          await setDoc(userDocRef, newCompletion);
        }

        setIsCompleted(true);
      } catch (error) {
        console.error('Error saving module completion status:', error);
      }
    }
  };

  useEffect(() => {
    saveCompletionStatus();
  }, [progress, user]);

  return (
    <div className="module-page">
      <button className="back-button" onClick={() => navigate('/educational')}>
        &larr; Back to Educational Resources
      </button>
      <header>
        <h1>Sustainability Basics</h1>
        <p>Welcome! Discover how sustainability impacts your life and what actions you can take to create a greener future.</p>
      </header>

      <section className="info-section">
        <h2>What is Sustainability?</h2>
        <p>
          Sustainability ensures that we meet our current needs without compromising the ability of future generations to meet theirs. It revolves around three main pillars:
        </p>
        <ul>
          <li><strong>Environmental:</strong> Protecting ecosystems and natural resources.</li>
          <li><strong>Social:</strong> Promoting equity and improving quality of life.</li>
          <li><strong>Economic:</strong> Encouraging responsible growth and reducing waste.</li>
        </ul>
        <p>
          For more on sustainability definitions, visit the 
          <a href="https://www.epa.gov/sustainability" target="_blank" rel="noopener noreferrer">EPA Sustainability Page</a>.
        </p>

        <h2>The Environmental Pillar</h2>
        <p>
          This pillar focuses on preserving the planet's natural resources. Major aspects include:
        </p>
        <ul>
          <li><strong>Climate Change:</strong> Reducing greenhouse gas emissions to prevent global warming.</li>
          <li><strong>Deforestation:</strong> Protecting forests that absorb CO₂ and provide oxygen.</li>
          <li><strong>Biodiversity:</strong> Conserving plant and animal species to maintain ecosystem balance.</li>
        </ul>
        <p>
          Learn more at the <a href="https://www.worldwildlife.org/" target="_blank" rel="noopener noreferrer">WWF Deforestation Page</a>.
        </p>

        <h2>The Social Pillar</h2>
        <p>
          Emphasizing quality of life for all communities, it involves:
        </p>
        <ul>
          <li><strong>Equity:</strong> Ensuring fair treatment for everyone.</li>
          <li><strong>Health and Safety:</strong> Promoting public health and reducing workplace hazards.</li>
          <li><strong>Community Engagement:</strong> Encouraging participation in societal decisions.</li>
        </ul>
        <p>
          Visit the <a href="https://www.un.org/sustainabledevelopment/inequality/" target="_blank" rel="noopener noreferrer">UN SDG 10 Page</a> to learn more.
        </p>

        <h2>Global Challenges in Sustainability</h2>
        <p>
          Challenges include climate change, water scarcity, and waste management. Addressing these requires global cooperation. Learn more at the <a href="https://www.un.org/en/climatechange" target="_blank" rel="noopener noreferrer">UN Climate Action Page</a>.
        </p>
      </section>

      <section className="quiz-section">
        <h2>Quick Quiz</h2>
        <p>Test your knowledge with these questions:</p>

        <div>
          <p><strong>1. Which of the following is NOT a pillar of sustainability?</strong></p>
          <form onSubmit={(e) => handleQuizSubmit(e, 'q1', 'd')}>
            <label><input type="radio" name="q1" value="a" onChange={(e) => handleAnswerChange('q1', e.target.value)} /> A) Environmental</label>
            <label><input type="radio" name="q1" value="b" onChange={(e) => handleAnswerChange('q1', e.target.value)} /> B) Social</label>
            <label><input type="radio" name="q1" value="c" onChange={(e) => handleAnswerChange('q1', e.target.value)} /> C) Economic</label>
            <label><input type="radio" name="q1" value="d" onChange={(e) => handleAnswerChange('q1', e.target.value)} /> D) Technological</label>
            <button type="submit">Submit</button>
          </form>
          {quizFeedback['q1'] && <p className="quiz-feedback">{quizFeedback['q1']}</p>}
        </div>


        {/* Question 2 */}
        <div className="quiz-card">
          <p><strong>2. What percentage of global greenhouse gas emissions come from food production?</strong></p>
          <form onSubmit={(e) => handleQuizSubmit(e, 'q2', 'b')}>
            <label><input type="radio" name="q2" value="a" onChange={(e) => handleAnswerChange('q2', e.target.value)} /> A) 15%</label>
            <label><input type="radio" name="q2" value="b" onChange={(e) => handleAnswerChange('q2', e.target.value)} /> B) 26%</label>
            <label><input type="radio" name="q2" value="c" onChange={(e) => handleAnswerChange('q2', e.target.value)} /> C) 35%</label>
            <label><input type="radio" name="q2" value="d" onChange={(e) => handleAnswerChange('q2', e.target.value)} /> D) 50%</label>
            <button type="submit">Submit</button>
          </form>
          {quizFeedback['q2'] && <p className="quiz-feedback">{quizFeedback['q2']}</p>}
        </div>

        {/* Question 3 */}
        <div className="quiz-card">
          <p><strong>3. Which SDG focuses on climate action?</strong></p>
          <form onSubmit={(e) => handleQuizSubmit(e, 'q3', 'c')}>
            <label><input type="radio" name="q3" value="a" onChange={(e) => handleAnswerChange('q3', e.target.value)} /> A) SDG 7</label>
            <label><input type="radio" name="q3" value="b" onChange={(e) => handleAnswerChange('q3', e.target.value)} /> B) SDG 12</label>
            <label><input type="radio" name="q3" value="c" onChange={(e) => handleAnswerChange('q3', e.target.value)} /> C) SDG 13</label>
            <label><input type="radio" name="q3" value="d" onChange={(e) => handleAnswerChange('q3', e.target.value)} /> D) SDG 15</label>
            <button type="submit">Submit</button>
          </form>
          {quizFeedback['q3'] && <p className="quiz-feedback">{quizFeedback['q3']}</p>}
        </div>

        {/* Question 4 */}
        <div className="quiz-card">
          <p><strong>4. How much of total global emissions is contributed by deforestation?</strong></p>
          <form onSubmit={(e) => handleQuizSubmit(e, 'q4', 'a')}>
            <label><input type="radio" name="q4" value="a" onChange={(e) => handleAnswerChange('q4', e.target.value)} /> A) 10%</label>
            <label><input type="radio" name="q4" value="b" onChange={(e) => handleAnswerChange('q4', e.target.value)} /> B) 20%</label>
            <label><input type="radio" name="q4" value="c" onChange={(e) => handleAnswerChange('q4', e.target.value)} /> C) 30%</label>
            <label><input type="radio" name="q4" value="d" onChange={(e) => handleAnswerChange('q4', e.target.value)} /> D) 40%</label>
            <button type="submit">Submit</button>
          </form>
          {quizFeedback['q4'] && <p className="quiz-feedback">{quizFeedback['q4']}</p>}
        </div>

        {/* Question 5 */}
        <div className="quiz-card">
          <p><strong>5. What is one simple action you can take to reduce waste?</strong></p>
          <form onSubmit={(e) => handleQuizSubmit(e, 'q5', 'b')}>
            <label><input type="radio" name="q5" value="a" onChange={(e) => handleAnswerChange('q5', e.target.value)} /> A) Use plastic bags</label>
            <label><input type="radio" name="q5" value="b" onChange={(e) => handleAnswerChange('q5', e.target.value)} /> B) Use reusable bags</label>
            <label><input type="radio" name="q5" value="c" onChange={(e) => handleAnswerChange('q5', e.target.value)} /> C) Use disposable cups</label>
            <label><input type="radio" name="q5" value="d" onChange={(e) => handleAnswerChange('q5', e.target.value)} /> D) Throw away food waste</label>
            <button type="submit">Submit</button>
          </form>
          {quizFeedback['q5'] && <p className="quiz-feedback">{quizFeedback['q5']}</p>}
        </div>
      </section>

      <section className="progress-section">
        <h2>Your Sustainability Journey</h2>
        <div className="progress-wrapper">
          <progress value={progress} max="100"></progress>
          <p>{progress}% completed</p>
        </div>
      </section>
    </div>
  );
};

export default SustainabilityBasicsModule;