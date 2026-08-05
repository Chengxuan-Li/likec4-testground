# Feature2Building Domain Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expand Feature2Building with Feature, three assigned archetypes, owned Zones and Faces, and the requested domain-data relationships.

**Architecture:** Keep every new domain concept nested inside the existing Feature2Building stage so the main view remains collapsed and the scoped detail view expands naturally. Replace only the Preprocessing-to-Building edge, preserve downstream simulation flows, and update the private request alongside the executable model.

**Tech Stack:** Markdown, LikeC4 DSL, LikeC4 CLI 1.59.2 through `npx`.

## Global Constraints

- Work only in `C:\github\likec4-testground`.
- Treat `C:\github\RCEnergySimulator` as read-only.
- Do not commit, stage, push, publish to the Wiki, or export PNG files.
- Preserve the existing collapsed main view and relationship-browser behavior.

---

### Task 1: Expand the Feature2Building domain model

**Files:**
- Modify: `likec4/model/simulation-data-flow.c4`

**Interfaces:**
- Consumes: existing `preprocessing`, `feature2Building`, `definitionTables`, and `precomputeBoundary` model elements.
- Produces: nested `feature`, `constructionArchetype`, `systemsArchetype`, `energyLoadsArchetype`, `building`, `zones`, and `faces` elements with the approved relationships.

- [x] **Step 1: Run a source assertion that demonstrates the requested model is absent**

```powershell
$source = Get-Content -Raw likec4\model\simulation-data-flow.c4
if ($source -notmatch "feature = domainObject 'Feature'" -and
    $source -notmatch "faces = domainObject 'Faces'") { exit 1 }
```

Expected: exit code 1 because Feature and Faces do not yet exist.

- [x] **Step 2: Add the nested elements and relationships**

Inside `feature2Building`, add compact `domainObject` elements named `feature`,
`constructionArchetype`, `systemsArchetype`, `energyLoadsArchetype`, and `faces`.
Set `faces.style.multiple` to `true`; retain `zones.style.multiple true`.

Use these exact relationship labels:

```likec4
feature -> constructionArchetype 'emits'
feature -> systemsArchetype 'emits'
feature -> energyLoadsArchetype 'emits'
feature -> building 'supplies geometric information'
building -> zones 'owns'
zones -> faces 'owns'
constructionArchetype -> zones 'supplies Thermal Mass + Infiltration Rate'
constructionArchetype -> faces 'supplies U Value + WWR'
systemsArchetype -> zones 'supplies conditioning systems'
energyLoadsArchetype -> zones 'supplies schedules'
```

Replace the external preprocessing edge with:

```likec4
preprocessing -> feature2Building.feature 'emits'
```

- [x] **Step 3: Run focused model assertions**

```powershell
$source = Get-Content -Raw likec4\model\simulation-data-flow.c4
$required = @(
  "preprocessing -> feature2Building.feature 'emits'",
  "feature -> constructionArchetype 'emits'",
  "feature -> systemsArchetype 'emits'",
  "feature -> energyLoadsArchetype 'emits'",
  "feature -> building 'supplies geometric information'",
  "building -> zones 'owns'",
  "zones -> faces 'owns'"
)
$missing = $required | Where-Object { -not $source.Contains($_) }
if ($missing.Count -gt 0) { $missing; exit 1 }
if ($source.Contains("building -> zones 'creates'")) { exit 1 }
```

Expected: exit code 0 and no missing relationship text.

### Task 2: Synchronize the private request and validate

**Files:**
- Modify: `prompts/2026-08-05-simulation-data-flow.md`
- Verify: `likec4/views/simulation-data-flow.c4`

**Interfaces:**
- Consumes: the expanded model from Task 1 and existing view `feature2BuildingDetails`.
- Produces: a private prompt matching the executable diagram and a validated LikeC4 project.

- [x] **Step 1: Update the private request**

Revise the architectural question, scope, requested flow, and acceptance criteria so they
state that Preprocessing emits Feature; Feature emits the three archetypes and supplies
Building geometry; Building owns Zones; Zones owns multiple Faces; and each archetype
supplies the approved properties to Zones or Faces. Remove obsolete statements that
Preprocessing sends feature identifiers directly to Building or that Building creates Zones.

- [x] **Step 2: Format the LikeC4 source**

Run from `likec4`:

```powershell
npx --yes likec4@1.59.2 format
```

Expected: exit code 0.

- [x] **Step 3: Validate syntax and semantics**

Run from `likec4`:

```powershell
npx --yes likec4@1.59.2 format --check
npx --yes likec4@1.59.2 validate
```

Expected: both commands exit 0.

- [x] **Step 4: Verify scope and repository safety**

```powershell
rg -n "Feature|Archetype|Faces|owns|supplies" likec4\model\simulation-data-flow.c4 prompts\2026-08-05-simulation-data-flow.md
git diff --cached --quiet
git status --short
```

Expected: requested concepts appear in only the private model/prompt documentation;
nothing is staged, no PNG changes are created, and no adjacent repository is modified.
