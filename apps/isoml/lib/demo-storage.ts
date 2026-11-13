import { emptyDemoSession } from "@/lib/demo-engine";
import type { DemoSession } from "@/lib/types";

const SESSION_KEY = "isoml.demo.session.v1";

export function loadDemoSession(): DemoSession {
  if (typeof window === "undefined") return emptyDemoSession();
  try {
    const raw = window.sessionStorage.getItem(SESSION_KEY);
    if (!raw) return emptyDemoSession();
    return { ...emptyDemoSession(), ...(JSON.parse(raw) as DemoSession) };
  } catch {
    return emptyDemoSession();
  }
}

export function saveDemoSession(session: DemoSession): void {
  window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearDemoSession(): DemoSession {
  const next = emptyDemoSession();
  window.sessionStorage.removeItem(SESSION_KEY);
  return next;
}
