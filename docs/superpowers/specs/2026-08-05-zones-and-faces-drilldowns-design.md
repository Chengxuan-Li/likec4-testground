# Zones and Faces drilldowns design

## Goal

Add navigable Zones and Faces scoped views without duplicating the existing Faces model
element or changing the main simulation-stage projection.

## Zones model and view

Nest three compact domain components under the existing multiple `zones` element:

- `ZoneConstruction`
- `Systems`
- `Energy Loads`

Retarget the three Zone-level archetype relationships:

- Construction Archetype supplies Thermal Mass and Infiltration Rate to ZoneConstruction.
- Systems Archetype supplies conditioning systems to Systems.
- Energy Loads Archetype supplies schedules to Energy Loads.

Retarget Construction Archetype-to-Faces to the nested Faces Material Info card for U Value
and WWR. Do not draw direct Zones-to-child relationships because immediate containment
expresses ownership and LikeC4 does not permit relationships between a container and its
immediate child.

Add `zonesDetails` scoped to `feature2Building.zones`. Include the three external archetype
sources, all Zone children, and the existing `feature2Building.faces` element. The Faces
card is the same model element projected into another view, remains `multiple true`, and
navigates to `facesDetails`.

## Faces model and view

Nest four compact data elements under the existing `feature2Building.faces` element:

- Material Info
- Context Info
- Geometry Info
- Window Info

Add `facesDetails` scoped to the existing Faces element and include all four children.

## Navigation

Keep the wildcard F2B detail projection so external relationship endpoints remain visible,
then layer navigation overrides onto Zones and Faces. Zones navigates to `zonesDetails`,
Faces navigates to `facesDetails`, and the shared Faces card in `zonesDetails` also
navigates to `facesDetails`.

## Validation

Update the private prompt, regenerate all orthogonal-routing snapshots, and require zero
fallbacks or geometry violations. Run LikeC4 1.59.2 formatting and validation. Confirm the
five top-level processing stages retain one shared y-coordinate and exact left-to-right
order. Do not export PNG, stage, commit, push, or publish.
