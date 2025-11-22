"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Link2, CheckCircle2, XCircle } from "lucide-react";

export default function Settings() {
  const [trelloConnected, setTrelloConnected] = useState(false);
  const [jiraConnected, setJiraConnected] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Dashboard</span>
        </Link>

        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings & Integrations</h1>

          {/* Integrations Section */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Task Management Integrations</h2>
            
            <div className="space-y-4">
              {/* Trello Integration */}
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Link2 className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Trello</h3>
                    <p className="text-sm text-gray-500">Sync tasks to Trello boards</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {trelloConnected ? (
                    <>
                      <CheckCircle2 className="w-6 h-6 text-green-600" />
                      <span className="text-sm text-green-600 font-medium">Connected</span>
                      <button
                        onClick={() => setTrelloConnected(false)}
                        className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
                      >
                        Disconnect
                      </button>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-6 h-6 text-gray-400" />
                      <button
                        onClick={() => setTrelloConnected(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        Connect
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Jira Integration */}
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Link2 className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Jira</h3>
                    <p className="text-sm text-gray-500">Sync tasks to Jira projects</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {jiraConnected ? (
                    <>
                      <CheckCircle2 className="w-6 h-6 text-green-600" />
                      <span className="text-sm text-green-600 font-medium">Connected</span>
                      <button
                        onClick={() => setJiraConnected(false)}
                        className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
                      >
                        Disconnect
                      </button>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-6 h-6 text-gray-400" />
                      <button
                        onClick={() => setJiraConnected(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        Connect
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-2">How to Connect</h3>
            <p className="text-blue-800 text-sm">
              Click "Connect" on any integration above to authorize access. You'll be redirected to
              the service's authentication page. Once connected, tasks extracted from meetings and
              voice notes will automatically sync to your connected services.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

