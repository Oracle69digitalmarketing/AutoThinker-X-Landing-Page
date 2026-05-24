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
2. Set the `VITE_GEMINI_API_KEY` in `.env` to your Gemini API key (from [AI Studio](https://aistudio.google.com/))
3. Run the app:
   `npm run dev`

## Deployment

This app is ready to be deployed to **Vercel**, **Netlify**, or **Firebase Hosting**.

### Vercel Deployment
1. Connect your GitHub repository to Vercel.
2. Add `VITE_GEMINI_API_KEY` as an Environment Variable in the Vercel project settings.
3. Vercel will automatically detect the Vite project and deploy it.
