# Post-hoc Scenario Mixer Implementation Plan

> **For agentic workers:** Execute the checked tasks inline in the current workspace. Do not
> delegate, stage, commit, push, publish, or export PNG.

**Goal:** Add a native LikeC4 view of the post-hoc scenario mixer and its external actors.

**Architecture:** Reuse Result Tables, add dedicated Input and WebUI actors, and add one
expanded Scenario Mixer system with four direct members. Keep the six supplied flows exact.

**Tech Stack:** LikeC4 DSL and CLI 1.59.2, repository orthogonal-router, Markdown.

## Global constraints

- Work only in `C:\github\likec4-testground`.
- Treat `..\RCEnergySimulator` as read-only and do not inspect it for this conceptual view.
- Do not create or modify Wiki artifacts.
- Do not stage, commit, push, publish, or export PNG.

## Task 1: Extend the model vocabulary and mixer boundary

**Files:**

- Modify `likec4/specification.c4`.
- Modify `likec4/model/simulation-data-flow.c4`.

- [x] Add a `ui` element kind with browser shape and compact processing styling.
- [x] Add customer-shaped `mixerInput` and browser-shaped `webUI` external actors.
- [x] Add Scenario Mixer with exactly four direct members.
- [x] Add all six requested model relationships with exact labels.

## Task 2: Add the view

**Files:**

- Modify `likec4/views/simulation-data-flow.c4`.

- [x] Add `postHocScenarioMixerView` with the exact title.
- [x] Expand Scenario Mixer and collapse the reused Result Tables projection.
- [x] Link Result Tables to `resultTablesDetails`.
- [x] Keep Input and WebUI outside the Scenario Mixer boundary.
- [x] Use left-to-right layout with Result Tables and Input source-side and WebUI response-side.

## Task 3: Route and verify

**Files:**

- Create `likec4/.likec4/postHocScenarioMixerView.likec4.snap`.
- Regenerate affected existing snapshots.

- [x] Run LikeC4 formatting checks.
- [x] Regenerate all orthogonal snapshots with zero fallbacks and geometry violations.
- [x] Assert exact containment, external shapes, relationship labels, and Result Tables reuse.
- [x] Run LikeC4 validation and `git diff --check`.
- [x] Confirm no rendered artifacts or staged files exist.

## Task 4: Add result-selection flow and icons

- [x] Add SiteEnergyResult to Modeled Mixture Selection without a label.
- [x] Customize SiteEnergyResult with `multiple true` only in `postHocScenarioMixerView`.
- [x] Add verified GCP icons to every visible mixer-view card.
- [x] Regenerate routing and assert exact view-only multiplicity and all seven relationships.
- [x] Run formatting, validation, geometry, and Git-state checks.
