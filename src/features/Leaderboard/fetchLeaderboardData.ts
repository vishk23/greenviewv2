import { db } from '@services/firebase';
import { collection, query, orderBy, limit, getDocs, doc, getDoc } from 'firebase/firestore';

export interface LeaderboardEntry {
  rank: number;
  name: string;
  score: number;
  badge: string;
}

const calculateBadge = (score: number): string => {
  if (score >= 90) return '★★★';
  if (score >= 65) return '★★';
  if (score >= 40) return '★';
  return '☆';
};

// Function to fetch the user's name based on userId
const fetchUserName = async (userId: string): Promise<string | null> => {
  try {
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      const userData = userDoc.data();
      return userData.name || null;
    }
    return null;
  } catch (error) {
    console.error('Error fetching user name:', error);
    return null;
  }
};

export const fetchLeaderboardData = async (): Promise<LeaderboardEntry[]> => {
  try {
    const scoresCollection = collection(db, 'scores');
    const scoresQuery = query(scoresCollection, orderBy('score', 'desc'), limit(15));
    const querySnapshot = await getDocs(scoresQuery);

    const fetchedData: LeaderboardEntry[] = await Promise.all(
      querySnapshot.docs.map(async (doc, index) => {
        const data = doc.data();
        const userId = doc.id; // Assuming `userId` is the document ID
        const userName = await fetchUserName(userId);
        
        return {
          rank: index + 1,
          name: userName || data.email, // Fallback to email if name is not found
          score: data.score,
          badge: calculateBadge(data.score),
        };
      })
    );

    return fetchedData;
  } catch (error) {
    console.error('Error fetching leaderboard data:', error);
    return [];
  }
};
