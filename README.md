# Simplified English

Paste regular US/UK English into the left box and get Simplified English on the right, with character counts and percent reduction.

**Live app: https://sirleech.github.io/simplified-english/**

## Run locally

It's a static page with no build step. Open `index.html`, or run the no-cache dev server:

```bash
python3 serve.py 8141   # http://localhost:8141
```

## How it works

Rules live in `rules.js` and are applied in one left-to-right pass. List order is match priority, and some rules use word lists (for example, which words have EA saying "e") because spelling alone can't tell the sound. The page lists every rule with before/after examples; new rules appear automatically.

After adding or changing rules, refresh the list below:

```bash
node scripts/update-readme.js
```

## Rules

<!-- RULES:START -->

### 1. C is no longer a K sound

A C that sounds like K is now written K.

| Before | After |
| --- | --- |
| Cat | Kat |
| Cow | Kow |

### 2. C is no longer an S sound

A C that sounds like S (before E, I or Y) is now written S.

| Before | After |
| --- | --- |
| Cell | Sell |
| City | Sity |

### 3. Ch is now spelled C

C takes over the “Ch” sound, so Chat is spelled Cat.

| Before | After |
| --- | --- |
| Chat | Cat |
| Church | Curc |

### 4. No more SS — just S

Double S is reduced to a single S.

| Before | After |
| --- | --- |
| Hissing | Hising |
| Mess | Mes |

### 5. No more CK — just K

CK is replaced by K alone.

| Before | After |
| --- | --- |
| Track | Trak |
| Chicken | Ciken |

### 6. Q already says KW — drop the U

Q makes the “KW” sound on its own, so no U is needed after it.

| Before | After |
| --- | --- |
| Quit | Qit |
| Quick | Qik |

### 7. EA that says EE is now EE

Only when EA makes the long “ee” sound. EA in words like Great or Bear stays as it is.

| Before | After |
| --- | --- |
| Eat | Eet |
| Dream | Dreem |
| Great | Grate |

### 8. EA that says E is now E

When EA makes a short “e” sound, it becomes a single E.

| Before | After |
| --- | --- |
| Bread | Bred |
| Head | Hed |
| Ready | Redy |

### 9. EA that says A is now A

When EA makes the long “a” sound, it becomes A, with a silent E after the next consonant.

| Before | After |
| --- | --- |
| Bear | Bare |
| Great | Grate |
| Break | Brake |

### 10. Silent K is removed

A K before N at the start of a word makes no sound, so it goes.

| Before | After |
| --- | --- |
| Know | Now |
| Knife | Nyf |

### 11. Silent W is removed

A W before R at the start of a word makes no sound, so it goes.

| Before | After |
| --- | --- |
| Write | Ryt |
| Wrong | Rong |

### 12. Silent G is removed

A G before N, at the start or end of a word, makes no sound.

| Before | After |
| --- | --- |
| Gnat | Nat |
| Sign | Sin |

### 13. Silent P is removed

A P before S or N at the start of a word makes no sound.

| Before | After |
| --- | --- |
| Psalm | Salm |
| Pneumonia | Neumonia |

### 14. Silent B (and N) after M is removed

B or N after M at the end of a word makes no sound.

| Before | After |
| --- | --- |
| Lamb | Lam |
| Climb | Klim |
| Autumn | Autum |

### 15. Silent B before T is removed

B before T in a few words is never said.

| Before | After |
| --- | --- |
| Debt | Det |
| Doubt | Dout |

### 16. IGHT is spelled ITE

GH is silent and the I says its own name, so it gets a silent E, like Night → Nite.

| Before | After |
| --- | --- |
| Night | Nite |
| Light | Lite |
| Bright | Brite |

### 17. IE that says Y is now Y

When IE makes the long “i” sound, it is written Y. IE in Field or Chief stays as it is.

| Before | After |
| --- | --- |
| Lie | Ly |
| Pie | Py |
| Tried | Tryd |
| Field | Field |

### 18. I that says Y is now Y

When I makes the long “eye” sound with a silent E after it, the I becomes Y and the silent E goes.

| Before | After |
| --- | --- |
| Fire | Fyr |
| Time | Tym |
| Like | Lyk |

### 19. I before ND or LD is now Y

In Find, Kind, Child and Wild the I says its own name, so it becomes Y.

| Before | After |
| --- | --- |
| Find | Fynd |
| Kind | Kynd |
| Child | Cyld |

### 20. Silent GH is removed

GH before T (as in Eight or Thought), and IGH at the end of a word, makes no sound.

| Before | After |
| --- | --- |
| Eight | Eite |
| Thought | Thout |
| High | Hi |

### 21. Silent L is removed

L in ALK, OLK and OULD makes no sound.

| Before | After |
| --- | --- |
| Walk | Wak |
| Folk | Fok |
| Would | Woud |

### 22. Silent H is removed (WH, RH, GH)

H after W, R or G at the start of a word makes no sound. WHO and WHOLE are left alone.

| Before | After |
| --- | --- |
| What | Wat |
| Rhyme | Ryme |
| Ghost | Gost |

### 23. Silent H is removed (Hour, Honest)

H at the start of a few words is never said.

| Before | After |
| --- | --- |
| Hour | Our |
| Honest | Onest |
| Heir | Eir |

### 24. Silent T is removed

T in STLE, STEN and FTEN at the end of a word makes no sound.

| Before | After |
| --- | --- |
| Castle | Kasle |
| Listen | Lisen |
| Often | Ofen |

### 25. Silent S is removed

S in Island and Aisle makes no sound.

| Before | After |
| --- | --- |
| Island | Iland |
| Aisle | Aile |

### 26. Silent C is removed

C after S and before E, I or Y makes no sound.

| Before | After |
| --- | --- |
| Science | Siense |
| Scene | Sene |

<!-- RULES:END -->
