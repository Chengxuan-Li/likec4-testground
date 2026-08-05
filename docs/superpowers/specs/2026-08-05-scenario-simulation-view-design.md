# Scenario simulation view design

## Goal

Add a scenario-oriented copy of the Simulation Stages and Data Flow view while preserving
the existing view as the expanded baseline-oriented diagram.

## Simulation model boundary

Promote the current view-only Baseline Simulation grouping to one real `Simulation` stage
container. Move Precompute Boundary Conditions, Zone5R1C Simulation, and Results
Aggregation under it without changing their internal flows or persistence relationships.

The existing `simulationDataFlow` view keeps these three members expanded beneath the real
`Simulation` model container. It must not add a second view-only group with the same name.
The new `scenarioSimulationView` renders that same model container once as a collapsed card
with `multiple true` and navigation to `simulationDetails`. It also includes a separate,
childless `Baseline` stage above it. Only the scenario Simulation projection is multiple and
only that projection opens `simulationDetails`.

## Scenario elements and relationships

Add two top-level model elements used only by the scenario view:

- `Scenario Mappings`, a multiple processing stage with the description “Apply measure
  packages based on selection criteria for each scenario”.
- `Building Upgrade Scenarios`, a multiple domain collection.

Add these relationships:

1. Preprocessing feeds Scenario Mappings.
2. Feature2Building supplies a Copy of Building to Building Upgrade Scenarios.
3. Scenario Mappings supplies applied selections and scenario measures to Building Upgrade
   Scenarios.
4. Building Upgrade Scenarios creates a copy of the Simulation instance.
5. Building Upgrade Scenarios supplies Definition Tables.
6. Feature2Building supplies its zone geometry and location to Baseline in the scenario
   projection; hide the corresponding Feature2Building-to-Simulation projection there while
   preserving the underlying relationship for `simulationDataFlow`.
7. Baseline supplies Simulation.

## Views

- Rename the expanded `Baseline Simulation` group to `Simulation` in `simulationDataFlow`.
- Add `simulationDetails` scoped to the real Simulation container, retaining click-through
  navigation to Precompute Boundary Conditions and Results Aggregation details.
- Add `scenarioSimulationView` as a structural copy of the current main view. Its Simulation
  card is collapsed; Precompute Boundary Conditions, Zone5R1C, and Results Aggregation are
  hidden until the card is opened.
- Include Scenario Mappings and Building Upgrade Scenarios inside the scenario view's
  UBEM domain only.
- Place the childless Baseline and the multiple Simulation on the same horizontal rank, with
  Baseline above.
- Use verified bundled GCP icons on every visible card in the scenario view.
- Preserve inputs, table systems, GIS export, the hidden main-view External Loads edge, and
  all existing detail views.

## Validation

Update the existing private baseline prompt and add a new private scenario prompt with view
ID `scenarioSimulationView`. Regenerate all orthogonal snapshots, require zero routing
fallbacks and geometry violations, and run LikeC4 1.59.2 formatting and validation. Confirm
the existing expanded stage order and the new scenario flow. Do not export PNG, stage,
commit, push, or publish.
