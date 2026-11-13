import { NextResponse } from "next/server";

type Body = {
  name?: string;
  email?: string;
  interest?: string;
};

export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const name = body.name?.trim();
  const email = body.email?.trim();
  if (!name || !email) {
    return NextResponse.json(
      { error: "Name and email are required." },
      { status: 400 },
    );
  }

  const webhook = process.env.EARLY_ACCESS_WEBHOOK_URL?.trim();
  if (webhook) {
    try {
      await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          interest: body.interest || "Reachy Mini × You",
          source: "isoml.com",
        }),
      });
      return NextResponse.json({
        message: "Thanks — your early access request was sent.",
        mode: "webhook",
      });
    } catch {
      return NextResponse.json(
        { error: "Webhook delivery failed. Please try again later." },
        { status: 502 },
      );
    }
  }

  console.info("[isoML early-access]", {
    name,
    email,
    interest: body.interest || "Reachy Mini × You",
  });

  return NextResponse.json({
    message:
      "Thanks — request recorded locally on the server log. Configure EARLY_ACCESS_WEBHOOK_URL for durable capture.",
    mode: "log-only",
  });
}
