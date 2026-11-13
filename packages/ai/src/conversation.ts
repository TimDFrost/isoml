import type { SessionDefinition } from "@ohya/identity-schema";
import {
  buildSessionSystemPrompt,
  inferEmotionFromReply,
  localInterviewReply,
  type DrYablesEmotion,
} from "./index.js";

export type ChatTurn = { role: "system" | "user" | "assistant"; content: string };

export type ConversationResult = {
  reply: string;
  emotion: DrYablesEmotion;
  candidateInsight?: string;
  mode: "huggingface" | "openai" | "local-fallback";
  usage?: { prompt_tokens?: number; completion_tokens?: number; total_tokens?: number };
};

async function chatCompletions(input: {
  baseUrl: string;
  apiKey: string;
  model: string;
  messages: ChatTurn[];
}): Promise<{ content: string; usage?: ConversationResult["usage"] }> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25_000);
  try {
    const response = await fetch(`${input.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${input.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: input.model,
        temperature: 0.7,
        max_tokens: 320,
        messages: input.messages,
      }),
      signal: controller.signal,
    });
    if (!response.ok) {
      throw new Error(`Provider error ${response.status}`);
    }
    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
      usage?: ConversationResult["usage"];
    };
    const content = data.choices?.[0]?.message?.content?.trim();
    if (!content) throw new Error("Empty model response");
    return { content, usage: data.usage };
  } finally {
    clearTimeout(timeout);
  }
}

export async function runInterviewTurn(input: {
  session: SessionDefinition;
  message: string;
  turn: number;
  history?: Array<{ role: "user" | "assistant"; content: string }>;
  approvedNotes?: string[];
}): Promise<ConversationResult> {
  const system = buildSessionSystemPrompt(input.session, input.approvedNotes || []);
  const messages: ChatTurn[] = [
    { role: "system", content: system },
    ...(input.history || []).slice(-8).map((item) => ({
      role: item.role,
      content: item.content,
    })),
    { role: "user", content: input.message },
  ];

  const hfToken = process.env.HF_TOKEN || process.env.HUGGINGFACE_API_KEY;
  const hfModel =
    process.env.HF_CHAT_MODEL ||
    process.env.LLM_MODEL ||
    "meta-llama/Llama-3.1-8B-Instruct:novita";

  if (hfToken) {
    try {
      const result = await chatCompletions({
        baseUrl: "https://router.huggingface.co/v1",
        apiKey: hfToken,
        model: hfModel,
        messages,
      });
      return {
        reply: result.content,
        emotion: inferEmotionFromReply(result.content),
        candidateInsight: input.message.slice(0, 160),
        mode: "huggingface",
        usage: result.usage,
      };
    } catch {
      // fall through
    }
  }

  const openAiKey = process.env.OPENAI_API_KEY || process.env.LLM_API_KEY;
  if (openAiKey) {
    try {
      const result = await chatCompletions({
        baseUrl: "https://api.openai.com/v1",
        apiKey: openAiKey,
        model: process.env.OPENAI_MODEL || process.env.LLM_MODEL || "gpt-4o-mini",
        messages,
      });
      return {
        reply: result.content,
        emotion: inferEmotionFromReply(result.content),
        candidateInsight: input.message.slice(0, 160),
        mode: "openai",
        usage: result.usage,
      };
    } catch {
      // fall through
    }
  }

  return {
    ...localInterviewReply({
      session: input.session,
      userMessage: input.message,
      turn: input.turn,
      approvedNotes: input.approvedNotes,
    }),
    mode: "local-fallback",
  };
}
