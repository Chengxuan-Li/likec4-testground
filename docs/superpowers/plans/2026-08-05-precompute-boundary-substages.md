# Precompute Boundary Substages Implementation Plan

**Goal:** Add a collapsible Precompute Boundary Conditions detail flow while preserving a one-row five-stage main processing sequence.

**Architecture:** Nest Local Weather, Face Radiation, and Boundary Conditions under the existing Precompute Boundary Conditions stage. Replace its two parent-level handoffs with child-level relationships, expose the detailed chain in a scoped view, and rebuild the repository's orthogonal snapshots from auto-layout.

**Tech Stack:** LikeC4 DSL, LikeC4 CLI 1.59.2, repository orthogonal-router, Markdown.

## Constraints

- Work only in `C:\github\likec4-testground`.
- Preserve existing uncommitted external-load relationship work.
- Do not export PNG, stage, commit, push, or publish.

## Task 1: Model the nested boundary workflow

- [x] Confirm `localWeather`, `faceRadiation`, and `boundaryConditions` are absent.
- [x] Add the three nested `stage` elements under `precomputeBoundary`.
- [x] Remove `feature2Building.zones -> precomputeBoundary` and `precomputeBoundary -> zone5R1C`.
- [x] Add Zones-to-Local Weather, Local Weather-to-Face Radiation,
  Face Radiation-to-Boundary Conditions, and Boundary Conditions-to-Zone5R1C.
- [x] Add Weather Input connections to Local Weather and Face Radiation.
- [x] Preserve Weather Input-to-Zone5R1C and Precompute-to-Zone Result Table.

## Task 2: Add the collapsed drilldown view and synchronize the prompt

- [x] Give collapsed `precomputeBoundary` navigation to `precomputeBoundaryDetails` in the
  main view.
- [x] Add the scoped detail view with external Zones, Weather Input, and Zone5R1C plus all
  nested substages.
- [x] Exclude the External Loads relationship only from the main-view projection to preserve
  the processing row while retaining the model relationship.
- [x] Update prompt scope, requested flow, visual direction, and acceptance criteria.

## Task 3: Rebuild and verify

- [x] Format the LikeC4 sources.
- [x] Regenerate all orthogonal-routing snapshots and require zero fallbacks or violations.
- [x] Run LikeC4 formatting checks and validation.
- [x] Assert the obsolete parent-level edges are absent and every new edge appears once.
- [x] Assert the five main processing stages share one y-coordinate in the main snapshot.
- [x] Confirm the PNG is unchanged and nothing is staged or committed.
