# Apology Website 💕

A romantic Next.js + Three.js experience: a man and woman in 3D, apology messages (man speaks only), accept/reject buttons on her side, email notifications to you, and a final "I love you" moment.

## Features

- **3D characters** — stylized man & woman with talking animation (man only)
- **3 apology messages** — typewriter effect, customizable in `src/lib/dialogue.ts`
- **Accept / Reject** — buttons on the woman's side after each message
- **Email alerts** — you get an email when she accepts or rejects (Gmail SMTP)
- **Final scene** — floating hearts + "I love you" message

## Setup

1. **Install dependencies**

   ```bash
   cd apology-website
   npm install
   ```

2. **Configure email** (optional but recommended)

   Copy `.env.example` to `.env.local` and fill in:

   ```bash
   cp .env.example .env.local
   ```

   For Gmail: enable 2FA, then create an [App Password](https://myaccount.google.com/apppasswords).

3. **Personalize messages**

   Edit `src/lib/dialogue.ts`:
   - `APOLOGY_DIALOGUE` — the 3 apology lines (man speaks)
   - `FINAL_MESSAGE` — closing "I love you" text
   - `HER_NAME` / `HIS_NAME` — display names

4. **Run locally**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Deploy

Deploy to [Vercel](https://vercel.com) and add the same env vars in Project Settings → Environment Variables.

## Project structure

```
src/
  app/           # Next.js pages & API
  components/    # 3D scene & UI
  lib/dialogue.ts  # ← edit your messages here
```
