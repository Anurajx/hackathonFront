// anurajx/hackathonfront/Anurajx-hackathonFront-ff5e466210bfd2bb3b8b04adc729d82a8163b594/app/dashboard/JiraEventsWidget.tsx

import Link from "next/link";
import { Calendar, Clock, Link2, XCircle } from "lucide-react";

// --- UTILITY & JIRA LOGIC ---

// Define a type for a simplified Jira Issue/Activity
type JiraIssue = {
  id: string;
  key: string;
  fields: {
    summary: string;
    status: { name: string };
    updated: string;
    // The assignee field contains the full user object, but we'll only use displayName
    assignee: { displayName: string } | null;
  };
};

// These environment variables are securely accessed only on the server
const JIRA_URL = process.env.JIRA_BASE_URL;
const JIRA_EMAIL = process.env.JIRA_EMAIL;
const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN;

// Helper function to format the time since the event (e.g., "1 hour ago")
const timeAgo = (date: string) => {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  let interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + " years ago";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " months ago";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " days ago";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " hours ago";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " minutes ago";
  }
  return Math.floor(seconds) + " seconds ago";
};

/**
 * Fetches the 5 most recently updated Jira issues visible to the API user.
 */
async function fetchJiraEvents(
  userEmail: string
): Promise<JiraIssue[] | { error: string }> {
  if (!JIRA_URL || !JIRA_EMAIL || !JIRA_API_TOKEN) {
    return { error: "Jira API credentials not set up on the server." };
  }

  // Base64 encode the authentication string (email:token) for Basic Auth
  const authString = Buffer.from(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`).toString(
    "base64"
  );

  const url = `${JIRA_URL}/rest/api/3/search/jql`;

  // CORRECTED JQL: Restricted to issues updated in the last 30 days to make it "bounded"
  const jql = `updated > "-30d" ORDER BY updated DESC`;

  const payload = {
    jql: jql,
    maxResults: 5,
    fields: ["summary", "status", "updated", "assignee"], // Request specific fields
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Basic ${authString}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    if (!response.ok) {
      // Handle non-200 responses (e.g., 401 Unauthorized, 404 Not Found)
      const errorData = await response
        .json()
        .catch(() => ({ errorMessages: [response.statusText] }));
      const errorMessage = errorData.errorMessages
        ? errorData.errorMessages.join(" ")
        : response.statusText;
      return {
        error: `Jira API Error (${response.status}): ${errorMessage}. Double-check JIRA_API_TOKEN permissions and ensure it's not expired.`,
      };
    }

    const data = await response.json();

    // Check if the issues array is empty.
    if (!data.issues || data.issues.length === 0) {
      return {
        error:
          "No issues were found with the current search query (updated in last 30 days). Try checking the permissions of the API user's token.",
      };
    }

    return data.issues as JiraIssue[];
  } catch (e: any) {
    // Handle network or parsing errors
    console.error("Jira Fetch Error:", e);
    return {
      error: `Failed to connect to Jira API (Network Error: ${e.message}). Check JIRA_BASE_URL: ${JIRA_URL}`,
    };
  }
}

interface JiraEventsWidgetProps {
  userEmail: string;
  userId: string;
}

export async function JiraEventsWidget({ userEmail }: JiraEventsWidgetProps) {
  const issuesOrError = await fetchJiraEvents(userEmail);

  let jiraEvents: JiraIssue[] = [];
  let error: string | null = null;

  if ("error" in issuesOrError) {
    error = issuesOrError.error;
  } else {
    jiraEvents = issuesOrError;
  }

  const isJiraIntegrated = jiraEvents.length > 0;

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center gap-3 mb-4">
        <Calendar className="w-6 h-6 text-gray-600" />
        <h3 className="text-xl font-semibold text-gray-900">
          Recent Jira Activity
        </h3>
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${
            isJiraIntegrated && !error
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {isJiraIntegrated && !error ? "Jira Live" : "Connection Error"}
        </span>
      </div>
      <div className="space-y-4">
        {error ? (
          <div className="p-4 bg-red-50 rounded-lg border-l-4 border-red-500 flex items-start gap-3">
            <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <p className="text-red-800 font-medium">
              Jira Connection Failed: {error}
            </p>
          </div>
        ) : jiraEvents.length > 0 ? (
          jiraEvents.map((issue) => (
            <div
              key={issue.id}
              className="p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500 flex justify-between items-start"
            >
              <div className="flex items-start gap-3">
                <Link2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-900 font-medium">
                    <span className="font-semibold text-blue-600">
                      {issue.key}:
                    </span>{" "}
                    {issue.fields.summary}
                  </p>
                  <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                    <span className="text-xs text-gray-500">Status:</span>
                    <span className="font-semibold text-sm">
                      {issue.fields.status.name}
                    </span>
                    <span className="text-xs text-gray-500 ml-4">
                      Assigned to:
                    </span>
                    <span className="font-semibold text-sm">
                      {issue.fields.assignee?.displayName || "Unassigned"}
                    </span>
                  </p>
                </div>
              </div>
              <div className="flex items-center text-sm text-gray-500 ml-4 flex-shrink-0">
                <Clock className="w-4 h-4 mr-1" />
                <span>Updated {timeAgo(issue.fields.updated)}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-600">
              <span className="font-semibold">
                No recent Jira activity found.
              </span>{" "}
              The query succeeded but returned no issues. Verify that issues
              exist in your Jira instance.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
