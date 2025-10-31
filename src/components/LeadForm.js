"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";

export default function LeadForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { data: session } = useSession();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...form,
      userEmail: session?.user?.email,
      submittedAt: new Date().toISOString(),
    };

    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setLoading(false);
    if (res.ok) {
      setSuccess(true);
      setForm({ name: "", email: "", message: "" });
      setTimeout(() => setSuccess(false), 3000);
    } else alert("❌ Failed to send lead");
  };

  return (
    <section className="relative py-20 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.1)_0%,transparent_70%)]"></div>

      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="relative z-10 max-w-3xl mx-auto px-6"
      >
        <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl shadow-2xl rounded-3xl p-10 border border-gray-700">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
            Share Your Thoughts 💬
          </h2>
          <p className="text-gray-400 text-center mb-8 max-w-lg mx-auto">
            Help us improve our service! Your feedback and insights help shape better tools for our clients.
          </p>

          {success && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-green-400 text-center mb-4 font-medium"
            >
              ✅ Thank you! Your message has been sent successfully.
            </motion.p>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid md:grid-cols-2 gap-5">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full bg-gray-800/70 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
              />

              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full bg-gray-800/70 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <textarea
              name="message"
              placeholder="Write your message here..."
              value={form.message}
              onChange={handleChange}
              required
              rows={4}
              className="w-full bg-gray-800/70 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-200"
            >
              {loading ? "Sending..." : "Submit Feedback"}
            </button>
          </form>
        </div>
      </motion.div>
    </section>
  );
}
