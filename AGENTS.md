# LikeC4 test-ground instructions

These instructions apply to the entire repository.

## Repository boundary

- Treat `C:\github\likec4-testground` as the only writable workspace for this diagram workflow.
- Do not modify `..\RCEnergySimulator` or any other adjacent repository. `..\RCEnergySimulator` may be read only when implementation evidence is needed for a diagram.
- Do not write to `EnergyAtlasWiki`, deploy MkDocs content, or prepare a Wiki commit unless the user explicitly authorizes that separate publication phase.
- Store human-authored diagram requests under `prompts/`.
- Store executable LikeC4 source under `likec4/` and local approval renders under `review/`.
- Store private workflow guidance and design records in this repository only.
- Never stage or commit changes in this repository. Leave all work as uncommitted working-tree files for user review.

## Prompt management

- Name active prompts `YYYY-MM-DD-<public-slug>.md` using lowercase kebab case.
- Start new prompts from `prompts/TEMPLATE.md`.
- Give each prompt a stable private request ID and a public slug.
- A private prompt may cite implementation files, symbols, and internal evidence needed for analysis.
- Record the intended future Wiki page, LikeC4 view ID, scope, exclusions, and approval status in the prompt.
- Move superseded or inactive prompts to `prompts/shelved/`; do not treat them as active requests.
- Future public artifacts must not contain or link back to a private request ID or prompt path.

## Cross-diagram visual contract

Use these defaults unless a diagram prompt records a reason to depart from them:

- Treat containers as quiet structural frames. Use pale fills, solid thin borders,
  a visible top-left label, and enough inset padding to make containment unmistakable.
  Parent containers should be lighter than their children; no container should become
  the most visually dominant object merely because it is large.
- Use compact cards for responsibilities, stages, and data stores. Prefer title-only
  `xsmall` or concise `small` cards in the rendered view; keep supporting descriptions
  in the model for interactive inspection when they would overcrowd the static view.
- Use icons only when they are already available, public-safe, stylistically consistent,
  and meaningfully improve recognition. A labeled card is the safe default.
- Compose on a visible grid. Establish the primary reading order before adding secondary
  relationships, align peers into ranks, and reserve whitespace between ranks as routing
  corridors. A vertically scrolling Wiki view should normally use at most four columns.
- Prefer horizontal and vertical relationship travel, cardinal attachment points, short
  labels on straight portions, and few crossings. Native LikeC4 relationship views may
  curve or round routes; never describe them as strictly orthogonal unless the renderer
  actually produces only horizontal/vertical segments and 90-degree elbows.
- LikeC4 does not allow a direct relationship between a container and its immediate
  child. Convey parent-to-child delegation through concise container labels and model
  descriptions. If explicit call-order arrows are essential, use approved conceptual
  run-stage cards or a separate dynamic view.
- Separate primary simulation flow from secondary persistence, aggregation, export, and
  observability flows. Render secondary destinations as a shallow band or quiet boundary.
- Use a restrained semantic palette: cool pale frames for structure, one accent family
  for processing, amber for external inputs, green for results, and neutral relationships.
  Do not rely on color alone to communicate meaning.
- The approval PNG and future interactive view must be native projections of the same
  LikeC4 source. Do not hand-edit exported PNGs to repair routing or composition.

During visual review, compare the render at normal Wiki width against these checks:

1. The reading order is apparent before relationship labels are read.
2. The largest filled area is not the strongest visual element.
3. Nested boundaries remain distinguishable without saturated fills.
4. Cards and labels remain legible without excessive zoom.
5. Primary relationships are shorter and clearer than secondary relationships.
6. Any non-orthogonal routing limitation is visible and described honestly.

## Future public-output safety

Before any separately authorized publication to `EnergyAtlasWiki`, treat every proposed
public file as user-visible:

- Include only concepts intentionally approved for publication.
- Assume every LikeC4 element, description, relationship, link, comment, and unused view
  is public, even when it does not appear in the current PNG.
- Exclude absolute filesystem paths, credentials, private URLs, raw source excerpts,
  investigation notes, and unused architectural inventory.
- Use implementation class names only when the request explicitly needs them and they are
  suitable for public documentation.
- Build and review public candidates locally in this test ground before publication.

