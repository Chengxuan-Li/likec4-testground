# Live LikeC4 GitHub Pages Implementation Plan

> **For agentic workers:** Execute inline in the current workspace. Do not stage, commit,
> push, or generate static diagram images.

**Goal:** Automatically deploy the interactive LikeC4 application to GitHub Pages.

**Architecture:** Build `likec4/` with LikeC4 1.59.2 using the repository Pages base path
and hash-history navigation, then upload and deploy `dist/` with official GitHub actions.

**Tech Stack:** LikeC4 1.59.2, Node.js 22, GitHub Actions, GitHub Pages.

## Global constraints

- Work only in `C:\github\likec4-testground`.
- Preserve all current models, views, icons, and `.likec4.snap` layouts.
- Never export or publish static diagram images.
- Do not stage, commit, or push.

## Task 1: Add the Pages workflow

**Files:**

- Create `.github/workflows/deploy-likec4-pages.yml`.

- [x] Trigger on pushes to `main` and `workflow_dispatch`.
- [x] Grant `contents: read`, `pages: write`, and `id-token: write`.
- [x] Set Pages deployment concurrency and the `github-pages` environment.
- [x] Check out source and configure Node.js 22 and GitHub Pages.
- [x] Run LikeC4 format and validation checks.
- [x] Build `likec4/` into `dist/` with base `/likec4-testground/` and hash history.
- [x] Upload `dist/` and deploy it with official Pages actions.

## Task 2: Document and ignore local build output

**Files:**

- Modify `.gitignore`.
- Modify `README.md`.

- [x] Ignore root `dist/` output.
- [x] Document the local production build and preview commands.
- [x] Document the live Pages URL and repository Pages-source setting.
- [x] State explicitly that deployment is interactive and uses no image exports.

## Task 3: Verify production behavior

- [x] Run LikeC4 format and validation checks locally.
- [x] Build with `/likec4-testground/` and hash history.
- [x] Assert `dist/index.html` exists and references base-prefixed assets.
- [x] Confirm the build contains no generated PNG or PDF diagram exports, and no standalone
  diagram SVG exports (the application favicon SVG is expected).
- [x] Check workflow syntax and `git diff --check`.
- [x] Confirm nothing is staged or committed.
