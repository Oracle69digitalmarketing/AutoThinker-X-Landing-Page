<div align="center">
  <img width="1200" height="475" alt="AutoThinker X Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
  <br/>
  <h1>AutoThinker X Landing Page</h1>
  <p><strong>From Idea to Investable Blueprint in Under 10 Minutes.</strong></p>
  <p>A high-conversion, AI-powered landing page for the next generation of African tech founders.</p>
</div>

---

## 🚀 Overview

AutoThinker X is a specialized platform designed to accelerate product strategy for bootstrapped founders and ecosystem builders. This repository contains the professional landing page, featuring an interactive AI demo, an automated lead magnet delivery system, and a secure administrative dashboard.

## ✨ Key Features

- **Interactive AI Demo:** Real-time venture blueprint generation powered by a dual-engine strategy (**Groq Llama 3** + **Gemini 2.0 Flash** fallback).
- **CRO Optimized Waitlist:** Built with conversion-focused hooks, including an institutional/accelerator toggle and social proof anchors.
- **Automated Lead Magnet:** Instant delivery of the *'2026 AfCFTA Cross-Border Expansion Checklist'* via Vercel Edge functions and NodeMailer.
- **Admin Dashboard:** A secure, password-protected portal for real-time waitlist management, analytics, and CSV data export.
- **Free-Tier Architecture:** Optimized for zero-cost operation using **Vercel** for hosting/API and **Supabase** for database management.

## 🛠️ Tech Stack

- **Frontend:** React 19, TypeScript, Vite
- **Styling:** Tailwind CSS 4.0, Framer Motion (Animations)
- **Icons:** Lucide React
- **Backend:** Vercel API Routes (Serverless)
- **Database:** Supabase (PostgreSQL)
- **AI Integration:** Groq SDK, Google Generative AI (@google/genai)
- **Email:** NodeMailer

## ⚙️ Local Development

### Prerequisites
- Node.js (v18+)
- npm

### Installation
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory and add the following keys:
   ```env
   # AI Providers
   VITE_GEMINI_API_KEY=your_gemini_key
   VITE_GROQ_API_KEY=your_groq_key

   # Supabase Configuration
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

   # Admin Portal
   VITE_ADMIN_PASSWORD=your_admin_password

   # Email Delivery (SMTP)
   SMTP_HOST=smtp.gmail.com
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=your_app_password
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## 🌍 Deployment

### Vercel (Recommended)
This project is pre-configured for seamless deployment on Vercel:
1. Connect your GitHub repository to Vercel.
2. Add the environment variables listed above in the Vercel dashboard.
3. Deploy. The API routes in `/api` will be automatically handled as serverless functions.

### Supabase Database Setup
Execute the following SQL in your Supabase SQL Editor to initialize the waitlist table:

```sql
create table waitlist (
  id uuid default gen_random_uuid() primary key,
  name text,
  email text not null unique,
  wtp text,
  excited_feature text,
  user_type text,
  created_at timestamp with time zone default now()
);

-- Enable RLS (Optional but recommended)
alter table waitlist enable row level security;
create policy "Enable insert for everyone" on waitlist for insert with check (true);
create policy "Enable read for authenticated users" on waitlist for select using (auth.role() = 'authenticated');
```

## 🛡️ Admin Portal
Access the secure dashboard by appending `#admin` to your site URL (e.g., `autothinker-x.vercel.app/#admin`). Use the password defined in `VITE_ADMIN_PASSWORD` to log in.

---
<div align="center">
  <p>© 2026 AutoThinker X. Accelerating African Innovation.</p>
</div>
