'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';

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
      password, // for production, hash password
      createdAt: new Date().toISOString(),
    });

    alert('Signup successful! You can now log in.');
    router.push('/auth/signin');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-500">
      <form onSubmit={handleSubmit} className="bg-blue-600 p-6 rounded-xl shadow-md w-96">
        <h1 className="text-2xl font-bold mb-4 text-center">Client Signup</h1>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border rounded-lg p-2 mb-3"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded-lg p-2 mb-3"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded-lg p-2 mb-4"
          required
        />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg">
          Sign Up
        </button>
      </form>
    </div>
  );
}
