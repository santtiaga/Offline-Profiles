/**
 * Small platform-neutral logger for the Offline Profiles app.
 * The MGU UI can subscribe to entries and render them in an on-screen console.
 * No timers, filesystem access, or SDK dependencies are assumed here.
 */

const LEVELS = Object.freeze({
  DEBUG: 10,
  INFO: 20,
  WARN: 30,
  ERROR: 40,
});

export class Logger {
  constructor({ capacity = 300, minLevel = "DEBUG", onEntry = null } = {}) {
    this.capacity = Math.max(1, capacity);
    this.minLevel = LEVELS[minLevel] ?? LEVELS.DEBUG;
    this.onEntry = typeof onEntry === "function" ? onEntry : null;
    this.entries = [];
    this.sequence = 0;
  }

  write(level, event, details = {}) {
    const numericLevel = LEVELS[level] ?? LEVELS.INFO;
    if (numericLevel < this.minLevel) return null;

    const entry = Object.freeze({
      id: ++this.sequence,
      timestamp: new Date().toISOString(),
      level,
      event: String(event),
      details: sanitize(details),
    });

    this.entries.push(entry);
    if (this.entries.length > this.capacity) this.entries.shift();

    try {
      this.onEntry?.(entry);
    } catch {
      // Logging must never break the application flow.
    }
    return entry;
  }

  debug(event, details) { return this.write("DEBUG", event, details); }
  info(event, details) { return this.write("INFO", event, details); }
  warn(event, details) { return this.write("WARN", event, details); }
  error(event, details) { return this.write("ERROR", event, details); }

  snapshot() {
    return this.entries.slice();
  }

  clear() {
    this.entries.length = 0;
  }
}

function sanitize(value, key = "") {
  if (/password|token|secret|private.?key|vin|user.?id/i.test(key)) {
    return "[REDACTED]";
  }
  if (value === null || value === undefined) return value;
  if (Array.isArray(value)) return value.map((item) => sanitize(item));
  if (typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([childKey, childValue]) => [
        childKey,
        sanitize(childValue, childKey),
      ]),
    );
  }
  if (typeof value === "string" && value.length > 2000) {
    return value.slice(0, 2000) + "…[truncated]";
  }
  return value;
}
