'use client';
import { useEffect, useState } from 'react';

export default function LeadStats({ userEmail, isAdmin = false }) {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeads = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/leads');
        const data = await res.json();
        setLeads(isAdmin ? data : data.filter(l => l.userEmail === userEmail));
      } catch (err) {
        console.error('Error fetching leads:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeads();
  }, [userEmail, isAdmin]);

  const totalLeads = leads.length;
  const leadsPerDay = {};
  leads.forEach((lead) => {
    const date = new Date(lead.createdAt).toLocaleDateString();
    leadsPerDay[date] = (leadsPerDay[date] || 0) + 1;
  });

  return (
    <div className="bg-gray-800 rounded-xl shadow-md p-6 w-full text-white">
      <h2 className="text-xl font-bold mb-4">Lead Analytics</h2>
      {loading ? (
        <p className="text-gray-400 text-center">Loading stats...</p>
      ) : (
        <>
          <div className="mb-4">
            <span className="text-indigo-400 font-bold text-2xl">{totalLeads}</span>
            <span className="ml-2 text-gray-300">Total Leads</span>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Leads Per Day</h3>
            <div className="overflow-y-auto max-h-48 border-t border-gray-700 pt-2">
              {Object.entries(leadsPerDay).map(([date, count]) => (
                <div key={date} className="flex justify-between text-gray-300 py-1">
                  <span>{date}</span>
                  <span className="text-indigo-400 font-semibold">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
