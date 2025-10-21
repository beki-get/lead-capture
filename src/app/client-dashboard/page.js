'use client';
import { useState, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import LeadChart from '@/components/LeadChart';
import LeadStats from '@/components/LeadState';

export default function ClientDashboardWrapper() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'unauthenticated') signIn();
  }, [status]);

  if (!session) return <p className="text-center mt-20">Redirecting to login...</p>;

  return <ClientDashboard userEmail={session.user.email} />;
}

function ClientDashboard({ userEmail }) {
  const [leads, setLeads] = useState([]);

  useEffect(() => {
    const fetchLeads = async () => {
      const res = await fetch('/api/leads');
      const data = await res.json();
      const userLeads = data.filter(lead => lead.userEmail === userEmail);
      setLeads(userLeads);
    };
    fetchLeads();
  }, [userEmail]);

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Client Dashboard
        </h1>
        <LeadChart userEmail={userEmail} />
        <LeadStats userEmail={userEmail} />
      </div>
    </main>
  );
}






























{/*
    
    
    
    'use client';
import { useState, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import LeadChart from '@/components/LeadChart';
import LeadStats from '@/components/LeadState';

export default function ClientDashboardWrapper() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'unauthenticated') signIn();
  }, [status]);

  if (!session) return <p className="text-center mt-20">Redirecting to login...</p>;

  return <ClientDashboard userEmail={session.user.email} />;
}

function ClientDashboard({ userEmail }) {
  const [leads, setLeads] = useState([]);

  useEffect(() => {
    const fetchLeads = async () => {
      const res = await fetch('/api/leads');
      const data = await res.json();
      const userLeads = data.filter(lead => lead.userEmail === userEmail);
      setLeads(userLeads);
    };
    fetchLeads();
  }, [userEmail]);

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Client Dashboard
        </h1>
        <LeadChart leads={leads} />
        <LeadStats leads={leads} />
      </div>
    </main>
  );
}

    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    */}