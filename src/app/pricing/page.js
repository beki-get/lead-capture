'use client';
import { useSession } from 'next-auth/react';

export default function Pricing() {
  const { data: session } = useSession();

  const handleCheckout = async (priceId, planName) => {
    if (!session) return alert("Please login first.");
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId, userEmail: session.user.email, planName }),
      });
      if (!res.ok) {
        const text = await res.text();
        console.error("Checkout failed:", text);
        alert("Checkout failed. Check console for details.");
        return;
      }

      const data = await res.json();
      if (!data.url) throw new Error("Checkout session not created");
      window.location.href = data.url;
    } catch (error) {
      console.error("Error during checkout:", error);
      alert("Failed to initiate checkout. Please try again.");
    }
  };

  const plans = [
    { name: 'Free', price: '$0', id: 'price_1SKfjxGksStpzN2UmgG3NcjX', features: ['Basic lead capture', 'Email support'] },
    { name: 'Pro', price: '$10/mo', id: 'price_1SKflZGksStpzN2U4a73zCkr', features: ['Everything in Free', 'Advanced analytics', 'Priority support'], highlight: true },
    { name: 'Business', price: '$25/mo', id: 'price_1SKfmOGksStpzN2UNIJt8VUt', features: ['Everything in Pro', 'Team management', 'Custom integrations'] },
  ];

  return (
    <main className="min-h-screen bg-gray-50 py-16 px-6">
      <h1 className="text-4xl font-bold mb-12 text-center text-gray-800">Choose Your Plan</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map(plan => (
          <div
            key={plan.id}
            className={`relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border ${
              plan.highlight ? 'border-blue-600' : 'border-gray-200'
            }`}
          >
            {plan.highlight && (
              <span className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                Most Popular
              </span>
            )}
            <h2 className="text-2xl font-semibold mb-4">{plan.name}</h2>
            <p className="text-gray-700 text-xl mb-6">{plan.price}</p>
            <ul className="mb-6 space-y-2 text-gray-600">
              {plan.features.map((f, idx) => (
                <li key={idx} className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 00-1.414 0L9 11.586 6.707 9.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l7-7a1 1 0 000-1.414z" clipRule="evenodd" />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleCheckout(plan.id, plan.name)}
              className={`w-full py-3 rounded-xl text-white font-semibold transition-colors duration-300 ${
                plan.highlight ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-800 hover:bg-gray-900'
              }`}
            >
              Subscribe
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
