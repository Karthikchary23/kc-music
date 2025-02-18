import { NextResponse } from "next/server";

export function middleware(req) {
  const userToken = req.cookies.get("userToken"); // Retrieve token from cookies

  if (req.nextUrl.pathname === "/music" && !userToken) {
    return NextResponse.redirect(new URL("/", req.url)); // Redirect to login page
  }

  return NextResponse.next();
}

// Apply middleware only on specific routes
export const config = {
  matcher: ["/music"],
};
