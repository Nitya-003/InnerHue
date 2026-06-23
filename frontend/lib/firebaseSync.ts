import { doc, setDoc, collection, getDocs, deleteDoc } from 'firebase/firestore';
import { db, auth } from './firebase';
import { MoodEntry } from './useMoodStore';

export const saveMoodToCloud = async (mood: MoodEntry): Promise<void> => {
  const user = auth?.currentUser;
  if (!user || !db) return;

  try {
    const moodRef = doc(db, `users/${user.uid}/moods`, mood.id);
    await setDoc(moodRef, mood);
  } catch (error) {
    console.error('Error saving mood to cloud:', error);
  }
};

export const deleteMoodFromCloud = async (id: string): Promise<void> => {
  const user = auth?.currentUser;
  if (!user || !db) return;

  try {
    const moodRef = doc(db, `users/${user.uid}/moods`, id);
    await deleteDoc(moodRef);
  } catch (error) {
    console.error('Error deleting mood from cloud:', error);
  }
};

export const fetchMoodsFromCloud = async (): Promise<MoodEntry[]> => {
  const user = auth?.currentUser;
  if (!user || !db) return [];

  try {
    const moodsRef = collection(db, `users/${user.uid}/moods`);
    const snapshot = await getDocs(moodsRef);
    return snapshot.docs.map(d => d.data() as MoodEntry);
  } catch (error) {
    console.error('Error fetching moods from cloud:', error);
    return [];
  }
};

export const syncLocalToCloud = async (localMoods: MoodEntry[]): Promise<void> => {
  const user = auth?.currentUser;
  if (!user || !db) return;

  try {
    const cloudMoods = await fetchMoodsFromCloud();
    const cloudIds = new Set(cloudMoods.map(m => m.id));

    for (const mood of localMoods) {
      if (!cloudIds.has(mood.id)) {
        await saveMoodToCloud(mood);
      }
    }
  } catch (error) {
    console.error('Error syncing local to cloud:', error);
  }
};