# Meeting Assistant - AI-Powered Task Management

A modern web application that records meetings, transcribes audio, and automatically extracts action items that sync to Trello and Jira.

## Features

- 🎙️ **Meeting Recording**: Record meetings with real-time transcription
- 🤖 **AI Task Extraction**: Automatically extract action items, deadlines, and assignments from transcriptions
- 📋 **Auto Sync**: Tasks automatically sync to Trello and Jira
- 💬 **Voice Notes**: Send voice notes to team members with automatic task creation
- 🔐 **Authentication**: Secure login with Clerk
- 👤 **User Profiles**: Beautiful user profile display after login

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Modern, responsive styling
- **Clerk** - Authentication and user management
- **Lucide React** - Beautiful icons

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Clerk account (for authentication)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up Clerk:
   - Create an account at [clerk.com](https://clerk.com)
   - Create a new application
   - Copy your API keys

3. Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key
CLERK_SECRET_KEY=your_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
├── app/
│   ├── dashboard/
│   │   ├── record-meeting/    # Meeting recording interface
│   │   ├── send-voice-note/    # Voice note sending interface
│   │   ├── settings/           # Settings and integrations
│   │   └── page.tsx            # Main dashboard
│   ├── sign-in/                # Sign in page
│   ├── sign-up/                # Sign up page
│   ├── layout.tsx              # Root layout with Clerk provider
│   ├── page.tsx                # Landing page
│   └── globals.css             # Global styles
├── middleware.ts               # Clerk middleware for route protection
└── package.json
```

## Next Steps

To make this application fully functional, you'll need to:

1. **Backend API**: Set up API endpoints for:
   - Audio transcription (e.g., using OpenAI Whisper, Google Speech-to-Text)
   - LLM processing for task extraction (e.g., using OpenAI GPT, Anthropic Claude)
   - Trello API integration
   - Jira API integration

2. **Real Audio Processing**: Replace mock transcription with actual audio processing

3. **Task Extraction**: Implement LLM prompts to extract:
   - Action items
   - Assignees
   - Deadlines
   - Task descriptions

4. **Integration APIs**: Connect to Trello and Jira APIs to create cards/issues

## Environment Variables

Make sure to set up all required environment variables in `.env.local`:

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Your Clerk publishable key
- `CLERK_SECRET_KEY` - Your Clerk secret key
- `NEXT_PUBLIC_CLERK_SIGN_IN_URL` - Sign in URL path
- `NEXT_PUBLIC_CLERK_SIGN_UP_URL` - Sign up URL path
- `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` - Redirect after sign in
- `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` - Redirect after sign up

## License

MIT

