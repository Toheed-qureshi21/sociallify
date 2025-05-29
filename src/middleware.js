import { NextResponse } from "next/server";
import { generateAccessToken, verifyAccessToken, verifyRefreshToken } from "./utils/tokens";

export async function middleware(req) {
  const url = req.nextUrl.clone();
  const PUBLIC_PATHS = ["/auth", "/"];

  if (PUBLIC_PATHS.some(path => url.pathname.startsWith(path))) {
    return NextResponse.next();
  }

  const accessToken = req.cookies.get("access_token")?.value || null;
  const refreshToken = req.cookies.get("refresh_token")?.value || null;

  if (!accessToken && !refreshToken) {
    url.pathname = "/auth";
    return NextResponse.redirect(url);
  }

  const accessPayload = await verifyAccessToken(accessToken);
  if (accessPayload) {
    return NextResponse.next();
  }

  if (refreshToken) {
    const refreshPayload = await verifyRefreshToken(refreshToken);
    if (refreshPayload) {
      const newAccessToken = await generateAccessToken({ id: refreshPayload.id });

      const response = NextResponse.next();

      response.cookies.set(
        "access_token",
        newAccessToken,
        {
          httpOnly: true,
          path: "/",
          maxAge: 15 * 60,
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
        }
      );

      return response;
    }
  }

  url.pathname = "/auth";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    "/profile/:path*",
    "/notification/:path*",
    "/admin/:path*",
    "/api/protected/:path*",
  ],
};
