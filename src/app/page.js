import LeadForm from '@/components/LeadForm';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-300">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Lead Capture App
      </h1>
      <LeadForm />
    </main>
  );
}
