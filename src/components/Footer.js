'use client'

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export default function Footer() {
  return (
    <footer className="bg-gray-950 border-t border-gray-800 py-12 px-6 text-center">
      <div className="max-w-7xl mx-auto space-y-6">
        <h3 className="text-2xl font-semibold text-white">
          Ready to Capture More Leads?
        </h3>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Start embedding powerful forms on your site today and watch your conversions grow.
        </p>

        <Button asChild className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl shadow-md">
          <a href="/signup">Get Started Free</a>
        </Button>

        <Separator className="my-8 bg-gray-800" />

        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()} Lead Capture App. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
