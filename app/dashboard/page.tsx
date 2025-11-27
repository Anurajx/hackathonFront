// anurajx/hackathonfront/Anurajx-hackathonFront-ff5e466210bfd2bb3b8b04adc729d82a8163b594/app/dashboard/page.tsx

import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Mic, MessageSquare, Settings, LogOut } from "lucide-react";
import { SignOutButton } from "@clerk/nextjs";
import { JiraEventsWidget } from "./JiraEventsWidget"; // Import the new component

export default async function Dashboard() {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId) {
    redirect("/hero");
  }

  // The userId is passed to the widget for dynamic data fetching

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header (omitted for brevity) */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">MeetAction</h1>
          <div className="flex items-center gap-4">
            {user?.imageUrl && (
              <img
                src={user.imageUrl}
                alt={user.firstName || "User"}
                className="w-10 h-10 rounded-full"
              />
            )}
            <div className="text-right">
              <p className="font-semibold text-gray-900">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-sm text-gray-500">
                {user?.emailAddresses[0]?.emailAddress}
              </p>
            </div>
            <SignOutButton>
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <LogOut className="w-5 h-5" />
              </button>
            </SignOutButton>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.firstName || "there"}! 👋
          </h2>
          <p className="text-gray-600">
            Record meetings, send voice notes, and manage your tasks seamlessly.
          </p>
        </div>

        {/* Quick Actions Grid (omitted for brevity) */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Record Meeting Card */}
          <Link href="/voiceNote">
            <div className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-blue-500">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Mic className="w-7 h-7 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    Record Instance
                  </h3>
                  <p className="text-sm text-gray-500">
                    Start a new meeting recording
                  </p>
                </div>
              </div>
              <p className="text-gray-600">
                Record your meeting with real-time transcription. AI will
                automatically extract action items and sync them to Trello/Jira.
              </p>
            </div>
          </Link>

          {/* Send Voice Note Card */}
          <Link href="/voiceNote">
            <div className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-purple-500">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-purple-100 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-7 h-7 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    Send Voice Note
                  </h3>
                  <p className="text-sm text-gray-500">
                    Send a task via voice message
                  </p>
                </div>
              </div>
              <p className="text-gray-600">
                Send a voice note to assign tasks. The AI will parse deadlines
                and automatically add them to the recipient's Trello/Jira.
              </p>
            </div>
          </Link>
        </div>

        {/* Dynamic Jira Events Widget - Plugged in here */}
        <JiraEventsWidget
          userId={userId}
          userEmail={user?.emailAddresses[0]?.emailAddress || ""}
        />

        {/* Settings Link */}
        <div className="mt-6">
          <Link
            href="/dashboard/settings"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <Settings className="w-5 h-5" />
            <span>Settings & Integrations</span>
          </Link>
        </div>
      </main>
    </div>
  );
}
