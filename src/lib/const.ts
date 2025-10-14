export const PAGE_SIZE = 20;

export const tagSnippet = (workspaceId: string, endpoint: string) => {
  return `<script>
(function () {
  const WORKSPACE_ID = "${workspaceId}";
  const ENDPOINT = "${endpoint}";

  function newUUID() {
    try {
      if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
    } catch {}
    // v4-like fallback
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  const VID_KEY = "sa_vid";
  function getVisitorId() {
    try {
      let v = localStorage.getItem(VID_KEY);
      if (!v) { v = newUUID(); localStorage.setItem(VID_KEY, v); }
      return v;
    } catch { return newUUID(); }
  }

  function send(payload, retries = 2) {
    return fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true
    }).catch(() => {
      if (retries > 0) {
        const waitMs = (3 - retries) * 500;
        setTimeout(() => send(payload, retries - 1), waitMs);
      }
    });
  }

  const queue = [];
  const BATCH_MS = 600;
  const BATCH_MAX = 12;
  const INTERVAL_MS = 10000;
  let timer = null;
  let intervalId = null;

  function enqueue(ev) {
    queue.push(ev);
    if (queue.length >= BATCH_MAX) return flush();
    if (!timer) timer = setTimeout(flush, BATCH_MS);
  }

  function flush(final = false) {
    if (timer) { clearTimeout(timer); timer = null; }
    if (!queue.length) return;
    const batch = { workspaceId: WORKSPACE_ID, events: queue.splice(0, queue.length)}

    if (final) {
      fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(batch),
        keepalive: true
      }).catch(() => {});
      return;
    }
    send(batch, 2);
  }

  intervalId = setInterval(() => { flush(); }, INTERVAL_MS);

  function base(type, elementId) {
    return {
      eventId: newUUID(),
      type,
      workspaceId: WORKSPACE_ID,
      visitorId: getVisitorId(),
      occurredAt: new Date().toISOString(),
      pageUrl: location.href,
      refferUrl: document.referrer || undefined,
      elementId: elementId || undefined
    };
  }

  enqueue({ ...base("TRACK") });
  enqueue({ ...base("PAGE") });
  flush();

  document.addEventListener("blur", (e) => {
    const el = e.target;
    if (!(el instanceof HTMLInputElement)) return;
    if (el.type !== "email") return;
    const val = (el.value || "").trim();
    if (/.+@.+\..+/.test(val)) enqueue({ ...base("TRACK", el.id || "email-input") });
  }, true);

  document.addEventListener("click", (e) => {
    const el = e.target;
    if (!(el instanceof Element)) return;
    let id = el.getAttribute("id");
    if (!id && el.tagName === "BUTTON") {
      id = "button:" + (el.getAttribute("type") || "button").toLowerCase();
    }
    if (id) enqueue({ ...base("CLICK", id) });
  }, true);

  function cleanupAndFlush() {
    if (intervalId) clearInterval(intervalId);
    flush(true);
  }
  window.addEventListener("pagehide", cleanupAndFlush);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") cleanupAndFlush();
  });
})();
</script>`;
};
