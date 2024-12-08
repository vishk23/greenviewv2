import { db } from '@services/firebase';
import { collection, query, orderBy, limit, getDocs, doc, getDoc } from 'firebase/firestore';

export interface LeaderboardEntry {
  rank: number;
  name: string;
  score: number;
  streak: number;
}

// Function to fetch the user's name based on userId
const fetchUserName = async (userId: string): Promise<string | null> => {
  try {
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      const userData = userDoc.data();
      return userData.displayName || null;
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
        const userId = doc.id;
        const userName = await fetchUserName(userId);
        
        return {
          rank: index + 1,
          name: userName || data.email,
          score: data.score,
          streak: data.streak || 0,
        };
      })
    );

    return fetchedData;
  } catch (error) {
    console.error('Error fetching leaderboard data:', error);
    return [];
  }
};
