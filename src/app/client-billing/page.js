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
      const res = await fetch(`/api/subscription?userEmail=${userEmail}`);
      const data = await res.json();
      setSubscription(data.subscription || null);
    };
    fetchSubscription();
  }, [userEmail]);

  const handlePortal = async () => {
    setLoading(true);
    const res = await fetch('/api/create-portal-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userEmail }),
    });
    const data = await res.json();
    setLoading(false);
    if (data.url) window.location.href = data.url;
    else alert('Failed to redirect to billing portal');
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Billing</h1>
      {subscription ? (
        <div className="bg-white shadow-xl rounded-xl p-6 text-center">
          <p className="text-gray-700 mb-4">
            Current Plan: <strong>{subscription.planName}</strong>
          </p>
          <p className="text-gray-500 mb-6">
            Status: {subscription.status}
          </p>
          <button
            onClick={handlePortal}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            {loading ? 'Redirecting...' : 'Manage Billing'}
          </button>
        </div>
      ) : (
        <p className="text-center text-gray-500">No active subscription found.</p>
      )}
    </div>
  );
}
