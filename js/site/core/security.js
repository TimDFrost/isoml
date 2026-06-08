/**
 * Shared security utilities — XSS escaping, input validation, safe URLs.
 */

const HTML_ESCAPE = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };

export function escapeHtml(str) {
  return String(str ?? "").replace(/[&<>"']/g, (ch) => HTML_ESCAPE[ch]);
}

/** Escape for HTML attribute values. */
export function escapeAttr(str) {
  return escapeHtml(str).replace(/\//g, "&#47;");
}

export function sanitizeText(value, { maxLength = 500, minLength = 0, allowEmpty = false } = {}) {
  const text = String(value ?? "").trim();
  if (!text && !allowEmpty) return null;
  if (text.length < minLength) return null;
  if (text.length > maxLength) return text.slice(0, maxLength);
  return text;
}

export function validateEmail(email) {
  const normalized = String(email ?? "").trim().toLowerCase();
  if (!normalized || normalized.length > 254) return null;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) return null;
  return normalized;
}

export function validatePhone(phone) {
  const digits = String(phone ?? "").replace(/\D/g, "");
  if (digits.length < 10 || digits.length > 15) return null;
  return String(phone).trim().slice(0, 24);
}

export function validateUsername(username) {
  const name = String(username ?? "").trim().toLowerCase();
  if (!/^[a-z0-9_]{3,24}$/.test(name)) return null;
  return name;
}

export function validateRole(role, allowed = ["fan", "comic"]) {
  return allowed.includes(role) ? role : allowed[0];
}

export function isSafeHttpUrl(url) {
  if (!url || typeof url !== "string") return false;
  try {
    const parsed = new URL(url.trim());
    return parsed.protocol === "https:" && Boolean(parsed.hostname);
  } catch {
    return false;
  }
}

export function sanitizeExternalUrl(url, { allowedHosts = null } = {}) {
  if (!isSafeHttpUrl(url)) return null;
  try {
    const parsed = new URL(url.trim());
    if (
      allowedHosts?.length &&
      !allowedHosts.some((h) => parsed.hostname === h || parsed.hostname.endsWith(`.${h}`))
    ) {
      return null;
    }
    return parsed.href;
  } catch {
    return null;
  }
}

export function isStripePaymentUrl(url) {
  return Boolean(
    sanitizeExternalUrl(url, {
      allowedHosts: ["buy.stripe.com", "checkout.stripe.com"],
    })
  );
}

export function sanitizeHexColor(color, fallback = "#666666") {
  return /^#[0-9a-fA-F]{6}$/.test(String(color ?? "")) ? String(color) : fallback;
}
