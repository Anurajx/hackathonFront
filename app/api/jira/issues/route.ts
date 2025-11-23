import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  try {
    // Check authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get Jira credentials
    const baseUrl = process.env.JIRA_BASE_URL;
    const email = process.env.JIRA_EMAIL;
    let apiToken = process.env.JIRA_API_TOKEN?.trim();

    if (!baseUrl || !email || !apiToken) {
      return NextResponse.json(
        { error: "Jira credentials missing" },
        { status: 500 }
      );
    }

    // Create auth header
    const authHeader = Buffer.from(`${email}:${apiToken}`).toString("base64");

    // Use the new Jira JQL search API endpoint (POST request)
    const jiraUrl = `${baseUrl}/rest/api/3/search/jql`;

    console.log("Calling Jira JQL Search API:", jiraUrl);

    const response = await fetch(jiraUrl, {
      method: "POST",
      headers: {
        Authorization: `Basic ${authHeader}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jql: "ORDER BY updated DESC",
        maxResults: 20,
        fields: [
          "summary",
          "status",
          "assignee",
          "priority",
          "created",
          "updated",
          "issuetype",
          "project",
          "description",
        ],
      }),
    });

    // Handle non-OK response
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Jira API Error:", errorText);

      return NextResponse.json(
        {
          error: "Failed to fetch Jira issues",
          details: errorText,
          status: response.status,
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Jira standard search API returns issues in data.issues
    const issues = data.issues || [];

    return NextResponse.json({
      issues,
      total: data.total || issues.length,
      maxResults: data.maxResults || 20,
    });
  } catch (error) {
    console.error("Error fetching Jira issues:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
