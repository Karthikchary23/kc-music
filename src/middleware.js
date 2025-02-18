import { NextResponse } from "next/server";

export function middleware(req) {
  const userToken = req.cookies.get("userToken"); // Retrieve token from cookies
  const pathname = req.nextUrl.pathname;

  // Redirect to /music if the user has a token and is trying to access the home page
  if (pathname === "/" && userToken) {
    return NextResponse.redirect(new URL("/music", req.url));
  }

  // Redirect to home if trying to access /music without a token
  if (pathname === "/music" && !userToken) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

// Apply middleware only on specific routes
export const config = {
  matcher: ["/", "/music"], // Apply on home and music pages
};
