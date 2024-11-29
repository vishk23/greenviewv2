
import ProgressBar from '@components/ProgressBar/ProgressBar';
import React, { useState, useEffect } from 'react';
import './Energy.css';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@services/firebase';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { ModuleCompletion } from './ModuleCompletion'; // Assuming this is where the model is defined

const EnergyModule: React.FC = () => {
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
              energyModule: true,
              };

        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          await updateDoc(userDocRef, {
            energyModule: true,
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress, user]);

  return (
    <div className="module-page">
      {/* Back Button */}
      <button className="back-button" onClick={() => navigate('/educational')}>
        &larr; Back to Educational Resources
      </button>

      <header>
        <h1>Energy Conservation in Dorms</h1>
        <p>Welcome to the Energy Conservation module! Learn how to save energy and reduce your carbon footprint in your dormitory.</p>
      </header>

      <section className="info-section">
        <h2>Why Conserve Energy?</h2>
        <p>
          Conserving energy in dorms is not only about cutting costs—it’s about reducing the environmental impact. Every kilowatt-hour of electricity saved helps to reduce carbon emissions, minimize reliance on fossil fuels, and contribute to a more sustainable campus.
        </p>

        <h2>How Does Energy Usage Impact the Environment?</h2>
        <p>
          The energy we use in our dorms comes primarily from burning fossil fuels like coal, oil, and natural gas. These processes release carbon dioxide (CO₂), a greenhouse gas that contributes to climate change. Energy conservation helps to:
        </p>
        <ul>
          <li><strong>Reduce CO₂ Emissions:</strong> Burning less fuel means less CO₂ released into the atmosphere.</li>
          <li><strong>Decrease Resource Depletion:</strong> Fossil fuels are non-renewable and take millions of years to form.</li>
          <li><strong>Protect Ecosystems:</strong> Extracting and burning fossil fuels disrupts natural habitats and harms wildlife.</li>
        </ul>

        <h2>Top Energy-Saving Tips for Dorm Life</h2>
        <p>Here are actionable steps to help you conserve energy in your dorm:</p>
        <ul>
          <li><strong>Lighting:</strong> Replace incandescent bulbs with LED lights, which use up to 75% less energy and last significantly longer.</li>
          <li><strong>Unplug Electronics:</strong> Devices like phone chargers and gaming consoles draw power even when not in use. Unplug them to prevent "phantom" energy consumption.</li>
          <li><strong>Thermostat Settings:</strong> In colder months, set your thermostat to 68°F (20°C) during the day and lower it at night. In warmer months, use fans instead of air conditioning when possible.</li>
          <li><strong>Efficient Use of Appliances:</strong> Only run the microwave or fridge when necessary. If you share appliances, coordinate with roommates to minimize usage.</li>
          <li><strong>Laundry:</strong> Wash clothes in cold water and dry them on a rack instead of using an electric dryer.</li>
        </ul>

        <h2>Did You Know?</h2>
        <p>
          Leaving a laptop plugged in when it’s fully charged can waste 4.5 kWh per week, equivalent to powering a light bulb for over 22 hours! Make it a habit to unplug devices once they’re charged.
        </p>

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
      </section>

      <section className="quiz-section">
        <h2>Quick Quiz</h2>
        <p>Test your knowledge with these questions:</p>

        {/* Question 1 */}
        <div>
          <p><strong>1. What is the most energy-efficient type of light bulb?</strong></p>
          <form onSubmit={(e) => handleQuizSubmit(e, 'q1', 'a')}>
            <label><input type="radio" name="q1" value="a" onChange={(e) => handleAnswerChange('q1', e.target.value)} /> A) LED</label>
            <label><input type="radio" name="q1" value="b" onChange={(e) => handleAnswerChange('q1', e.target.value)} /> B) Incandescent</label>
            <label><input type="radio" name="q1" value="c" onChange={(e) => handleAnswerChange('q1', e.target.value)} /> C) Halogen</label>
            <label><input type="radio" name="q1" value="d" onChange={(e) => handleAnswerChange('q1', e.target.value)} /> D) Fluorescent</label>
            <button type="submit">Submit</button>
          </form>
          {quizFeedback['q1'] && <p className="quiz-feedback">{quizFeedback['q1']}</p>}
        </div>

        {/* Question 2 */}
        <div>
          <p><strong>2. What is "phantom power"?</strong></p>
          <form onSubmit={(e) => handleQuizSubmit(e, 'q2', 'b')}>
            <label><input type="radio" name="q2" value="a" onChange={(e) => handleAnswerChange('q2', e.target.value)} /> A) Energy used by refrigerators</label>
            <label><input type="radio" name="q2" value="b" onChange={(e) => handleAnswerChange('q2', e.target.value)} /> B) Energy drawn by devices not in use</label>
            <label><input type="radio" name="q2" value="c" onChange={(e) => handleAnswerChange('q2', e.target.value)} /> C) Energy used by microwaves</label>
            <label><input type="radio" name="q2" value="d" onChange={(e) => handleAnswerChange('q2', e.target.value)} /> D) Energy used by light bulbs</label>
            <button type="submit">Submit</button>
          </form>
          {quizFeedback['q2'] && <p className="quiz-feedback">{quizFeedback['q2']}</p>}
        </div>

        {/* Question 3 */}
        <div>
          <p><strong>3. Which of the following appliances uses the most energy in a dorm?</strong></p>
          <form onSubmit={(e) => handleQuizSubmit(e, 'q3', 'c')}>
            <label><input type="radio" name="q3" value="a" onChange={(e) => handleAnswerChange('q3', e.target.value)} /> A) Laptop</label>
            <label><input type="radio" name="q3" value="b" onChange={(e) => handleAnswerChange('q3', e.target.value)} /> B) Microwave</label>
            <label><input type="radio" name="q3" value="c" onChange={(e) => handleAnswerChange('q3', e.target.value)} /> C) Refrigerator</label>
            <label><input type="radio" name="q3" value="d" onChange={(e) => handleAnswerChange('q3', e.target.value)} /> D) Fan</label>
            <button type="submit">Submit</button>
          </form>
          {quizFeedback['q3'] && <p className="quiz-feedback">{quizFeedback['q3']}</p>}
        </div>

        {/* Question 4 */}
        <div>
          <p><strong>4. How much energy can unplugging a fully charged laptop save in a week?</strong></p>
          <form onSubmit={(e) => handleQuizSubmit(e, 'q4', 'd')}>
            <label><input type="radio" name="q4" value="a" onChange={(e) => handleAnswerChange('q4', e.target.value)} /> A) 1 kWh</label>
            <label><input type="radio" name="q4" value="b" onChange={(e) => handleAnswerChange('q4', e.target.value)} /> B) 2.5 kWh</label>
            <label><input type="radio" name="q4" value="c" onChange={(e) => handleAnswerChange('q4', e.target.value)} /> C) 3.5 kWh</label>
            <label><input type="radio" name="q4" value="d" onChange={(e) => handleAnswerChange('q4', e.target.value)} /> D) 4.5 kWh</label>
            <button type="submit">Submit</button>
          </form>
          {quizFeedback['q4'] && <p className="quiz-feedback">{quizFeedback['q4']}</p>}
        </div>

        {/* Question 5 */}
        <div>
          <p><strong>5. What is the recommended thermostat setting for energy efficiency during winter?</strong></p>
          <form onSubmit={(e) => handleQuizSubmit(e, 'q5', 'a')}>
            <label><input type="radio" name="q5" value="a" onChange={(e) => handleAnswerChange('q5', e.target.value)} /> A) 68°F</label>
            <label><input type="radio" name="q5" value="b" onChange={(e) => handleAnswerChange('q5', e.target.value)} /> B) 72°F</label>
            <label><input type="radio" name="q5" value="c" onChange={(e) => handleAnswerChange('q5', e.target.value)} /> C) 75°F</label>
            <label><input type="radio" name="q5" value="d" onChange={(e) => handleAnswerChange('q5', e.target.value)} /> D) 78°F</label>
            <button type="submit">Submit</button>
          </form>
          {quizFeedback['q5'] && <p className="quiz-feedback">{quizFeedback['q5']}</p>}
        </div>
      </section>

      <section className="progress-section">
        <h2>Your Energy Conservation Journey</h2>
        <ProgressBar points={progress} />
      </section>
    </div>
  );
};

export default EnergyModule;
