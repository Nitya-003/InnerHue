import { doc, setDoc, getDoc, updateDoc, collection, getDocs, deleteDoc } from 'firebase/firestore';
import { db, auth } from './firebase';
import { MoodEntry } from './useMoodStore';

export const saveMoodToCloud = async (mood: MoodEntry) => {
  const user = auth.currentUser;
  if (!user) return; // Only save if user is logged in

  try {
    const moodRef = doc(db, `users/${user.uid}/moods`, mood.id);
    await setDoc(moodRef, mood);
  } catch (error) {
    console.error("Error saving mood to cloud:", error);
  }
};

export const deleteMoodFromCloud = async (id: string) => {
  const user = auth.currentUser;
  if (!user) return;

  try {
    const moodRef = doc(db, `users/${user.uid}/moods`, id);
    await deleteDoc(moodRef);
  } catch (error) {
    console.error("Error deleting mood from cloud:", error);
  }
};

export const fetchMoodsFromCloud = async (): Promise<MoodEntry[]> => {
  const user = auth.currentUser;
  if (!user) return [];

  try {
    const moodsRef = collection(db, `users/${user.uid}/moods`);
    const snapshot = await getDocs(moodsRef);
    const moods: MoodEntry[] = [];
    snapshot.forEach(doc => {
      moods.push(doc.data() as MoodEntry);
    });
    return moods;
  } catch (error) {
    console.error("Error fetching moods from cloud:", error);
    return [];
  }
};

export const syncLocalToCloud = async (localMoods: MoodEntry[]) => {
  const user = auth.currentUser;
  if (!user) return;

  try {
    const cloudMoods = await fetchMoodsFromCloud();
    const cloudIds = new Set(cloudMoods.map(m => m.id));

    // Upload any moods that only exist locally
    for (const mood of localMoods) {
      if (!cloudIds.has(mood.id)) {
        await saveMoodToCloud(mood);
      }
    }
  } catch (error) {
    console.error("Error syncing local to cloud:", error);
  }
};
