// src/app/api/stripe/webhook/route.js
import { query, collection, where, getDocs } from 'firebase/firestore';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { db } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
 const priceToName = {
  'price_1SKfmOGksStpzN2UNIJt8VUt': 'Pro',
  'price_1SKfmX...': 'Business',
  'price_1SKfmY...': 'Free',
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

  // ✅ Handle successful payment
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const customerEmail = session.customer_email;
    const priceId = session.metadata.priceId;
   const planName = priceToName[priceId] || 'Unknown';

    try {
     // Retrieve price and product details from Stripe
      const price = await stripe.prices.retrieve(priceId);
      const product = await stripe.products.retrieve(price.product);
      const planName = product.name; // <-- This overwrites the previous planName!

      // Find user's document in Firestore using email
      const q = query(collection(db, 'users'), where('email', '==', customerEmail));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        console.error('❌ User not found:', customerEmail);
        return ;
      }

      const userDoc = snapshot.docs[0];
      await updateDoc(userDoc.ref, {
        plan: planName,
        planStatus: 'active',
        updatedAt: new Date().toISOString(),
        stripeCustomerId: session.customer,
      });

      console.log('✅ Firestore updated for user:', customerEmail);
    } catch (error) {
      console.error('❌ Firestore update failed:', error);
    }
  }

  return NextResponse.json({ received: true });
}
