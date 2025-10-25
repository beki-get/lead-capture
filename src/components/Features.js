'use client';
import { Card, CardContent } from './ui/card';

export default function Features() {
  return (
    <div id="features" className="bg-gray-950 py-10 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base/7 font-semibold text-indigo-400">Powerful Lead Management</h2>
          <p className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-white sm:text-5xl lg:text-balance">
            Everything you need to capture, track, and convert leads
          </p>
          <p className="mt-6 text-lg/8 text-gray-300">
            LeadGenly gives you all the tools to collect leads, monitor performance, and grow your
            business without writing a single line of code.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">

            {/* Feature 1 */}
            <div className="relative pl-16">
              <dt className="text-base/7 font-semibold text-white">
                <div className="absolute top-0 left-0 flex size-10 items-center justify-center rounded-lg bg-indigo-500">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
                    aria-hidden="true" className="size-6 text-white">
                    <path d="M3 7.5h18M3 12h18M3 16.5h18" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                Easy Embed Form
              </dt>
              <dd className="mt-2 text-base/7 text-gray-400">
                Generate and copy your form embed code in seconds. Just paste it on any website and
                start collecting leads instantly.
              </dd>
            </div>

            {/* Feature 2 */}
            <div className="relative pl-16">
              <dt className="text-base/7 font-semibold text-white">
                <div className="absolute top-0 left-0 flex size-10 items-center justify-center rounded-lg bg-indigo-500">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
                    aria-hidden="true" className="size-6 text-white">
                    <path d="M12 6v6l4 2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                Real-time Analytics
              </dt>
              <dd className="mt-2 text-base/7 text-gray-400">
                Track every form submission with detailed insights source, location, and conversion
                performance all in one dashboard.
              </dd>
            </div>

            {/* Feature 3 */}
            <div className="relative pl-16">
              <dt className="text-base/7 font-semibold text-white">
                <div className="absolute top-0 left-0 flex size-10 items-center justify-center rounded-lg bg-indigo-500">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
                    aria-hidden="true" className="size-6 text-white">
                    <path d="M12 8v8m4-4H8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                Smart Notifications
              </dt>
              <dd className="mt-2 text-base/7 text-gray-400">
                Get notified instantly when a new lead comes in via email or your dashboard, so
                you can respond faster and close more deals.
              </dd>
            </div>

            {/* Feature 4 */}
            <div className="relative pl-16">
              <dt className="text-base/7 font-semibold text-white">
                <div className="absolute top-0 left-0 flex size-10 items-center justify-center rounded-lg bg-indigo-500">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
                    aria-hidden="true" className="size-6 text-white">
                    <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                Secure Data Storage
              </dt>
              <dd className="mt-2 text-base/7 text-gray-400">
                Your leads are protected with bank-grade encryption and backed by secure Firebase
                storage privacy you can trust.
              </dd>
            </div>

          </dl>
        </div>
      </div>
    </div>
  );
}
