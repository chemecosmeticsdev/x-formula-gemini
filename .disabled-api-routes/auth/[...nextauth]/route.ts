
import { NextRequest, NextResponse } from "next/server";

// Demo mode - NextAuth disabled for static deployment
export async function GET(request: NextRequest) {
  return NextResponse.json(
    { 
      message: "Demo mode - authentication disabled for static deployment",
      status: "disabled" 
    },
    { status: 501 }
  );
}

export async function POST(request: NextRequest) {
  return NextResponse.json(
    { 
      message: "Demo mode - authentication disabled for static deployment",
      status: "disabled" 
    },
    { status: 501 }
  );
}
