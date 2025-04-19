import { MiddlewareConfig } from "next/dist/build/analysis/get-page-static-info";
import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const publicRoutes = ["/auth/login"];

  if (publicRoutes.includes(request.nextUrl.pathname)) {
    return NextResponse.next();
  }
  const isAuthenticated = request.cookies.get("token");

  if (!isAuthenticated) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }
  const user = request.cookies.get("user");
  console.log(user);
  if (request.nextUrl.pathname.startsWith("/finance")) {
    if (!user || JSON.parse(user.value).role !== "super_admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
