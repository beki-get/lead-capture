// src/app/dashboard/page.js
'use client';
import { useEffect, useState } from 'react';
import { useSession, signIn } from 'next-auth/react';
import LeadStats from '@/components/LeadState';
import LeadChart from '@/components/LeadChart';
import { exportToCSV } from '@/utils/exportToCSV';
export default function DashboardWrapper() {
  const { data: session, status } = useSession();

       useEffect(() => {
            if (status === 'unauthenticated') signIn();
                   }, [status]);

           if (!session) return <p className="text-center mt-20">Redirecting to login...</p>;

             return <Dashboard />;
              }

// Make Dashboard a named export
function Dashboard() {
    const [leads, setLeads] = useState([]);
    const [search, setSearch] = useState('');
    const [sortOrder, setSortOrder] = useState('desc');
    const [currentPage, setCurrentPage] = useState(1);
      const { data: session } = useSession();
    
  useEffect(() => {
        const fetchLeads = async () => {
         const res = await fetch('/api/leads');
         const data = await res.json();
          const userLeads = data.filter(
            (lead) => lead.userEmail === session.user.email
          );
          setLeads(userLeads);
          setLeads(data);
          };
         fetchLeads();
      }, [session]);

  const filteredLeads = leads
       .filter((lead) =>
       lead.name.toLowerCase().includes(search.toLowerCase()) ||
        lead.email.toLowerCase().includes(search.toLowerCase())
     )
    .sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
     });
const leadsPerPage = 5;
    const indexOfLastLead = currentPage * leadsPerPage;
    const indexOfFirstLead = indexOfLastLead - leadsPerPage;
    const currentLeads = filteredLeads.slice(indexOfFirstLead, indexOfLastLead);
    const totalPages = Math.ceil(filteredLeads.length / leadsPerPage);
    const handlePageChange = (page) => setCurrentPage(page);

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-200 p-8">
       <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-6">
         <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
           Admin Dashboard
         </h1>
         <LeadChart isAdmin={true} />
         <LeadStats isAdmin={true} />
       </div>

         <div className="bg-blue-500 flex justify-between items-center mb-4 max-w-4xl mx-auto">
            <input
              type="text"
               placeholder="Search by name or email..."
                value={search}
                 onChange={(e) => setSearch(e.target.value)}
                  className="border px-3 py-2 rounded-lg w-1/2"
             />
           <select
             value={sortOrder}
             onChange={(e) => setSortOrder(e.target.value)}
              className="border px-3 py-2 rounded-lg"
           >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
        </select>
      </div>
            
      {filteredLeads.length === 0 ? (
        <p className="text-center text-gray-500">No leads yet.</p>
      ) : (
        <div className="overflow-x-auto max-w-4xl mx-auto bg-blue-500 rounded-xl shadow-md p-4">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Message</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {currentLeads.map((lead) => (
                <tr key={lead.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{lead.name}</td>
                  <td className="p-3">{lead.email}</td>
                  <td className="p-3">{lead.message}</td>
                  <td className="p-3 text-gray-500">
                    {lead.createdAt ? new Date(lead.createdAt).toLocaleString() : ""}
                  </td>
                  <td className="p-3">
                     <select
                        value={lead.status || 'Pending'}
                        onChange={async (e) => {
                           const newStatus = e.target.value;
                           await fetch(`/api/leads/${lead.id}`, {
                               method: 'PUT',
                                headers: { 'Content-Type': 'application/json' },
                                 body: JSON.stringify({ status: newStatus }),
                                  });
                                setLeads((prev) =>
                                 prev.map((l) =>
                                l.id === lead.id ? { ...l, status: newStatus } : l
                                  )
                                );
                               }}
                                className="border rounded-lg p-1 text-sm"
                             >
                               <option value="Pending">Pending</option>
                               <option value="Contacted">Contacted</option>
                               <option value="Converted">Converted</option>
                             </select>
                           </td>
                         </tr>
                       ))}
                     </tbody>
          </table>
         <div className="flex justify-center mt-4 space-x-2">
    {Array.from({ length: totalPages }, (_, i) => (
     <button
         key={i + 1}
           onClick={() => handlePageChange(i + 1)}
             className={`px-3 py-1 rounded ${
               currentPage === i + 1
                ? 'bg-blue-600 text-white'
                 : 'bg-gray-200 text-gray-700'
                 }`}
                    >
                   {i + 1}
              </button>
                 ))}
            </div>
          
           </div>
             )}
         <button
            onClick={() => exportToCSV(leads, 'leads.csv')}
            className="mb-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Export Leads as CSV
          </button>
    </main>
  );
}
