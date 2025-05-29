import { cookieConfig } from "@/constants/constant";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// utils/cookie.js  (unchanged)
export const setAuthCookies = (accessToken, refreshToken, data = {}, status = 200) => {
  const res = new NextResponse(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  });

  res.cookies.set("access_token", accessToken, {
    ...cookieConfig,
    maxAge: 15 * 60,
  });
  res.cookies.set("refresh_token", refreshToken, {
    ...cookieConfig,
    maxAge: 7 * 24 * 60 * 60,
  });

  return res;
};



export const getTokenCookies = async() => {
  const cookieStore = await cookies();
  return {
    accessToken: cookieStore.get('access_token')?.value || null,
    refreshToken: cookieStore.get('refresh_token')?.value || null,
  }
}

export const clearCookies = () => {
  const response = new NextResponse(null, { status: 200 });

  response.cookies.set('access_token', '', {
    path: '/',
    maxAge: 0,
  });

  response.cookies.set('refresh_token', '', {
    path: '/',
    maxAge: 0,
  });

  return response;
}
