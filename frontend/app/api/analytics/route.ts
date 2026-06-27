import { NextResponse } from 'next/server';
import { adminDb, adminAuth } from '@/lib/firebaseAdmin';

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized: Missing token' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    let uid: string;
    try {
      const decodedToken = await adminAuth.verifyIdToken(token);
      uid = decodedToken.uid;
    } catch (error) {
      console.error('Error verifying Firebase token:', error);
      return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 });
    }

    const moodsRef = adminDb.collection('users').doc(uid).collection('moods');
    const snapshot = await moodsRef.get();
    
    let totalEntries = 0;
    let todayEntries = 0;
    let weekEntries = 0;
    const moodCounts: Record<string, number> = {};

    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(now.getDate() - 7);
    const weekAgoTime = oneWeekAgo.getTime();

    snapshot.forEach(doc => {
      const data = doc.data();
      totalEntries++;

      if (data.date === todayStr) {
        todayEntries++;
      }

      if (new Date(data.timestamp).getTime() >= weekAgoTime) {
        weekEntries++;
      }

      const moodName = data.emotion || data.mood;
      if (moodName) {
        moodCounts[moodName] = (moodCounts[moodName] || 0) + 1;
      }
    });

    let mostCommonMood = null;
    let maxCount = 0;
    for (const [mood, count] of Object.entries(moodCounts)) {
      if (count > maxCount) {
        maxCount = count;
        mostCommonMood = mood;
      }
    }

    const stats = {
      totalEntries,
      todayEntries,
      weekEntries,
      mostCommonMood,
      moodCounts,
    };

    return NextResponse.json(stats);
  } catch (error: unknown) {
  const message = error instanceof Error ? error.message : 'Internal Server Error';
  console.error('Analytics API Error:', message);
  return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
}
}
