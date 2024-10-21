import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@services/firebase'; // Import Firebase config
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import ProgressBar from './ProgressBar'; // Ensure ProgressBar component is imported
import './Score.css'; // Assuming custom styles

interface ScoreProps {
  score: number;
  totalQuestions: number;
}

const Score: React.FC<ScoreProps> = ({ score, totalQuestions }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [previousScore, setPreviousScore] = useState<number | null>(null);
  const [message, setMessage] = useState<string>('Great start! This is your first time taking the quiz.');
  const [user] = useAuthState(auth); // Firebase authentication hook

  const maxScore = totalQuestions * 10; // Calculate max score
  const percentageScore = (score / maxScore) * 100; // Calculate percentage for progress bar

  useEffect(() => {
    if (user) {
      const fetchScore = async () => {
        const userDocRef = doc(db, 'scores', user.uid); // 'scores' is the collection

        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const previous = userData.score;
          setPreviousScore(previous);

          if (score > previous) {
            setMessage(`Great Job! Your score improved by ${score - previous} points!`);
          } else if (score === previous) {
            setMessage('Your score remains the same. Keep going!');
          } else {
            setMessage('Keep going! You can improve your score!');
          }

          await updateDoc(userDocRef, {
            score: score,
            lastUpdated: new Date(),
          });
        } else {
          await setDoc(userDocRef, {
            userId: user.uid,
            score: score,
            lastUpdated: new Date(),
          });
          setMessage('Great start! This is your first time taking the quiz.');
        }
      };

      fetchScore().catch((error) => console.error('Error fetching score:', error));
    }
  }, [user, score]);

  return (
    <div className="score-container">
      <div className="score-box">
        {/* Progress Bar */}
        <div className="progress-bar-wrapper">
          <ProgressBar points={percentageScore} /> {/* Ensure ProgressBar is rendering */}
        </div>

        {/* Score number in the middle */}
        <div className="score-display">
          <span className="score-number">{score}</span> {/* Display the score in the center */}
          <span className="job">{message}</span> {/* Display dynamic message below the score */}
        </div>
      </div>
    </div>
  );
};

export default Score;
