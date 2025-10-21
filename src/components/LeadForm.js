'use client';
import { useState } from 'react';
import { useSession } from 'next-auth/react';

export default function LeadForm() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { data: session } = useSession();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    setLoading(false);
    if (res.ok) {
      setSuccess(true);
      setForm({ name: '', email: '', message: '' });
    } else {
      alert('Failed to send lead');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-black shadow-xl rounded-xl p-6 mt-10">
      <h2 className="text-2xl font-bold text-center mb-4 text-blue-600">
        Contact Us
      </h2>

      {success && (
        <p className="text-green-600 text-center mb-3">
          ✅ Lead submitted successfully!
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <textarea
          name="message"
          placeholder="Your Message"
          value={form.message}
          onChange={handleChange}
          required
          rows={4}
          className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {loading ? 'Sending...' : 'Submit'}
        </button>
      </form>
    </div>
  );
}
