# Collapsed Processing and Icon Design

## Intent

Refine the simulation data-flow view so the main canvas emphasizes five processing stages while nested domain objects and aggregation details remain available through click-through views.

## Decisions

- Collapse `Feature2Building (F2B)` in the main view and add a scoped detail view containing Building and Zones.
- Target Building directly from Preprocessing in the model. The main view derives this as an edge to the collapsed F2B card.
- Render Definition Tables, Result Tables, and GIS Tables as storage-shaped collapsed containers.
- Render Inputs with LikeC4's supported `person` shape as the requested customer-style silhouette.
- Rename Simulation Results to Results Aggregation, model it as a stage, and place its collapsed card inside the Simulation Processing group.
- Retain ZoneResult, BuildingResult, and SiteEnergyResult inside Results Aggregation and expose them through a scoped detail view.
- Use a small set of bundled GCP icons as recognition metaphors: Dataflow for preprocessing and boundary preparation, Cloud Functions for F2B, Compute Engine for simulation, BigQuery for aggregation, and Cloud Storage for GeoJSON output. These icons do not assert a GCP deployment topology.

## Verification

Format and validate with LikeC4 1.59.2. Check the source for the collapsed/detail-view arrangement, direct Preprocessing-to-Building relationship, requested shapes, renamed aggregation stage, and valid GCP icon identifiers. Do not export a PNG.
