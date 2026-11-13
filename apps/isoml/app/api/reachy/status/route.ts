import { NextResponse } from "next/server";

/**
 * Honest Reachy Mini adapter status.
 * Verified SDK/hardware integration is intentionally not simulated as connected.
 * Official docs should be checked before enabling control surfaces:
 * https://www.pollen-robotics.com/
 */
export async function GET() {
  const endpoint = process.env.REACHY_MINI_ENDPOINT?.trim();

  if (!endpoint) {
    return NextResponse.json({
      connection: "unavailable",
      adapter: "not-configured",
      nfcHat: "planned",
      message:
        "REACHY_MINI_ENDPOINT is not set. Personality service remains separate from hardware.",
    });
  }

  return NextResponse.json({
    connection: "disconnected",
    adapter: "endpoint-present-unverified",
    nfcHat: "planned",
    message:
      "An endpoint is configured, but this build does not claim a successful live robot session until the official SDK path is verified and wired.",
  });
}
