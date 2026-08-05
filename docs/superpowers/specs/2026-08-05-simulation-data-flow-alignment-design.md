# Simulation Data Flow Alignment and Grouping Design

## Decision

Keep LikeC4 1.59.2 as the native renderer and use declarative view constraints instead of
absolute coordinates. The layout will be stable for the pinned source and renderer, but it
will not claim pixel-exact placement after future node or label changes.

## Layout

The primary simulation chain remains visually dominant and reads from ingestion at the top
through object creation, simulation, Baseline, and result aggregation. `rank same` blocks
align logical peers into explicit rows. LikeC4 continues to choose exact coordinates and
route relationships within those constraints.

## Groups

Use view-level groups so the logical model and relationship endpoints remain unchanged:

- `Definition Tables`: Building Definition Table and Zone Definition Table.
- `Result Tables`: Zone Result Table, Building Result Table, and Site Energy Result Table.
- `GIS Tables`: GIS Properties Table and GIS Result Table.

GeoJSON input/output files remain outside all three groups. Each group uses a pale neutral
fill, solid border, and low opacity so it reads as a structural storage frame rather than a
primary processing stage.

## Acceptance

LikeC4 formatting and validation must pass. The native PNG must visibly contain all three
groups, preserve every existing relationship, keep the primary simulation stages legible,
and remain suitable for a vertically scrolling Wiki page. No file is staged or committed.

