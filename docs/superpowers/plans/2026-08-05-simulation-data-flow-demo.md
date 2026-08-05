# Simulation Data Flow Demo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Create a fresh LikeC4 demo that explains the key simulation stages and the data flowing between preprocessing, domain objects, simulation, result aggregation, persistence, and GeoJSON export.

**Architecture:** Keep private request intent in `prompts/` and executable LikeC4 source in `likec4/`. Use one selective conceptual model and one portrait-oriented view, then export a native LikeC4 PNG to `review/` so the static preview and live view share one source.

**Tech Stack:** Markdown, LikeC4 1.59.2, PNG export through `npx`.

## Global Constraints

- Modify files only inside `C:\github\likec4-testground`.
- Treat `..\RCEnergySimulator` and every other repository as read-only evidence; this task does not need further evidence reads.
- Do not stage or commit anything.
- Do not deploy or write to the MkDocs Wiki repository.
- Keep the view readable on a vertically scrolling Wiki page and avoid unnecessary implementation-class detail.
- Keep the PNG and live preview as native projections of the same LikeC4 source.

---

### Task 1: Establish the test-ground boundary and prompt shelf

**Files:**
- Modify: `AGENTS.md`
- Modify: `README.md`
- Modify: `prompts/README.md`
- Modify: `prompts/TEMPLATE.md`
- Create: `prompts/shelved/README.md`
- Move: the two empty 2026-08-04 prompt placeholders into `prompts/shelved/`

**Interfaces:**
- Consumes: the user's repository boundary and no-commit rule.
- Produces: repository-local authoring rules and a clear distinction between active and shelved prompts.

- [x] Correct all stale `docs/likec4/` paths to repository-root paths.
- [x] Define this repository as the only writable workspace and document later Wiki deployment as a separate, explicitly authorized phase.
- [x] Add a usable prompt template and explain that the shelved ported prompts were empty placeholders.
- [x] Verify no file outside this repository changed.

### Task 2: Write the fresh simulation data-flow request

**Files:**
- Create: `prompts/2026-08-05-simulation-data-flow.md`

**Interfaces:**
- Consumes: the stages, flows, aggregation rules, inputs, stores, and GeoJSON outputs specified by the user.
- Produces: stable request ID `EA-ARCH-DEMO-001`, public slug `simulation-data-flow`, intended view ID `simulationDataFlow`, scope, exclusions, layout guidance, and acceptance criteria.

- [x] Record the complete semantic flow without adding unsupported implementation details.
- [x] Distinguish primary simulation flow from persistence and export flows.
- [x] Require a compact portrait-oriented native LikeC4 render.
- [x] Self-review the prompt for missing arrows, contradictory ownership, and stale repository paths.

### Task 3: Build the LikeC4 model and view

**Files:**
- Create: `likec4/likec4.config.json`
- Create: `likec4/specification.c4`
- Create: `likec4/model/simulation-data-flow.c4`
- Create: `likec4/views/simulation-data-flow.c4`

**Interfaces:**
- Consumes: `prompts/2026-08-05-simulation-data-flow.md`.
- Produces: LikeC4 view `simulationDataFlow` with all requested nodes and relationships.

- [x] Define a restrained semantic palette for inputs, processing, domain objects, baselines/results, and data stores.
- [x] Model GeoJSON loading, preprocessing responsibilities, Feature2Building, Building/Zone creation, boundary precomputation, Zone5R1C simulation with weather, baseline result emission, result aggregation, and selective GIS export.
- [x] Use ranks and spacing to make the main reading order clear while keeping persistence secondary.
- [x] Run LikeC4 formatting and validation; fix every reported error.

### Task 4: Render and verify the demo

**Files:**
- Create: `review/simulation-data-flow.png`
- Modify: `prompts/2026-08-05-simulation-data-flow.md`

**Interfaces:**
- Consumes: validated view `simulationDataFlow`.
- Produces: approval PNG and exact local live-preview instructions.

- [x] Export a light PNG with LikeC4 1.59.2.
- [x] Inspect the rendered image at normal reading width and refine the source if the reading order, nesting, labels, or routes are unclear.
- [x] Mark the prompt `generated` while keeping approval explicitly pending.
- [x] Re-run formatting and validation, inspect the working-tree status, and confirm no commits exist.
