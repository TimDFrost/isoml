export type TwinTone = "warm" | "witty" | "calm" | "direct" | "curious";

export type DataSourceType =
  | "journal"
  | "writing"
  | "resume"
  | "messages"
  | "preferences"
  | "other";

export type ProcessingStatus = "queued" | "processing" | "ready" | "error";

export type InsightKind =
  | "stated-fact"
  | "preference"
  | "inferred-pattern"
  | "uncertain";

export type InsightDecision = "pending" | "approved" | "corrected" | "rejected";

export type OutboxMode = "draft-only" | "ask-before-sending" | "handle-under-rules";

export type DemoSession = {
  nickname: string;
  traits: [string, string, string];
  writingSample: string;
  preference: string;
  interviewAnswer: string;
  summary: string;
  sampleReply: string;
  conversation: Array<{ role: "user" | "assistant"; content: string }>;
  robotMood: "curious" | "warm" | "focused";
  updatedAt: string;
};

export type TwinConfig = {
  displayName: string;
  tone: TwinTone;
  vocabulary: string;
  humor: string;
  formality: "casual" | "balanced" | "formal";
  responseLength: "short" | "medium" | "long";
  favoriteExpressions: string[];
  approvedMemories: string[];
  topicsToAvoid: string[];
  privateKnowledge: string;
  publicKnowledge: string;
  robotExpression: string;
};

export type DataSource = {
  id: string;
  title: string;
  type: DataSourceType;
  origin: string;
  date: string;
  status: ProcessingStatus;
  permissions: string;
  approvedForTwin: boolean;
  preview: string;
};

export type InterviewItem = {
  id: string;
  category: string;
  question: string;
  answer: string;
  lesson: string;
  status: "open" | "skipped" | "approved";
};

export type Insight = {
  id: string;
  kind: InsightKind;
  text: string;
  sourceIds: string[];
  decision: InsightDecision;
  correction?: string;
};

export type OutboxDraft = {
  id: string;
  channel: "social" | "text" | "work";
  recipient: string;
  body: string;
  status: "draft" | "awaiting-approval" | "paused" | "logged";
  createdAt: string;
};

export type StudioState = {
  twin: TwinConfig;
  sources: DataSource[];
  interviews: InterviewItem[];
  insights: Insight[];
  outboxMode: OutboxMode;
  outbox: OutboxDraft[];
  robot: {
    connection: "disconnected" | "unavailable" | "planned";
    selectedPersonality: string;
    nfcHat: "planned";
    notes: string;
  };
  updatedAt: string;
};

export type ChatMessage = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  at: string;
};
