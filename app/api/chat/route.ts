import { NextResponse } from "next/server";
import { buildTwinSystemPrompt } from "@/lib/prompts";
import type { TwinConfig } from "@/lib/types";

type ChatBody = {
  message?: string;
  profile?: TwinConfig;
};

export async function POST(request: Request) {
  let body: ChatBody;
  try {
    body = (await request.json()) as ChatBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const message = body.message?.trim();
  const profile = body.profile;
  if (!message || !profile) {
    return NextResponse.json(
      { error: "message and profile are required." },
      { status: 400 },
    );
  }

  const apiKey = process.env.OPENAI_API_KEY || process.env.LLM_API_KEY;
  const model = process.env.LLM_MODEL || "gpt-4o-mini";

  if (!apiKey) {
    const name = profile.displayName || "your twin";
    return NextResponse.json({
      reply: [
        `I'm ${name}, an AI twin inspired by the approved isoML profile — not the real person.`,
        "Live LLM replies activate when OPENAI_API_KEY or LLM_API_KEY is set on the server.",
        profile.approvedMemories[0]
          ? `Approved memory I can reference: ${profile.approvedMemories[0]}.`
          : "I won't invent autobiography outside the approved profile.",
        `You said: “${message.slice(0, 180)}”.`,
      ].join(" "),
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
        model,
        temperature: 0.7,
        messages: [
          { role: "system", content: buildTwinSystemPrompt(profile) },
          { role: "user", content: message },
        ],
      }),
    });

    if (!response.ok) {
      const detail = await response.text();
      return NextResponse.json(
        { error: "LLM request failed.", detail: detail.slice(0, 500) },
        { status: 502 },
      );
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const reply = data.choices?.[0]?.message?.content?.trim();
    if (!reply) {
      return NextResponse.json({ error: "Empty model response." }, { status: 502 });
    }

    return NextResponse.json({
      reply,
      mode: "llm",
      disclosure: "Approved twin configuration and your message were sent server-side to the model provider.",
    });
  } catch {
    return NextResponse.json(
      { error: "Unexpected LLM bridge error." },
      { status: 500 },
    );
  }
}
