import { db } from '@services/firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';

export interface LeaderboardEntry {
  rank: number;
  name: string;
  score: number;
  badge: string;
}

const calculateBadge = (score: number): string => {
  if (score >= 90) return '★★★';
  if (score >= 70) return '★★';
  if (score >= 50) return '★';
  return '☆';
};

export const fetchLeaderboardData = async (): Promise<LeaderboardEntry[]> => {
  try {
    const scoresCollection = collection(db, 'scores');
    const scoresQuery = query(scoresCollection, orderBy('score', 'desc'), limit(15));
    const querySnapshot = await getDocs(scoresQuery);

    const fetchedData: LeaderboardEntry[] = querySnapshot.docs.map((doc, index) => ({
      rank: index + 1,
      name: doc.data().email || `User ${index + 1}`, // Now using the email field from Firestore
      score: doc.data().score,
      badge: calculateBadge(doc.data().score),
    }));

    return fetchedData;
  } catch (error) {
    console.error('Error fetching leaderboard data:', error);
    return [];
  }
};
