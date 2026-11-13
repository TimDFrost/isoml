import { NextResponse } from "next/server";
import {
  assertPaidImportAllowed,
  consumeTransferToken,
} from "@ohya/billing";

export async function POST(request: Request) {
  let body: {
    userId?: string;
    token?: string;
    consent?: boolean;
  };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.userId || !body.token) {
    return NextResponse.json({ error: "userId and token required" }, { status: 400 });
  }
  if (!body.consent) {
    return NextResponse.json(
      { error: "Explicit consent is required after payment." },
      { status: 403 },
    );
  }

  try {
    assertPaidImportAllowed(body.userId);
    const consumed = consumeTransferToken(body.token, body.userId);
    return NextResponse.json({
      imported: true,
      profileId: consumed.profileId,
      profileVersion: consumed.profileVersion,
      note: "Approved versioned profile may now be loaded into the isoML twin configuration service.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        imported: false,
        error: error instanceof Error ? error.message : "Transfer denied",
      },
      { status: 402 },
    );
  }
}
