// Each rule matches at the current position in a single left-to-right pass.
// Rules earlier in the list win over later ones, so order matters.
// `pattern` is a regex source (no capture groups); `to` is the replacement.
// Spelling alone can't tell which sound EA makes, so these are word lists.
// Entries match as word prefixes, so plurals and -ing forms are covered.
const prefixList = (words) => new RegExp("^(" + words.join("|") + ")", "i");

// EA says a short "e": Bread -> Bred
const EA_SHORT_E = prefixList([
  "head", "bread", "dread", "tread", "spread", "thread", "dead", "deaf", "death",
  "health", "wealth", "stealth", "breath", "sweat", "threat", "ready", "steady",
  "heavy", "heaven", "weather", "feather", "leather", "heather", "measure",
  "pleasure", "treasure", "meant", "meadow", "weapon", "instead", "already",
  "breakfast", "pleasant", "peasant", "jealous", "zealous",
]);

// EA says neither "ee" nor "e" (or is two separate sounds): leave alone
const EA_UNCHANGED = prefixList([
  "great", "break", "steak", "bear(?!d)", "pear", "wear", "swear", "tear", "heart",
  "hearth", "earth", "early", "earn", "learn", "heard", "search", "pearl", "yearn",
  "rehears", "ocean", "creat", "idea", "area", "react", "theat", "reali[sz]e",
  "cereal", "beaut",
]);

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
    id: "ea-short",
    title: "EA that says E is now E",
    note: "When EA makes a short “e” sound, it becomes a single E.",
    pattern: "ea",
    to: "e",
    only: EA_SHORT_E,
    examples: ["Bread", "Head", "Ready"],
  },
  {
    id: "ea",
    title: "EA that says EE is now EE",
    note: "Only when EA makes the long “ee” sound. EA in words like Great or Bear stays as it is.",
    pattern: "ea(?!u)",
    to: "ee",
    skip: EA_UNCHANGED,
    examples: ["Eat", "Dream", "Great"],
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

const STICKY = RULES.map((r) => new RegExp(r.pattern, "iy"));

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

// Single left-to-right pass: at each position the first rule that matches
// (and passes its word-list conditions) wins; otherwise the character is kept.
function translate(text) {
  let result = "";
  let i = 0;
  while (i < text.length) {
    let applied = false;
    for (let n = 0; n < RULES.length; n++) {
      const rule = RULES[n];
      STICKY[n].lastIndex = i;
      const m = STICKY[n].exec(text);
      if (!m) continue;
      if (rule.only || rule.skip) {
        const word = wordAt(text, i);
        if (rule.only && !rule.only.test(word)) continue;
        if (rule.skip && rule.skip.test(word)) continue;
      }
      result += matchCase(m[0], rule.to);
      i += m[0].length;
      applied = true;
      break;
    }
    if (!applied) result += text[i++];
  }
  return result;
}

if (typeof module !== "undefined") module.exports = { RULES, translate };
