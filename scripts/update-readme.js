// Regenerates the rules section of README.md from rules.js.
// Usage: node scripts/update-readme.js
const fs = require("fs");
const path = require("path");
const { RULES, translate } = require("../rules.js");

const ORDER = [
  "hard-c", "soft-c", "ch", "ss", "ck", "qu", "ea", "ea-short", "ea-long-a",
  "silent-k", "silent-w", "silent-g", "silent-p", "silent-b", "silent-bt", "ight",
  "ie", "long-i", "long-i-nd", "silent-gh", "silent-l", "silent-h-start",
  "silent-h-word", "silent-t", "silent-s", "silent-c",
];
const shown = [
  ...ORDER.map((id) => RULES.find((r) => r.id === id)).filter(Boolean),
  ...RULES.filter((r) => !r.hidden && !ORDER.includes(r.id)),
];

const body = shown
  .map((r, i) => {
    const rows = r.examples.map((e) => `| ${e} | ${translate(e)} |`).join("\n");
    return `### ${i + 1}. ${r.title}\n\n${r.note}\n\n| Before | After |\n| --- | --- |\n${rows}\n`;
  })
  .join("\n");

const file = path.join(__dirname, "..", "README.md");
const start = "<!-- RULES:START -->";
const end = "<!-- RULES:END -->";
const readme = fs.readFileSync(file, "utf8");
const a = readme.indexOf(start);
const b = readme.indexOf(end);
const next = readme.slice(0, a + start.length) + "\n\n" + body + "\n" + readme.slice(b);
fs.writeFileSync(file, next);
console.log(`Wrote ${shown.length} rules to README.md`);
