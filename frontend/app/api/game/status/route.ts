import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get("address");

  if (!address) {
    return NextResponse.json({ error: "Address is required" }, { status: 400 });
  }

  try {
    // TODO: Replace with actual database query
    // For now, return mock data
    return NextResponse.json({
      hasActiveGame: false,
      gameId: null,
      availableSlots: 0,
    });
  } catch (error) {
    console.error("Error checking game status:", error);
    return NextResponse.json(
      { error: "Failed to check game status" },
      { status: 500 }
    );
  }
}
