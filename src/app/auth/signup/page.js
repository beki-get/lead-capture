'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if user exists
    const q = query(collection(db, 'users'), where('email', '==', email));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) return alert('Email already registered');

    // Add client to Firestore
    await addDoc(collection(db, 'users'), {
      name,
      email,
      password, // TODO: hash password in production
      createdAt: new Date().toISOString(),
    });

    alert('Signup successful! You can now log in.');
    router.push('/auth/signin');
  };

  const handleSocialLogin = (provider) => {
    // TODO: integrate next-auth social login
    alert(`Login with ${provider} clicked`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="max-w-md w-full space-y-6">
        <h1 className="text-3xl font-bold text-white text-center">Create Your Account</h1>

        <div className="flex justify-center gap-4">
          <Button variant="outline" className="flex-1" onClick={() => handleSocialLogin('Google')}>
            Sign up with Google
          </Button>
          <Button variant="outline" className="flex-1" onClick={() => handleSocialLogin('GitHub')}>
            Sign up with GitHub
          </Button>
        </div>

        <Separator className="my-4" />

        <form onSubmit={handleSubmit} className="space-y-4 bg-gray-800 p-6 rounded-xl shadow-lg">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          <Button type="submit" className="w-full bg-indigo-500 hover:bg-indigo-400">
            Sign Up
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
