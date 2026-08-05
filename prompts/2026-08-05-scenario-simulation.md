# Scenario simulation

- Private request ID: `EA-ARCH-DEMO-002`
- Public slug: `scenario-simulation`
- Intended Wiki page: `architecture/scenario-simulation`
- LikeC4 view ID: `scenarioSimulationView`
- Status: `generated` (approval pending)

## Architectural question

How are processed features and scenario selections combined into multiple building-upgrade
scenarios, and how does each scenario create a simulation instance while retaining access
to the baseline simulation internals?

## Audience

EnergyAtlas developers and technical Wiki readers comparing baseline and scenario-oriented
simulation flows.

## Scope

- Inputs, Preprocessing, Feature2Building, persistence tables, GIS tables, and Results
  GeoJSON from the baseline simulation-data-flow model.
- Multiple Scenario Mappings that apply measure packages based on per-scenario selection
  criteria.
- Multiple Building Upgrade Scenarios built from copied Buildings and applied scenario
  selections/measures.
- One collapsed, multiple Simulation card linking to a detail view of Precompute Boundary
  Conditions, Zone5R1C Simulation, and Results Aggregation.
- One separate, childless Baseline card above the multiple Simulation card.

## Exclusions

- Scenario authoring UI, optimization, calibration, and measure-package internals.
- Deployment topology, queues, protocols, and infrastructure.
- Wiki publication or PNG export in this revision.

## Requested flow

1. Input GeoJSON feeds Preprocessing and Preprocessing continues to Feature2Building.
2. Preprocessing also feeds multiple Scenario Mappings.
3. Feature2Building supplies a Copy of Building to multiple Building Upgrade Scenarios.
4. Scenario Mappings supplies applied selections and scenario measures to Building Upgrade
   Scenarios.
5. Building Upgrade Scenarios creates a copy of a Simulation instance.
6. Building Upgrade Scenarios supplies Definition Tables.
7. Feature2Building supplies zone geometry and location to Baseline instead of directly to
   Simulation in this view.
8. Baseline supplies Simulation.
9. The collapsed Simulation card opens a detail view containing Precompute Boundary
   Conditions, Zone5R1C Simulation, and Results Aggregation.
10. Existing definition, result, GIS, and GeoJSON flows remain available.

## Private evidence hints

No implementation evidence is required. If later validation is requested, inspect
`..\RCEnergySimulator` read-only and record only the minimum necessary evidence here.

## Visual direction

- Use `autoLayout LeftRight` for a clear scenario-preparation flow.
- Keep Scenario Mappings and Building Upgrade Scenarios inside UBEM.
- Render Scenario Mappings, Building Upgrade Scenarios, and collapsed Simulation as
  multiple instances.
- Keep Simulation internals hidden in this view and available through click navigation.
- Preserve quiet frames, compact cards, orthogonal routing, and the existing restrained
  semantic palette.
- Give every visible card a suitable verified bundled GCP icon.

## Acceptance criteria

- View ID is `scenarioSimulationView`.
- Scenario Mappings and Building Upgrade Scenarios render with `multiple true`.
- Simulation renders collapsed with `multiple true` and navigates to `simulationDetails`.
- Baseline is a distinct childless card above Simulation and is not multiple.
- The seven scenario relationships appear with the requested directions and labels where specified.
- Precompute Boundary Conditions, Zone5R1C Simulation, and Results Aggregation do not appear
  as separate cards in the scenario view.
- Existing inputs, persistence, GIS, and export concepts remain available.
- Routing, formatting, and LikeC4 validation pass.
- No PNG is exported, and nothing is staged or committed.
