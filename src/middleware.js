import { NextResponse } from "next/server";
import { generateAccessToken, verifyAccessToken, verifyRefreshToken } from "./utils/tokens";

export async function middleware(req) {
  const url = req.nextUrl.clone();
  
  const PUBLIC_PATHS = ["/auth",  "/"];
  // const PUBLIC_PATHS = ["/auth"];

  if (
    url.pathname === "/" ||
    PUBLIC_PATHS.some(path => path !== "/" && url.pathname.startsWith(path))
  ) {
    return NextResponse.next();
  }
  // if (url.pathname ==="/auth") {
  //   return NextResponse.next();
  // }

  const accessToken = req.cookies.get("access_token")?.value || null;
  const refreshToken = req.cookies.get("refresh_token")?.value || null;

  if (!accessToken && !refreshToken) {
    url.pathname = "/auth";
    return NextResponse.redirect(url);
  }

  let userId = null;

  // 1. Try verifying access token
  const accessPayload = await verifyAccessToken(accessToken);
  if (accessPayload) {
    userId = accessPayload;
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-user-id", userId);
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  // 2. If access token is invalid but refresh exists
  if (refreshToken) {
    const refreshPayload = await verifyRefreshToken(refreshToken);
    if (refreshPayload) {
      userId = refreshPayload;
      const newAccessToken = await generateAccessToken({ id: userId });

      const response = NextResponse.next({
        request: {
          headers: new Headers({
            ...Object.fromEntries(req.headers),
            "x-user-id": userId,
          }),
        },
      });

      response.cookies.set("access_token", newAccessToken, {
        httpOnly: true,
        path: "/",
        maxAge: 15 * 60,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      });

      return response;
    }
  }

  // 3. Redirect to auth if all checks fail
  url.pathname = "/auth";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    // "/",
    "/profile",
    "/notification",
    "/admin/:path*",
    "/api/protected/:path*",
    "/api/auth/logout",
  ],
};
