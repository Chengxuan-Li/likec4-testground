# Simulation stages and data flow

- Private request ID: `EA-ARCH-DEMO-001`
- Public slug: `simulation-data-flow`
- Intended Wiki page: `architecture/simulation-data-flow`
- LikeC4 view ID: `simulationDataFlow`
- Status: `generated` (approval pending)

## Architectural question

How does a preprocessed geospatial Feature produce archetype assignments and become a
simulation-ready Building with Zones and Faces, how are boundary conditions and weather
used by Zone5R1C simulation, and how do generated results flow through aggregation,
persistence, and GeoJSON export?

## Audience

EnergyAtlas developers and technical Wiki readers who need a selective architectural view
of the main simulation stages and data products without reading implementation classes.

## Scope

Show these concepts and responsibilities:

- A collapsed Inputs system containing an input GeoJSON disk file and Weather Input.
- A preprocessing stage that combines schema matching, geometric preprocessing, and
  archetype assignment.
- A GIS properties table that receives processed feature-collection data.
- Feature2Building (`F2B`), whose nested Feature is emitted by Preprocessing, emits
  Construction, Systems, and Energy Loads archetypes, and supplies geometric information
  to Building.
- Building ownership of multiple Zones and Zone ownership of multiple Faces inside F2B.
- A Zones drilldown containing ZoneConstruction, Systems, and Energy Loads, plus a reused
  projection of the existing multiple Faces element linking to its own drilldown.
- Construction Archetype properties for ZoneConstruction and Faces Material Info, Systems
  Archetype conditioning systems for Systems, and Energy Loads Archetype schedules for
  Energy Loads.
- A Faces drilldown containing Material Info, Context Info, Geometry Info, and Window Info.
- A collapsed Definition Tables system containing Building and Zone definition tables.
  Zone definitions include energy-load time series.
- A collapsed Precompute Boundary Conditions stage with Local Weather, Face Radiation,
  and Boundary Conditions substages in a scoped detail view.
- The detailed boundary flow from Zones through all three substages into Zone5R1C.
- A Simulation subgroup containing Precompute Boundary Conditions, Zone5R1C
  Simulation, and Results Aggregation.
- Weather as an external simulation input.
- A collapsed Results Aggregation stage containing ZoneResult, BuildingResult, and
  SiteEnergyResult inside the UBEM group.
- A direct Energy Loads Archetype connection supplying External loads to SiteEnergyResult.
- A collapsed Result Tables system containing their corresponding result tables.
- A collapsed GIS Tables system containing GIS Properties and GIS Result tables.
- One Results GeoJSON output exported by both GIS tables.

## Exclusions

- Complete class, method, schema, or database-column inventories.
- Deployment topology, processes, queues, protocols, and infrastructure.
- Calibration, scenario comparison, non-baseline simulation modes, and UI concerns.
- Unrequested result types or persistence destinations.
- Claims that native LikeC4 relationship routing is strictly orthogonal.
- Wiki integration, deployment, or publication work.

## Requested flow

Use this as the semantic source of truth:

1. An input GeoJSON disk file enters one preprocessing node directly. Preprocessing
   represents schema matching, geometric preprocessing, and archetype assignment.
2. Preprocessing sends processed feature data to the GIS properties table.
3. Preprocessing emits Feature within Feature2Building (`F2B`).
4. Feature emits Construction Archetype, Systems Archetype, and Energy Loads Archetype,
   and supplies geometric information to Building.
5. `F2B` contains Feature, all three archetypes, Building, multiple Zones, and one shared
   multiple Faces element. Building owns Zones, and Zones own Faces. Zones contains
   ZoneConstruction, Systems, and Energy Loads. Faces contains Material Info, Context Info,
   Geometry Info, and Window Info.
6. Construction Archetype supplies Thermal Mass and Infiltration Rate to ZoneConstruction
   and supplies U Value and WWR to Faces Material Info. Systems Archetype supplies
   conditioning systems to Systems. Energy Loads Archetype supplies schedules to Energy
   Loads.
7. Building definitions are written to the building definition table. Zone definitions,
   including energy-load time series, are written to the zone definition table.
8. Zones feed Local Weather inside Precompute Boundary Conditions with zone geometry and
   location context.
9. Weather independently feeds both Local Weather and Face Radiation. Its existing direct
   connection to Zone5R1C remains as an external simulation input.
10. Local Weather feeds Face Radiation, Face Radiation feeds Boundary Conditions, and
    Boundary Conditions feeds Zone5R1C. The former direct Zones-to-Precompute and
    Precompute-to-Zone5R1C parent-level relationships do not remain.
11. Zone5R1C simulation emits ZoneResult directly and has no other result-stage output.
12. ZoneResult persists to the zone result table.
13. PrecomputeBoundaryCondition writes directly to the zone result table; it does not emit
    a ZoneResult object.
14. ZoneResult aggregates into BuildingResult, which aggregates into SiteEnergyResult.
    Each result object persists to its corresponding result table.
15. Energy Loads Archetype directly supplies External loads to SiteEnergyResult; this
    connection does not pass through ZoneResult.
16. SiteEnergyResult is selectively projected into the GIS result table.
17. Both the GIS properties table and GIS result table export the same Results GeoJSON
    output.

The view may show result objects separately from their tables when that distinction makes
aggregation clearer. It must not imply that table-to-table aggregation performs the
domain-result roll-up.

## Private evidence hints

No implementation evidence is required for this first test-ground demo. If later review
requires validation against code, inspect `..\RCEnergySimulator` read-only and record only
the minimum necessary evidence here.

## Visual direction

- Use a left-to-right primary reading order so automatic layout resets preserve the
  processing sequence. This five-stage row is an intentional departure from the usual
  four-column Wiki default.
- Keep ingestion before preprocessing, followed by object construction, boundary
  precomputation, simulation, and result aggregation.
- Place definition and result tables in quieter side bands so persistence does not become
  the dominant visual path.
- Keep the two GeoJSON output files near their emitting GIS tables.
- Use compact cards with concise canvas labels; place supporting explanations in model
  descriptions for interactive inspection.
- Use amber for external file/weather inputs, a cool accent for processing, pale cool
  cards for domain objects, green for results, and neutral storage styling.
- Prefer short cardinal relationship travel and low crossing counts while accepting native
  LikeC4 curves where necessary.
- Use the directed processing relationships, rather than a same-rank constraint, to assign
  the five stages to successive left-to-right ranks. Exact absolute coordinates are not
  required and must not be claimed.
- Keep the Energy Loads Archetype-to-SiteEnergyResult relationship in the model but exclude
  its collapsed projection from the main view so it does not disturb the five-stage row.
  The connection remains available through global relationship browsing and detail views.
- Show Inputs as one collapsed card; clicking it opens a scoped view of Input GeoJSON and
  Weather Input.
- Add a quiet, solid-border `UBEM` group containing Preprocessing,
  collapsed Feature2Building, and a nested `Simulation` group. Simulation
  contains Precompute Boundary Conditions, Zone5R1C Simulation, and collapsed Results
  Aggregation. Use `autoLayout LeftRight` and their semantic relationships to preserve this
  exact sequence after a manual-layout reset: Preprocessing, Feature2Building, Precompute
  Boundary Conditions, Zone5R1C Simulation, Results Aggregation.
- Render UBEM as the lighter parent frame and Simulation as a
  slightly stronger but still quiet nested frame.
- Render Results Aggregation with the same processing-stage color as the other four stages;
  retain green for the nested result objects in its detail view.
- Show Definition Tables, Result Tables, and GIS Tables as collapsed cards with native
  click-through scoped detail views.
- Show Results Aggregation as one collapsed stage with a scoped detail view containing
  ZoneResult, BuildingResult, and SiteEnergyResult.
- Show Feature2Building as one collapsed stage with a scoped detail view containing
  Feature, Construction Archetype, Systems Archetype, Energy Loads Archetype, Building,
  `Zones`, and `Faces`. Render both Zones and Faces with `multiple true`.
- Make Zones and Faces clickable in the F2B detail view. Zones opens a scoped view with
  ZoneConstruction, Systems, Energy Loads, and the same shared Faces model element; that
  Faces card navigates to the Faces scoped view.
- In the Faces view, show Material Info, Context Info, Geometry Info, and Window Info as
  compact data cards.
- Show Precompute Boundary Conditions as one collapsed stage in the main view. Its scoped
  detail view includes external Zones and Weather Input, internal Local Weather, Face
  Radiation, and Boundary Conditions substages, and external Zone5R1C Simulation.
- Render Definition Tables, Result Tables, and GIS Tables with database/storage shapes.
- Render Inputs with LikeC4's person shape as the requested customer-style silhouette.
- Add restrained bundled GCP icons to selected processing, aggregation, and output cards
  as recognition metaphors; they do not assert a GCP deployment topology.
- Remove Properties GeoJSON. Keep Results GeoJSON outside GIS Tables.
- The PNG and live interactive preview must be native projections of the same source.

## Acceptance criteria

- Every relationship numbered 1 through 17 above appears with the stated direction.
- Preprocessing visibly owns all three preprocessing responsibilities.
- Working Feature Collection and an element named Baseline do not appear in the model or view.
- Input GeoJSON feeds Preprocessing directly.
- Preprocessing emits Feature inside Feature2Building and does not point directly to
  Building.
- Feature emits Construction Archetype, Systems Archetype, and Energy Loads Archetype and
  supplies geometric information to Building.
- Building owns Zones; Zones own Faces; both Zones and Faces render as multiple instances.
- Construction Archetype supplies Thermal Mass and Infiltration Rate to ZoneConstruction
  and U Value and WWR to Faces Material Info; it does not target the Faces container.
- Systems Archetype supplies conditioning systems to Systems, and Energy Loads Archetype
  supplies schedules to Energy Loads. None of those three relationships targets the Zones
  parent directly.
- Energy Loads Archetype directly supplies External loads to SiteEnergyResult without
  passing through ZoneResult.
- The External Loads relationship is excluded only from the main `simulationDataFlow`
  projection and remains available in the model and relationship/detail views.
- Zones connect to Local Weather, which connects to Face Radiation, which connects to
  Boundary Conditions, which connects to Zone5R1C.
- Weather Input connects to Local Weather and Face Radiation and retains its direct
  Zone5R1C connection; Weather does not enter Preprocessing.
- The obsolete Zones-to-Precompute Boundary Conditions and Precompute Boundary
  Conditions-to-Zone5R1C parent-level relationships are absent.
- Zone5R1C has one result-stage output: ZoneResult.
- PrecomputeBoundaryCondition writes directly to Zone Result Table and has no relationship
  to the ZoneResult object.
- Result-object aggregation is clear: ZoneResult → BuildingResult → SiteEnergyResult.
- Only SiteEnergyResult feeds the GIS result table, and the relationship is labeled as a
  selective projection or aggregation.
- Both GIS tables can independently emit output GeoJSON files.
- Inputs is collapsed in the main view and its detail view contains exactly Input GeoJSON
  and Weather Input.
- DuckDB Local Storage does not appear.
- UBEM contains Preprocessing, collapsed Feature2Building, Precompute
  Boundary Conditions, Zone5R1C Simulation, and collapsed Results Aggregation. Simulation
  Simulation groups the final three of those stages without changing their sequence.
- The five UBEM stages share one processing color, one horizontal row,
  and the exact left-to-right sequence Preprocessing, Feature2Building, Precompute Boundary
  Conditions, Zone5R1C Simulation, Results Aggregation.
- Feature, all three archetypes, Building, Zones, and Faces are nested within
  Feature2Building; Zones and Faces are plural and rendered as multiple instances.
- Zones contains ZoneConstruction, Systems, and Energy Loads. Its scoped view also projects
  the existing Faces element rather than defining a duplicate Faces model element.
- Faces contains Material Info, Context Info, Geometry Info, and Window Info.
- Zones and Faces navigate from the F2B detail view; the reused Faces card in the Zones
  view navigates to the same Faces detail view.
- Feature2Building, Precompute Boundary Conditions, and Results Aggregation are collapsed
  in the main view and each navigates to a named scoped detail view.
- Definition Tables, Result Tables, and GIS Tables are collapsed storage-shaped cards;
  Inputs is a collapsed person-shaped card. Each navigates to a named scoped detail view.
- Properties GeoJSON does not appear. Both GIS tables export Results GeoJSON.
- Table-group peers remain aligned through a reproducible LikeC4 rank; processing stages
  use successive relationship-driven ranks without absolute positioning.
- The primary reading order is understandable before reading every edge label.
- The diagram remains legible while accepting the deliberate five-stage processing row.
- LikeC4 formatting and validation pass using the pinned CLI version.
- No PNG is exported for this revision; the user visually inspects the live localhost view.
- Approval remains pending until the user accepts the live view.
