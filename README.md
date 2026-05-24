<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/6b7ec88d-4e22-48ef-9c4c-2fd67009e937

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the following in `.env`:
   - `VITE_GEMINI_API_KEY`: Your Gemini API key
   - `VITE_GROQ_API_KEY`: Your Groq API key
   - `VITE_SUPABASE_URL`: Your Supabase Project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase Anon/Public Key
   - `VITE_ADMIN_PASSWORD`: Password for the admin portal (default: `admin`)
   - `SMTP_USER`: Email for lead magnet delivery
   - `SMTP_PASS`: App password for lead magnet delivery
3. Run the app:
   `npm run dev`

## Deployment

This app is ready to be deployed to **Vercel** (Free Tier).

### Vercel Deployment
1. Connect your GitHub repository to Vercel.
2. Add the Environment Variables listed above in the Vercel project settings.
3. Vercel will automatically detect the Vite project and deploy it.

### Database Setup (Supabase)
Create a table named `waitlist` in your Supabase SQL Editor:
```sql
create table waitlist (
  id uuid default gen_random_uuid() primary key,
  name text,
  email text not null,
  wtp text,
  excited_feature text,
  user_type text,
  created_at timestamp with time zone default now()
);
```

