import { NextRequest, NextResponse } from "next/server";
import { middlewareAuth } from "@/utils/middelware-auth";

export async function middleware(req: NextRequest) {
  const url = req.url;
  const pathname = req.nextUrl.pathname;

  // Protected profile routes
  if (pathname.startsWith("/profile")) {
    const user = await middlewareAuth(req);
    if (!user) {
      return NextResponse.redirect(new URL("/auth/login", url));
    }
  }

  if (pathname.startsWith("/auth")) {
    const user = await middlewareAuth(req);
    if (user) {
      return NextResponse.redirect(new URL("/profile", url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/auth/:path*"],
};
