# Wiki Live Diagram Publication Implementation Plan

> **For agentic workers:** Execute the checked tasks inline. Do not delegate, stage, commit,
> push, or export PNG. Publication writes land in `..\EnergyAtlasWiki` as uncommitted
> working-tree changes only.

**Goal:** Serve the approved LikeC4 views as live, interactive diagrams from the EnergyAtlas
Wiki on GitHub Pages, with no PNG anywhere in the workflow.

**Architecture:** `EnergyAtlasWiki` becomes a self-contained public LikeC4 project. CI runs
the ported orthogonal router, then `likec4 codegen webcomponent`, then `mkdocs build`. Pages
embed `<likec4-view … browser="true">` behind a front-matter flag.

**Tech Stack:** LikeC4 DSL and CLI 1.59.2, Node 20, MkDocs with a custom theme, pytest,
GitHub Actions.

## Global constraints

- Design records stay in `C:\github\likec4-testground`; publication artifacts go to
  `C:\github\EnergyAtlasWiki`.
- Do not stage, commit, or push in either repository.
- Never generate, reference, or commit a PNG diagram export.
- Treat every published file as user-visible: no absolute paths, private repository names,
  prompt paths, request IDs, or unused architectural inventory.

## Task 1: Port the public LikeC4 project

**Files:** `architecture/likec4/**`, `architecture/package.json`, `architecture/.gitignore`,
`architecture/tools/orthogonal-router/**`, `architecture/README.md`, `architecture/STYLE.md`.

- [ ] Port `specification.c4`, the model, and all thirteen views; add an explicit `index`
      landscape view so the landing map is deliberate rather than auto-generated.
- [ ] Preserve the scaffold's `likec4.config.json` public theme; retire the shelved
      `site-building-zone-simulation` model and view and delete its PNG.
- [ ] Port `routing.config.json` and `tools/orthogonal-router/` verbatim.
- [ ] Add `package.json` and lockfile pinning `likec4@1.59.2` and `json5`.
- [ ] Rewrite the README render section around the live viewer; update STYLE.md so the
      orthogonal contract is claimable and PNG language is gone.

## Task 2: Theme, styles, and embed runtime

**Files:** `theme/base.html`, `assets/css/main.css`, `docs/assets/css/main.css`,
`docs/assets/js/likec4-embed.js`.

- [ ] Add an Architecture branch to `render_space_icon` using the lucide `network` glyph.
- [ ] Load the viewer bundle and embed script only when `page.meta.likec4` is set.
- [ ] Add `.wiki-space-icon-architecture` and `.likec4-figure` styles to both CSS copies.
- [ ] Write `likec4-embed.js`: sync `color-scheme` from `EnergyAtlasTheme`, react to
      `energyatlas-theme-change`, and guarantee a usable height on narrow viewports.

## Task 3: Author the Architecture subspace

**Files:** `docs/architecture/*.md`.

- [ ] Write the overview, Simulation Stages and Data Flow, Scenario Simulation, and Post-hoc
      Scenario Mixer pages, each with `full_width: true` and `likec4: true`.
- [ ] Explain the drilldown, expansion, and inspection affordances once, on the overview.

## Task 4: Navigation and site map

**Files:** `mkdocs.yml`, `docs/wiki-guide/site-map.md`.

- [ ] Insert the Architecture subspace between Workflows and Python.
- [ ] Add the four pages to the site map in the required link format.

## Task 5: Tests

**Files:** `tests/test_docs_structure.py`, `tests/test_site_chrome.py`,
`tests/test_architecture_pages.py`, `tests/test_public_safety.py`.

- [ ] Update page counts and `CONTENT_ROOTS`; update icon and nav-order assertions.
- [ ] Assert every embedded view id exists in source, each primary view has exactly one page,
      front-matter flags are present, and no PNG is referenced.
- [ ] Add a public-safety scanner over the published architecture surface.

## Task 6: CI and gitignore

**Files:** `.github/workflows/deploy.yml`, `.gitignore`.

- [ ] Add a pytest job gating deploy.
- [ ] Add Node 20, `npm ci`, router, codegen, a bundle sanity assertion, and
      `mkdocs build --strict`.
- [ ] Ignore the generated bundle, `.likec4/` snapshots, and `node_modules/`.

## Task 7: Validate

- [ ] `likec4 format --check`, `likec4 validate`, router with zero violations and zero
      fallbacks, codegen, `pytest`, `mkdocs build --strict`.
- [ ] Serve the site and verify drilldown, collapsed-system expansion, element inspection,
      theme switching, and a clean console at 375, 768, and 1280 pixel widths.
- [ ] Run the link check and the public-safety scan.
