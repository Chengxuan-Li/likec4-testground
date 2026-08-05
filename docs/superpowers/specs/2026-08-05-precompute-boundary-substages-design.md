# Precompute boundary substages design

## Goal

Expand Precompute Boundary Conditions into a collapsible detail view while keeping it a
single stage in the Simulation Stages and Data Flow view.

## Model

Nest three processing stages inside `precomputeBoundary`:

1. Local Weather
2. Face Radiation
3. Boundary Conditions

Replace the parent-level Zones-to-Precompute and Precompute-to-Zone5R1C connections with:

```text
Zones -> Local Weather -> Face Radiation -> Boundary Conditions -> Zone5R1C Simulation
```

Weather Input connects independently to Local Weather and Face Radiation. Preserve the
existing direct Weather Input-to-Zone5R1C connection because its removal was not requested.
Preserve the parent Precompute Boundary Conditions-to-Zone Result Table persistence edge.

## Views and layout

Keep Precompute Boundary Conditions collapsed in `simulationDataFlow` and add navigation
to a scoped `precomputeBoundaryDetails` view. That detail view includes external Zones,
Weather Input, and Zone5R1C alongside the three nested substages.

Keep `autoLayout LeftRight`. The nested directed chain projects through the collapsed F2B
and Precompute boundaries, preserving the top-level sequence Preprocessing,
Feature2Building, Precompute Boundary Conditions, Zone5R1C Simulation, Results Aggregation.
Exclude the Energy Loads Archetype-to-SiteEnergyResult relationship from this main-view
projection; keep it in the model and relationship/detail views. This prevents the secondary
cross-container edge from offsetting Results Aggregation under Graphviz.
After regenerating routing snapshots, assert those five stage cards share one y-coordinate
in the main view.

## Documentation and validation

Synchronize the private prompt. Regenerate all orthogonal-routing snapshots, require zero
fallbacks and geometry violations, then run LikeC4 1.59.2 formatting and validation. Do
not export PNG, stage, commit, push, or publish.
