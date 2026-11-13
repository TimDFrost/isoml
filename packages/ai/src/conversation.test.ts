import assert from "node:assert/strict";
import test from "node:test";
import { YABLES_SESSIONS } from "@ohya/identity-schema";
import { runInterviewTurn } from "./conversation.js";

test("local fallback interview returns one reply without credentials", async () => {
  const prevHf = process.env.HF_TOKEN;
  const prevOpen = process.env.OPENAI_API_KEY;
  const prevLlm = process.env.LLM_API_KEY;
  delete process.env.HF_TOKEN;
  delete process.env.HUGGINGFACE_API_KEY;
  delete process.env.OPENAI_API_KEY;
  delete process.env.LLM_API_KEY;

  const session = YABLES_SESSIONS[0]!;
  const result = await runInterviewTurn({
    session,
    message: "I love designing logos late at night.",
    turn: 0,
    approvedNotes: ["enjoys creative projects"],
  });

  assert.equal(result.mode, "local-fallback");
  assert.ok(result.reply.length > 20);
  assert.ok(result.candidateInsight?.includes("designing"));

  if (prevHf) process.env.HF_TOKEN = prevHf;
  if (prevOpen) process.env.OPENAI_API_KEY = prevOpen;
  if (prevLlm) process.env.LLM_API_KEY = prevLlm;
});
