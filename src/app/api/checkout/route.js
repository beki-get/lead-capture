///////checkout/route.js
import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Add the same mapping here for consistency
const priceToName = {
  'price_1SKfmOGksStpzN2UNIJt8VUt': 'Pro',
  'price_1SKfmX...': 'Business',
  'price_1SKfmY...': 'Free',
};

export async function POST(req) {
  try {
    const body = await req.json();
    const { priceId, userEmail, planName } = body || {};

    if (!priceId || !userEmail) {
      console.error("Missing required fields:", { priceId, userEmail });
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Ensure we have a proper plan name
    const finalPlanName = planName && !planName.startsWith('price_') 
      ? planName 
      : priceToName[priceId] || 'Unknown';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: "subscription",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/pricing`,
      customer_email: userEmail,
      metadata: { 
        priceId, 
        planName: finalPlanName // Ensure we're storing the actual plan name
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe Checkout Error:", err.message);
    return NextResponse.json(
      { error: "Failed to create checkout session", details: err.message },
      { status: 500 }
    );
  }
}