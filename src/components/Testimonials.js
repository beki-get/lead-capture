'use client'

import { Card, CardContent } from "@/components/ui/card"

export default function Testimonials() {
  return (
    <section className="relative isolate overflow-hidden bg-gray-950 px-6 py-24 sm:py-32 lg:px-8">
      {/* Background gradients */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,var(--color-indigo-500),transparent)] opacity-10" />
      <div className="absolute inset-y-0 right-1/2 -z-10 mr-16 w-[200%] origin-bottom-left skew-x-[-30deg] bg-gray-950 shadow-xl ring-1 shadow-indigo-500/5 ring-white/5 sm:mr-28 lg:mr-0 xl:mr-16 xl:origin-center" />

      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-base font-semibold leading-7 text-indigo-400">
          What Our Clients Say
        </h2>
        <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Trusted by Businesses Worldwide
        </p>
      </div>

      <div className="mx-auto mt-16 max-w-2xl lg:max-w-4xl">
        <Card className="bg-gray-900 border-gray-800 shadow-lg">
          <CardContent className="p-10">
            <blockquote className="text-center text-xl font-medium text-gray-200 sm:text-2xl">
              <p>
                “This lead form increased our client conversions by 40% in the first month! 
                Setup took only a few minutes, and the analytics dashboard is a game-changer.”
              </p>
            </blockquote>

            <figcaption className="mt-10">
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt="Judith Black"
                className="mx-auto size-12 rounded-full ring-2 ring-indigo-500/50"
              />
              <div className="mt-4 flex items-center justify-center space-x-3 text-base">
                <span className="font-semibold text-white">Judith Black</span>
                <svg
                  viewBox="0 0 2 2"
                  width="3"
                  height="3"
                  aria-hidden="true"
                  className="fill-white"
                >
                  <circle r="1" cx="1" cy="1" />
                </svg>
                <span className="text-gray-400">CEO, Workcation</span>
              </div>
            </figcaption>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
