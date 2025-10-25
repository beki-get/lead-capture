'use client';
import { useState, useEffect } from 'react';
import { useSession, signOut, signIn } from 'next-auth/react';
import LeadChart from '@/components/LeadChart';
import LeadStats from '@/components/LeadState';
import { Sun, Moon } from 'lucide-react'; // optional icons for theme toggle

export default function ClientDashboardWrapper() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'unauthenticated') signIn();
  }, [status]);

  if (!session) return <p className="text-center mt-20">Redirecting to login...</p>;

  return <ClientDashboard user={session.user} />;
}

function ClientDashboard({ user }) {
  const [leads, setLeads] = useState([]);
  const [activeSection, setActiveSection] = useState('dashboard'); // dashboard, profile, settings
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const fetchLeads = async () => {
      const res = await fetch('/api/leads');
      const data = await res.json();
      const userLeads = data.filter((lead) => lead.userEmail === user.email);
      setLeads(userLeads);
    };
    fetchLeads();
  }, [user.email]);

  const totalLeads = leads.length;
  const last7DaysLeads = leads.filter(
    (l) => (new Date() - new Date(l.createdAt)) / (1000 * 60 * 60 * 24) <= 7
  ).length;

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'leads', label: 'Leads' },
    { id: 'profile', label: 'Profile' },
    { id: 'settings', label: 'Settings' },
    { id: 'future', label: 'Future Features' },
  ];

  return (
    <div className={`${darkMode ? 'dark' : ''} flex min-h-screen`}>
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0  bg-gray-800 text-white w-64 transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out z-50 md:relative md:translate-x-0`}
      >
        <div className="p-6 text-center font-bold text-xl border-b border-gray-700">
          Lead Capture
        </div>
        <nav className="mt-6 flex flex-col gap-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`text-left w-full px-4 py-2 rounded hover:bg-gray-700 transition ${
                activeSection === item.id ? 'bg-gray-700 font-semibold' : ''
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <div className="mt-auto p-6 flex justify-between items-center">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full hover:bg-gray-700 transition"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button
            onClick={() => signOut()}
            className="bg-red-500 hover:bg-red-400 text-white px-3 py-1 rounded-md transition"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile toggle button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden fixed top-4 left-4 z-50 bg-gray-800 text-white p-2 rounded-md"
      >
        ☰
      </button>

      {/* Main content */}
      <main className="flex-1 p-6 transition-all duration-300 md:ml-64">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 capitalize">{activeSection}</h1>
        </header>

        {activeSection === 'dashboard' && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div className="bg-white dark:bg-gray-700 p-4 rounded-xl shadow-md text-center transition transform hover:scale-105">
                <p className="text-gray-500 dark:text-gray-300">Total Leads</p>
                <p className="text-2xl font-bold text-indigo-500">{totalLeads}</p>
              </div>
              <div className="bg-white dark:bg-gray-700 p-4 rounded-xl shadow-md text-center transition transform hover:scale-105">
                <p className="text-gray-500 dark:text-gray-300">Last 7 Days</p>
                <p className="text-2xl font-bold text-indigo-500">{last7DaysLeads}</p>
              </div>
            </div>

            <LeadChart userEmail={user.email} />
            <LeadStats userEmail={user.email} />
          </>
        )}

        {activeSection === 'leads' && (
          <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-md">
            <p>Leads table or management section will go here.</p>
          </div>
        )}

        {activeSection === 'profile' && (
          <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-md">
            <p>Profile management section here.</p>
          </div>
        )}

        {activeSection === 'settings' && (
          <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-md">
            <p>Settings and integrations will go here.</p>
          </div>
        )}

        {activeSection === 'future' && (
          <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-md">
            <p>Future features placeholder (e.g., marketing automation, AI insights).</p>
          </div>
        )}
      </main>
    </div>
  );
}
