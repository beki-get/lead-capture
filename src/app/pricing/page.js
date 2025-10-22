'use client';
import { useSession } from 'next-auth/react';

export default function Pricing() {
  const { data: session } = useSession();

  const handleCheckout = async (priceId) => {
    if (!session) return alert("Please login first.");
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId, userEmail: session.user.email }),
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

  return (
    <main className="min-h-screen bg-gray-100 p-10 text-center">
      <h1 className="text-3xl font-bold mb-8">Choose Your Plan</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {[
          { name: 'Free', price: '$0', id: 'price_1SKfjxGksStpzN2UmgG3NcjX' },
          { name: 'Pro', price: '$10/mo', id: 'price_1SKflZGksStpzN2U4a73zCkr' },
          { name: 'Business', price: '$25/mo', id: 'price_1SKfmOGksStpzN2UNIJt8VUt' },
        ].map(plan => (
          <div key={plan.id} className="bg-white rounded-xl p-6 shadow-md">
            <h2 className="text-xl font-semibold mb-2">{plan.name}</h2>
            <p className="text-gray-600 mb-4">{plan.price}</p>
            <button
              onClick={() => handleCheckout(plan.id)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Subscribe
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
