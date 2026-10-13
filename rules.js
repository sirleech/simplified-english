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

// EA says a long "a": Bear -> Bare, Great -> Grate (the new silent E follows the consonant)
const EA_LONG_A = prefixList(["great", "break", "steak", "bear(?!d)", "pear(?!l)", "wear(?!y)", "swear"]);

// EA says neither "ee" nor "e" (or is two separate sounds): leave alone
const EA_UNCHANGED = prefixList([
  "tear", "heart",
  "hearth", "earth", "early", "earn", "learn", "heard", "search", "pearl", "yearn",
  "rehears", "ocean", "creat", "idea", "area", "react", "theat", "reali[sz]e",
  "cereal", "beaut",
]);

// IE says a long "i" (the Y sound): Lie -> Ly. Whole words only, so field/chief/friend are untouched.
const IE_SAYS_Y = new RegExp(
  "^(?:" +
    [
      "(?:l|d|p|t|v)ie[sd]?", "(?:cr|tr|fr|dr|sp|fl)ie[sd]", "[a-z]*pl(?:ie[sd])",
      "[a-z]*fi(?:ed|es)", "reli?e[sd]", "denie[sd]", "magpie", "necktie", "belie[sd]?",
    ].join("|") +
    ")$",
  "i"
);

// "I say Y" words. The I-C-E pattern (fire, time, like) is matched on the whole
// word: optional common prefix + consonants + I + one consonant + E + optional ending.
// Short-I look-alikes (give, live, river, engine...) are excluded.
const LONG_I_E = new RegExp(
  "^(?:a|be|con|com|de|di|dis|en|ex|in|re|pro|sur|ar|ap|ad|un|out|up|on|al|im)?" +
    "(?:qu|[bcdfghjklmnpqrstvwxz])*i[bcdfghjklmnpqrstvwxz]e(?:s|d|r|st|ly)?$",
  "i"
);
const LONG_IVE = "(?:five|hive|dive|drive|alive|arrive|strive|survive|thrive|revive|deprive)(?:s|d|r)?";
const NOT_LONG_I = new RegExp(
  "^(?:(?!" + LONG_IVE + "$)[a-z]*ive(?:s|d|r|ly)?|river|liver|shiver|quiver|deliver|giver|engine|promise|regime)",
  "i"
);
// I says Y before ND / LD: Find -> Fynd
const I_ND_LD = new RegExp(
  "^(?:behind|find|kind|mankind|unkind|mind|remind|bind|blind|grind|rind|wild|mild|child)(?:s|ed|er|ers|ing|ness|ly|ful)?$",
  "i"
);

// Words where a silent H / S / B is dropped (matched as word prefixes)
const SILENT_H_WORDS = prefixList(["hour", "honest", "honor", "honour", "heir"]);
const SILENT_S_WORDS = prefixList(["island", "aisle", "isle"]);
const SILENT_B_WORDS = prefixList(["debt", "doubt", "subtle"]);

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
    id: "ea-long-a",
    title: "EA that says A is now A",
    note: "When EA makes the long “a” sound, it becomes A, with a silent E after the next consonant.",
    pattern: "ea[bcdfghjklmnpqrstvwxz]",
    to: (m, next) => "a" + m[2] + (next && /[aeiouy]/i.test(next) ? "" : "e"),
    only: EA_LONG_A,
    examples: ["Bear", "Great", "Break"],
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
    id: "silent-k",
    title: "Silent K is removed",
    note: "A K before N at the start of a word makes no sound, so it goes.",
    pattern: "(?<![a-z])kn",
    to: "n",
    examples: ["Know", "Knife"],
  },
  {
    id: "silent-w",
    title: "Silent W is removed",
    note: "A W before R at the start of a word makes no sound, so it goes.",
    pattern: "(?<![a-z])wr",
    to: "r",
    examples: ["Write", "Wrong"],
  },
  {
    id: "silent-g",
    title: "Silent G is removed",
    note: "A G before N, at the start or end of a word, makes no sound.",
    pattern: "(?<![a-z])gn|gn(?![a-z])",
    to: "n",
    examples: ["Gnat", "Sign"],
  },
  {
    id: "silent-p",
    title: "Silent P is removed",
    note: "A P before S or N at the start of a word makes no sound.",
    pattern: "(?<![a-z])p[sn]",
    to: (m) => m[1],
    examples: ["Psalm", "Pneumonia"],
  },
  {
    id: "silent-b",
    title: "Silent B (and N) after M is removed",
    note: "B or N after M at the end of a word makes no sound.",
    pattern: "m[bn](?=s?(?![a-z]))",
    to: (m) => m[0],
    examples: ["Lamb", "Climb", "Autumn"],
  },
  {
    id: "silent-bt",
    title: "Silent B before T is removed",
    note: "B before T in a few words is never said.",
    pattern: "bt",
    to: "t",
    only: SILENT_B_WORDS,
    examples: ["Debt", "Doubt"],
  },
  {
    id: "ight",
    title: "IGHT is spelled ITE",
    note: "GH is silent and the I says its own name, so it gets a silent E, like Night → Nite.",
    pattern: "ight",
    to: (m, next) => "it" + (next && /[aeiouy]/i.test(next) ? "" : "e"),
    examples: ["Night", "Light", "Bright"],
  },
  {
    id: "ie",
    title: "IE that says Y is now Y",
    note: "When IE makes the long “i” sound, it is written Y. IE in Field or Chief stays as it is.",
    pattern: "ie",
    to: "y",
    only: IE_SAYS_Y,
    examples: ["Lie", "Pie", "Tried", "Field"],
  },
  {
    id: "long-i",
    title: "I that says Y is now Y",
    note: "When I makes the long “eye” sound with a silent E after it, the I becomes Y and the silent E goes.",
    pattern: "i(?=[bcdfghjklmnpqrstvwxz]e(?:s|d|r|st|ly)?(?![a-z]))",
    to: "y",
    only: LONG_I_E,
    skip: NOT_LONG_I,
    examples: ["Fire", "Time", "Like"],
  },
  {
    id: "long-i-e",
    hidden: true,
    pattern: "(?<=i[bcdfghjklmnpqrstvwxz])e(?=(?:s|d|r|st|ly)?(?![a-z]))",
    to: "",
    only: LONG_I_E,
    skip: NOT_LONG_I,
  },
  {
    id: "long-i-nd",
    title: "I before ND or LD is now Y",
    note: "In Find, Kind, Child and Wild the I says its own name, so it becomes Y.",
    pattern: "i(?=nd|ld)",
    to: "y",
    only: I_ND_LD,
    examples: ["Find", "Kind", "Child"],
  },
  {
    id: "silent-gh",
    title: "Silent GH is removed",
    note: "GH before T (as in Eight or Thought), and IGH at the end of a word, makes no sound.",
    pattern: "(?<=[a-z])gh(?=t)|igh(?![a-z])",
    to: (m) => (m.length === 2 ? "" : "i"),
    examples: ["Eight", "Thought", "High"],
  },
  {
    id: "silent-l",
    title: "Silent L is removed",
    note: "L in ALK, OLK and OULD makes no sound.",
    pattern: "(?<=[ao])l(?=k)|(?<=ou)l(?=d)",
    to: "",
    examples: ["Walk", "Folk", "Would"],
  },
  {
    id: "silent-h-start",
    title: "Silent H is removed (WH, RH, GH)",
    note: "H after W, R or G at the start of a word makes no sound. WHO and WHOLE are left alone.",
    pattern: "(?<![a-z])(?:wh(?!o)|rh|gh)",
    to: (m) => m[0],
    examples: ["What", "Rhyme", "Ghost"],
  },
  {
    id: "silent-h-word",
    title: "Silent H is removed (Hour, Honest)",
    note: "H at the start of a few words is never said.",
    pattern: "h[oe]",
    to: (m) => m[1],
    only: SILENT_H_WORDS,
    examples: ["Hour", "Honest", "Heir"],
  },
  {
    id: "silent-t",
    title: "Silent T is removed",
    note: "T in STLE, STEN and FTEN at the end of a word makes no sound.",
    pattern: "(?<=s)t(?=(?:le|en)(?![a-z]))|(?<=f)t(?=en(?![a-z]))",
    to: "",
    examples: ["Castle", "Listen", "Often"],
  },
  {
    id: "silent-s",
    title: "Silent S is removed",
    note: "S in Island and Aisle makes no sound.",
    pattern: "s(?=l)",
    to: "",
    only: SILENT_S_WORDS,
    examples: ["Island", "Aisle"],
  },
  {
    id: "silent-c",
    title: "Silent C is removed",
    note: "C after S and before E, I or Y makes no sound.",
    pattern: "sc(?=[eiy])",
    to: "s",
    examples: ["Science", "Scene"],
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
  if (!out) return "";
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
      const to = typeof rule.to === "function" ? rule.to(m[0], text[i + m[0].length]) : rule.to;
      result += matchCase(m[0], to);
      i += m[0].length;
      applied = true;
      break;
    }
    if (!applied) result += text[i++];
  }
  return result;
}

if (typeof module !== "undefined") module.exports = { RULES, translate };
