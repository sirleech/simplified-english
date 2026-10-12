// Each rule matches at the current position in a single left-to-right pass.
// Rules earlier in the list win over later ones, so order matters.
// `pattern` is a regex source (no capture groups); `to` is the replacement.
// Words (matched as prefixes, so plurals and -ing forms are covered) where EA
// is not the long "ee" sound. Spelling alone can't tell, so this is a word list.
const EA_NOT_EE = new RegExp(
  "^(" +
    [
      "head", "bread", "dread", "tread", "spread", "thread", "dead", "deaf", "death",
      "health", "wealth", "stealth", "breath", "sweat", "threat", "ready", "steady",
      "heavy", "heaven", "weather", "feather", "leather", "heather", "measure",
      "pleasure", "treasure", "meant", "meadow", "weapon", "instead", "already",
      "great", "break", "steak", "bear", "pear", "wear", "swear", "tear", "heart",
      "hearth", "earth", "early", "earn", "learn", "heard", "search", "pearl",
      "yearn", "rehears", "ocean", "create", "creat", "idea", "area", "react",
      "theat", "reali[sz]e", "cereal", "lineage", "beaut",
    ].join("|") +
    ")",
  "i"
);

const RULES = [
  {
    id: "qu",
    title: "Q already says KW — drop the U",
    note: "Q makes the “KW” sound on its own, so no U is needed after it.",
    pattern: "qu",
    to: "q",
    examples: ["Quit", "Quick"],
  },
  {
    id: "ea",
    title: "EA that says EE is now EE",
    note: "Only when EA makes the long “ee” sound. EA in words like Bread, Great or Bear stays as it is.",
    pattern: "ea(?!u)",
    to: "ee",
    skip: EA_NOT_EE,
    examples: ["Eat", "Dream", "Bread"],
  },
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
  const upper = (ch) => ch !== ch.toLowerCase();
  if (source.length > 1 && [...source].every(upper)) return out.toUpperCase();
  return upper(source[0]) ? out[0].toUpperCase() + out.slice(1) : out;
}

function wordAt(text, offset) {
  const isLetter = (ch) => /[A-Za-z'’]/.test(ch);
  let start = offset;
  let end = offset;
  while (start > 0 && isLetter(text[start - 1])) start--;
  while (end < text.length && isLetter(text[end])) end++;
  return text.slice(start, end);
}

function translate(text) {
  return text.replace(RULES_RE, (...args) => {
    const match = args[0];
    const offset = args[1 + RULES.length];
    const rule = RULES[args.slice(1, 1 + RULES.length).findIndex((g) => g !== undefined)];
    if (rule.skip && rule.skip.test(wordAt(text, offset))) return match;
    return matchCase(match, rule.to);
  });
}

if (typeof module !== "undefined") module.exports = { RULES, translate };
