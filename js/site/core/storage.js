/**
 * Namespaced storage — swap LocalStorageAdapter for RemoteAdapter when API is live.
 * Collections mirror future database tables.
 */

const PREFIX = "isoml:v1:";

export const Collections = {
  USERS: "users",
  SESSION: "session",
  POSTS: "fan-posts",
  COMMENTS: "fan-comments",
  VOTES: "votes",
  GAMIFY: "gamify-meta",
  COMEDIAN_APPLICATIONS: "comedian-applications",
  UPDATES_SUBSCRIBERS: "updates-subscribers",
  FAN_COMPETITION: "fan-competition",
};

const COLLECTION_LIMITS = {
  [Collections.POSTS]: 500,
  [Collections.COMMENTS]: 2000,
  [Collections.VOTES]: 10000,
  [Collections.USERS]: 5000,
  [Collections.COMEDIAN_APPLICATIONS]: 1000,
  [Collections.UPDATES_SUBSCRIBERS]: 5000,
};

export class LocalStorageAdapter {
  get(key, fallback = null) {
    try {
      const raw = localStorage.getItem(PREFIX + key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  }

  set(key, value) {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
    } catch {
      /* quota exceeded — fail silently in demo mode */
    }
  }

  remove(key) {
    localStorage.removeItem(PREFIX + key);
  }

  /** @param {string} collection */
  list(collection) {
    return this.get(collection, []);
  }

  /** @param {string} collection @param {object} item — must have id */
  insert(collection, item) {
    const rows = this.list(collection);
    rows.unshift(item);
    const limit = COLLECTION_LIMITS[collection];
    this.set(collection, limit ? rows.slice(0, limit) : rows);
    return item;
  }

  /** @param {string} collection @param {string} id @param {object} patch */
  update(collection, id, patch) {
    const rows = this.list(collection);
    const idx = rows.findIndex((r) => r.id === id);
    if (idx === -1) return null;
    rows[idx] = { ...rows[idx], ...patch, updatedAt: new Date().toISOString() };
    this.set(collection, rows);
    return rows[idx];
  }

  findById(collection, id) {
    return this.list(collection).find((r) => r.id === id) ?? null;
  }

  filter(collection, predicate) {
    return this.list(collection).filter(predicate);
  }
}

export const storage = new LocalStorageAdapter();
