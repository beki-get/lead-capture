'use client';
import { signIn } from 'next-auth/react';
import { useState } from 'react';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await signIn('credentials', { email, password, redirect: false });

    if (res.ok) {
      // Redirect based on role
      const sessionRes = await fetch('/api/auth/session');
      const session = await sessionRes.json();
      if (session.user.role === 'admin') window.location.href = '/dashboard';
      else window.location.href = '/client-dashboard';
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-500">
      <form onSubmit={handleSubmit} className="bg-blue-600 p-6 rounded-xl shadow-md w-96">
        <h1 className="text-2xl font-bold mb-4 text-center">Sign In</h1>
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
          Sign In
        </button>
      </form>
    </div>
  );
}
