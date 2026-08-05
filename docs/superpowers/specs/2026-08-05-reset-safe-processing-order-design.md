# Reset-Safe Processing Order Design

## Problem

The main `simulationDataFlow` view uses `autoLayout TopBottom` with a five-node `rank same` constraint. LikeC4 forwards that rank constraint to Graphviz, which keeps the stages on one row but remains free to reorder them to reduce crossings. Removing the manual layout therefore produces the incorrect visual order:

`Feature2Building → Precompute Boundary Conditions → Preprocessing → Zone5R1C Simulation → Results Aggregation`

## Approved Design

- Change the main `simulationDataFlow` view to `autoLayout LeftRight 80 55`.
- Remove the five-stage `rank same` constraint.
- Preserve the semantic processing relationships:
  - Preprocessing → Building within collapsed Feature2Building
  - Zones within collapsed Feature2Building → Precompute Boundary Conditions
  - Precompute Boundary Conditions → Zone5R1C Simulation
  - Zone5R1C Simulation → ZoneResult within collapsed Results Aggregation
- Let those directed relationships assign successive left-to-right ranks, producing the reset-safe sequence:

  `Preprocessing → Feature2Building → Precompute Boundary Conditions → Zone5R1C Simulation → Results Aggregation`

- Retain the existing table-group rank constraint initially. In a left-to-right layout, it keeps Definition Tables, Result Tables, and GIS Tables vertically aligned on one rank.

## Scope

- Update the private prompt to describe the left-to-right, reset-safe layout contract.
- Do not change model semantics, element membership, icons, colors, shapes, scoped detail views, or relationship labels.
- Treat repositioning of Inputs, table groups, GIS output, and relationship routes as expected consequences of changing the global layout direction.
- Do not manually position nodes or recreate a manual snapshot as part of verification.
- Do not export a PNG, deploy to the Wiki, stage files, or commit.

## Verification

- Confirm no active `simulationDataFlow.likec4.snap` exists before testing.
- Run LikeC4 1.59.2 formatting and validation.
- Inspect the live reset/automatic view and verify that the five processing stages have monotonically increasing x-coordinates in the approved order.
- Confirm that no new manual snapshot is required for the correct sequence.
- Confirm the existing PNG is unchanged and Git has no staged changes or commits.
