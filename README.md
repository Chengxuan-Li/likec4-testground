# LikeC4 test ground

This repository is the sole working area for selective EnergyAtlas architecture-diagram
experiments, including prompt design, LikeC4 source, custom styling, and local approval
renders. Nothing here is committed by Codex.

## Layout

- [`prompts/`](prompts/) contains active private diagram requests and the request template.
- [`prompts/shelved/`](prompts/shelved/) contains inactive historical placeholders.
- [`likec4/`](likec4/) contains executable LikeC4 model and view source.
- [`likec4/.likec4/`](likec4/.likec4/) contains generated `.likec4.snap` connector geometry.
- [`tools/orthogonal-router/`](tools/orthogonal-router/) re-routes relationship connectors
  as strictly orthogonal paths with rounded corners.
- [`review/`](review/) contains locally generated approval images.
- [`AGENTS.md`](AGENTS.md) defines repository, privacy, and visual-design constraints.

`../RCEnergySimulator` is a read-only implementation-evidence source. Final approved
artifacts may eventually be published to the MkDocs Wiki, but publication is outside the
current workflow and requires explicit authorization.

## Demo commands

Run LikeC4 commands from `likec4/`. The active demo prompt records its exact view ID and
acceptance status.

Interactive local preview with hot reload:

```powershell
Set-Location C:\github\likec4-testground\likec4
npx --yes likec4@1.59.2 start
```

Then open <http://localhost:5173/view/simulationDataFlow>. Stop the server with `Ctrl+C`.
The default listener is localhost only.

## Connector routing

LikeC4's own layout draws relationships as curved diagonal splines. The router re-routes them
as strictly orthogonal paths with rounded corners and writes native `.likec4.snap`
manual-layout files, which the viewer and the PNG export both read. Graphviz still decides
where every node goes.

Install once:

```powershell
Set-Location C:\github\likec4-testground\tools\orthogonal-router
npm install
```

Regenerate the routes. Do this after any model or view edit and before exporting — a stale
snapshot silently keeps the old geometry. The command always rebuilds from pristine
auto-layout, so re-running it is safe:

```powershell
node C:\github\likec4-testground\tools\orthogonal-router\src\cli.mjs --workspace C:\github\likec4-testground\likec4
```

It exits non-zero if any route fails the geometry check. Per-view settings, including opting a
view out, live in [`likec4/routing.config.json`](likec4/routing.config.json); routing is on by
default for every view.

### Undo an accidental drag

Dragging a node or edge in the viewer overwrites that view's `.likec4.snap`. To throw the
change away, run the regeneration command again — there is no separate reset mode, because the
router never reads its own previous output. It deletes the snapshots and rebuilds from pristine
auto-layout every time.

To reset one view and leave the others alone:

```powershell
node C:\github\likec4-testground\tools\orthogonal-router\src\cli.mjs --workspace C:\github\likec4-testground\likec4 --view simulationDataFlow
```

`--view` clears and regenerates only the named views; every other view keeps its existing
snapshot. Files in `.likec4/` that do not end in `.likec4.snap`, such as the `.bak` and
`.reset-backup` copies, are ignored by both likec4 and the router.

To drop orthogonal routing entirely and go back to LikeC4's native splines, delete the
snapshots and re-export without running the router:

```powershell
Remove-Item C:\github\likec4-testground\likec4\.likec4\*.likec4.snap
```

To inspect the chosen routes for one view:

```powershell
node C:\github\likec4-testground\tools\orthogonal-router\src\report.mjs C:/github/likec4-testground/likec4 simulationDataFlow
```

## Validate and reproduce the approval render

```powershell
Set-Location C:\github\likec4-testground\likec4
npx --yes likec4@1.59.2 format --check
npx --yes likec4@1.59.2 validate
node ..\tools\orthogonal-router\src\cli.mjs --workspace .
npx --yes likec4@1.59.2 export png --flat --light -f simulationDataFlow -o ..\review
Move-Item -LiteralPath ..\review\simulationDataFlow.png -Destination ..\review\simulation-data-flow.png -Force
```

LikeC4 exports a transparent PNG; light/dark appearance is supplied by the viewer or
future Wiki page background.
