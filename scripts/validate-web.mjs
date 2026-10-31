import fs from "node:fs";
import vm from "node:vm";
import path from "node:path";

const html = fs.readFileSync("index.html", "utf8");
const required = [
  'localStorage.getItem("flexo_v1")',
  'manifest.webmanifest',
  'service-worker.js',
  'Qwen2.5-0.5B-Instruct-q4f16_1-MLC',
  'CreateMLCEngine',
  'onlineResearch',
  'function rank(query)',
  'pdfjs-dist@4.10.38',
  'extractOffice(file)'
];
const errors = [];
for (const item of required) if (!html.includes(item)) errors.push("Missing required implementation marker: " + item);

const manifestMatch = html.match(/<link[^>]+rel=["']manifest["'][^>]+href=["']([^"']+)["']/i);
if (!manifestMatch) errors.push("PWA manifest link is missing");
else {
  const manifestPath = path.resolve(manifestMatch[1]);
  if (!fs.existsSync(manifestPath)) errors.push("PWA manifest file is missing: " + manifestPath);
  else {
    try { JSON.parse(fs.readFileSync(manifestPath, "utf8")); }
    catch { errors.push("PWA manifest is invalid JSON"); }
  }
}

for (const match of html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/gi)) {
  const attrs = match[1] || "";
  const code = match[2] || "";
  if (!code.trim() || /\bsrc\s*=/.test(attrs)) continue;
  try { new vm.Script(code, { filename: "index.html:inline-script" }); }
  catch (error) { errors.push("Inline JavaScript syntax error: " + error.message); }
}

for (const file of ["builtin-intelligence.js", "jszip.min.js", "service-worker.js", "manifest.webmanifest", "icons/flexo-mark.svg"]) {
  if (!fs.existsSync(file)) errors.push("Missing app asset: " + file);
}

const sw = fs.readFileSync("service-worker.js", "utf8");
if (!sw.includes("flexo-app-shell-v3")) errors.push("Service worker cache version was not bumped");
if (!sw.includes("https://esm.run") || !sw.includes("https://cdn.jsdelivr.net")) errors.push("Runtime CDN cache allowlist is missing");
if (!sw.includes('url.pathname.includes("/api/")')) errors.push("Service worker API cache exclusion is missing");

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log("Flexo web validation passed: inline JavaScript syntax, app assets, manifest, PWA cache rules, and key intelligence integrations.");
