// Human-readable summary of the routes chosen for a view.
import { loadAutoLayoutViews } from './snapshot.mjs'
import { loadConfig } from './config.mjs'
import { routeView } from './route.mjs'
import { toCubics } from './geometry.mjs'

const [workspace, viewId] = process.argv.slice(2)
const cfg = loadConfig(`${workspace}/routing.config.json`).forView(viewId)
const { views } = await loadAutoLayoutViews(workspace)
const view = views.find(v => v.id === viewId)
const result = routeView(view, cfg)

/** Recover the underlying orthogonal polyline from the emitted cubic path. */
function corners(points) {
  const cubics = toCubics(points)
  return cubics.filter(c => Math.abs(c[0][0] - c[3][0]) > 1 && Math.abs(c[0][1] - c[3][1]) > 1).length
}

let totalCorners = 0
for (const e of result.view.edges) {
  const n = corners(e.points)
  totalCorners += n
  const label = (e.label ?? '').replace(/\s+/g, ' ').slice(0, 28)
  console.log(
    `${String(n)} corner(s)  ${`${e.source} -> ${e.target}`.padEnd(52)} ${label}\n` +
      `             ${e.points.map(p => `${p[0]},${p[1]}`).join(' ')}`,
  )
}
console.log(`\n${result.view.edges.length} edges, ${totalCorners} corners total`)
console.log(`fallback: ${result.fallback.length}, violations: ${result.violations.length}`)
