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

test("server-renders the finished Expertise planner", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>SHD Quartermaster — Division 2 Expertise Planner<\/title>/i);
  assert.match(html, /Plan upgrades/);
  assert.match(html, /Resource manifest/);
  assert.match(html, /Upgrade intelligence/);
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
  assert.match(html, /Maximum Expertise/);
});
