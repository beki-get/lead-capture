'use client';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';


export default function Pricing() {
  return (
    <section className="relative isolate bg-gray-950 px-6 py-24 sm:py-32 lg:px-8">
      <div aria-hidden="true" className="absolute inset-x-0 -top-3 -z-10 transform-gpu overflow-hidden px-36 blur-3xl">
        <div
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
          className="mx-auto aspect-[1155/678] w-[72rem] bg-gradient-to-tr from-indigo-500/30 to-violet-500/30 opacity-25"
        ></div>
      </div>

      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-base font-semibold text-indigo-400">Pricing</h2>
        <p className="mt-2 text-5xl font-bold tracking-tight text-white sm:text-6xl">
          Choose the right plan for you
        </p>
        <p className="mt-6 text-lg text-gray-400">
          Scalable plans that grow with your business. Start free — upgrade anytime.
        </p>
      </div>

      <div className="mx-auto mt-20 grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {/* Free Plan */}
        <Card className="bg-gray-900/50 border border-gray-800 shadow-lg hover:border-indigo-600 transition">
          <CardContent className="p-8">
            <h3 className="text-xl font-semibold text-white mb-2">Free</h3>
            <p className="text-gray-400 mb-4">For individuals exploring lead management.</p>
            <p className="text-4xl font-bold text-white">$0<span className="text-base text-gray-400">/mo</span></p>
            <ul className="mt-6 space-y-3 text-gray-300 text-sm">
              <li>✅ Up to 3 active lead forms</li>
              <li>✅ Basic analytics dashboard</li>
              <li>✅ Limited form submissions</li>
              <li>❌ No team collaboration</li>
              <li>❌ No custom branding</li>
            </ul>
            <Button className="w-full mt-8 bg-indigo-500 hover:bg-indigo-400">Get Started</Button>
          </CardContent>
        </Card>

        {/* Pro Plan */}
        <Card className="bg-gray-900/70 border border-gray-700 shadow-xl hover:border-indigo-500 transition">
          <CardContent className="p-8">
            <h3 className="text-xl font-semibold text-white mb-2">Pro</h3>
            <p className="text-gray-400 mb-4">Perfect for small businesses & startups.</p>
            <p className="text-4xl font-bold text-white">$29<span className="text-base text-gray-400">/mo</span></p>
            <ul className="mt-6 space-y-3 text-gray-300 text-sm">
              <li>✅ Unlimited lead forms</li>
              <li>✅ Real-time analytics</li>
              <li>✅ CRM integration (coming soon)</li>
              <li>✅ Team members (coming soon)</li>
              <li>✅ 24-hour support response</li>
            </ul>
            <Button className="w-full mt-8 bg-indigo-500 hover:bg-indigo-400">Upgrade to Pro</Button>
          </CardContent>
        </Card>

        {/* Enterprise Plan */}
        <Card className="bg-indigo-950/40 border border-indigo-700 shadow-2xl hover:border-indigo-400 transition">
          <CardContent className="p-8">
            <h3 className="text-xl font-semibold text-white mb-2">Enterprise</h3>
            <p className="text-gray-400 mb-4">Advanced solutions for large organizations.</p>
            <p className="text-4xl font-bold text-white">$99<span className="text-base text-gray-400">/mo</span></p>
            <ul className="mt-6 space-y-3 text-gray-300 text-sm">
              <li>✅ Everything in Pro</li>
              <li>✅ Dedicated account manager</li>
              <li>✅ Custom domain integration</li>
              <li>✅ AI-based lead scoring (future)</li>
              <li>✅ Marketing automation tools (future)</li>
              <li>✅ API access & premium integrations</li>
            </ul>
            <Button className="w-full mt-8 bg-indigo-600 hover:bg-indigo-500">Contact Sales</Button>
          </CardContent>
        </Card>
       
      </div>
    </section>
  );
}
