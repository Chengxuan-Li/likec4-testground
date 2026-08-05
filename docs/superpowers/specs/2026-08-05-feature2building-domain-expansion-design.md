# Feature2Building domain expansion design

## Goal

Expand the scoped Feature2Building detail view to show how a preprocessed Feature
produces archetype assignments and supplies geometry used to construct the Building,
Zones, and Faces hierarchy.

## Scope

- Keep the main Simulation Stages and Data Flow view collapsed at Feature2Building.
- Add Feature, Construction Archetype, Systems Archetype, Energy Loads Archetype,
  and Faces inside Feature2Building.
- Keep Building and Zones inside Feature2Building.
- Preserve all simulation, result aggregation, persistence, and export behavior outside
  Feature2Building.
- Do not change the relationship-browser behavior reviewed immediately before this work.

## Model design

Use compact `domainObject` elements for all new Feature2Building members. This matches
the existing Building and Zones vocabulary and avoids implying that archetypes are
services, processing stages, or storage systems.

The relationships are:

1. Preprocessing emits Feature.
2. Feature emits Construction Archetype.
3. Feature emits Systems Archetype.
4. Feature emits Energy Loads Archetype.
5. Feature supplies geometric information to Building.
6. Building owns Zones.
7. Zones owns Faces.
8. Construction Archetype supplies Thermal Mass and Infiltration Rate to Zones.
9. Construction Archetype supplies U Value and WWR to Faces.
10. Systems Archetype supplies conditioning systems to Zones.
11. Energy Loads Archetype supplies schedules to Zones.

Zones remains plural and multiple. Faces is plural and receives `multiple true`.

## View behavior

The main view continues to render Feature2Building as one collapsed processing-stage
card. Its scoped detail view exposes all nested elements and their relationships using
the existing left-to-right automatic layout. No manual positions or PNG exports are
introduced.

The external Preprocessing-to-Feature relationship replaces the current
Preprocessing-to-Building relationship. Existing downstream relationships from Building
and Zones remain intact unless their labels are explicitly changed above.

## Documentation

Update the private prompt so its architectural question, scope, requested flow, and
acceptance criteria describe Feature emission, archetype assignments, geometry flow,
ownership, and Faces. Do not publish or deploy these changes to the Wiki.

## Validation

- Format and validate the LikeC4 source with the repository-pinned CLI.
- Confirm the main view still collapses Feature2Building.
- Confirm the scoped Feature2Building view contains every requested element and edge.
- Do not create a PNG, commit, stage, push, or alter the adjacent RCEnergySimulator repo.

