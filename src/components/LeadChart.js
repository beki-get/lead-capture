// src/components/LeadChart.js
'use client';
import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function LeadChart({ userEmail, isAdmin = false }) {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState('all'); // all, 7, 30

  useEffect(() => {
    const fetchLeads = async () => {
      const res = await fetch('/api/leads');
      const leads = await res.json();
      const userLeads = leads.filter((lead) => lead.userEmail === userEmail);
      // ✅ Filter by userEmail if not admin
      const filteredLeads = isAdmin
        ? leads
        : leads.filter((lead) => lead.userEmail === userEmail);
      const now = new Date();
      const leadsPerDay = {};

      filteredLeads.forEach((lead) => {
        const leadDate = new Date(lead.createdAt);
        const diffDays = Math.floor((now - leadDate) / (1000 * 60 * 60 * 24));

        if (
          filter === 'all' ||
          (filter === '7' && diffDays < 7) ||
          (filter === '30' && diffDays < 30)
        ) {
          const dateStr = leadDate.toLocaleDateString();
          leadsPerDay[dateStr] = (leadsPerDay[dateStr] || 0) + 1;
        }
      });

      const chartData = Object.entries(leadsPerDay).map(([date, count]) => ({
        date,
        count,
      }));

      setData(chartData);
    };

    fetchLeads();
  }, [filter, userEmail, isAdmin]);

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-xl p-6 mb-6">
      <h2 className="text-xl font-bold mb-4 text-gray-700">Leads Chart</h2>

      {/* Filter Dropdown */}
      <div className="mb-4">
        <label className="mr-2 font-semibold">Filter:</label>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded-lg p-1"
        >
          <option value="all">All Time</option>
          <option value="7">Last 7 Days</option>
          <option value="30">Last 30 Days</option>
        </select>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="date" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="count" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
