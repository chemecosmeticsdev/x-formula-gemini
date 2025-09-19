
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, password, firstName, lastName } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // For demo deployment - authentication is disabled
    return NextResponse.json(
      { 
        message: "Demo mode - signup disabled. Please use the app without authentication.",
        userId: "demo-user" 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Demo mode - authentication disabled" },
      { status: 501 }
    );
  }
}
