import { cookieConfig } from "@/constants/constant";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// utils/cookie.js  (unchanged)

export const setAuthCookies = (accessToken, refreshToken,user, message ="", status = 200) => {
  
  const res = new NextResponse(JSON.stringify({message,user}), {
    status,
    headers: { "Content-Type": "application/json" },
  });
// const res = NextResponse.next();


  res.cookies.set("access_token", accessToken, {
   httpOnly: true,
        path: "/",
        maxAge: 15 * 60,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
  });

  res.cookies.set("refresh_token", refreshToken, {
    httpOnly: true,
        path: "/",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60, // 7 days
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
