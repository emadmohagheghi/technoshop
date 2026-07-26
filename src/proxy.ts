import { NextRequest, NextResponse } from "next/server";
import { middlewareAuth } from "@/utils/middelware-auth";

export async function proxy(req: NextRequest) {
  const url = req.url;
  const pathname = req.nextUrl.pathname;
  const isProtectedCheckout =
    pathname.startsWith("/checkout/shipping") ||
    pathname.startsWith("/checkout/payment");
  const nextParam = req.nextUrl.searchParams.get("next");
  const safeNext =
    nextParam?.startsWith("/") && !nextParam.startsWith("//")
      ? nextParam
      : null;

  if (pathname.startsWith("/profile") || isProtectedCheckout) {
    const user = await middlewareAuth(req);
    if (!user) {
      const loginUrl = new URL("/auth/login", url);
      loginUrl.searchParams.set("next", `${pathname}${req.nextUrl.search}`);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (pathname.startsWith("/auth")) {
    const user = await middlewareAuth(req);
    if (user) {
      return NextResponse.redirect(new URL(safeNext ?? "/profile", url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/profile/:path*",
    "/auth/:path*",
    "/checkout/shipping/:path*",
    "/checkout/payment/:path*",
  ],
};
