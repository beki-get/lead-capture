'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';

const GENERIC_ERROR = 'Invalid email or password.';

function toFriendlyError(error) {
  const message = error?.message || '';

  if (message.toLowerCase().includes('email not confirmed')) {
    return 'Please confirm your email first — check your inbox for the link we sent.';
  }
  if (message.toLowerCase().includes('fetch') || message.toLowerCase().includes('network')) {
    return "Couldn't reach the server. Check your connection and try again.";
  }
  return GENERIC_ERROR;
}

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(toFriendlyError(signInError));
      setSubmitting(false);
      return;
    }

    // Note: this still points at /client-dashboard, which gets renamed to
    // /dashboard once the old admin dashboard is removed (next cleanup pass).
    router.push('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-2xl shadow-lg text-white">
        <h1 className="text-3xl font-bold text-center mb-6">Sign In</h1>

        {error && <p className="text-red-400 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg bg-gray-700 p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
            disabled={submitting}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg bg-gray-700 p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
            disabled={submitting}
          />
          <Button
            type="submit"
            className="w-full bg-indigo-500 hover:bg-indigo-400 py-3 rounded-lg font-semibold"
            disabled={submitting}
          >
            {submitting ? 'Signing in…' : 'Sign In'}
          </Button>
        </form>

        <div className="mt-4 text-center text-sm">
          <a href="/auth/signup" className="text-indigo-400 hover:underline">
            Create account
          </a>
        </div>
      </div>
    </div>
  );
}