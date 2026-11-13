import { NextResponse } from "next/server";
import { YABLES_SESSIONS } from "@ohya/identity-schema";
import { buildSessionSystemPrompt, localInterviewReply } from "@ohya/ai";

export async function POST(request: Request) {
  let body: { sessionId?: number; message?: string; turn?: number };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const session = YABLES_SESSIONS.find((item) => item.id === body.sessionId);
  const message = body.message?.trim();
  if (!session || !message) {
    return NextResponse.json({ error: "sessionId and message required" }, { status: 400 });
  }

  const apiKey = process.env.OPENAI_API_KEY || process.env.LLM_API_KEY;
  if (!apiKey) {
    return NextResponse.json({
      ...localInterviewReply({
        session,
        userMessage: message,
        turn: body.turn ?? 0,
      }),
      mode: "local-fallback",
    });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.LLM_MODEL || "gpt-4o-mini",
        temperature: 0.7,
        messages: [
          { role: "system", content: buildSessionSystemPrompt(session) },
          { role: "user", content: message },
        ],
      }),
    });
    if (!response.ok) {
      return NextResponse.json({
        ...localInterviewReply({ session, userMessage: message, turn: body.turn ?? 0 }),
        mode: "local-fallback",
      });
    }
    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const reply = data.choices?.[0]?.message?.content?.trim();
    return NextResponse.json({
      reply: reply || localInterviewReply({ session, userMessage: message, turn: 0 }).reply,
      emotion: "speaking",
      candidateInsight: message.slice(0, 160),
      mode: "llm",
    });
  } catch {
    return NextResponse.json({
      ...localInterviewReply({ session, userMessage: message, turn: body.turn ?? 0 }),
      mode: "local-fallback",
    });
  }
}
