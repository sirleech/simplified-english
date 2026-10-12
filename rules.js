// Each rule matches at the current position in a single left-to-right pass.
// Rules earlier in the list win over later ones, so order matters.
// `pattern` is a regex source (no capture groups); `to` is the replacement.
const RULES = [
  {
    id: "ch",
    title: "Ch is now spelled C",
    note: "C takes over the “Ch” sound, so Chat is spelled Cat.",
    pattern: "ch",
    to: "c",
    examples: ["Chat", "Church"],
  },
  {
    id: "ck",
    title: "No more CK — just K",
    note: "CK is replaced by K alone.",
    pattern: "ck",
    to: "k",
    examples: ["Track", "Chicken"],
  },
  {
    id: "soft-c",
    title: "C is no longer an S sound",
    note: "A C that sounds like S (before E, I or Y) is now written S.",
    pattern: "c(?=[eiy])",
    to: "s",
    examples: ["Cell", "City"],
  },
  {
    id: "hard-c",
    title: "C is no longer a K sound",
    note: "A C that sounds like K is now written K.",
    pattern: "c",
    to: "k",
    examples: ["Cat", "Cow"],
  },
  {
    id: "ss",
    title: "No more SS — just S",
    note: "Double S is reduced to a single S.",
    pattern: "ss",
    to: "s",
    examples: ["Hissing", "Mess"],
  },
];

const RULES_RE = new RegExp(RULES.map((r) => `(${r.pattern})`).join("|"), "gi");

function matchCase(source, out) {
  return source[0] === source[0].toUpperCase() && source[0] !== source[0].toLowerCase()
    ? out.toUpperCase()
    : out;
}

function translate(text) {
  return text.replace(RULES_RE, (...args) => {
    const match = args[0];
    const rule = RULES[args.slice(1, 1 + RULES.length).findIndex((g) => g !== undefined)];
    return matchCase(match, rule.to);
  });
}

if (typeof module !== "undefined") module.exports = { RULES, translate };
