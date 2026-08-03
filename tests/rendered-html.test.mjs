import assert from "node:assert/strict";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the finished Expertise calculator", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Expertise Calculator — The Division 2<\/title>/i);
  assert.match(html, /Expertise/);
  assert.match(html, /Calculator/);
  assert.match(html, /Materials required/);
  assert.match(html, /Cost trajectory/);
  assert.match(html, /Y8S1 \(Rev\. 2\)/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|react-loading-skeleton/i);
});

test("ships accessible calculator controls in the initial response", async () => {
  const response = await render();
  const html = await response.text();
  assert.match(html, /aria-label="Category for item 1"/);
  assert.match(html, /type="range"/);
  assert.match(html, /aria-live="polite"/);
  assert.match(html, /aria-pressed="false"/);
  assert.match(html, /aria-label="Color theme"/);
  assert.match(html, />System<\/button>/);
  assert.match(html, /role="switch"/);
  assert.match(html, /Inventory check/);
  assert.match(html, /aria-label="Decrease Current level for Weapon 1"/);
  assert.match(html, /aria-label="Increase Target level for Weapon 1"/);
  assert.match(html, /aria-label="Increase Quantity for item 1"/);
  assert.doesNotMatch(html, /_vinext\/image/);
  assert.doesNotMatch(html, /Cost data notes/);
});
