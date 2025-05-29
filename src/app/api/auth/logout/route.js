// app/api/auth/logout/route.js
import { NextResponse } from 'next/server';

export async function POST(request) {
  const response = new NextResponse(JSON.stringify({ message: "Logout successful" }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });

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
