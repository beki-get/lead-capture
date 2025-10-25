// src/app/client-billing/page.js
'use client';
import { useEffect, useState } from 'react';
import { useSession, signIn } from 'next-auth/react';

export default function ClientBillingWrapper() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'unauthenticated') signIn();
  }, [status]);

  if (!session) return <p className="text-center mt-20">Redirecting to login...</p>;

  return <ClientBilling userEmail={session.user.email} />;
}

function ClientBilling({ userEmail }) {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const res = await fetch(`/api/subscription?userEmail=${userEmail}`);
        const data = await res.json();
        setSubscription(data.subscription || null);
      } catch (err) {
        console.error('Error fetching subscription:', err);
      }
    };
    fetchSubscription();
  }, [userEmail]);

  const handlePortal = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/create-portal-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userEmail }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else alert('Failed to redirect to billing portal');
    } catch (err) {
      console.error('Billing portal error:', err);
      alert('Failed to redirect to billing portal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
          Billing
        </h1>

        {subscription ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 flex flex-col items-center space-y-6">
            <p className="text-gray-700 text-lg">
              Current Plan: <strong>{subscription.planName}</strong>
            </p>
            <p className="text-gray-500 text-md">Status: {subscription.status}</p>

            <button
              onClick={handlePortal}
              disabled={loading}
              className="w-full md:w-auto bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition font-semibold"
            >
              {loading ? 'Redirecting...' : 'Manage Billing'}
            </button>
          </div>
        ) : (
          <p className="text-center text-gray-500 text-lg mt-10">
            No active subscription found.
          </p>
        )}
      </div>
    </main>
  );
}
