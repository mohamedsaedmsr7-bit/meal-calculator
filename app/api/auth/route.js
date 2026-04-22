import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { password } = await request.json();
    const SECRET = process.env.APP_PASSWORD;
    
    console.log("SECRET:", SECRET);
    console.log("password:", password);
    
    if (password !== SECRET) {
      return NextResponse.json({ error: "Wrong" }, { status: 401 });
    }

    const response = NextResponse.json({ ok: true });
    response.cookies.set("meal_auth", "ok", {
      httpOnly: false,
      secure: false,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
    return response;
  } catch(e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}