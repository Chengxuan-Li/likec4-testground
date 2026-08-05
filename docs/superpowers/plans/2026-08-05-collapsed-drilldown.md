# Collapsed Drill-Down Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace selected groups with collapsed clickable systems and nest Building/Zones inside Feature2Building.

**Architecture:** Use model containment plus named scoped views for native drill-down. Keep Feature2Building expanded in the main view, retain the processing region, and preserve the flat data-flow semantics through fully qualified child relationships.

**Tech Stack:** Markdown and LikeC4 1.59.2.

## Global Constraints

- Modify only `C:\github\likec4-testground`.
- Do not export PNG, stage, commit, deploy, or modify adjacent repositories.

---

### Task 1: Update prompt and notation

**Files:**
- Modify: `prompts/2026-08-05-simulation-data-flow.md`
- Modify: `likec4/specification.c4`

- [x] Record collapsed systems, drill-down behavior, shared Results GeoJSON, and F2B containment.
- [x] Add a compact system element kind for collapsed cards.

### Task 2: Restructure the model

**Files:**
- Modify: `likec4/model/simulation-data-flow.c4`

- [x] Create Inputs, Definition Tables, Result Tables, GIS Tables, and Simulation Results containers.
- [x] Move Building and renamed multiple Zones inside Feature2Building.
- [x] Remove Properties GeoJSON and route both GIS tables to Results GeoJSON.
- [x] Update all relationships to fully qualified children while preserving the approved flow.

### Task 3: Build main and detail views

**Files:**
- Modify: `likec4/views/simulation-data-flow.c4`

- [x] Collapse the five requested systems in the main view.
- [x] Keep Feature2Building expanded inside Simulation Processing.
- [x] Add one named scoped detail view per collapsed system.
- [x] Remove obsolete group and rank predicates.

### Task 4: Validate without rendering

**Files:**
- Modify: `docs/superpowers/plans/2026-08-05-collapsed-drilldown.md`

- [x] Run LikeC4 format checking and full validation.
- [x] Assert containment, navigation views, output relationships, removed elements, unchanged PNG, and zero staged files/commits.
