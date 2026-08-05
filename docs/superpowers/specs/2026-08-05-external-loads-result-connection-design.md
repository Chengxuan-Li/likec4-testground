# External loads result connection design

## Goal

Show that the Energy Loads Archetype inside Feature2Building supplies external loads
directly to SiteEnergyResult inside Results Aggregation.

## Model design

Add one cross-container relationship:

```likec4
feature2Building.energyLoadsArchetype -> resultsAggregation.siteEnergyResult 'supplies External loads'
```

The direct edge preserves the requested semantics without implying that external loads
are emitted by Zone5R1C or aggregated through ZoneResult. Keep both parent elements
collapsed in the main view and retain their existing scoped detail views.

## Documentation and validation

Update the private simulation-data-flow prompt to include the relationship in its scope,
requested flow, and acceptance criteria. Format and validate with LikeC4 1.59.2. Do not
export PNG, push, or commit unless the user separately requests it.

