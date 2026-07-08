import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
    // Without this, getToken() infers secure-cookie status from the request
    // itself. Behind Railway's proxy, that inference can disagree with how
    // NextAuth actually set the cookie (Node runtime, via AUTH_URL/AUTH_TRUST_HOST),
    // causing it to look for the wrong cookie name and never find a valid
    // session — which produces the /admin <-> /login redirect loop.
    secureCookie: process.env.NODE_ENV === "production",
  });

  const { pathname } = req.nextUrl;

  const isProtected =
    pathname.startsWith("/admin") || pathname.startsWith("/api/admin");

  if (isProtected && !token) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};