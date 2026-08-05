# Live LikeC4 GitHub Pages design

## Goal

Deploy this repository's complete LikeC4 workspace as a live, interactive GitHub Pages site
without generating or publishing static diagram images.

## Deployment architecture

GitHub Actions builds the LikeC4 production application from `likec4/` with LikeC4 1.59.2.
The build uses `/likec4-testground/` as its asset base and hash-history routing so GitHub
Pages can serve direct diagram links without rewrite rules. The generated `dist/` directory
is uploaded as a Pages artifact and deployed through the official Pages actions.

The workflow runs on pushes to `main` and through manual dispatch. It uses Pages OIDC
permissions, a single deployment concurrency group, and the `github-pages` environment.

## Quality gates

Before building, CI runs LikeC4 formatting and validation against `likec4/`. The production
build must contain `index.html`, use the repository base path for assets, and expose hash
routes for interactive views and drilldowns. No PNG export command or image artifact is part
of the workflow.

## Documentation

The repository README documents the production build, local preview, expected Pages URL,
and the repository setting required to use GitHub Actions as the Pages source. Generated
`dist/` output remains ignored locally.

## Constraints

- Do not change diagram semantics or routing snapshots.
- Do not export PNG, SVG, PDF, or other static diagram images.
- Do not stage, commit, or push unless separately requested.
