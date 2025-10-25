'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await signIn('credentials', { email, password, redirect: false });

    if (res.ok) {
      const sessionRes = await fetch('/api/auth/session');
      const session = await sessionRes.json();
      if (session.user.role === 'admin') window.location.href = '/dashboard';
      else window.location.href = '/client-dashboard';
    } else {
      setError('Invalid credentials. Please try again.');
    }
  };

  const handleGoogleSignIn = () => signIn('google');

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
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg bg-gray-700 p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          <Button type="submit" className="w-full bg-indigo-500 hover:bg-indigo-400 py-3 rounded-lg font-semibold">
            Sign In
          </Button>
        </form>

        <div className="mt-4 text-center">
          <Button onClick={handleGoogleSignIn} className="w-full bg-white text-gray-900 py-3 rounded-lg font-semibold hover:bg-gray-100">
            Sign in with Google
          </Button>
        </div>

        <div className="mt-4 flex justify-between text-sm text-gray-400">
          <a href="/forgot-password" className="hover:text-indigo-400">Forgot password?</a>
          <a href="/signup" className="hover:text-indigo-400">Create account</a>
        </div>

        <div className="mt-6 text-center text-gray-500 text-xs">
          Other login methods like GitHub, LinkedIn, or SSO can be added here.
        </div>
      </div>
    </div>
  );
}
