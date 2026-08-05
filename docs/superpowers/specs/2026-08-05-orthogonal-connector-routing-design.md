# Orthogonal connector routing — design

Date: 2026-08-05
Status: approved for implementation

## Problem

LikeC4 1.59.2 routes every relationship as a Graphviz cubic spline. `DotPrinter.createGraph()`
hardcodes `splines: 'spline'` with `layout: dot`, Graphviz returns bezier control points per
edge, and the viewer renders them verbatim through `bezierPath()`, which emits
`M p0 C p1 p2 p3 C …`. There is no step or orthogonal path type anywhere in the renderer.

The result is the diagonal, curving connectors visible in `review/simulation-data-flow.png`.
`AGENTS.md` already records this as a known limitation and forbids claiming the routes are
orthogonal while the renderer does not actually produce them.

There is no configuration escape hatch. `likec4.config.json`'s schema exposes only `theme`,
`defaults`, `customCss`, `imageAliases`, `manualLayouts.outDir`, `inferTechnologyFromIcon`,
`implicitViews` and `landingPage`. Nothing reaches the layout engine.

## Goal

Relationship connectors in this test ground travel only horizontally and vertically, joined by
rounded 90-degree elbows, in both the interactive viewer and the exported approval PNG, with
no hand-editing of exports and no divergence between the two.

## Key enabling facts

Established by reading the installed `likec4@1.59.2` package rather than from documentation:

1. **Manual-layout snapshots are a first-class input.** `.likec4.snap` files under
   `likec4/.likec4/` are read by the language service. `applyManualLayout()` in `@likec4/core`
   takes the *snapshot* as the geometry base — including each edge's `points` array — and
   patches titles, styles and labels from the freshly computed view. Structural changes are
   recorded as `drifts` rather than causing the snapshot to be discarded.

2. **Snapshots are JSON5.** They are parsed with a JSON5 parser and written with
   `stringify(obj, { space: 2, quote: "'" })`. Writing them from outside likec4 with the
   `json5` package reproduces likec4's own formatting byte for byte.

3. **A Node API exists.** `LikeC4.fromWorkspace(path)` → `.diagrams()` returns
   `LayoutedView[]` — the exact objects that get serialized into a snapshot.

4. **Rounded orthogonal geometry is expressible in the current renderer.** `bezierPath()`
   consumes a flat array of `1 + 3n` points and emits cubic segments. A straight run is a
   cubic with collinear control points; a quarter-circle corner of radius `r` is a cubic with
   control points at `kappa · r` (kappa = 0.5523). **No renderer change is required.**

5. **PNG export renders the same React application headlessly**, so a change that fixes the
   viewer fixes the export, and the two cannot drift apart.

## Approach

Leave Graphviz in full control of node placement. Re-route only the edges, into the whitespace
Graphviz left between nodes, and persist the result as a manual-layout snapshot.

```
0. move aside likec4/.likec4/*.snap          ← router always starts from pristine auto-layout
1. LikeC4.fromWorkspace('likec4').diagrams() → LayoutedView[]
2. for each view enabled in config: route(view)
3. json5.stringify(view, {space: 2, quote: "'"}) → likec4/.likec4/<id>.likec4.snap
4. likec4 start / likec4 export png          ← both render the orthogonal routes
```

Step 0 is load-bearing. `diagrams()` applies any existing snapshot, so without it the router
would consume its own previous output and re-route already-orthogonal geometry. Always
regenerating from scratch makes the tool idempotent by construction.

### Why not the alternatives

- **Patch or fork likec4.** Would apply to every view automatically and survive model edits,
  but costs a build pipeline and permanent upgrade friction. Out of scope: the decision was to
  keep this test ground's renders working, not to fix likec4 itself.
- **Graphviz `splines=ortho`.** Requires a fork anyway, and Graphviz's orthogonal mode does not
  support edge `label` (only `xlabel`) and does not honour `lhead`/`ltail` cluster clipping,
  both of which this model relies on.
- **Post-process the exported SVG/PNG.** Violates the AGENTS.md requirement that the approval
  render and the interactive view be native projections of the same source.
- **Reshape the model so splines happen to look straight.** Never strictly orthogonal, no
  rounded elbows, and cannot fix long cross-diagram edges.

## Router design

### Obstacles

Leaf node rectangles inflated by `nodeMargin`. Compound/group rectangles are soft obstacles: a
route may enter one only when its endpoint lies inside. Edge label boxes join the obstacle set
once placed.

### Corridors

Cluster node x-intervals into rank bands and y-intervals into row bands. The gaps between them
are the routing corridors:

- **Vertical strips** between adjacent columns, used for vertical travel.
- **Horizontal bands** between adjacent rows, plus the margins above the topmost and below the
  bottommost row, used for long horizontal runs that span several columns.

Any orthogonal route alternates between the two families. This is a channel router, and it
matches the AGENTS.md instruction to "reserve whitespace between ranks as routing corridors".

### Route templates

Tried in order; a candidate is rejected when any segment intersects an obstacle.

1. **Straight** — source and target share a row band and sit in adjacent columns. One
   horizontal segment, zero corners.
2. **Z, two corners** — exit the source's E side, cross into the vertical strip between the
   columns, travel vertically, enter the target's W side.
3. **U / detour, four corners** — same column, blocked strip, or a span across several
   columns. Exit N or S into a free horizontal band, travel, then drop into the target.

If every template is blocked the edge keeps its Graphviz spline and the run reports it, so a
failure is visible rather than silently wrong.

### Lane assignment

Edges sharing a strip or band receive lane indices offset from the centreline by `laneSpacing`,
ordered to minimise crossings. Attachment points are distributed along a node's side rather
than stacked at its midpoint, which is the "cardinal attachment points" rule made literal.

### Corner rounding

Walk the polyline. At each interior vertex emit a quarter arc of radius
`min(cornerRadius, half the shorter adjacent segment)` as a cubic bezier with control points at
`kappa · r` along each incident direction. Straight runs become cubics with control points at
one third and two thirds. The output is the flat `1 + 3n` array that likec4 already expects.

### Labels

Re-seat each `labelBBox` on the longest straight portion of its new route, with greedy shifting
along that segment to avoid label-label overlap.

## Configuration

`likec4/routing.config.json`:

```json
{
  "default": { "orthogonal": true, "cornerRadius": 12, "laneSpacing": 14, "nodeMargin": 12 },
  "views": { "inputsDetails": { "orthogonal": false } }
}
```

Orthogonal routing defaults to on for every view, with per-view opt-out and per-view tuning.

The configuration deliberately does **not** live in the `.c4` sources. `ParsedAstElementView`
has no `metadata` field — only elements and relations do — so the only DSL-native mechanism
would be a view tag such as `#nativeRouting`. AGENTS.md requires treating every tag as public,
and a private tooling flag does not belong in a file destined for the Wiki.

## Verification

A run is only considered good when all of the following hold:

1. **Geometry checker passes.** Every emitted segment is axis-aligned within epsilon, except
   corner arcs, which must stay inside their corner's bounding box. No segment intersects a
   node rectangle. This is what makes "strictly orthogonal" an honest claim rather than an
   impression.
2. `likec4 validate` passes.
3. The PNG exports and, reviewed at normal Wiki width, satisfies the six AGENTS.md visual
   checks.

Once the checker passes, the AGENTS.md bullet that warns against describing routes as
orthogonal is updated to describe the actual behaviour.

## Risks

- **R1 — the viewer might re-derive geometry from `controlPoints` rather than rendering
  `points`.** This would discard the routes entirely. Phase 0 settles it before any router code
  is written. Fallback: emit `controlPoints` as the corner vertices.
- **R2 — corridors too narrow.** Graphviz spaces nodes for splines, not lanes. Mitigation is
  native: raise `nodeSep`/`rankSep` in the view's `autoLayout`.
- **R3 — drift.** Any model or view edit stales the snapshots. Regeneration becomes a required
  step of the render workflow, documented as a single command.
- **R4 — group boundaries.** Edges targeting a compound need clipping at the group border,
  replacing Graphviz's `lhead`/`ltail` behaviour.
- **R5 — repo shape.** This introduces the first `node_modules` into the test ground, under
  `tools/orthogonal-router/`. All work stays uncommitted per AGENTS.md.

## Out of scope

Fixing likec4 upstream, changing node placement, dynamic and deployment views, and any
publication to the Wiki.
