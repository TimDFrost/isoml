import { NextResponse } from "next/server";
import { YABLES_SESSIONS } from "@ohya/identity-schema";
import { runInterviewTurn } from "@ohya/ai/conversation";

type Body = {
  sessionId?: number;
  message?: string;
  turn?: number;
  history?: Array<{ role: "user" | "assistant"; content: string }>;
  approvedNotes?: string[];
};

export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const session = YABLES_SESSIONS.find((item) => item.id === body.sessionId);
  const message = body.message?.trim();
  if (!session || !message) {
    return NextResponse.json({ error: "sessionId and message required" }, { status: 400 });
  }

  // Basic abuse guard — interview stays free, but unbounded spam is not.
  if (message.length > 4000) {
    return NextResponse.json({ error: "Message too long." }, { status: 413 });
  }

  try {
    const result = await runInterviewTurn({
      session,
      message,
      turn: body.turn ?? 0,
      history: body.history,
      approvedNotes: body.approvedNotes,
    });
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "Interview bridge failed." },
      { status: 502 },
    );
  }
}
