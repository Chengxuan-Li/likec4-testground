# External Loads Result Connection Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Connect Energy Loads Archetype directly to SiteEnergyResult with the label `supplies External loads`.

**Architecture:** Add one cross-container relationship to the existing LikeC4 model while preserving both collapsed parent cards and their scoped detail views. Synchronize the private prompt and validate with the pinned CLI.

**Tech Stack:** Markdown, LikeC4 DSL, LikeC4 CLI 1.59.2 through `npx`.

## Global Constraints

- Work only in `C:\github\likec4-testground`.
- Do not modify `C:\github\RCEnergySimulator`.
- Do not export PNG, stage, commit, push, or publish.

---

### Task 1: Add and document the external-loads relationship

**Files:**
- Modify: `likec4/model/simulation-data-flow.c4`
- Modify: `prompts/2026-08-05-simulation-data-flow.md`
- Verify: `likec4/views/simulation-data-flow.c4`

**Interfaces:**
- Consumes: `feature2Building.energyLoadsArchetype` and `resultsAggregation.siteEnergyResult`.
- Produces: a direct relationship labeled `supplies External loads`.

- [x] **Step 1: Verify the relationship is initially absent**

```powershell
rg -F "feature2Building.energyLoadsArchetype -> resultsAggregation.siteEnergyResult 'supplies External loads'" likec4\model\simulation-data-flow.c4
```

Expected: exit code 1.

- [x] **Step 2: Add the relationship**

Add this exact model statement near the other result-flow relationships:

```likec4
feature2Building.energyLoadsArchetype -> resultsAggregation.siteEnergyResult 'supplies External loads'
```

- [x] **Step 3: Update the private prompt**

Add the direct Energy Loads Archetype-to-SiteEnergyResult relationship to the prompt's
scope, requested flow, and acceptance criteria. Preserve the existing aggregation chain
and clarify that this connection does not pass through ZoneResult.

- [x] **Step 4: Format and validate**

Run from `likec4`:

```powershell
npx --yes likec4@1.59.2 format
npx --yes likec4@1.59.2 format --check
npx --yes likec4@1.59.2 validate
```

Expected: all commands exit 0.

- [x] **Step 5: Regenerate orthogonal-routing snapshots**

Run the repository router after the model edit:

```powershell
node C:\github\likec4-testground\tools\orthogonal-router\src\cli.mjs --workspace C:\github\likec4-testground\likec4
```

Expected: all eight view snapshots are regenerated, every edge is routed, and the
geometry check reports zero violations and zero fallbacks.

- [x] **Step 6: Verify exact semantics and repository safety**

```powershell
rg -F "feature2Building.energyLoadsArchetype -> resultsAggregation.siteEnergyResult 'supplies External loads'" likec4\model\simulation-data-flow.c4
git diff --cached --quiet
git status --short
```

Expected: exactly one matching relationship, no staged files, no PNG changes, and only
the approved local source and documentation changes remain uncommitted.
