# Orthogonal Connector Routing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Relationship connectors travel only horizontally and vertically with rounded 90-degree elbows, in both the interactive viewer and the exported approval PNG.

**Architecture:** Graphviz keeps full control of node placement. A test-ground tool re-routes only the edges into the whitespace between nodes and persists the result as a native `.likec4.snap` manual-layout file, which both the viewer and the PNG export read.

**Tech Stack:** Node 24, LikeC4 1.59.2 Node API, json5.

Design: `docs/superpowers/specs/2026-08-05-orthogonal-connector-routing-design.md`

## Global Constraints

- Modify only `C:\github\likec4-testground`.
- Never stage or commit. Leave everything as uncommitted working-tree files.
- Never hand-edit an exported PNG.
- Do not add tooling flags to the `.c4` sources; they are treated as public.

---

### Task 1: Scaffold the router tool

**Files:**
- Create: `tools/orthogonal-router/package.json`
- Create: `tools/orthogonal-router/.gitignore`

- [x] Private ESM package depending on `likec4@1.59.2` and `json5`.
- [x] Install dependencies; confirm `LikeC4.fromWorkspace` imports.

### Task 2: Phase 0 spike — snapshot round trip

- [x] Dumped a layouted `simulationDataFlow` view. **All coordinates share one absolute space:** edge `1f12mie` starts at `[667,357]`, exactly the right border of `preprocessing` `(409,289,258,135)` at its vertical centre, and stops 11px short of the target for the arrowhead.
- [x] Wrote unmodified snapshots and re-exported: PNG hash `21D1973C…` identical to baseline. The round trip is lossless.
- [x] **R1 settled and closed:** `controlPoints` is `undefined` in fresh auto-layout, so the renderer draws `points` and `controlPoints` is optional user-edit state. The router does not emit it.

### Task 3: Snapshot IO, config, CLI skeleton

**Files:**
- Create: `tools/orthogonal-router/src/snapshot.mjs`, `src/config.mjs`, `src/cli.mjs`
- Create: `likec4/routing.config.json`

- [x] Read/write snapshots with `json5.stringify(view, { space: 2, quote: "'" })`, matching likec4's own writer.
- [x] Clear stale snapshots before calling `diagrams()`; assert no view returns `_layout: 'manual'`.
- [x] Per-view config with `orthogonal` defaulting to true.

### Task 4: Geometry core and checker

**Files:**
- Create: `tools/orthogonal-router/src/geometry.mjs`, `src/check.mjs`

- [x] Encode an orthogonal polyline as a `1 + 3n` cubic array with quarter-arc corners at kappa 0.5523.
- [x] Clamp corner radius to half the shorter adjacent segment.
- [x] Checker asserts every cubic is axis-aligned or a square-bounded 90-degree turn, and crosses no node rectangle.
- [x] **`snapOrthogonal`:** round to integers and force exact axis alignment *before* validating. Sub-pixel slop from box centres and channel midpoints was rounding into visible 1px diagonals; snapping first means the checker inspects exactly what gets drawn.

### Task 5: Corridor model

**Files:**
- Create: `tools/orthogonal-router/src/corridors.mjs`

- [x] Channels computed per travel segment rather than as a global grid. A global banding was too conservative — a band occupied anywhere is still free everywhere else, which would have blocked the long `preprocessing -> gisTables` run.
- [x] Obstacle set from inflated leaf rectangles; compounds are soft, with a separate parallel-border clearance measure so routes do not hug a group frame.

### Task 6: Route templates and lanes

**Files:**
- Create: `tools/orthogonal-router/src/route.mjs`

- [x] Straight, elbow, Z, S and detour shapes over all four side pairs and a set of anchor offsets, each rejected on obstacle collision, backtracking, or non-orthogonality.
- [x] Fall back to the original spline and report any edge no shape could route. Zero fallbacks across all 8 views.
- [x] Lane offsets within shared corridors, plus anchor distribution along node sides.
- [x] Endpoint raw rectangles re-added as obstacles so a route cannot loop back through the box it just left.
- [x] Alignment offsets so a clean straight run is reachable whenever the boxes overlap on the perpendicular axis.
- [x] Crossing penalty weighted below the cost of a corner, so parallel runs re-order rather than intersect.

### Task 7: Label re-seating

- [x] Place each `labelBBox` on the longest straight portion, sliding along it to avoid overlap.
- [x] Allow placement on either side of a line, with a padded overlap test. Two runs exactly `laneSpacing` apart had nowhere to put their labels and stacked them flush.

### Task 8: Apply and validate

- [x] All 8 views, 57 edges: 57 routed, 0 fallback, 0 geometry violations.
- [x] `likec4 format --check` → "All 3 file(s) are formatted"; `likec4 validate` → "✓ Valid (3 files)".
- [x] Exported and reviewed all 8 views against the six AGENTS.md checks.
- [x] Idempotency verified: two consecutive runs produce byte-identical snapshots for all 8 views.
- [x] Installed the approval render at `review/simulation-data-flow.png`.

### Task 9: Update the repository contract

**Files:**
- Modify: `AGENTS.md`, `README.md`

- [x] Replaced the bullet warning that native routing may curve with the verified behaviour, the regeneration requirement, and the honesty condition tied to the checker.
- [x] Documented the router in the demo command sequence, before export.
- [x] Confirmed zero staged files and zero commits.
