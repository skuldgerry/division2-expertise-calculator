import { access, cp, rm, stat } from "node:fs/promises";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

// GitHub Pages mounts the uploaded artifact at the repository base path.
// vinext 1.x includes that base path in its physical export layout as well.
// Flatten the generated mount directory while retaining public assets at root.
export async function preparePagesExport(clientDirectory) {
  const clientRoot = resolve(clientDirectory);
  const mountDirectory = join(clientRoot, "division2-expertise-calculator");
  let nested = false;
  try {
    nested = (await stat(mountDirectory)).isDirectory();
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
  if (nested) {
    await cp(mountDirectory, clientRoot, { recursive: true });
    await rm(mountDirectory, { recursive: true });
  }
  await access(join(clientRoot, "index.html"));
}

const isEntryPoint = process.argv[1]
  && pathToFileURL(resolve(process.argv[1])).href === import.meta.url;
if (isEntryPoint && process.env.GITHUB_PAGES === "true") {
  await preparePagesExport("dist/client");
}
