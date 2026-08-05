# Sequential Processing Stage Layout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give Results Aggregation the shared processing-stage color and verify the five processing stages appear in the requested left-to-right sequence.

**Architecture:** Remove the one local style override that distinguishes Results Aggregation. Preserve the existing `TopBottom` view and ordered `rank same` constraint, whose generated snapshot already places the five connected stages at monotonically increasing x-coordinates.

**Tech Stack:** LikeC4 DSL and LikeC4 CLI 1.59.2.

## Global Constraints

- Work only in `C:\github\likec4-testground`.
- Do not change data-flow semantics, scoped detail views, icons, or table placement.
- Do not export a PNG, deploy to the Wiki, stage files, or commit.

---

### Task 1: Record and apply the styling requirement

**Files:**
- Modify: `prompts/2026-08-05-simulation-data-flow.md`
- Modify: `likec4/model/simulation-data-flow.c4`

- [x] Add the exact five-stage sequence and shared processing color to the private prompt.
- [x] Remove only the `color green` override from `resultsAggregation`, leaving it as a `stage` with its existing icon and children.

### Task 2: Verify the declarative and generated order

**Files:**
- Test: `likec4/model/simulation-data-flow.c4`
- Test: `likec4/views/simulation-data-flow.c4`
- Test: `likec4/.likec4/simulationDataFlow.likec4.snap`

- [x] Confirm the `rank same` declaration lists `preprocessing`, `feature2Building`, `precomputeBoundary`, `zone5R1C`, and `resultsAggregation` in that exact order.
- [x] Run `npx --yes likec4@1.59.2 format --check .` and `npx --yes likec4@1.59.2 validate` from `likec4`.
- [x] Confirm the generated snapshot gives those stages monotonically increasing x-coordinates and preserves a common processing row.
- [x] Confirm the PNG timestamp and size are unchanged and Git has no staged changes or commits.
