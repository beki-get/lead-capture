// Maps Supabase's raw error messages to something a visitor can actually
// act on, without leaking internals or confirming/denying an email exists

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';

const MIN_PASSWORD_LENGTH = 8;


function toFriendlyError(error) {
  const message = error?.message || '';

  if (message.includes('already registered') || message.includes('already exists')) {
    return 'That email is already registered. Try signing in instead.';
  }
  if (message.toLowerCase().includes('password')) {
    return message; 
  }
  if (message.toLowerCase().includes('fetch') || message.toLowerCase().includes('network')) {
    return "Couldn't reach the server. Check your connection and try again.";
  }
  return 'Something went wrong creating your account. Please try again.';
}

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState('idle');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setStatus('submitting');
    const supabase = createClient();

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name }, 
      },
    });

    if (signUpError) {
      setError(toFriendlyError(signUpError));
      setStatus('idle');
      return;
    }
    if (data.session) {
      router.push('/');
    } else {
      setStatus('checkEmail');
    }
  };

  if (status === 'checkEmail') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
        <div className="max-w-md w-full text-center bg-gray-800 p-8 rounded-2xl text-white space-y-3">
          <h1 className="text-2xl font-bold">Check your email</h1>
          <p className="text-gray-400">
            We sent a confirmation link to <span className="text-white">{email}</span>. Click it to
            activate your account, then come back and sign in.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="max-w-md w-full space-y-6">
        <h1 className="text-3xl font-bold text-white text-center">Create Your Account</h1>

        {error && <p className="text-red-400 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4 bg-gray-800 p-6 rounded-xl shadow-lg">
          <input
            type="text"
            placeholder="Business name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
            disabled={status === 'submitting'}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
            disabled={status === 'submitting'}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
            minLength={MIN_PASSWORD_LENGTH}
            disabled={status === 'submitting'}
          />
          <input
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
            disabled={status === 'submitting'}
          />
          <Button
            type="submit"
            className="w-full bg-indigo-500 hover:bg-indigo-400"
            disabled={status === 'submitting'}
          >
            {status === 'submitting' ? 'Creating account…' : 'Sign Up'}
          </Button>
        </form>

        <p className="text-center text-gray-400">
          Already have an account?{' '}
          <a href="/auth/signin" className="text-indigo-400 hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}