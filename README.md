# Lead Capture — lead capture app for businesses

## What this is
Lead Capture is a small Next.js application that provides an embeddable lead collection form, a customer-facing landing page, and an admin dashboard for viewing and exporting captured leads. It's designed for small businesses who want a quick embeddable form and a simple admin UI to manage leads.

### Stack
- **Language(s):** JavaScript (primary), CSS
- **Framework / runtime:** Next.js (App Router, v15.x) with React 19
- **Notable libraries:** Firebase (for data/storage/auth), NextAuth (authentication), Stripe (billing), Tailwind CSS (styling), Recharts (charts/visuals)

## How it's organized
Top-level important entries:
```
src/                       Application source (Next.js app router)
  app/                     Pages and route folders (landing, dashboard, embed-form, pricing, success, auth, api, etc.)
  components/              UI components used across pages (Hero, Features, LeadForm, LeadTable, LeadChart, Pricing, Footer, ...)
  lib/                     Small libraries (e.g. firebase.js, utils.js)
public/                    Static assets and embed script (images, embed.js)
package.json               Project metadata & npm scripts
next.config.mjs            Next.js configuration
postcss.config.mjs         PostCSS / Tailwind config helper
globals.css                Global CSS / Tailwind entry (src/app/globals.css)
README.md                  This file
```

How it fits together:
- The landing page (src/app/page.js) composes Hero, Features, the LeadForm component and other sections. The LeadForm component posts leads to the app API or directly to Firebase depending on configuration.
- Admin pages under src/app/* (dashboard, client-dashboard, client-billing) read lead data and render tables and charts (LeadTable, LeadChart).
- src/lib/firebase.js contains Firebase initialization logic used by client and server code.
- public/embed.js is an embeddable script meant to inject the form onto external websites.

## Features
- Embeddable lead form (public/embed.js) to capture leads on third-party sites.
- Admin dashboard with table and chart views of captured leads (src/components/LeadTable.js, LeadChart.js).
- Authentication for admin flows using NextAuth (auth routes under src/app/auth).
- Billing-related pages (client-billing) with Stripe dependency included in package.json.
- CSV export / file handling utilities are present (dependencies include papaparse and file-saver).

## How to run it (shortest path)
1. Clone and install:
```bash
git clone https://github.com/beki-get/lead-capture.git
cd lead-capture
npm install
```

2. Create environment variables (see below for recommended names), then run the dev server:
```bash
npm run dev
# Visit http://localhost:3000
```

3. Build / start for production:
```bash
npm run build
npm start
```

## Environment variables (example)
The app uses Firebase, NextAuth, Stripe, and SMTP for emails. Check src/lib/firebase.js and any auth/billing files for the exact variable names the project expects. Common variable names you should set include:
- NEXT_PUBLIC_FIREBASE_API_KEY
- NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
- NEXT_PUBLIC_FIREBASE_PROJECT_ID
- FIREBASE_PRIVATE_KEY (if server code uses a service account)
- NEXTAUTH_URL (e.g., https://your-site.vercel.app or http://localhost:3000)
- NEXTAUTH_SECRET
- STRIPE_SECRET_KEY
- SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, MAIL_FROM

Note: The exact names and any additional variables are defined in the repo code — look in src/lib/firebase.js, src/app/auth (NextAuth config), and the API routes in src/app/api for the precise keys.

## Deploy
- Recommended: Vercel (first-class Next.js support).
- Other hosts supporting Node/Next.js also work; ensure environment variables above are configured in the host.

## Troubleshooting & notes
- If the embed script isn’t working on an external page, check public/embed.js and ensure the site where it's embedded permits external scripts.
- If authentication fails, verify NEXTAUTH_URL and NEXTAUTH_SECRET match the deployed site.
- For billing issues, ensure your Stripe API keys are in the environment and the billing pages reference them.

## Contributing
- Open a PR describing the change and run the dev server locally to verify UI changes.
- Follow repository lint rules (npm run lint) and formatting conventions.

## Try asking
- Where does the app initialize Firebase (look at `src/lib/firebase.js`) and which environment variables does it read?
- How is authentication configured and which NextAuth provider/adapter is used (check `src/app/auth` and any NextAuth config files)?
- Where is the embed script implemented and how should external sites include it (`public/embed.js` and `src/app/embed-form`)?
