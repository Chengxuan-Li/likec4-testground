# Processing Region Design

Remove the outer `DuckDB Local Storage` view group while preserving `Definition Tables`,
`Result Tables`, and `GIS Tables` as independent quiet groups. Add a `Simulation Processing`
view group containing exactly Preprocessing, Feature2Building, Precompute Boundary
Conditions, and Zone5R1C Simulation, with all four aligned on one declarative rank.

Set `multiple true` in the Zone element's style so the view communicates multiplicity
without adding duplicate Zone nodes or changing relationships. Building and Zone remain
outside Simulation Processing, so their object-construction flow crosses the processing
boundary intentionally.

Validate with LikeC4 1.59.2 without exporting a PNG. Preserve the uncommitted repository.

