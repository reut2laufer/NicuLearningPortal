---
name: auto-format
description: Format source code with the right formatter for each language (SwiftFormat for Swift, ruff for Python, shfmt for shell, jq for JSON, prettier for HTML/CSS/JS/TS). Use this skill whenever the user asks to format, reformat, or tidy up code, clean up code style, fix messy or inconsistent indentation/spacing, make a file readable, run the formatter (e.g. before a commit), or make code follow language style guidelines — for a file, a directory, or a whole project, even if they don't say the word "format". Also use it when the user wants auto-formatting for a new language, wants this formatting setup replicated on another machine, or asks why a file wasn't auto-formatted after an edit. Do NOT use it for formatting dates, numbers, or strings inside code (DateFormatter/NumberFormatter questions), for styling documents like Word or PDF files, for lint-warning fixes, or for refactoring — those are different tasks.
---

# auto-format

Format code with the right formatter per language. Paths below are
relative to the repo root. The dispatcher script is the primary path;
the per-language commands are what it runs under the hood.

## Primary path: the dispatcher

```bash
.claude/skills/auto-format/format.sh <file-or-directory> [...]
```

- Accepts files and/or directories (directories are walked recursively,
  skipping `node_modules/` and `.git/`).
- Picks the formatter by extension; formats in place.
- Exits non-zero if any file failed or was skipped for a missing
  formatter, and says which on stderr.

## Formatter per language

| Extension | Formatter | Command it runs |
|---|---|---|
| `.py` | ruff | `ruff format FILE` |
| `.sh` `.bash` | shfmt | `shfmt -w FILE` |
| `.json` | jq | `jq . FILE > FILE.jqtmp && mv FILE.jqtmp FILE` |
| `.html` `.css` `.js` `.jsx` `.ts` `.tsx` `.md` `.yaml` `.yml` | prettier | `prettier --write FILE` |
| `.swift` | SwiftFormat | `swiftformat FILE` (macOS only in practice — see Gotchas) |

## Prerequisites (verified on this repo's Linux container)

`ruff`, `jq`, `prettier`, and `node` are preinstalled in Claude Code
web sessions for this repo. If one is missing:

```bash
apt-get install -y shfmt jq   # shfmt is NOT preinstalled — install it first
pip3 install ruff
npm install -g prettier
```

## Before committing formatted files

This repo's pages (`*.html`) predate any formatter. Running prettier
over a whole existing page produces a large whitespace-only diff that
buries the real change. Format only the files you actually edited, and
eyeball `git diff --stat` before committing — if a file you didn't
touch shows hundreds of changed lines, drop it from the commit.

## Gotchas

- **shfmt is not preinstalled** here (ruff/jq/prettier are). One
  `apt-get install -y shfmt` fixes it; version 3.8.0 from Ubuntu works.
- **shfmt indents with tabs by default.** Use `shfmt -i 2 -w FILE` if
  the file uses 2-space indent and you want to keep it.
- **jq has no in-place flag.** Writing `jq . f > f` truncates the file
  before jq reads it. Always go through a temp file (the dispatcher
  does).
- **SwiftFormat is effectively macOS-only in this environment.** On a
  Mac it's `brew install swiftformat`. In this repo's remote container
  the Linux release binary cannot be fetched (the session proxy blocks
  GitHub downloads outside the repo's scope), so `.swift` files are
  reported as skipped with exit 1 rather than silently ignored. This
  repo has no Swift, so this only matters if that changes.
- **jq reorders nothing but normalizes everything** — key order is
  preserved, but all whitespace becomes 2-space pretty-printed. Don't
  run it on JSON where compact form is intentional (e.g. minified
  fixtures).

## Troubleshooting

- `skip (swiftformat not installed)` + exit 1 → expected on Linux; see
  Gotchas. Ignore for non-Swift work.
- `skip (no formatter for extension)` → the file type isn't covered;
  add a case to `format.sh` and a row to the table above.
- `prettier: command not found` → `npm install -g prettier` (needs
  node; preinstalled here at `/opt/node22`).
