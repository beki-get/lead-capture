import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import  SessionProviderWrapper  from "@/components/SessionProviderWrapper";
import { use } from "react";



const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "LeadGenly - Simple Lead Capture Forms",
  description: "LeadGenly helps you turn website visitors into paying customers easily embed your form, collect leads, and track performance in one dashboard.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      > <SessionProviderWrapper>{children}</SessionProviderWrapper>
      </body>
    </html>
  );
}
