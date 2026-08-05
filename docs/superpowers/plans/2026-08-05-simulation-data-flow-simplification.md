# Simulation Data Flow Simplification Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Simplify the simulation result flow and nest all table categories inside DuckDB Local Storage without exporting a PNG.

**Architecture:** Update the private prompt and flat logical model together, then reshape only the view grouping. Preserve the `simulationDataFlow` view ID and validate with pinned LikeC4 1.59.2.

**Tech Stack:** Markdown and LikeC4 1.59.2.

## Global Constraints

- Modify only `C:\github\likec4-testground`.
- Do not stage, commit, deploy, or modify an adjacent repository.
- Do not export or replace `review/simulation-data-flow.png`.

---

### Task 1: Revise the active prompt

**Files:**
- Modify: `prompts/2026-08-05-simulation-data-flow.md`

**Interfaces:**
- Consumes: the approved semantic and grouping replacement.
- Produces: one internally consistent request without Working Feature Collection or Baseline.

- [x] Replace the scope, numbered flow, visual direction, and acceptance criteria.
- [x] Require External Inputs and nested DuckDB storage categories.
- [x] Remove the PNG-generation acceptance requirement for this revision.

### Task 2: Simplify the logical model

**Files:**
- Modify: `likec4/model/simulation-data-flow.c4`

**Interfaces:**
- Consumes: the revised active prompt.
- Produces: direct ingestion, direct Zone5R1C result emission, and direct boundary-condition persistence.

- [x] Remove Working Feature Collection and Baseline elements.
- [x] Replace Input GeoJSON → Working Collection → Preprocessing with Input GeoJSON → Preprocessing.
- [x] Replace all Baseline relationships with Zone5R1C → ZoneResult only.
- [x] Replace Precompute Boundary Conditions → ZoneResult with Precompute Boundary Conditions → Zone Result Table.

### Task 3: Nest view groups and validate

**Files:**
- Modify: `likec4/views/simulation-data-flow.c4`

**Interfaces:**
- Consumes: the simplified model identifiers.
- Produces: External Inputs and DuckDB Local Storage with three nested table categories.

- [x] Group Input GeoJSON and Weather Input under External Inputs.
- [x] Nest Definition Tables, Result Tables, and GIS Tables under DuckDB Local Storage.
- [x] Remove ranks and includes for deleted nodes; retain valid internal ranks.
- [x] Run format checking, validation, source assertions, and Git-state checks without exporting PNG.
