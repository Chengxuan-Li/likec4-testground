# Post-hoc scenario mixer

- Private request ID: `EA-ARCH-DEMO-003`
- Public slug: `post-hoc-scenario-mixer`
- Intended Wiki page: `architecture/post-hoc-scenario-mixer`
- LikeC4 view ID: `postHocScenarioMixerView`
- Status: `generated` (approval pending)

## Architectural question

How do persisted annual building results and modeling parameters drive a post-hoc scenario
mixture and trigger a WebUI style update?

## Audience

EnergyAtlas developers and technical Wiki readers reviewing interactive post-hoc scenario
mixing.

## Scope

- One expanded Scenario Mixer system containing SiteEnergyResult, Choice Model, Modeled
  Mixture Selection, and Scenario Results.
- One projection of the existing Result Tables system and Site Energy Result Table.
- A customer-shaped Input actor and browser-shaped WebUI component.
- The seven explicitly requested relationships and labels where specified.

## Exclusions

- Choice-model algorithms, probability distributions, and calibration internals.
- API protocols, endpoint paths, payload schemas, and deployment topology.
- Additional inferred flows beyond the requested SiteEnergyResult-to-selection connection.
- Wiki publication or PNG export in this revision.

## Requested flow

1. Site Energy Result Table supplies `BuildingId, Annual Results` to SiteEnergyResult.
2. Input supplies `Modeling Parameters` to Choice Model.
3. Choice Model supplies `Mixer Parameters` to Modeled Mixture Selection.
4. WebUI makes an `API Call with Mixer Parameters` to Choice Model.
5. Modeled Mixture Selection performs `Real Time Aggregation` into Scenario Results.
6. Scenario Results sends an `API Response Triggering Style Update` to WebUI.
7. SiteEnergyResult supplies Modeled Mixture Selection.

## Private evidence hints

No implementation evidence is required. If later validation is requested, inspect
`..\RCEnergySimulator` read-only and record only the minimum necessary evidence here.

## Visual direction

- Use a left-to-right reading order.
- Keep Scenario Mixer expanded as a quiet structural frame.
- Keep Result Tables collapsed and link it to `resultTablesDetails`.
- Place external Input, WebUI, and Result Tables outside Scenario Mixer.
- Preserve compact cards, restrained semantic colors, and orthogonal routing.
- Render SiteEnergyResult as multiple only in this view.
- Give every visible card a suitable verified bundled GCP icon.

## Acceptance criteria

- View ID is `postHocScenarioMixerView` and title is `Post-hoc Scenario Mixer View`.
- Scenario Mixer contains exactly the four requested direct members in this workflow.
- Result Tables reuses the existing model element rather than duplicating storage.
- Input uses the customer/person shape and WebUI uses the browser shape.
- All seven relationships appear with exact direction and labels where specified.
- SiteEnergyResult has `multiple true` only in this view.
- Routing, formatting, and LikeC4 validation pass.
- No PNG is exported, and nothing is staged or committed.
