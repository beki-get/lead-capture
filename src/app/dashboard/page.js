'use client';
import { useEffect, useState } from 'react';
import { useSession, signIn } from 'next-auth/react';
import LeadStats from '@/components/LeadState';
import LeadChart from '@/components/LeadChart';
import LeadTable from '@/components/LeadTable';

export default function DashboardWrapper() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'unauthenticated') signIn();
  }, [status]);

  if (!session) return <p className="text-center mt-20">Redirecting to login...</p>;

  return <Dashboard />;
}

function Dashboard() {
  const [leads, setLeads] = useState([]);
  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);

  const { data: session } = useSession();

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const res = await fetch('/api/leads');
        const data = await res.json();
        setLeads(data);
      } catch (err) {
        console.error('Error fetching leads:', err);
      }
    };
    fetchLeads();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 p-4 sm:p-6 lg:p-10">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-4 sm:p-6 lg:p-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center">
          Admin Dashboard
        </h1>

        <div className="grid grid-cols-1 gap-6">
          {/* Charts Section */}
          <div className="bg-gray-50 rounded-xl border border-gray-200 shadow-sm p-4 sm:p-6">
            <LeadChart isAdmin={true} />
          </div>

          {/* Stats Section */}
          <div className="bg-gray-50 rounded-xl border border-gray-200 shadow-sm p-4 sm:p-6">
            <LeadStats isAdmin={true} />
          </div>

          {/* Lead Table */}
          <div className="bg-gray-50 rounded-xl border border-gray-200 shadow-sm p-4 sm:p-6 overflow-x-auto">
            <LeadTable leads={leads} />
          </div>
        </div>
      </div>
    </main>
  );
}
