import { readdir, readFile, stat } from "node:fs/promises";
import { resolve, relative, sep } from "node:path";
import { load } from "cheerio";
import { parse } from "yaml";
import { isDeepStrictEqual } from "node:util";

const root = resolve("_site");
const config = parse(await readFile("_config.yml", "utf8"));
const origin = new URL(config.url).origin;
const errors = [];
const html = new Map();
async function collect(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = resolve(dir, entry.name);
    if (entry.isDirectory()) {
      if (!["libs", "jupyter", "plotly"].includes(entry.name)) await collect(path);
    } else if (entry.name.endsWith(".html") && !relative(root, path).startsWith("assets" + sep)) {
      html.set(path, load(await readFile(path, "utf8")));
    }
  }
}
await collect(root);
for (const route of ["index.html", "blog/index.html", "projects/index.html", "cv/index.html", "404.html"]) {
  if (!html.has(resolve(root, route))) errors.push("Missing route: " + route);
}
for (const [file, $] of html) {
  const route =
    "/" +
    relative(root, file)
      .split(sep)
      .join("/")
      .replace(/index\.html$/, "");
  for (const element of $("[href], [src]").toArray()) {
    const reference = $(element).attr("href") ?? $(element).attr("src");
    if (!reference || /^(mailto:|tel:|data:|javascript:)/i.test(reference)) continue;
    let url;
    try {
      url = new URL(reference, origin + route);
    } catch {
      errors.push(route + ": invalid URL " + reference);
      continue;
    }
    if (url.origin !== origin) continue;
    let target = resolve(root, "." + decodeURIComponent(url.pathname));
    if (target !== root && !target.startsWith(root + sep)) {
      errors.push(route + ": path outside build");
      continue;
    }
    try {
      if ((await stat(target)).isDirectory()) target = resolve(target, "index.html");
      await stat(target);
      const targetDoc = html.get(target);
      if (url.hash && targetDoc && !url.hash.startsWith("#:~:")) {
        const id = decodeURIComponent(url.hash.slice(1));
        const found = targetDoc("[id], a[name]")
          .toArray()
          .some((node) => targetDoc(node).attr("id") === id || targetDoc(node).attr("name") === id);
        if (!found) errors.push(route + ": missing anchor " + reference);
      }
    } catch {
      errors.push(route + ": missing file " + reference);
    }
  }
  if ($("main").length !== 1) errors.push(route + ": expected one main landmark");
  if ($("h1").length !== 1) errors.push(route + ": expected one h1");
  const ids = $("[id]")
    .toArray()
    .map((node) => $(node).attr("id"));
  if (new Set(ids).size !== ids.length) errors.push(route + ": duplicate element ids");
  for (const node of $("img").toArray()) {
    if ($(node).attr("alt") === undefined) errors.push(route + ": image missing alt text");
  }
}
const projects = html.get(resolve(root, "projects/index.html"));
const resume = JSON.parse(await readFile("_data/resume.json", "utf8"));
const publishedResume = JSON.parse(await readFile(resolve(root, "assets/json/resume.json"), "utf8"));
if (!isDeepStrictEqual(resume, publishedResume)) errors.push("Published CV JSON differs from its source");
const cv = html.get(resolve(root, "cv/index.html"));
for (const entry of resume.education ?? []) {
  if (entry.score && !cv?.("#education").text().includes(entry.score)) errors.push("CV is missing an education result: " + entry.score);
}
for (const node of projects?.(".project-card img").toArray() ?? []) {
  const src = projects(node).attr("src");
  const image = await stat(resolve(root, "." + new URL(src, origin).pathname));
  if (image.size > 2.5 * 1024 * 1024) errors.push("Project thumbnail exceeds 2.5 MiB: " + src);
}
for (const path of ["scripts", "tests", "node_modules", "vendor", "docs", "README.md", "assets/img/robotfile.gif"]) {
  try {
    await stat(resolve(root, path));
    errors.push("Development/original file leaked into build: " + path);
  } catch {
    /* correctly excluded */
  }
}
if (errors.length) {
  console.error([...new Set(errors)].join("\n"));
  process.exit(1);
}
console.log("Checked " + html.size + " pages: internal links, anchors, landmarks, images and deployment exclusions pass.");
