# Post-hoc scenario mixer view design

## Goal

Add a dedicated view showing how persisted annual site-energy results and modeling
parameters drive a post-hoc scenario mixture and a WebUI style update.

## Model boundary

Add one `Scenario Mixer` system containing four direct, childless members:

- `SiteEnergyResult`, the annual per-building result loaded from persistence.
- `Choice Model`, which converts modeling parameters into mixer parameters.
- `Modeled Mixture Selection`, which applies the modeled selection.
- `Scenario Results`, the real-time aggregate returned to the WebUI.

Reuse the existing `Result Tables` model system and its `Site Energy Result Table`; do not
duplicate persistence elements. Add a dedicated customer-shaped `Input` actor and a
browser-shaped `WebUI` component outside Scenario Mixer.

## Relationships

1. Site Energy Result Table sends `BuildingId, Annual Results` to SiteEnergyResult.
2. Input sends `Modeling Parameters` to Choice Model.
3. Choice Model sends `Mixer Parameters` to Modeled Mixture Selection.
4. WebUI sends `API Call with Mixer Parameters` to Choice Model.
5. Modeled Mixture Selection sends `Real Time Aggregation` to Scenario Results.
6. Scenario Results sends `API Response Triggering Style Update` to WebUI.
7. SiteEnergyResult supplies Modeled Mixture Selection.

The SiteEnergyResult-to-Modeled-Mixture-Selection relationship is intentionally unlabeled.

## View

Add `postHocScenarioMixerView` titled `Post-hoc Scenario Mixer View`. Render Scenario Mixer
expanded, Result Tables as one collapsed projection linking to its existing detail view,
and Input and WebUI as external actors. Use left-to-right layout and preserve native
LikeC4 click inspection.

Customize SiteEnergyResult with `multiple true` only in this view. Use verified bundled GCP
icons on every visible card.

## Validation

Create a private prompt, regenerate all orthogonal snapshots without fallbacks or geometry
violations, and verify exact containment, labels, shapes, reuse, and view membership with
LikeC4 1.59.2. Do not export PNG, stage, commit, push, or publish.
