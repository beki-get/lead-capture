import LeadForm from '@/components/LeadForm';

export default function EmbedFormPage({ searchParams }) {
  const userEmail = searchParams?.userEmail || null; // URL: /embed-form?userEmail=client@gmail.com
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-md">
        <LeadForm userEmailFromUrl={userEmail} />
      </div>
    </div>
  );
}
