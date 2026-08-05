# Simulation Data Flow Alignment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add stable declarative alignment and three visual table groups to the existing simulation data-flow view.

**Architecture:** Keep the model flat and preserve all relationship endpoints. Implement grouping and positioning only in the view with `group` and `rank` predicates, then regenerate the native LikeC4 PNG.

**Tech Stack:** Markdown, LikeC4 1.59.2, PNG export through `npx`.

## Global Constraints

- Modify only `C:\github\likec4-testground`.
- Do not stage, commit, deploy, or modify an adjacent repository.
- Preserve every existing diagram relationship and the `simulationDataFlow` view ID.
- Use declarative alignment; do not claim or implement absolute coordinates.

---

### Task 1: Record the approved layout contract

**Files:**
- Modify: `prompts/2026-08-05-simulation-data-flow.md`

**Interfaces:**
- Consumes: the approved alignment and three-group design.
- Produces: prompt acceptance criteria covering the exact group memberships.

- [x] Add declarative alignment and group requirements to the visual direction.
- [x] Add exact group-membership checks to the acceptance criteria.

### Task 2: Add groups and rank constraints

**Files:**
- Modify: `likec4/views/simulation-data-flow.c4`

**Interfaces:**
- Consumes: existing top-level model identifiers.
- Produces: one view with three styled storage groups and explicit primary-flow ranks.

- [x] Replace the catch-all inclusion with ordered group predicates plus explicit inclusion of ungrouped elements.
- [x] Add pale neutral styling, solid borders, and low opacity to all three groups.
- [x] Align the primary flow and storage peers using valid `rank same` constraints.
- [x] Run `npx --yes likec4@1.59.2 format` and `npx --yes likec4@1.59.2 validate`.

### Task 3: Render and verify

**Files:**
- Regenerate: `review/simulation-data-flow.png`

**Interfaces:**
- Consumes: validated view `simulationDataFlow`.
- Produces: a visually inspected native approval PNG.

- [x] Export the view with `npx --yes likec4@1.59.2 export png --flat --light -f simulationDataFlow -o ..\review`.
- [x] Rename the generated image to `simulation-data-flow.png` after verifying both paths are inside `review/`.
- [x] Inspect the image and refine constraints if a group is missing, visually dominant, or breaks the primary reading order.
- [x] Re-run format checking and validation, then verify zero staged files and zero commits.
