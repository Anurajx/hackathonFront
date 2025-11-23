"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  Circle,
  ExternalLink,
  RefreshCw,
  Filter,
} from "lucide-react";

interface JiraIssue {
  id: string;
  key: string;
  fields: {
    summary: string;
    status: {
      name: string;
      statusCategory: {
        key: string;
      };
    };
    assignee: {
      displayName: string;
      avatarUrls: {
        "24x24": string;
      };
    } | null;
    priority: {
      name: string;
      iconUrl: string;
    };
    created: string;
    updated: string;
    issuetype: {
      name: string;
      iconUrl: string;
    };
    project: {
      key: string;
      name: string;
    };
    description: string | null;
  };
}

export default function JiraIssues() {
  const [issues, setIssues] = useState<JiraIssue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "todo" | "in-progress" | "done">(
    "all"
  );
  const [baseUrl, setBaseUrl] = useState("https://meetoapi.atlassian.net");

  const fetchIssues = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/jira/issues");
      const data = await response.json();

      if (!response.ok) {
        // Handle different error formats
        let errorMsg = "Failed to fetch issues";

        if (data.details) {
          if (typeof data.details === "string") {
            errorMsg = data.details;
          } else if (Array.isArray(data.details)) {
            errorMsg = data.details.join(", ");
          } else {
            errorMsg = JSON.stringify(data.details);
          }
        } else if (data.error) {
          errorMsg = data.error;
        } else if (data.errorMessages && Array.isArray(data.errorMessages)) {
          errorMsg = data.errorMessages.join(", ");
        }

        throw new Error(errorMsg);
      }

      // Handle response - check for issues in different possible locations
      const issues = data.issues || data.values || data.results || [];

      if (!Array.isArray(issues)) {
        console.warn("Unexpected response format:", data);
        setIssues([]);
      } else {
        setIssues(issues);
      }

      if (data.baseUrl) {
        setBaseUrl(data.baseUrl);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load issues";
      console.error("Error fetching Jira issues:", err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  const getStatusIcon = (statusCategory: string) => {
    switch (statusCategory) {
      case "done":
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case "indeterminate":
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case "new":
        return <Circle className="w-4 h-4 text-blue-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (statusCategory: string) => {
    switch (statusCategory) {
      case "done":
        return "bg-green-100 text-green-800 border-green-200";
      case "indeterminate":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "new":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityColor = (priority: string) => {
    const lower = priority.toLowerCase();
    if (lower.includes("highest") || lower.includes("critical")) {
      return "bg-red-100 text-red-800";
    } else if (lower.includes("high")) {
      return "bg-orange-100 text-orange-800";
    } else if (lower.includes("medium")) {
      return "bg-yellow-100 text-yellow-800";
    } else {
      return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const filteredIssues = issues.filter((issue) => {
    if (filter === "all") return true;
    const statusCategory = issue.fields.status.statusCategory.key;
    if (filter === "done") return statusCategory === "done";
    if (filter === "in-progress") return statusCategory === "indeterminate";
    if (filter === "todo") return statusCategory === "new";
    return true;
  });

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-8">
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="w-6 h-6 text-blue-600 animate-spin mr-3" />
          <p className="text-gray-600">Loading Jira issues...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-md p-8">
        <div className="text-center py-8">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 font-semibold mb-2">
            Error loading issues
          </p>
          <div className="max-w-2xl mx-auto">
            <p className="text-gray-600 text-sm mb-2 break-words">{error}</p>
            <p className="text-gray-500 text-xs mb-4">
              Check that your Jira credentials are correct in .env.local and
              restart the server if needed.
            </p>
          </div>
          <button
            onClick={fetchIssues}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-1">
            Jira Issues
          </h3>
          <p className="text-sm text-gray-500">
            {filteredIssues.length}{" "}
            {filteredIssues.length === 1 ? "issue" : "issues"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            aria-label="Filter issues by status"
          >
            <option value="all">All</option>
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
          <button
            onClick={fetchIssues}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {filteredIssues.length === 0 ? (
        <div className="text-center py-12">
          <Circle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">No issues found</p>
          <p className="text-gray-500 text-sm mt-1">
            {filter !== "all"
              ? "Try changing the filter"
              : "Issues will appear here"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredIssues.map((issue) => (
            <a
              key={issue.id}
              href={`${baseUrl}/browse/${issue.key}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-mono text-blue-600 font-semibold">
                      {issue.key}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium border ${getStatusColor(
                        issue.fields.status.statusCategory.key
                      )}`}
                    >
                      <span className="flex items-center gap-1">
                        {getStatusIcon(issue.fields.status.statusCategory.key)}
                        {issue.fields.status.name}
                      </span>
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium ${getPriorityColor(
                        issue.fields.priority.name
                      )}`}
                    >
                      {issue.fields.priority.name}
                    </span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {issue.fields.summary}
                  </h4>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <span className="font-medium">Project:</span>
                      {issue.fields.project.name}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="font-medium">Type:</span>
                      {issue.fields.issuetype.name}
                    </span>
                    {issue.fields.assignee && (
                      <span className="flex items-center gap-1">
                        <span className="font-medium">Assignee:</span>
                        {issue.fields.assignee.displayName}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <span className="font-medium">Updated:</span>
                      {formatDate(issue.fields.updated)}
                    </span>
                  </div>
                </div>
                <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0 mt-1" />
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
