import { NextResponse } from "next/server";
import { synthesizeDemo } from "@/lib/demo-engine";
import type { DemoSession } from "@/lib/types";

export async function POST(request: Request) {
  let body: DemoSession;
  try {
    body = (await request.json()) as DemoSession;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const apiKey = process.env.OPENAI_API_KEY || process.env.LLM_API_KEY;
  const model = process.env.LLM_MODEL || "gpt-4o-mini";
  const synthetic = synthesizeDemo(body);

  if (!apiKey) {
    return NextResponse.json({
      ...synthetic,
      mode: "synthetic",
      disclosure:
        "No model key configured. Returning local demonstration output only.",
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
        temperature: 0.6,
        messages: [
          {
            role: "system",
            content: [
              "You help isoML generate a short twin demo summary and sample reply.",
              "Never claim to be the human. Label uncertainty. Stay within provided fields.",
              "Return JSON with keys summary and sampleReply only.",
            ].join(" "),
          },
          {
            role: "user",
            content: JSON.stringify({
              nickname: body.nickname,
              traits: body.traits,
              writingSample: body.writingSample,
              preference: body.preference,
              interviewAnswer: body.interviewAnswer,
            }),
          },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      return NextResponse.json({
        ...synthetic,
        mode: "synthetic",
        disclosure:
          "Model request failed. Falling back to local demonstration output. Demo fields only were prepared for the provider.",
      });
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      return NextResponse.json({ ...synthetic, mode: "synthetic" });
    }

    const parsed = JSON.parse(content) as {
      summary?: string;
      sampleReply?: string;
    };

    return NextResponse.json({
      summary: parsed.summary || synthetic.summary,
      sampleReply: parsed.sampleReply || synthetic.sampleReply,
      mode: "llm",
      disclosure:
        "Only demo nickname, traits, writing sample, preference, and interview answer were sent to the model provider.",
    });
  } catch {
    return NextResponse.json({
      ...synthetic,
      mode: "synthetic",
      disclosure: "Unexpected model bridge error; using local demonstration output.",
    });
  }
}
