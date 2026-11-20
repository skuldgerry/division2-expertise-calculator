import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";
import test, { after, before } from "node:test";

const origin = "http://127.0.0.1:4174";
let preview;
let previewOutput = "";

before(async () => {
  // The built Worker imports cloudflare: modules. Exercise it in the same
  // local workerd runtime as production preview rather than Node's ESM loader.
  preview = spawn(process.execPath, [
    "node_modules/vite/bin/vite.js", "preview", "--host", "127.0.0.1",
    "--port", "4174", "--strictPort",
  ], { stdio: ["ignore", "pipe", "pipe"] });
  for (const stream of [preview.stdout, preview.stderr]) {
    stream.on("data", (chunk) => {
      previewOutput = (previewOutput + chunk.toString()).slice(-8000);
    });
  }
  const deadline = Date.now() + 60_000;
  while (Date.now() < deadline) {
    if (preview.exitCode !== null) break;
    try {
      const response = await fetch(origin, { signal: AbortSignal.timeout(1000) });
      const ready = response.ok;
      await response.body?.cancel();
      if (ready) return;
    } catch {
      // Preview may still be starting its Worker.
    }
    await delay(100);
  }
  throw new Error(`Worker preview did not become ready:\n${previewOutput}`);
}, { timeout: 65_000 });

after(async () => {
  if (!preview || preview.exitCode !== null || preview.signalCode !== null) return;
  preview.kill("SIGTERM");
  const deadline = Date.now() + 5000;
  while (preview.exitCode === null && preview.signalCode === null && Date.now() < deadline) await delay(50);
  if (preview.exitCode === null && preview.signalCode === null) preview.kill("SIGKILL");
});

async function render() {
  return fetch(origin, {
    headers: { accept: "text/html" },
    signal: AbortSignal.timeout(10_000),
  });
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
  assert.match(html, /aria-label="Material totals view"/);
  assert.match(html, />Combined<\/strong>/);
  assert.match(html, />By item<\/strong>/);
  const itemPreview = html.match(/<div class="item-cost-preview">[\s\S]*?<\/div><\/article>/)?.[0] ?? "";
  for (const icon of [
    "exotic_components-icon.png",
    "shd_calibration-icon.png",
    "field_recon_data-icon.png",
    "steel-icon.png",
    "titanium-icon.png",
    "receiver_components-icon.png",
  ]) {
    assert.match(itemPreview, new RegExp(icon));
  }
  assert.doesNotMatch(html, /_vinext\/image/);
  assert.doesNotMatch(html, /Cost data notes/);
});
