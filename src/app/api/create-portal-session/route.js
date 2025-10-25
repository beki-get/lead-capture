// src/app/api/create-portal-session/route.js
import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const { userEmail } = await req.json();
    if (!userEmail) return NextResponse.json({ error: 'Missing userEmail' }, { status: 400 });

    // Get Stripe customer ID from Firestore
    const q = query(collection(db, 'users'), where('email', '==', userEmail));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return NextResponse.json({ error: 'No subscription found' }, { status: 404 });

    const userData = snapshot.docs[0].data();
    const customerId = userData.stripeCustomerId;

    // Create a Stripe Customer Portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.NEXTAUTH_URL}/client-dashboard`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('Error creating portal session:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
