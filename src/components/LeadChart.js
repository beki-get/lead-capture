'use client';
import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts';

export default function LeadChart({ userEmail, isAdmin = false }) {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState('all'); // all, 7, 30
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeads = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/leads');
        const leads = await res.json();
        const now = new Date();

        // 🧠 Filter by user (client only sees their own)
        const filteredLeads = isAdmin
          ? leads
          : leads.filter((l) => l.userEmail === userEmail);

        // 🧠 Filter by time range
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

            // 🧠 For admin: group by user to compare user performance
            if (isAdmin) {
              const key = `${dateStr}-${lead.userEmail}`;
              leadsPerDay[key] = {
                date: dateStr,
               user: lead.userEmail ? lead.userEmail.split('@')[0] : 'Unknown',
                count: (leadsPerDay[key]?.count || 0) + 1,
              };
            } else {
              leadsPerDay[dateStr] = {
                date: dateStr,
                count: (leadsPerDay[dateStr]?.count || 0) + 1,
              };
            }
          }
        });

        // 🧠 Transform data for chart
        const chartData = Object.values(leadsPerDay);
        setData(chartData);
      } catch (err) {
        console.error('Error fetching leads:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, [filter, userEmail, isAdmin]);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 w-full transition-all duration-300">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">
          {isAdmin ? 'All Clients Lead Chart' : 'Your Lead Chart'}
        </h2>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded-lg p-1 text-gray-700"
        >
          <option value="all">All Time</option>
          <option value="7">Last 7 Days</option>
          <option value="30">Last 30 Days</option>
        </select>
      </div>

      {loading ? (
        <p className="text-center text-gray-400">Loading chart...</p>
      ) : data.length === 0 ? (
        <p className="text-center text-gray-500">No lead data available.</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis allowDecimals={false} />
            <Tooltip
              formatter={(val, name, props) =>
                isAdmin ? [`${val} leads`, props.payload.user] : [`${val} leads`, 'Date']
              }
            />
            <Legend />
            <Bar
              dataKey="count"
              fill={isAdmin ? '#8b5cf6' : '#3b82f6'}
              radius={[6, 6, 0, 0]}
              name={isAdmin ? 'Leads by User' : 'Leads'}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
