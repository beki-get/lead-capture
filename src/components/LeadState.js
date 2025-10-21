'use client';
import { useEffect, useState } from 'react';

export default function LeadStats({ userEmail, isAdmin = false }) {
  const [leads, setLeads] = useState([]);

  useEffect(() => {
    const fetchLeads = async () => {
      const res = await fetch('/api/leads');
      const data = await res.json();

      // If it's a client, show only their leads
      const filteredLeads = isAdmin
        ? data
        : data.filter((lead) => lead.userEmail === userEmail);

      setLeads(filteredLeads);
    };

    fetchLeads();
  }, [userEmail, isAdmin]);

  // Total leads
  const totalLeads = leads.length;

  // Leads per day
  const leadsPerDay = {};
  leads.forEach((lead) => {
    const date = new Date(lead.createdAt).toLocaleDateString();
    leadsPerDay[date] = (leadsPerDay[date] || 0) + 1;
  });

  return (
    <div className="max-w-4xl mx-auto bg-gray-700 shadow-xl rounded-xl p-6 mb-6">
      <h2 className="text-xl font-bold mb-4 text-gray-100">Lead Analytics</h2>
      <p className="mb-2 text-gray-300">Total Leads: {totalLeads}</p>
      <div>
        <h3 className="font-semibold mb-2 text-gray-100">Leads Per Day:</h3>
        <ul className="list-disc list-inside">
          {Object.entries(leadsPerDay).map(([date, count]) => (
            <li key={date} className="text-gray-300">
              {date}: {count} lead{count > 1 ? 's' : ''}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
