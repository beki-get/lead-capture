// src/app/api/stripe/webhook/route.js
import { query, collection, where, getDocs } from 'firebase/firestore';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { db } from '@/lib/firebase';
import { updateDoc } from 'firebase/firestore';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// 🔹 Price ID → Plan name mapping
const priceToName = {
  'price_1SKflZGksStpzN2U4a73zCkr': 'Pro',
  'price_1SKfmOGksStpzN2UNIJt8VUt': 'Business',
};

export async function POST(req) {
  const sig = req.headers.get('stripe-signature');
  const body = await req.text();

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('❌ Webhook Error:', err.message);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  // ✅ Handle successful checkout (new subscription)
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const customerEmail = session.customer_email;
    const priceId = session.metadata?.priceId;

    try {
      const q = query(collection(db, 'users'), where('email', '==', customerEmail));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        console.error('❌ User not found:', customerEmail);
        return;
      }

      const userDoc = snapshot.docs[0];
      const planName = priceToName[priceId] || 'Unknown';

      await updateDoc(userDoc.ref, {
        plan: planName,
        planStatus: 'active',
        updatedAt: new Date().toISOString(),
        stripeCustomerId: session.customer, // Store for future webhook events
      });

      console.log('✅ Firestore updated (checkout):', customerEmail, planName);
    } catch (error) {
      console.error('❌ Firestore update failed:', error);
    }
  }

  // ✅ Handle subscription updates or cancellations
  if (
  event.type === 'customer.subscription.updated' ||
  event.type === 'customer.subscription.deleted'
) {
  const subscription = event.data.object;

  try {
    console.log('📦 Subscription event received:', event.type);
    console.log('➡️ Stripe customer ID:', subscription.customer);

    // Try to get customer info (email can be null)
    const customer = await stripe.customers.retrieve(subscription.customer);
    const customerEmail = customer?.email || null;
    let userDoc = null;

    // 1️⃣ Try matching by stripeCustomerId (most reliable)
    const qById = query(
      collection(db, 'users'),
      where('stripeCustomerId', '==', subscription.customer)
    );
    const snapshotById = await getDocs(qById);
    if (!snapshotById.empty) {
      userDoc = snapshotById.docs[0];
      console.log('✅ Found user by stripeCustomerId:', userDoc.id);
    }

    // 2️⃣ Fallback: try by email if ID not found
    if (!userDoc && customerEmail) {
      const qByEmail = query(
        collection(db, 'users'),
        where('email', '==', customerEmail)
      );
      const snapshotByEmail = await getDocs(qByEmail);
      if (!snapshotByEmail.empty) {
        userDoc = snapshotByEmail.docs[0];
        console.log('✅ Found user by email:', userDoc.id);

        // 🔧 Backfill missing stripeCustomerId if needed
        await updateDoc(userDoc.ref, {
          stripeCustomerId: subscription.customer,
        });
      }
    }

    if (!userDoc) {
      console.error('❌ No matching user found for customer:', subscription.customer);
      return;
    }

    // ✅ Update user plan
    if (subscription.status === 'active' || subscription.status === 'trialing') {
      const priceId = subscription.items.data[0].price.id;
      const planName = priceToName[priceId] || 'Unknown';
      await updateDoc(userDoc.ref, {
        plan: planName,
        planStatus: 'active',
        updatedAt: new Date().toISOString(),
      });
      console.log('✅ Subscription updated for:', userDoc.id, '→', planName);
    } else {
      await updateDoc(userDoc.ref, {
        plan: 'Free',
        planStatus: 'inactive',
        updatedAt: new Date().toISOString(),
      });
      console.log('✅ Subscription cancelled for:', userDoc.id);
    }
  } catch (error) {
    console.error('❌ Firestore update failed:', error);
  }
}

  return NextResponse.json({ received: true });
}
