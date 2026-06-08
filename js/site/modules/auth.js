import { AUTH, FAN_LOUNGE } from "../config.js";
import { api } from "../core/api.js";
import { Events, emit, on } from "../core/events.js";
import { escapeHtml, validateUsername, validateRole } from "../core/security.js";

let currentUser = null;

export function getCurrentUser() {
  return currentUser;
}

export function requireUser() {
  if (!currentUser) throw new Error("Sign in required");
  return currentUser;
}

export async function initAuth() {
  await seedDemoUsers();
  const session = await api.getSession();
  if (session?.userId) {
    currentUser = await api.getUserById(session.userId);
    if (!currentUser) await api.clearSession();
  }
  emit(currentUser ? Events.USER_SIGNED_IN : Events.USER_SIGNED_OUT, currentUser);
  return currentUser;
}

async function seedDemoUsers() {
  const users = await api.getUsers();
  if (users.length) return;
  await api.createUser({ username: "demo_fan", displayName: "Demo Fan", role: "fan" });
  await api.createUser({ username: "demo_comic", displayName: "Demo Comic", role: "comic" });
}

export async function signUp({ username, displayName, email, role }) {
  const validUsername = validateUsername(username);
  if (!validUsername) throw new Error("Invalid username.");

  const user = await api.createUser({
    username: validUsername,
    displayName: displayName?.trim() || validUsername,
    email: email?.trim() || null,
    role: validateRole(role, AUTH.roles.map((r) => r.id)),
  });
  await api.setSession(user.id);
  currentUser = user;
  emit(Events.USER_SIGNED_IN, user);
  return user;
}

export async function signIn(username) {
  const validUsername = validateUsername(username);
  if (!validUsername) throw new Error("Invalid username.");

  const users = await api.getUsers();
  const user = users.find((u) => u.username === validUsername);
  if (!user) throw new Error("User not found — create an account first");
  await api.setSession(user.id);
  currentUser = user;
  emit(Events.USER_SIGNED_IN, user);
  return user;
}

export async function signOut() {
  await api.clearSession();
  currentUser = null;
  emit(Events.USER_SIGNED_OUT, null);
}

export async function refreshUser() {
  if (!currentUser) return null;
  currentUser = await api.getUserById(currentUser.id);
  emit(Events.USER_UPDATED, currentUser);
  return currentUser;
}

export function isFounder(user) {
  if (!user) return false;
  const { founder } = FAN_LOUNGE;
  const email = user.email?.toLowerCase();
  const username = user.username?.toLowerCase();
  if (email && founder.emails?.some((e) => e.toLowerCase() === email)) return true;
  if (username && founder.usernames?.some((u) => u.toLowerCase() === username)) return true;
  return false;
}

/** Wire header user bar + auth modal */
export function mountAuthUI(containerId = "user-bar") {
  const container = document.getElementById(containerId);
  if (!container) return;

  const render = () => {
    if (currentUser) {
      const roleClass = AUTH.roles.some((r) => r.id === currentUser.role) ? currentUser.role : "fan";
      container.innerHTML = `
        <div class="user-bar-signed-in">
          <span class="user-xp" title="Experience points">⭐ ${Number(currentUser.xp) || 0} XP · Lvl ${Number(currentUser.level) || 1}</span>
          <span class="user-name">${escapeHtml(currentUser.displayName)}</span>
          <span class="user-role badge-role badge-role--${escapeHtml(roleClass)}">${escapeHtml(roleClass)}</span>
          <button type="button" class="btn btn-ghost btn-sm" data-auth-sign-out>Sign out</button>
        </div>
      `;
      container.querySelector("[data-auth-sign-out]")?.addEventListener("click", signOut);
    } else {
      container.innerHTML = `
        <button type="button" class="btn btn-ghost btn-sm" data-auth-open>Join / Sign in</button>
      `;
      container.querySelector("[data-auth-open]")?.addEventListener("click", openAuthModal);
    }
  };

  on(Events.USER_SIGNED_IN, render);
  on(Events.USER_SIGNED_OUT, render);
  on(Events.USER_UPDATED, render);
  on(Events.LEVEL_UP, refreshUser);
  render();
}

function openAuthModal() {
  const dialog = document.getElementById("auth-modal");
  if (dialog?.showModal) dialog.showModal();
}

export function mountAuthModal() {
  if (document.getElementById("auth-modal")) return;

  const dialog = document.createElement("dialog");
  dialog.id = "auth-modal";
  dialog.className = "site-modal";
  dialog.innerHTML = `
    <form method="dialog" class="auth-form" id="auth-form">
      <h2>Join IsoML</h2>
      <p class="auth-form-lead">Create a free fan account to post videos, comment, and earn XP.</p>
      <label>Username <input name="username" required minlength="3" maxlength="24" pattern="[A-Za-z0-9_]+" placeholder="your_handle" autocomplete="username" /></label>
      <label>Display name <input name="displayName" maxlength="40" placeholder="Optional" autocomplete="name" /></label>
      <label>Email <input type="email" name="email" placeholder="Optional — for account recovery" autocomplete="email" /></label>
      <label>I am a
        <select name="role">
          ${AUTH.roles.map((r) => `<option value="${r.id}">${r.label}</option>`).join("")}
        </select>
      </label>
      <p class="auth-form-error" id="auth-form-error" hidden role="alert"></p>
      <div class="modal-actions">
        <button type="button" class="btn btn-secondary" data-auth-sign-in-only>Sign in existing</button>
        <button type="submit" class="btn btn-primary">Create account</button>
      </div>
    </form>
  `;
  document.body.appendChild(dialog);

  const form = dialog.querySelector("#auth-form");
  const errEl = dialog.querySelector("#auth-form-error");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errEl.hidden = true;
    const fd = new FormData(form);
    try {
      await signUp({
        username: fd.get("username"),
        displayName: fd.get("displayName"),
        email: fd.get("email"),
        role: fd.get("role"),
      });
      dialog.close();
      form.reset();
    } catch (err) {
      errEl.textContent = err.message;
      errEl.hidden = false;
    }
  });

  dialog.querySelector("[data-auth-sign-in-only]")?.addEventListener("click", async () => {
    errEl.hidden = true;
    const username = form.username.value.trim();
    if (!username) {
      errEl.textContent = "Enter your username to sign in.";
      errEl.hidden = false;
      return;
    }
    try {
      await signIn(username);
      dialog.close();
    } catch (err) {
      errEl.textContent = err.message;
      errEl.hidden = false;
    }
  });
}

