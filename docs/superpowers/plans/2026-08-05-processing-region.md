# Processing Region Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Remove the DuckDB wrapper, render Zone as multiple instances, and align four processing stages inside one region.

**Architecture:** Keep the logical model flat except for Zone's visual multiplicity style. Use view-level groups and a same-rank constraint for presentation, preserving all relationships and the `simulationDataFlow` view ID.

**Tech Stack:** Markdown and LikeC4 1.59.2.

## Global Constraints

- Modify only `C:\github\likec4-testground`.
- Do not export PNG, stage, commit, deploy, or modify an adjacent repository.

---

### Task 1: Update the request contract

**Files:**
- Modify: `prompts/2026-08-05-simulation-data-flow.md`

- [x] Remove DuckDB Local Storage requirements while retaining three table-category groups.
- [x] Require Zone multiplicity and the four-member Simulation Processing region.

### Task 2: Update model and view

**Files:**
- Modify: `likec4/model/simulation-data-flow.c4`
- Modify: `likec4/views/simulation-data-flow.c4`

- [x] Set `multiple true` on Zone only.
- [x] Remove the DuckDB wrapper without changing table-group memberships.
- [x] Group the four named processing stages and align them on one rank.

### Task 3: Verify source

**Files:**
- Modify: `docs/superpowers/plans/2026-08-05-processing-region.md`

- [x] Run LikeC4 format checking and validation.
- [x] Assert exact group membership, Zone multiplicity, DuckDB absence, no PNG update, and zero staged files or commits.
