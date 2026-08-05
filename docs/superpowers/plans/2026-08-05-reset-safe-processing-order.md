# Reset-Safe Processing Order Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the five simulation-processing stages retain their semantic order after the manual layout is removed.

**Architecture:** Use a global left-to-right automatic layout and let the existing directed processing chain assign successive ranks. Remove the same-rank constraint that aligns stages but permits Graphviz to reorder them.

**Tech Stack:** LikeC4 DSL, LikeC4 CLI 1.59.2, and the localhost LikeC4 preview.

## Global Constraints

- Work only in `C:\github\likec4-testground`.
- Do not change model semantics, element membership, icons, colors, shapes, scoped views, or relationship labels.
- Do not create a new manual snapshot, export a PNG, deploy to the Wiki, stage files, or commit.

---

### Task 1: Update the layout contract and view

**Files:**
- Modify: `prompts/2026-08-05-simulation-data-flow.md`
- Modify: `likec4/views/simulation-data-flow.c4`

- [x] Replace the prompt's same-rank processing requirement with the reset-safe left-to-right semantic sequence.
- [x] Remove the five-stage `rank same` block from `simulationDataFlow`.
- [x] Change only the main view from `autoLayout TopBottom 80 55` to `autoLayout LeftRight 80 55`.

### Task 2: Verify automatic ordering

**Files:**
- Test: `likec4/views/simulation-data-flow.c4`
- Test: `likec4/model/simulation-data-flow.c4`

- [x] Confirm `likec4/.likec4/simulationDataFlow.likec4.snap` is absent.
- [x] Run `npx --yes likec4@1.59.2 format --check .` and `npx --yes likec4@1.59.2 validate` from `likec4`.
- [x] Inspect the live automatic view and verify monotonically increasing x-coordinates for Preprocessing, Feature2Building, Precompute Boundary Conditions, Zone5R1C Simulation, and Results Aggregation.
- [x] Confirm no active manual snapshot was created, the PNG is unchanged, and Git has no staged changes or commits.
