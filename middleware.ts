import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/hero(.*)",
  "/sign-up(.*)",
  "/sign-in(.*)",
  "/voiceNote(.*)",
]);

export default clerkMiddleware(async (auth, request) => {
  const { userId } = await auth();

  if (!isPublicRoute(request)) {
    if (!userId) {
      const signInUrl = new URL("/hero", request.url);
      return NextResponse.redirect(signInUrl);
    }
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
