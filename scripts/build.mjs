import { spawnSync } from "node:child_process";
import { PurgeCSS } from "purgecss";
import { readdir, readFile, writeFile } from "node:fs/promises";
import { minify } from "terser";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const windows = process.platform === "win32";
// The command is fixed: cmd.exe is needed for RubyInstaller's .bat wrapper.
const command = windows ? "cmd.exe" : "bundle";
const args = windows ? ["/d", "/s", "/c", "bundle exec jekyll build --trace"] : ["exec", "jekyll", "build", "--trace"];
const result = spawnSync(command, args, {
  stdio: "inherit",
  env: { ...process.env, JEKYLL_ENV: "production" },
});
if (result.error || result.status !== 0) {
  console.error(result.error?.message ?? "Jekyll build failed.");
  process.exit(result.status || 1);
}
const css = await new PurgeCSS().purge(require("../purgecss.config.js"));
for (const result of css) await writeFile(result.file, result.css);
for (const file of await readdir("_site/assets/js")) {
  if (!file.endsWith(".js") || file.endsWith(".min.js") || file === "typograms.js") continue;
  const path = "_site/assets/js/" + file;
  const source = await readFile(path, "utf8");
  const result = await minify(source, { module: /^import\s/m.test(source) });
  await writeFile(path, result.code);
}
console.log("Production CSS and JavaScript optimised. Run npm run test:site and npm run test:ui before publishing.");
