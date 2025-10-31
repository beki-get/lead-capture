'use client';
import { useSession } from 'next-auth/react';

export default function EmbedInstructions() {
  const { data: session } = useSession();
  const userEmail = session?.user?.email || '';

  const shareLink = `https://lead-capture-two.vercel.app/embed-form?userEmail=${encodeURIComponent(userEmail)}`;
  const script = `<script src="https://lead-capture-two.vercel.app/embed.js" data-user-email="${userEmail}"></script>`;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Embed Form</h2>

      <div className="mb-6">
        <h3 className="font-medium">Shareable Link (no code)</h3>
        <p className="text-sm text-gray-600">Place this URL behind any button or link on your site.</p>
        <pre className="bg-gray-100 p-3 rounded mt-2">{shareLink}</pre>
      </div>

      <div>
        <h3 className="font-medium">Copy & Paste Script (embed on page)</h3>
        <p className="text-sm text-gray-600">Paste this into any HTML page where you want the form to appear.</p>
        <pre className="bg-gray-100 p-3 rounded mt-2">{script}</pre>
      </div>
    </div>
  );
}
