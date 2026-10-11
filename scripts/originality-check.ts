#!/usr/bin/env tsx
/**
 * Originality check: finds wording shared between this site's copy and reference text.
 *
 *   pnpm originality                          # compare against every reference/*.txt
 *   pnpm originality -- --reference old-site  # one reference file (name without .txt)
 *   pnpm originality -- --dump > out.txt      # print the site's own strings, one per line
 *   pnpm originality -- --root <dir> --dump   # …from another checkout (e.g. an older version)
 *   pnpm originality -- --shingles-only       # skip whole-phrase matching of short lines
 *                                             # (useful when a reference file is a full dump
 *                                             # whose short lines are tech names, not labels)
 *
 * What counts as "site copy":
 * - every string literal in src/content/**\/*.ts (template literals included, ${…} skipped);
 * - frontmatter values and prose paragraphs in content/**\/*.mdx (code blocks and tags skipped);
 * - string literals in page metadata files: src/app/**\/{page,layout,opengraph-image}.tsx.
 *
 * Strings are normalised (lowercase, punctuation removed, whitespace collapsed) and split into
 * 5-word shingles, which are compared with the shingles of every reference line. Reference lines
 * shorter than five words (button labels, short headings) are matched as whole phrases instead,
 * so a retired label like "Let's Talk" is caught even though it has no 5-word shingle.
 *
 * Prints each overlap with file and line, and exits with code 1 if there is at least one.
 */
import fs from "node:fs";
import path from "node:path";

const SHINGLE = 5;

type Entry = { file: string; line: number; text: string };

function argValue(name: string): string | undefined {
  const index = process.argv.indexOf(name);
  return index === -1 ? undefined : process.argv[index + 1];
}

const root = path.resolve(argValue("--root") ?? process.cwd());

function walk(dir: string, test: (file: string) => boolean, files: string[] = []): string[] {
  if (!fs.existsSync(dir)) return files;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, test, files);
    else if (test(full)) files.push(full);
  }
  return files;
}

/** Every string literal in a TS/TSX source file, with the line it starts on. */
export function stringLiterals(source: string): { line: number; text: string }[] {
  const out: { line: number; text: string }[] = [];
  let line = 1;
  let i = 0;
  const n = source.length;

  const readQuoted = (quote: string) => {
    const startLine = line;
    let text = "";
    i++;
    while (i < n && source[i] !== quote) {
      if (source[i] === "\\") {
        text += source[i + 1] === "n" ? " " : (source[i + 1] ?? "");
        i += 2;
        continue;
      }
      if (source[i] === "\n") line++;
      text += source[i];
      i++;
    }
    i++;
    out.push({ line: startLine, text });
  };

  const readTemplate = () => {
    let startLine = line;
    let text = "";
    i++;
    while (i < n && source[i] !== "`") {
      if (source[i] === "\\") {
        text += source[i + 2] ? source[i + 1] : "";
        i += 2;
        continue;
      }
      if (source[i] === "$" && source[i + 1] === "{") {
        // Close the current literal part and skip the expression (it may nest braces/strings).
        out.push({ line: startLine, text });
        text = "";
        let depth = 1;
        i += 2;
        while (i < n && depth > 0) {
          const ch = source[i];
          if (ch === "\n") line++;
          if (ch === "{") depth++;
          else if (ch === "}") depth--;
          else if (ch === '"' || ch === "'") {
            const quote = ch;
            i++;
            while (i < n && source[i] !== quote) i += source[i] === "\\" ? 2 : 1;
          }
          i++;
        }
        startLine = line;
        continue;
      }
      if (source[i] === "\n") line++;
      text += source[i];
      i++;
    }
    i++;
    out.push({ line: startLine, text });
  };

  while (i < n) {
    const ch = source[i];
    const next = source[i + 1];
    if (ch === "\n") {
      line++;
      i++;
    } else if (ch === "/" && next === "/") {
      while (i < n && source[i] !== "\n") i++;
    } else if (ch === "/" && next === "*") {
      i += 2;
      while (i < n && !(source[i] === "*" && source[i + 1] === "/")) {
        if (source[i] === "\n") line++;
        i++;
      }
      i += 2;
    } else if (ch === '"' || ch === "'") {
      readQuoted(ch);
    } else if (ch === "`") {
      readTemplate();
    } else {
      i++;
    }
  }
  return out;
}

/** Frontmatter values and prose paragraphs of an MDX file. */
export function mdxStrings(source: string): { line: number; text: string }[] {
  const out: { line: number; text: string }[] = [];
  const lines = source.split(/\r?\n/);
  let index = 0;
  if (lines[0]?.trim() === "---") {
    index = 1;
    while (index < lines.length && lines[index]!.trim() !== "---") {
      const value = lines[index]!.replace(/^\s*(-\s*)?([\w-]+:\s*)?/, "");
      if (value && !value.startsWith("#")) out.push({ line: index + 1, text: value });
      index++;
    }
    index++;
  }
  let fence = false;
  let paragraph: string[] = [];
  let start = 0;
  const flush = () => {
    if (paragraph.length) out.push({ line: start, text: paragraph.join(" ") });
    paragraph = [];
  };
  for (; index < lines.length; index++) {
    const raw = lines[index]!;
    if (/^\s*```/.test(raw)) {
      fence = !fence;
      flush();
      continue;
    }
    if (fence) continue;
    const text = raw.replace(/<[^>]+>/g, " ").replace(/^\s*(#{1,6}|[-*]|\d+\.|\|)\s*/, "");
    if (!text.trim()) {
      flush();
      continue;
    }
    if (!paragraph.length) start = index + 1;
    paragraph.push(text);
  }
  flush();
  return out;
}

export function normalise(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9\s]+/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

/** Every piece of site copy the check covers. */
export function collectSiteCopy(base = root): Entry[] {
  const entries: Entry[] = [];
  const rel = (file: string) => path.relative(base, file).replaceAll("\\", "/");
  const tsFiles = walk(path.join(base, "src", "content"), (file) => /\.ts$/.test(file));
  const pageFiles = walk(path.join(base, "src", "app"), (file) =>
    /[\\/](page|layout|opengraph-image)\.tsx$/.test(file),
  );
  for (const file of [...tsFiles, ...pageFiles]) {
    for (const { line, text } of stringLiterals(fs.readFileSync(file, "utf8"))) {
      // Import paths, class lists and identifiers are not copy.
      if (/^[@./]/.test(text) || !/\s/.test(text.trim())) continue;
      entries.push({ file: rel(file), line, text });
    }
  }
  for (const file of walk(path.join(base, "content"), (f) => /\.mdx?$/.test(f))) {
    for (const { line, text } of mdxStrings(fs.readFileSync(file, "utf8"))) {
      entries.push({ file: rel(file), line, text });
    }
  }
  return entries;
}

function main() {
  const entries = collectSiteCopy();

  if (process.argv.includes("--dump")) {
    for (const entry of entries) console.log(entry.text.replace(/\s+/g, " ").trim());
    return;
  }

  const referenceDir = path.join(process.cwd(), "reference");
  const only = argValue("--reference");
  const shinglesOnly = process.argv.includes("--shingles-only");
  const references = walk(referenceDir, (file) => file.endsWith(".txt")).filter(
    (file) => !only || path.basename(file, ".txt") === only,
  );
  if (references.length === 0) {
    console.log("No reference/*.txt files found — nothing to compare. See reference/README.md.");
    return;
  }

  // shingle → reference files it appears in; short phrases kept separately.
  const shingles = new Map<string, Set<string>>();
  const phrases = new Map<string, Set<string>>();
  for (const file of references) {
    const name = path.basename(file);
    for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
      const words = normalise(line);
      if (words.length === 0) continue;
      if (words.length < SHINGLE) {
        if (words.length < 2 || shinglesOnly) continue;
        const phrase = words.join(" ");
        phrases.set(phrase, (phrases.get(phrase) ?? new Set()).add(name));
        continue;
      }
      for (let i = 0; i + SHINGLE <= words.length; i++) {
        const key = words.slice(i, i + SHINGLE).join(" ");
        shingles.set(key, (shingles.get(key) ?? new Set()).add(name));
      }
    }
  }

  let overlaps = 0;
  for (const entry of entries) {
    const words = normalise(entry.text);
    const joined = ` ${words.join(" ")} `;
    const found = new Map<string, Set<string>>();
    for (let i = 0; i + SHINGLE <= words.length; i++) {
      const key = words.slice(i, i + SHINGLE).join(" ");
      const sources = shingles.get(key);
      if (sources) found.set(key, sources);
    }
    for (const [phrase, sources] of phrases) {
      if (joined.includes(` ${phrase} `)) found.set(phrase, sources);
    }
    for (const [match, sources] of found) {
      overlaps++;
      console.log(`${entry.file}:${entry.line}  "${match}"  ← ${[...sources].join(", ")}`);
    }
  }

  const scanned = `${entries.length} strings checked against ${references.length} reference file(s)`;
  if (overlaps > 0) {
    console.error(`\n${overlaps} overlap(s) found (${scanned}).`);
    process.exit(1);
  }
  console.log(`No overlaps (${scanned}).`);
}

// Run only when executed directly, so the helpers can be imported elsewhere.
if (/originality-check.ts$/.test(process.argv[1] ?? "")) main();
