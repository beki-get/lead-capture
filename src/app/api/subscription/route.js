/////// src/app/api/subscription/route.js
import { query, collection, where, getDocs } from 'firebase/firestore';
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';

// Same mapping for consistency
const priceToName = {
  'price_1SKfmOGksStpzN2UNIJt8VUt': 'Pro',
  'price_1SKfmX...': 'Business',
  'price_1SKfmY...': 'Free',
};

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userEmail = searchParams.get('userEmail');

    if (!userEmail) {
      return NextResponse.json({ error: 'Missing userEmail' }, { status: 400 });
    }

    const q = query(collection(db, "users"), where("email", "==", userEmail));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
        return NextResponse.json({ subscription: null });
    }

    const userData = snapshot.docs[0].data();

    // Convert price ID to plan name if needed
    let planName = userData.plan || 'Free';
    if (planName.startsWith('price_')) {
      planName = priceToName[planName] || 'Free';
    }

    const subscription = {
      planName: planName,
      status: userData.planStatus || 'inactive',
      updatedAt: userData.updatedAt || null,
    };

    return NextResponse.json({ subscription });
  } catch (err) {
    console.error('Error fetching subscription:', err);
    return NextResponse.json({ error: 'Failed to fetch subscription' }, { status: 500 });
  }
}