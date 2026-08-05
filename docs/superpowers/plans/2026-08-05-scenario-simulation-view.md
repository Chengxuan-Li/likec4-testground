# Scenario Simulation View Implementation Plan

**Goal:** Add a scenario-oriented view with a collapsed multiple Simulation card and scenario preparation flow.

**Architecture:** Introduce one real Simulation model container around the three existing simulation stages. Project it expanded in the existing view and collapsed in the new scenario view, avoiding duplicate architectural elements.

**Tech Stack:** LikeC4 DSL, LikeC4 CLI 1.59.2, repository orthogonal-router, Markdown.

## Constraints

- Work only in `C:\github\likec4-testground`.
- Preserve all existing semantics, drilldowns, orthogonal routing, and public-safety rules.
- Future diagram instructions target `scenarioSimulationView`; keep `simulationDataFlow` as
  the baseline-oriented view.
- Do not export PNG, stage, commit, push, or publish.

## Task 1: Introduce the Simulation model container

- [x] Confirm Precompute Boundary Conditions, Zone5R1C, and Results Aggregation are top-level.
- [x] Nest all three under a new `Simulation` stage without changing internal flows.
- [x] Update every affected relationship and scoped view FQN.
- [x] Rename the current Baseline Simulation projection group to Simulation.
- [x] Add `simulationDetails` with existing child drilldown navigation.

## Task 2: Add the scenario model and view

- [x] Add multiple Scenario Mappings with the exact requested description.
- [x] Add multiple Building Upgrade Scenarios.
- [x] Add the four requested scenario relationships and labels.
- [x] Add `scenarioSimulationView` with a collapsed, multiple Simulation card linking to
  `simulationDetails`.
- [x] Preserve inputs, tables, GIS output, ranks, and the External Loads exclusion.

## Task 3: Document and verify

- [x] Update the baseline prompt and create the scenario prompt from the repository template.
- [x] Format LikeC4 source and regenerate every routing snapshot.
- [x] Require zero routing fallbacks and geometry violations.
- [x] Run LikeC4 formatting checks and validation.
- [x] Assert containment, exact relationships, multiplicity, and navigation targets.
- [x] Assert the baseline expanded flow and scenario collapsed flow render as specified.
- [x] Confirm the PNG is unchanged and nothing is staged or committed.

## Task 4: Remove the duplicate Simulation projection

- [x] Remove the view-only `Simulation` group from `simulationDataFlow`.
- [x] Keep the real `simulation` model container expanded through its three included children.
- [x] Keep exactly one collapsed `simulation` projection in `scenarioSimulationView` with
  `multiple true` as a view property.
- [x] Regenerate routing snapshots and assert one Simulation model projection per view.
- [x] Run formatting and LikeC4 validation without staging, committing, or exporting PNG.

## Task 5: Add the explicit baseline instance

- [x] Add a childless `baselineSimulation` stage titled `Baseline Simulation`.
- [x] Include Baseline Simulation above the existing collapsed Simulation in
  `scenarioSimulationView`.
- [x] Keep `multiple true` and `navigateTo simulationDetails` only on Simulation.
- [x] Add Building Upgrade Scenarios to Definition Tables in the model and scenario view.
- [x] Regenerate routing and assert both distinct projections, ordering, and relationship.
- [x] Run formatting and LikeC4 validation without staging, committing, or exporting PNG.

## Task 6: Route the scenario baseline and add icons

- [x] Rename the separate childless stage to `Baseline`.
- [x] Add Feature2Building zone geometry/location to Baseline and Baseline to Simulation.
- [x] Exclude the original Feature2Building-to-Simulation-internals projection only from
  `scenarioSimulationView`.
- [x] Add verified GCP icons to every visible scenario-view card.
- [x] Regenerate routing, preserve Baseline-above-Simulation ordering, and verify.
