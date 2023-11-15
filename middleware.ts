import { authMiddleware, redirectToSignIn } from "@clerk/nextjs";
import { NextResponse } from "next/server";

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your Middleware
export default authMiddleware({
  publicRoutes: ["/"],
  afterAuth: (auth, req) => {
    const authorizedButOnPublic = auth.userId && auth.isPublicRoute;

    if (authorizedButOnPublic) {
      const orgSelection = new URL(
        auth.orgId ? `/organization/${auth.orgId}` : "/select-org",
        req.url,
      );

      return NextResponse.redirect(orgSelection);
    }

    const notAuthorizedButOnProtectedPage = !auth.userId && !auth.isPublicRoute;

    if (notAuthorizedButOnProtectedPage) {
      return redirectToSignIn({ returnBackUrl: req.url });
    }

    const authorizedButNoOrg = Boolean(
      auth.userId && !auth.orgId && req.nextUrl.pathname !== "/select-org",
    );

    if (authorizedButNoOrg) {
      const orgSelection = new URL("/select-org", req.url);
      return NextResponse.redirect(orgSelection);
    }
  },
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
