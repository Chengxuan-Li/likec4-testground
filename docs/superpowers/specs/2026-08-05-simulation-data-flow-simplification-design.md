# Simulation Data Flow Simplification Design

## Semantic changes

- Remove Working Feature Collection; Input GeoJSON feeds Preprocessing directly.
- Remove Baseline and every relationship incident to it.
- Zone5R1C Simulation emits ZoneResult directly.
- Remove Precompute Boundary Conditions → ZoneResult.
- Add Precompute Boundary Conditions → Zone Result Table to represent direct persistence.
- Preserve ZoneResult → BuildingResult → SiteEnergyResult aggregation and each result
  object's persistence relationship.

## Visual grouping

- Add `External Inputs`, containing Input GeoJSON and Weather Input.
- Add `DuckDB Local Storage`, containing the three existing nested categories:
  `Definition Tables`, `Result Tables`, and `GIS Tables`.
- Keep Properties GeoJSON and Results GeoJSON outside DuckDB.
- Keep all groups presentational; logical relationship endpoints remain table elements.

## Verification

Run LikeC4 format checking and validation only. Do not export or replace the PNG; the user
will visually inspect the live `simulationDataFlow` view on localhost. Confirm the removed
nodes and relationships no longer appear in source and no files are staged or committed.

