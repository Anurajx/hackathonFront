# Quick Setup Guide

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Set Up Clerk Authentication

1. Go to [https://clerk.com](https://clerk.com) and create a free account
2. Create a new application
3. Copy your API keys from the Clerk dashboard

## Step 3: Configure Environment Variables

Create a `.env.local` file in the root directory with the following:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_key_here
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

## Step 4: Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features Implemented

✅ **Landing Page** - Beautiful homepage with feature overview
✅ **Clerk Authentication** - Sign in/Sign up pages
✅ **User Dashboard** - Shows user profile after login
✅ **Meeting Recording** - Interface to record meetings with transcription display
✅ **Voice Note Sending** - Send voice notes to team members
✅ **Task Extraction** - UI for displaying extracted tasks from AI
✅ **Settings Page** - Trello/Jira integration management
✅ **Modern UI** - Clean, responsive design with Tailwind CSS

## Next Steps for Full Functionality

To make this fully functional, you'll need to:

1. **Backend API** - Create API endpoints for:
   - Audio transcription (OpenAI Whisper, Google Speech-to-Text, etc.)
   - LLM task extraction (OpenAI GPT, Anthropic Claude, etc.)
   - Trello API integration
   - Jira API integration

2. **Replace Mock Data** - The current implementation uses mock data. Replace with actual API calls in:
   - `app/dashboard/record-meeting/page.tsx` - `processRecording` function
   - `app/dashboard/send-voice-note/page.tsx` - `processRecording` and `sendVoiceNote` functions

3. **Add Real Integrations** - Implement OAuth flows for Trello and Jira in:
   - `app/dashboard/settings/page.tsx`

## Project Structure

```
├── app/
│   ├── dashboard/
│   │   ├── record-meeting/     # Meeting recording page
│   │   ├── send-voice-note/    # Voice note sending page
│   │   ├── settings/           # Settings & integrations
│   │   └── page.tsx            # Main dashboard
│   ├── sign-in/                # Clerk sign in
│   ├── sign-up/                # Clerk sign up
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Landing page
│   └── globals.css             # Global styles
└── middleware.ts               # Clerk route protection
```

## Troubleshooting

- **Clerk errors**: Make sure your environment variables are set correctly
- **Build errors**: Run `npm install` again to ensure all dependencies are installed
- **TypeScript errors**: Make sure you're using Node.js 18+ and have the latest TypeScript version

