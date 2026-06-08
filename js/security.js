/**
 * Security utilities for simulator (re-exports site core for single source of truth).
 */
export {
  escapeHtml,
  escapeAttr,
  sanitizeText,
  validateEmail,
  isSafeHttpUrl,
  sanitizeExternalUrl,
  sanitizeHexColor,
} from "./site/core/security.js";
