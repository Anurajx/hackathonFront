import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const baseUrl = process.env.JIRA_BASE_URL;
    const email = process.env.JIRA_EMAIL;
    let apiToken = process.env.JIRA_API_TOKEN;

    if (apiToken) {
      apiToken = apiToken.replace(/\s+/g, "").trim();
    }

    return NextResponse.json({
      hasBaseUrl: !!baseUrl,
      hasEmail: !!email,
      hasToken: !!apiToken,
      baseUrlLength: baseUrl?.length || 0,
      emailLength: email?.length || 0,
      tokenLength: apiToken?.length || 0,
      tokenPreview: apiToken ? `${apiToken.substring(0, 20)}...` : "missing",
      baseUrl,
      email,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
