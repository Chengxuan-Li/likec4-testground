# Sequential Processing Stage Layout Design

## Goal

Make the five collapsed processing stages read as one ordered sequence while giving Results Aggregation the same visual treatment as the other processing stages.

## Model Styling

- Remove the explicit green color override from `resultsAggregation`.
- Keep `resultsAggregation` as a `stage`, allowing it to inherit the shared `processing` color and stage shape from `likec4/specification.c4`.
- Preserve the green styling of the nested ZoneResult, BuildingResult, and SiteEnergyResult elements in the Results Aggregation detail view.

## Main View Layout

- Keep the main view's `TopBottom` automatic layout so the table and output bands retain their current composition.
- Keep all five processing stages in one declarative `rank same` constraint.
- Declare the processing stages in this exact left-to-right order:
  1. Preprocessing
  2. Feature2Building (F2B)
  3. Precompute Boundary Conditions
  4. Zone5R1C Simulation
  5. Results Aggregation
- Retain the existing semantic relationships between consecutive stages. These relationships reinforce the intended sequence without adding artificial proxy elements or layout-only relationships.

## Scope

- Update the private prompt to record the same-color and ordered-rank requirements.
- Do not change data-flow semantics, scoped detail views, icons, table placement, or container membership.
- Do not export a PNG, deploy to the Wiki, stage files, or commit.

## Verification

- Confirm Results Aggregation has no local color override and inherits the shared stage styling.
- Confirm the five-stage rank contains the exact requested order.
- Run LikeC4 1.59.2 formatting and validation checks.
- Preserve the current localhost preview snapshot only if it remains consistent with the source.
