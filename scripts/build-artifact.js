#!/usr/bin/env node
/*
 * build-artifact.js — produce a single self-contained page for a claude.ai
 * Artifact (or any drop-in HTML). Everything is inlined: the full prompt
 * library is baked into the script, so there are no network requests, no
 * service worker, and no API of any kind.
 *
 * Source of truth stays src/index.html. Output: artifact/content-forge.html
 * (a fragment: <style> + markup + <script>, no <head>/<body> wrapper, which
 * is what the Artifact runtime expects).
 *
 * Pure Node, no dependencies. Run: npm run build:artifact
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'src', 'index.html');
const OUT_DIR = path.join(ROOT, 'artifact');
const OUT = path.join(OUT_DIR, 'content-forge.html');

const html = fs.readFileSync(SRC, 'utf8');

// 1) Pull the <style> block and the <body> inner content.
const styleMatch = html.match(/<style>[\s\S]*?<\/style>/i);
const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
if (!styleMatch || !bodyMatch) throw new Error('Could not locate <style> or <body> in src/index.html');
const styleBlock = styleMatch[0];
let body = bodyMatch[1];

// 2) Inline every prompt file. Escaped as a JS string map; `<` is escaped so a
//    prompt containing "</script>" can never break out of the inline script.
const promptsDir = path.join(ROOT, 'prompts');
const prompts = {};
for (const file of fs.readdirSync(promptsDir)) {
  if (file.endsWith('.md')) prompts[file] = fs.readFileSync(path.join(promptsDir, file), 'utf8');
}
const promptsLiteral = JSON.stringify(prompts).replace(/</g, '\\u003c');

// 3) Replace the web/PWA bootstrap (fetch + service worker) with an offline,
//    inlined-prompt provider.
const artifactBootstrap =
`    /* Artifact build — prompts inlined, no network, no service worker. */
    const __PROMPTS = ${promptsLiteral};
    window.contentForge = {
      platform: 'browser',
      readPrompt: (filename) => Promise.resolve(__PROMPTS[filename] || ''),
      onMenuNewProject() {}, onMenuSave() {}, onMenuExport() {}, onMenuImport() {}
    };`;

const bootstrapRe = /\(function webBootstrap\(\) \{[\s\S]*?\n    \}\)\(\);/;
if (!bootstrapRe.test(body)) throw new Error('Could not find the webBootstrap block to replace');
body = body.replace(bootstrapRe, artifactBootstrap);

// 4) Emit the fragment.
const out = `${styleBlock}\n${body}\n`;
fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(OUT, out);

const promptCount = Object.keys(prompts).length;
console.log('Built ' + path.relative(ROOT, OUT));
console.log('  prompts inlined : ' + promptCount);
console.log('  size            : ' + (out.length / 1024).toFixed(0) + ' KB');
