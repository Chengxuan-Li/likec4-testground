# Zones and Faces Drilldowns Implementation Plan

**Goal:** Add clickable Zones and Faces detail views backed by nested Zone components and Face information cards.

**Architecture:** Extend the existing Zones and Faces elements rather than creating duplicate model objects. Retarget archetype relationships to per-Zone children, reuse the multiple Faces card in both F2B and Zones views, and preserve the main processing projection.

**Tech Stack:** LikeC4 DSL, LikeC4 CLI 1.59.2, repository orthogonal-router, Markdown.

## Constraints

- Work only in `C:\github\likec4-testground`.
- Reuse `feature2Building.faces`; do not create a second Faces model element.
- Preserve all unrelated relationships and the aligned five-stage main view.
- Do not export PNG, stage, commit, push, or publish.

## Task 1: Extend Zones and retarget archetypes

- [x] Confirm the three Zone child components are absent.
- [x] Add ZoneConstruction, Systems, and Energy Loads under Zones.
- [x] Retarget the Construction, Systems, and Energy Loads archetype relationships from
  Zones to their corresponding children.
- [x] Target the Construction Archetype U Value and WWR relationship at Faces Material
  Info rather than the Faces container.

## Task 2: Extend Faces and add drilldown navigation

- [x] Add Material Info, Context Info, Geometry Info, and Window Info under the existing
  Faces element.
- [x] Add `zonesDetails` with external archetypes, all Zone children, and the shared Faces
  card linking to `facesDetails`.
- [x] Add `facesDetails` with all six Face children.
- [x] Make Zones and Faces clickable from `feature2BuildingDetails`.

## Task 3: Document and verify

- [x] Update the private prompt's scope, flow, visual direction, and acceptance criteria.
- [x] Format LikeC4 source and regenerate all routing snapshots.
- [x] Require zero routing fallbacks and geometry violations.
- [x] Run LikeC4 formatting checks and validation.
- [x] Assert exact element reuse, relationship targets, enum values, and navigation IDs.
- [x] Assert the five main stages retain a common y-coordinate and ordered x-coordinates.
- [x] Confirm the PNG is unchanged and nothing is staged or committed.
