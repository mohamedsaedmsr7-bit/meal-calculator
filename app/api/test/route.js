import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ 
    password: process.env.APP_PASSWORD,
    exists: !!process.env.APP_PASSWORD,
    length: process.env.APP_PASSWORD?.length
  });
}