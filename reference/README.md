# Reference text for the originality check

`pnpm originality` compares every string of this site's copy with the text files in this
folder and fails if they share wording. See `scripts/originality-check.ts` for exactly what it
scans and how matches are found.

## Files

| File           | What goes in it                                                          | Committed?       |
| -------------- | ------------------------------------------------------------------------ | ---------------- |
| `old-site.txt` | Headings and button labels retired in the Skylamp rebrand, one per line. | Yes              |
| `arunesh.txt`  | The visible text of arunesh.tech — paste it in yourself.                 | No (git-ignored) |
| `vibrona.txt`  | The visible text of vibronatech.com — paste it in yourself.              | No (git-ignored) |

Any other `*.txt` file you add here is picked up too, and is git-ignored.

## Adding the reference sites

1. Open each page of the reference site in a browser.
2. Select all visible text (Ctrl/Cmd + A), copy, and paste it into `arunesh.txt` or
   `vibrona.txt`. Keep one sentence, heading or label per line where you can; blank lines are fine.
3. Run `pnpm originality`.

## Reading the output

Each overlap prints as:

```
src/content/home.ts:42  "a few shared words here"  ← vibrona.txt
```

- Five consecutive matching words (after lower-casing and removing punctuation) count as an
  overlap.
- Reference lines shorter than five words — short labels such as "Let's Talk" — are matched as
  whole phrases instead.
- The command exits with code 1 while any overlap remains, so it can gate CI.

Run a single file with `pnpm originality -- --reference vibrona`.
