import { NextResponse } from 'next/server';

export async function POST(request) {
  const { password } = await request.json();
  const SECRET = process.env.APP_PASSWORD;

  if (!SECRET) return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  if (password !== SECRET) return NextResponse.json({ error: "Wrong password" }, { status: 401 });

  const response = NextResponse.json({ ok: true });
  response.cookies.set("meal_auth", "ok", {
    httpOnly: true,
    secure: false,,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
  return response;
}