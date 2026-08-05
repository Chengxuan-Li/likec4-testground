// Reading layouted views from likec4 and writing them back as native manual-layout snapshots.
//
// `.likec4.snap` files are parsed by likec4 with JSON5 and written with
// `stringify(view, { space: 2, quote: "'" })`. Matching that exactly keeps the files diffable
// and hand-editable, and identical to what the viewer's own "save manual layout" produces.
import { existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import JSON5 from 'json5'
import { LikeC4 } from 'likec4'

const SNAP_EXT = '.likec4.snap'

export function snapshotDir(workspace) {
  return join(workspace, '.likec4')
}

export function snapshotPath(workspace, viewId) {
  return join(snapshotDir(workspace), `${viewId}${SNAP_EXT}`)
}

/**
 * Remove manual-layout snapshots so the next `diagrams()` call returns pristine auto-layout.
 * Without this the router would consume its own previous output and re-route geometry that is
 * already orthogonal.
 *
 * Only the views about to be regenerated are cleared. Clearing everything while writing back a
 * subset would silently strip routing from the views not being processed.
 *
 * @param viewIds restrict to these view ids; omit to clear every snapshot
 */
export function clearSnapshots(workspace, viewIds = null) {
  const dir = snapshotDir(workspace)
  if (!existsSync(dir)) return []
  const wanted = viewIds && viewIds.length > 0 ? new Set(viewIds.map(id => `${id}${SNAP_EXT}`)) : null
  const removed = []
  for (const name of readdirSync(dir)) {
    if (name === SNAP_EXT || !name.endsWith(SNAP_EXT)) continue
    if (wanted && !wanted.has(name)) continue
    rmSync(join(dir, name))
    removed.push(name)
  }
  return removed
}

/**
 * Load views with the ones being regenerated guaranteed to be pristine auto-layout.
 *
 * @param viewIds restrict regeneration to these view ids; omit for the whole workspace
 */
export async function loadAutoLayoutViews(workspace, viewIds = null) {
  const removed = clearSnapshots(workspace, viewIds)
  const likec4 = await LikeC4.fromWorkspace(workspace, { logger: false })
  const views = await likec4.diagrams()
  const scope = viewIds && viewIds.length > 0 ? new Set(viewIds) : null
  for (const view of views) {
    if (scope && !scope.has(view.id)) continue
    if (view._layout === 'manual') {
      throw new Error(
        `view ${view.id} came back as manual layout after clearing snapshots — stale state`,
      )
    }
  }
  return { views, removed }
}

export function writeSnapshot(workspace, view) {
  const dir = snapshotDir(workspace)
  mkdirSync(dir, { recursive: true })
  const path = snapshotPath(workspace, view.id)
  writeFileSync(path, JSON5.stringify(view, { space: 2, quote: "'" }) + '\n', 'utf-8')
  return path
}
