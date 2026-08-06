# Wiki live diagram publication design

## Goal

Publish the approved LikeC4 architecture diagrams into `EnergyAtlasWiki` as live, interactive
Wiki content served from GitHub Pages. No PNG diagram export is generated, referenced, or
committed at any point.

## Repository contract

`likec4-testground` stays the private authoring ground: prompts, private request IDs, design
records, and experiments. It is not the runtime source for the published site.

`EnergyAtlasWiki` becomes self-contained and fully public. It owns the public LikeC4 project,
the orthogonal connector router, CI-side viewer generation, and the Wiki pages. The initial
port is one-way and hand-reviewed; after it, `architecture/likec4/` is the canonical public
source. Nothing in the public repository references a private path, prompt, or request ID.

## Viewer mechanism

`likec4 codegen webcomponent` emits one self-contained IIFE bundle that registers a
`<likec4-view>` custom element. Verified properties of the 1.59.2 output:

- Plain global script, not an ES module, so a `<script defer>` tag is sufficient.
- Observed attributes are `view-id`, `browser`, `dynamic-variant`, and `color-scheme`.
- Renders into a shadow root, so Wiki CSS cannot leak into the diagram and vice versa.
- The host is `display: contents`; an inner element carries the view's own aspect ratio, so
  the embed is responsive without a declared height.
- Manual-layout snapshots under `.likec4/` are baked into the bundle. Generating with and
  without them differs by roughly 95 KB, so orthogonal routing survives into the live viewer
  only when the router runs before codegen.
- The only external network dependency is the IBM Plex font on `cdn.jsdelivr.net`, which the
  Wiki already uses.

`browser="true"` supplies the interaction contract: element inspection, collapsed-system
expansion, and `navigateTo` drilldown. The ten drilldown views ship without pages of their
own but are reachable through drilldown, so they are used inventory rather than unused
inventory.

## Publication layout

Under `architecture/`: the public LikeC4 project, a `package.json` pinning `likec4` and
`json5`, and a ported `tools/orthogonal-router/`. The existing `README.md` and `STYLE.md` are
preserved and extended; their PNG export instructions are replaced by the live-viewer
workflow. The shelved `site-building-zone-simulation` model, view, and PNG are retired
because no published page uses them.

Under `docs/architecture/`: four pages — Architecture Overview, Simulation Stages and Data
Flow, Scenario Simulation, and Post-hoc Scenario Mixer.

The generated bundle and the `.likec4/` snapshots are build outputs. Both are git-ignored and
produced in CI, so reviewable diffs stay limited to LikeC4 source.

## Page embedding

Diagram pages declare `full_width: true` and `likec4: true` in front matter. `theme/base.html`
loads the viewer bundle and a small embed script only when `page.meta.likec4` is set, so the
other pages do not pay the bundle cost. Pages embed a `<likec4-view>` inside a figure.

`docs/assets/js/likec4-embed.js` synchronises `color-scheme` with the Wiki theme by reading
`EnergyAtlasTheme` on load and listening for `energyatlas-theme-change`, which triggers the
element's own `attributeChangedCallback`. It also applies a mobile minimum height so a wide,
short view does not collapse on a narrow viewport.

## Navigation and chrome

A new Architecture subspace sits between Workflows and Python. `theme/base.html` gains a
matching `render_space_icon` branch using the lucide `network` glyph, and both copies of
`main.css` gain the icon and figure styles.

## Validation

Static: `likec4 format --check`, `likec4 validate`, the router reporting zero geometry
violations and zero fallback edges, codegen, `pytest`, and `mkdocs build --strict`.

Interactive: a served site checked in a real browser for drilldown, collapsed-system
expansion, element inspection, theme switching, and a clean console, at 375, 768, and 1280
pixel widths.

Safety: a link check over the built site, and a scanner test that fails on absolute paths,
private repository names, prompt paths, request IDs, and `.png` references anywhere in the
published architecture surface.

CI runs the tests as a gate, then generates snapshots and the bundle before building the
site. The router exits non-zero on any geometry violation, so a routing regression fails the
deployment rather than silently publishing degraded diagrams.
