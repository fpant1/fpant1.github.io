import { readFile, readdir, stat } from "node:fs/promises";
import { parseDocument } from "yaml";
import { join } from "node:path";

const errors = [];
const yamlFiles = ["_config.yml", ".pre-commit-config.yaml"];
async function collect(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) await collect(path);
    else if (/\.ya?ml$/.test(entry.name)) yamlFiles.push(path);
  }
}
await collect("_data");
await collect(".github");
for (const file of yamlFiles) {
  const document = parseDocument(await readFile(file, "utf8"), { uniqueKeys: true });
  errors.push(...document.errors.map((error) => file + ": " + error.message));
}
for (const directory of ["_pages", "_posts", "_projects", "_news", "_books"]) {
  for (const file of await readdir(directory)) {
    if (!file.endsWith(".md")) continue;
    const path = join(directory, file);
    const text = await readFile(path, "utf8");
    const frontMatter = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!frontMatter) continue;
    const document = parseDocument(frontMatter[1], { uniqueKeys: true });
    errors.push(...document.errors.map((error) => path + ": " + error.message));
    const data = document.toJSON();
    if (data?.published === false) continue;
    if (data?.content_width && !["reading", "wide", "home"].includes(data.content_width)) errors.push(path + ": invalid content_width");
    if (data?.layout) {
      try {
        await stat("_layouts/" + data.layout + ".liquid");
      } catch {
        errors.push(path + ": missing layout " + data.layout);
      }
    }
  }
}
const resume = JSON.parse(await readFile("_data/resume.json", "utf8"));
if (!resume.basics?.name) errors.push("CV data must include basics.name");
if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log("YAML, page metadata and CV data are valid.");
