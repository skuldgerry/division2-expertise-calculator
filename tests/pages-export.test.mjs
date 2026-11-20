import assert from "node:assert/strict";
import { access, mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { preparePagesExport } from "../build/prepare-pages-export.mjs";

test("Pages artifact has a root page, generated assets and existing public resources", async (t) => {
  const root = await mkdtemp(join(tmpdir(), "expertise-export-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  const mount = join(root, "division2-expertise-calculator");
  await mkdir(join(mount, "_next", "static"), { recursive: true });
  await mkdir(join(root, "resources"));
  await writeFile(join(mount, "index.html"), '<script src="/division2-expertise-calculator/_next/static/app.js"></script>');
  await writeFile(join(mount, "_next", "static", "app.js"), "export {};");
  await writeFile(join(root, "resources", "icon.png"), "public resource");

  await preparePagesExport(root);
  assert.match(await readFile(join(root, "index.html"), "utf8"), /division2-expertise-calculator/);
  await access(join(root, "_next", "static", "app.js"));
  assert.equal(await readFile(join(root, "resources", "icon.png"), "utf8"), "public resource");
  await assert.rejects(access(mount), { code: "ENOENT" });
  // Running preparation again must leave the ready artifact intact.
  await preparePagesExport(root);
});

test("Pages preparation rejects an export without an index page", async (t) => {
  const root = await mkdtemp(join(tmpdir(), "expertise-empty-export-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  await assert.rejects(preparePagesExport(root), { code: "ENOENT" });
});
