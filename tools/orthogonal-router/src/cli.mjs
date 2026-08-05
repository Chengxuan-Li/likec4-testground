#!/usr/bin/env node
// Re-route LikeC4 relationship connectors as strictly orthogonal paths with rounded corners,
// persisted as native manual-layout snapshots that both the viewer and the PNG export read.
import { resolve } from 'node:path'
import { loadConfig } from './config.mjs'
import { loadAutoLayoutViews, writeSnapshot } from './snapshot.mjs'

function parseArgs(argv) {
  const args = { workspace: null, config: null, identity: false, views: [], quiet: false }
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a === '--workspace') args.workspace = argv[++i]
    else if (a === '--config') args.config = argv[++i]
    else if (a === '--view') args.views.push(argv[++i])
    else if (a === '--identity') args.identity = true
    else if (a === '--quiet') args.quiet = true
    else throw new Error(`unknown argument: ${a}`)
  }
  args.workspace = resolve(args.workspace ?? process.cwd())
  args.config = args.config ?? resolve(args.workspace, 'routing.config.json')
  return args
}

const args = parseArgs(process.argv.slice(2))
const config = loadConfig(args.config)
const log = args.quiet ? () => {} : (...m) => console.log(...m)

log(`workspace: ${args.workspace}`)
const { views, removed } = await loadAutoLayoutViews(args.workspace, args.views)
if (removed.length > 0) log(`cleared ${removed.length} stale snapshot(s)`)

const selected = args.views.length > 0 ? views.filter(v => args.views.includes(v.id)) : views
const unknown = args.views.filter(id => !views.some(v => v.id === id))
if (unknown.length > 0) {
  console.error(`unknown view id(s): ${unknown.join(', ')}`)
  process.exit(1)
}
if (args.views.length > 0) {
  log(`scoped to ${selected.length} view(s); other views keep their existing snapshots`)
}

let routeView = null
if (!args.identity) {
  ;({ routeView } = await import('./route.mjs'))
}

const report = []
for (const view of selected) {
  const cfg = config.forView(view.id)
  if (!args.identity && !cfg.orthogonal) {
    log(`skip  ${view.id} (orthogonal: false)`)
    continue
  }
  const result = args.identity
    ? { view, routed: 0, fallback: [], violations: [] }
    : routeView(view, cfg)
  const path = writeSnapshot(args.workspace, result.view)
  report.push({ id: view.id, ...result, path })
  const suffix = args.identity
    ? '(identity)'
    : `${result.routed}/${result.view.edges.length} routed` +
      (result.fallback.length > 0 ? `, ${result.fallback.length} fallback` : '') +
      (result.violations.length > 0 ? `, ${result.violations.length} VIOLATIONS` : '')
  log(`write ${view.id.padEnd(26)} ${suffix}`)
}

const violations = report.flatMap(r => r.violations.map(v => `${r.id}: ${v}`))
const fallbacks = report.flatMap(r => r.fallback.map(f => `${r.id}: ${f}`))

if (fallbacks.length > 0) {
  log(`\nedges that no template could route (kept their original spline):`)
  for (const f of fallbacks) log(`  ${f}`)
}

if (violations.length > 0) {
  console.error(`\ngeometry check FAILED with ${violations.length} violation(s):`)
  for (const v of violations) console.error(`  ${v}`)
  process.exit(1)
}

log(`\ngeometry check passed for ${report.length} view(s)`)
