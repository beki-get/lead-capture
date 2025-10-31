'use client';
import { useState, useEffect, useCallback } from 'react';
import { useSession, signOut, signIn } from 'next-auth/react';
import { Sun, Moon, Search, Download } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import LeadChart from '@/components/LeadChart';
import LeadStats from '@/components/LeadState';

export default function ClientDashboardWrapper() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'unauthenticated') signIn();
  }, [status]);

  if (!session) return <p className="text-center mt-20">Redirecting to login...</p>;

  return <ClientDashboard user={session.user} />;
}

function ClientDashboard({ user }) {
  const router = useRouter();
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [profile, setProfile] = useState({ name: user.name, email: user.email });

  // Fetch leads with error handling
  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/leads');
      if (!res.ok) throw new Error('Failed to fetch leads');
      const data = await res.json();
      const userLeads = data.filter((lead) => lead.userEmail === user.email);
      setLeads(userLeads);
      setFilteredLeads(userLeads);
      toast.success('Leads loaded successfully');
    } catch (err) {
      setError(err.message);
      toast.error('Error fetching leads');
    } finally {
      setLoading(false);
    }
  }, [user.email]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  // Search and filter leads
  useEffect(() => {
    const filtered = leads.filter(
      (lead) =>
        lead.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredLeads(filtered);
  }, [searchQuery, leads]);

  // Export leads as CSV
  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Status', 'Created At'];
    const rows = filteredLeads.map((lead) => [
      lead.name || '',
      lead.email || '',
      lead.status || '',
      new Date(lead.createdAt).toLocaleDateString(),
    ]);
    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.join(',')),
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'leads.csv';
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Leads exported successfully');
  };

  // Update profile
  const updateProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });
      if (!res.ok) throw new Error('Failed to update profile');
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error('Error updating profile');
    }
  };

  const totalLeads = leads.length;
  const last7DaysLeads = leads.filter(
    (l) => (new Date() - new Date(l.createdAt)) / (1000 * 60 * 60 * 24) <= 7
  ).length;

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', ariaLabel: 'View dashboard' },
    { id: 'leads', label: 'Leads', ariaLabel: 'Manage leads' },
    { id: 'profile', label: 'Profile', ariaLabel: 'Edit profile' },
    { id: 'settings', label: 'Settings', ariaLabel: 'Adjust settings' },
    { id: 'client-billing', label: 'Billing', ariaLabel: 'View billing',path: '/client-billing' },
  ];

const handleMenuClick = (item) => {
    if (item.path) {
      router.push(item.path); // Navigate to the specified path
    } else {
      setActiveSection(item.id); // Set active section for other items
    }
  };


  return (
    <div className={`${darkMode ? 'dark' : ''} flex min-h-screen bg-gray-100 dark:bg-gray-900`}>
      <Toaster position="top-right" />
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-gray-800 text-white w-64 transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out z-50 md:relative md:translate-x-0`}
        aria-label="Main navigation"
      >
        <div className="p-6 text-center font-bold text-xl border-b border-gray-700">
          Lead Capture
        </div>
        <nav className="mt-6 flex flex-col gap-2" role="navigation">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleMenuClick(item)}
              className={`text-left w-full px-4 py-2 rounded hover:bg-gray-700 transition ${
                activeSection === item.id && !item.path ? 'bg-gray-700 font-semibold' : ''
              }`}
              aria-label={item.ariaLabel}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <div className="mt-auto p-6 flex justify-between items-center">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full hover:bg-gray-700 transition"
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button
            onClick={() => signOut()}
            className="bg-red-500 hover:bg-red-400 text-white px-3 py-1 rounded-md transition"
            aria-label="Log out"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        ></div>
      )}

      {/* Mobile toggle button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden fixed top-4 left-4 z-50 bg-gray-800 text-white p-2 rounded-md"
        aria-label="Toggle sidebar"
      >
        ☰
      </button>

      {/* Main content */}
      <main className="flex-1 p-6 transition-all duration-300 md:ml-64" role="main">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white capitalize">
            {activeSection}
          </h1>
          {activeSection === 'leads' && (
            <div className="flex gap-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search leads..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  aria-label="Search leads"
                />
              </div>
              <button
                onClick={exportToCSV}
                className="flex items-center gap-2 bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 transition"
                aria-label="Export leads to CSV"
              >
                <Download className="w-5 h-5" /> Export
              </button>
            </div>
          )}
        </header>

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-md mb-6" role="alert">
            {error}
          </div>
        )}

        {loading && <p className="text-center">Loading...</p>}

        {!loading && activeSection === 'dashboard' && (
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

        {!loading && activeSection === 'leads' && (
          <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-md">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-800">
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Created At</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="border-b dark:border-gray-600">
                    <td className="px-4 py-2">{lead.name || 'N/A'}</td>
                    <td className="px-4 py-2">{lead.email || 'N/A'}</td>
                    <td className="px-4 py-2">{lead.status || 'Pending'}</td>
                    <td className="px-4 py-2">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredLeads.length === 0 && (
              <p className="text-center mt-4">No leads found.</p>
            )}
          </div>
        )}

        {!loading && activeSection === 'profile' && (
          <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-md">
            <form onSubmit={updateProfile} className="space-y-4">
              <div>
                <label className="block text-gray-700 dark:text-gray-300">Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  aria-label="User name"
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-300">Email</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  aria-label="User email"
                />
              </div>
              <button
                type="submit"
                className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 transition"
                aria-label="Save profile"
              >
                Save Profile
              </button>
            </form>
          </div>
        )}

        {!loading && activeSection === 'settings' && (
          <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-md">
            <h2 className="text-lg font-semibold mb-4">Notification Settings</h2>
            <div className="space-y-4">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="form-checkbox" />
                <span>Email notifications for new leads</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="form-checkbox" />
                <span>Weekly summary reports</span>
              </label>
            </div>
          </div>
        )}

        {!loading && activeSection === 'client-billing' && (
          <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-md">
            <p>Billing and subscription management will go here. Integrate with Stripe or similar.</p>
          </div>
        )}
      </main>
    </div>
  );
}