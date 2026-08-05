# LikeC4 test ground

This repository is the sole working area for selective EnergyAtlas architecture-diagram
experiments, including prompt design, LikeC4 source, custom styling, and local approval
renders. Nothing here is committed by Codex.

## Layout

- [`prompts/`](prompts/) contains active private diagram requests and the request template.
- [`prompts/shelved/`](prompts/shelved/) contains inactive historical placeholders.
- [`likec4/`](likec4/) contains executable LikeC4 model and view source.
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

Validate and reproduce the approval render:

```powershell
Set-Location C:\github\likec4-testground\likec4
npx --yes likec4@1.59.2 format --check
npx --yes likec4@1.59.2 validate
npx --yes likec4@1.59.2 export png --flat --light -f simulationDataFlow -o ..\review
Move-Item -LiteralPath ..\review\simulationDataFlow.png -Destination ..\review\simulation-data-flow.png -Force
```

LikeC4 exports a transparent PNG; light/dark appearance is supplied by the viewer or
future Wiki page background.
