export function getBookingUrl(): string | null {
  const value = process.env.NEXT_PUBLIC_BOOKING_URL?.trim();
  return value || null;
}

export function getBaseUrl(): string {
  return process.env.NEXT_PUBLIC_BASE_URL?.trim() || "https://isoml.com";
}

export function hasLlmConfigured(): boolean {
  return Boolean(process.env.OPENAI_API_KEY || process.env.LLM_API_KEY);
}

export function getReachySdkConfigured(): boolean {
  return Boolean(process.env.REACHY_MINI_ENDPOINT?.trim());
}

export const REACHY_BUY_URL = "https://www.pollen-robotics.com/";
