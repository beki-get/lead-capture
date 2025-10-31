
export default function Secton() {

return(
<section className="bg-gradient-to-b from-gray-500 to-white py-20 px-6">
  <div className="max-w-6xl mx-auto text-center">
    <h2 className="text-4xl font-bold text-gray-800 mb-6">
      See How Our Dashboard Empowers You
    </h2>
    <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
      Get a complete overview of your business performance in one place 
      track leads, manage billing, export reports, and unlock insights 
      that drive real growth.
    </p>

    {/* Dashboard Preview Grid */}
    <div className="grid md:grid-cols-3 gap-8">
      <div className="bg-white shadow-lg rounded-2xl p-6 hover:shadow-2xl transition">
        <img
          src="/dashboard-1.png"
          alt="Analytics Overview"
          className="rounded-xl mb-4"
        />
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          Real-Time Analytics
        </h3>
        <p className="text-gray-600 text-sm">
          Visualize your leads and conversions through interactive charts 
          and daily insights.
        </p>
      </div>

      <div className="bg-white shadow-lg rounded-2xl p-6 hover:shadow-2xl transition">
        <img
          src="/billing.png"
          alt="Billing Management"
          className="rounded-xl mb-4"
        />
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          Simple Billing Control
        </h3>
        <p className="text-gray-600 text-sm">
          Manage subscriptions, invoices, and upgrade your plan all in one 
          intuitive dashboard.
        </p>
      </div>

      <div className="bg-white shadow-lg rounded-2xl p-6 hover:shadow-2xl transition">
        <img
          src="/admin.png"
          alt="Export Leads"
          className="rounded-xl mb-4"
        />
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
         Admin Dashboard
        </h3>
        <p className="text-gray-600 text-sm">
          Manage all customer leads smoothly
          Full control of leads by each customer
        </p>
      </div>
    </div>

    {/* Future Features */}
    <div className="mt-16">
      <h3 className="text-2xl font-bold text-gray-800 mb-4">
        Coming Soon 🚀
      </h3>
      <p className="text-gray-600 max-w-2xl mx-auto">
        AI-powered insights, lead scoring, automated follow-ups, 
        and marketing campaign tracking all built to help you 
        convert more efficiently.
      </p>
    </div>
  </div>
</section>
)};
