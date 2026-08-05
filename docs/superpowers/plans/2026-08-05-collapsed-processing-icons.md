# Collapsed Processing and Icon Refinement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Collapse F2B and Results Aggregation into the processing flow, apply the requested shapes, and add restrained bundled GCP icons.

**Architecture:** Keep nested concepts in the model and expose them in scoped detail views while the main view includes collapsed parent cards. Model the direct semantic relationship to Building and let LikeC4 project it to the collapsed F2B boundary.

**Tech Stack:** LikeC4 DSL and LikeC4 CLI 1.59.2.

## Global Constraints

- Work only in `C:\github\likec4-testground`.
- Do not write to `..\RCEnergySimulator` or deploy to the Wiki.
- Do not stage, commit, push, or export a PNG.
- Preserve private authoring information in this repository.

---

### Task 1: Update the private prompt

**Files:**
- Modify: `prompts/2026-08-05-simulation-data-flow.md`

- [x] Record the collapsed F2B detail view, direct Preprocessing-to-Building flow, storage/person shapes, Results Aggregation placement, and metaphorical GCP icons.
- [x] Update acceptance criteria to match the revised main view.

### Task 2: Refine the model and views

**Files:**
- Modify: `likec4/model/simulation-data-flow.c4`
- Modify: `likec4/views/simulation-data-flow.c4`

- [x] Apply `shape person` to Inputs and `shape storage` to all three table-group containers.
- [x] Rename Simulation Results to the Results Aggregation stage and update all references.
- [x] Change Preprocessing's F2B relationship to target nested Building directly.
- [x] Apply only verified `gcp:` bundled icons to processing, aggregation, and GeoJSON output elements.
- [x] Collapse F2B and Results Aggregation inside Simulation Processing and add or rename their scoped detail views.

### Task 3: Verify without rendering

**Files:**
- Test: `likec4/model/simulation-data-flow.c4`
- Test: `likec4/views/simulation-data-flow.c4`

- [x] Run `npx --yes likec4@1.59.2 format --check .` from `likec4`.
- [x] Run `npx --yes likec4@1.59.2 validate` from `likec4`.
- [x] Inspect source assertions and Git state; confirm the preview-generated current snapshot validates, the stale backup remains shelved, and there is no PNG change, staging, or commit.
