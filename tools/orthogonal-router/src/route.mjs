// The corridor router.
//
// Graphviz keeps full control of node placement. For every edge we discard its spline and
// build an orthogonal polyline instead, choosing from a small grammar of turn patterns and
// validating each candidate against the obstacle set. The winner is encoded as a rounded
// cubic path and written back into the view.
import { checkEdgeGeometry } from './check.mjs'
import {
  borderClearance,
  buildIndex,
  channelCandidates,
  freeChannels,
  isCompound,
  segmentClearance,
} from './corridors.mjs'
import {
  EPS,
  centerOf,
  cornerCount,
  overlap1d,
  polylineLength,
  rectOf,
  rectsOverlap,
  segmentHitsRect,
  simplify,
  snapOrthogonal,
  toRoundedBezierPoints,
} from './geometry.mjs'

const SIDES = ['E', 'W', 'N', 'S']
const SIDE_DIR = { E: [1, 0], W: [-1, 0], N: [0, -1], S: [0, 1] }
const SIDE_AXIS = { E: 'x', W: 'x', N: 'y', S: 'y' }

const clamp = (v, lo, hi) => (lo > hi ? (lo + hi) / 2 : Math.min(hi, Math.max(lo, v)))

function sidePad(rect, side) {
  const extent = SIDE_AXIS[side] === 'x' ? rect.y1 - rect.y0 : rect.x1 - rect.x0
  return Math.min(16, extent / 3)
}

/** A point on `side` of `rect`, displaced by `offset` along that side. */
function borderPoint(rect, side, offset) {
  const c = centerOf(rect)
  const pad = sidePad(rect, side)
  if (side === 'E' || side === 'W') {
    return [side === 'E' ? rect.x1 : rect.x0, clamp(c.y + offset, rect.y0 + pad, rect.y1 - pad)]
  }
  return [clamp(c.x + offset, rect.x0 + pad, rect.x1 - pad), side === 'N' ? rect.y0 : rect.y1]
}

const shift = (p, dir, d) => [p[0] + dir[0] * d, p[1] + dir[1] * d]

// ---------------------------------------------------------------------------------------------
// Turn patterns. Each returns a polyline from P0 to Pn, or null when the shape is inapplicable.

const straight = (P0, Pn, axis) =>
  axis === 'x'
    ? Math.abs(P0[1] - Pn[1]) < EPS
      ? [P0, Pn]
      : null
    : Math.abs(P0[0] - Pn[0]) < EPS
      ? [P0, Pn]
      : null

const elbow = (P0, Pn, firstAxis) =>
  firstAxis === 'x' ? [P0, [Pn[0], P0[1]], Pn] : [P0, [P0[0], Pn[1]], Pn]

const zed = (P0, Pn, travelAxis, c) =>
  travelAxis === 'x' ? [P0, [c, P0[1]], [c, Pn[1]], Pn] : [P0, [P0[0], c], [Pn[0], c], Pn]

const ess = (P0, Pn, firstAxis, c1, c2) =>
  firstAxis === 'x'
    ? [P0, [c1, P0[1]], [c1, c2], [Pn[0], c2], Pn]
    : [P0, [P0[0], c1], [c2, c1], [c2, Pn[1]], Pn]

const detour = (P0, Pn, firstAxis, c1, c2, c3) =>
  firstAxis === 'x'
    ? [P0, [c1, P0[1]], [c1, c2], [c3, c2], [c3, Pn[1]], Pn]
    : [P0, [P0[0], c1], [c2, c1], [c2, c3], [Pn[0], c3], Pn]

// ---------------------------------------------------------------------------------------------

/**
 * Every segment must be axis-aligned.
 *
 * This is not redundant with the shape builders: when a corner lands within EPS of an endpoint,
 * `simplify` collapses it and what remains is a single diagonal segment. Rejecting here makes
 * the router try another side or offset instead of emitting a sloped path.
 */
function isOrthogonal(poly) {
  const s = simplify(poly)
  if (s.length < 2) return false
  for (let i = 0; i + 1 < s.length; i++) {
    const dx = Math.abs(s[i + 1][0] - s[i][0])
    const dy = Math.abs(s[i + 1][1] - s[i][1])
    if (dx > EPS && dy > EPS) return false
    if (Math.max(dx, dy) < 2) return false
  }
  return true
}

function directionsOk(poly, ds, dt, minStub) {
  const s = simplify(poly)
  if (s.length < 2) return false
  const first = [s[1][0] - s[0][0], s[1][1] - s[0][1]]
  const last = [s[s.length - 1][0] - s[s.length - 2][0], s[s.length - 1][1] - s[s.length - 2][1]]
  if (first[0] * ds[0] + first[1] * ds[1] <= 0) return false
  // The path must arrive travelling against the target's outward normal.
  if (last[0] * dt[0] + last[1] * dt[1] >= 0) return false
  if (Math.hypot(...first) < minStub || Math.hypot(...last) < minStub) return false
  // No backtracking: consecutive segments must turn, never reverse.
  for (let i = 0; i + 2 < s.length; i++) {
    const a = [s[i + 1][0] - s[i][0], s[i + 1][1] - s[i][1]]
    const b = [s[i + 2][0] - s[i + 1][0], s[i + 2][1] - s[i + 1][1]]
    if (a[0] * b[0] + a[1] * b[1] < -EPS) return false
  }
  return true
}

function polylineClear(poly, obstacles) {
  const s = simplify(poly)
  for (let i = 0; i + 1 < s.length; i++) {
    for (const o of obstacles) {
      if (segmentHitsRect(s[i], s[i + 1], o.rect)) return false
    }
  }
  return true
}

function compoundCrossings(poly, ctx) {
  const s = simplify(poly)
  let count = 0
  for (const c of ctx.compounds) {
    if (ctx.insideCompounds.has(c.id)) continue
    for (let i = 0; i + 1 < s.length; i++) {
      if (segmentHitsRect(s[i], s[i + 1], c.rect)) {
        count++
        break
      }
    }
  }
  return count
}

function laneConflicts(poly, ctx) {
  const s = simplify(poly)
  let count = 0
  for (let i = 0; i + 1 < s.length; i++) {
    const horizontal = Math.abs(s[i][1] - s[i + 1][1]) < EPS
    const coord = horizontal ? s[i][1] : s[i][0]
    const lo = horizontal ? Math.min(s[i][0], s[i + 1][0]) : Math.min(s[i][1], s[i + 1][1])
    const hi = horizontal ? Math.max(s[i][0], s[i + 1][0]) : Math.max(s[i][1], s[i + 1][1])
    if (hi - lo < ctx.cfg.laneSpacing) continue
    for (const used of ctx.lanes) {
      if (used.horizontal !== horizontal) continue
      if (Math.abs(used.coord - coord) >= ctx.cfg.laneSpacing) continue
      if (used.hi <= lo + EPS || used.lo >= hi - EPS) continue
      count++
      break
    }
  }
  return count
}

/**
 * How many already-routed edges this candidate would cross.
 *
 * Two orthogonal edges cross when one's horizontal run passes through the span of the other's
 * vertical run. Weighted below the cost of a corner, so the router will re-order parallel runs
 * to avoid a crossing but will not buy its way out with an extra elbow.
 */
function crossings(poly, ctx) {
  const s = simplify(poly)
  let count = 0
  for (let i = 0; i + 1 < s.length; i++) {
    const horizontal = Math.abs(s[i][1] - s[i + 1][1]) < EPS
    const coord = horizontal ? s[i][1] : s[i][0]
    const lo = horizontal ? Math.min(s[i][0], s[i + 1][0]) : Math.min(s[i][1], s[i + 1][1])
    const hi = horizontal ? Math.max(s[i][0], s[i + 1][0]) : Math.max(s[i][1], s[i + 1][1])
    for (const used of ctx.lanes) {
      if (used.horizontal === horizontal) continue
      const [h, v] = horizontal ? [{ coord, lo, hi }, used] : [used, { coord, lo, hi }]
      if (v.coord > h.lo && v.coord < h.hi && h.coord > v.lo && h.coord < v.hi) count++
    }
  }
  return count
}

function anchorConflicts(nodeId, side, point, ctx) {
  const key = `${nodeId}:${side}`
  const used = ctx.anchors.get(key) ?? []
  const coord = SIDE_AXIS[side] === 'x' ? point[1] : point[0]
  return used.filter(u => Math.abs(u - coord) < ctx.cfg.laneSpacing).length
}

function scoreRoute(poly, ctx, meta) {
  const s = simplify(poly)
  const corners = cornerCount(poly)
  let penalty = 0
  for (let i = 0; i + 1 < s.length; i++) {
    const clr = segmentClearance(s[i], s[i + 1], ctx.obstacles)
    if (clr < ctx.cfg.laneSpacing) penalty += (ctx.cfg.laneSpacing - clr) * 60
    const border = borderClearance(s[i], s[i + 1], ctx.compounds)
    if (border < ctx.cfg.laneSpacing) penalty += (ctx.cfg.laneSpacing - border) * 60
    // A segment shorter than a full corner diameter forces the radius to be clamped, which
    // reads as a pinched elbow rather than a rounded one.
    if (corners > 0) {
      const len = Math.abs(s[i + 1][0] - s[i][0]) + Math.abs(s[i + 1][1] - s[i][1])
      const want = ctx.cfg.cornerRadius * 2
      if (len < want) penalty += (want - len) * 25
    }
  }
  // Break ties towards attaching at the middle of a node's side.
  penalty += (Math.abs(meta.sOff) + Math.abs(meta.tOff)) * 2.5
  penalty += laneConflicts(poly, ctx) * 5000
  penalty += crossings(poly, ctx) * 2500
  penalty += compoundCrossings(poly, ctx) * 800
  penalty += meta.anchorConflicts * 3500
  penalty += ctx.sidePenalty(meta.sSide) + ctx.sidePenalty(meta.tSide, true)
  return cornerCount(poly) * 9000 + polylineLength(poly) + penalty
}

function recordRoute(poly, meta, ctx) {
  const s = simplify(poly)
  for (let i = 0; i + 1 < s.length; i++) {
    const horizontal = Math.abs(s[i][1] - s[i + 1][1]) < EPS
    ctx.lanes.push({
      horizontal,
      coord: horizontal ? s[i][1] : s[i][0],
      lo: horizontal ? Math.min(s[i][0], s[i + 1][0]) : Math.min(s[i][1], s[i + 1][1]),
      hi: horizontal ? Math.max(s[i][0], s[i + 1][0]) : Math.max(s[i][1], s[i + 1][1]),
    })
  }
  for (const [nodeId, side, point] of [
    [meta.sourceId, meta.sSide, s[0]],
    [meta.targetId, meta.tSide, s[s.length - 1]],
  ]) {
    const key = `${nodeId}:${side}`
    const list = ctx.anchors.get(key) ?? []
    list.push(SIDE_AXIS[side] === 'x' ? point[1] : point[0])
    ctx.anchors.set(key, list)
  }
}

/** Every candidate polyline for one (source side, target side, offset) combination. */
function* shapesFor(P0, Pn, ds, dt, ctx, deep) {
  const dsAxis = ds[0] !== 0 ? 'x' : 'y'
  const dtAxis = dt[0] !== 0 ? 'x' : 'y'
  const { cfg, bounds, obstacles } = ctx

  if (dsAxis === dtAxis) {
    const s = straight(P0, Pn, dsAxis)
    if (s) yield s

    const travelAxis = dsAxis === 'x' ? 'x' : 'y'
    // The middle segment runs perpendicular to the exit direction.
    const gaps =
      travelAxis === 'x'
        ? freeChannels(obstacles, 'y', P0[1], Pn[1], bounds.x0, bounds.x1)
        : freeChannels(obstacles, 'x', P0[0], Pn[0], bounds.y0, bounds.y1)
    const preferred =
      travelAxis === 'x'
        ? [(P0[0] + Pn[0]) / 2, P0[0] + ds[0] * cfg.stub, Pn[0] + dt[0] * cfg.stub]
        : [(P0[1] + Pn[1]) / 2, P0[1] + ds[1] * cfg.stub, Pn[1] + dt[1] * cfg.stub]
    for (const c of channelCandidates(gaps, cfg.laneSpacing, preferred)) {
      yield zed(P0, Pn, travelAxis, c)
    }

    if (deep) {
      const otherGaps =
        travelAxis === 'x'
          ? freeChannels(obstacles, 'x', P0[0], Pn[0], bounds.y0, bounds.y1)
          : freeChannels(obstacles, 'y', P0[1], Pn[1], bounds.x0, bounds.x1)
      const c1s = channelCandidates(gaps, cfg.laneSpacing, preferred).slice(0, 5)
      const c2s = channelCandidates(otherGaps, cfg.laneSpacing).slice(0, 5)
      const c3 = travelAxis === 'x' ? Pn[0] + dt[0] * cfg.stub : Pn[1] + dt[1] * cfg.stub
      for (const c1 of c1s) for (const c2 of c2s) yield detour(P0, Pn, travelAxis, c1, c2, c3)
    }
    return
  }

  yield elbow(P0, Pn, dsAxis)

  if (deep) {
    const firstAxis = dsAxis
    const c1Gaps =
      firstAxis === 'x'
        ? freeChannels(obstacles, 'y', P0[1], Pn[1], bounds.x0, bounds.x1)
        : freeChannels(obstacles, 'x', P0[0], Pn[0], bounds.y0, bounds.y1)
    const c2Gaps =
      firstAxis === 'x'
        ? freeChannels(obstacles, 'x', P0[0], Pn[0], bounds.y0, bounds.y1)
        : freeChannels(obstacles, 'y', P0[1], Pn[1], bounds.x0, bounds.x1)
    const c1s = channelCandidates(c1Gaps, cfg.laneSpacing).slice(0, 5)
    const c2s = channelCandidates(c2Gaps, cfg.laneSpacing).slice(0, 5)
    for (const c1 of c1s) for (const c2 of c2s) yield ess(P0, Pn, firstAxis, c1, c2)
  }
}

function routeEdge(edge, ctx) {
  const source = ctx.byId.get(edge.source)
  const target = ctx.byId.get(edge.target)
  if (!source || !target || source.id === target.id) return null

  const sRect = rectOf(source)
  const tRect = rectOf(target)

  const exclude = new Set([
    edge.source,
    edge.target,
    ...ctx.ancestors(edge.source),
    ...ctx.ancestors(edge.target),
    ...ctx.descendants(edge.source),
    ...ctx.descendants(edge.target),
  ])
  // The endpoints are excluded from the inflated obstacle set so a stub leaving a border is not
  // read as a collision. Their raw rectangles go back in, which stops a route from looping back
  // through the very box it just left — the interior test ignores segments that merely graze a
  // border, so legitimate stubs still pass.
  const obstacles = [
    ...ctx.allObstacles.filter(o => !exclude.has(o.id)),
    ...[source, target].filter(n => !isCompound(n)).map(n => ({ id: n.id, raw: rectOf(n), rect: rectOf(n) })),
  ]
  ctx.obstacles = obstacles
  ctx.insideCompounds = new Set([...ctx.ancestors(edge.source), ...ctx.ancestors(edge.target)])

  const ls = ctx.cfg.laneSpacing
  const base = [0, ls, -ls, ls * 2, -ls * 2]

  // When the boxes overlap on the axis perpendicular to a side, offer the offset that lands both
  // attachment points on the overlap's midpoint. Without it a clean straight run is only
  // reachable by coincidence, and the router settles for a needless pair of corners.
  const alignY = overlap1d(sRect.y0, sRect.y1, tRect.y0, tRect.y1)
  const alignX = overlap1d(sRect.x0, sRect.x1, tRect.x0, tRect.x1)
  const offsetsFor = (side, rect) => {
    const c = centerOf(rect)
    if (SIDE_AXIS[side] === 'x' && alignY) return [...base, (alignY[0] + alignY[1]) / 2 - c.y]
    if (SIDE_AXIS[side] === 'y' && alignX) return [...base, (alignX[0] + alignX[1]) / 2 - c.x]
    return base
  }

  let best = null
  for (const deep of [false, true]) {
    for (const sSide of SIDES) {
      for (const tSide of SIDES) {
        const ds = SIDE_DIR[sSide]
        const dt = SIDE_DIR[tSide]
        for (const sOff of offsetsFor(sSide, sRect)) {
          for (const tOff of offsetsFor(tSide, tRect)) {
            const P0 = borderPoint(sRect, sSide, sOff)
            const Pn = shift(borderPoint(tRect, tSide, tOff), dt, ctx.cfg.arrowGap)
            const meta = {
              sSide,
              tSide,
              sOff,
              tOff,
              sourceId: edge.source,
              targetId: edge.target,
              anchorConflicts:
                anchorConflicts(edge.source, sSide, P0, ctx) +
                anchorConflicts(edge.target, tSide, Pn, ctx),
            }
            for (const raw of shapesFor(P0, Pn, ds, dt, ctx, deep)) {
              if (!raw) continue
              const poly = snapOrthogonal(raw)
              if (!isOrthogonal(poly)) continue
              if (!directionsOk(poly, ds, dt, Math.min(ctx.cfg.stub, 10))) continue
              if (!polylineClear(poly, obstacles)) continue
              const score = scoreRoute(poly, ctx, meta)
              if (!best || score < best.score) best = { poly, score, meta }
            }
          }
        }
      }
    }
    if (best) break
  }
  return best
}

// ---------------------------------------------------------------------------------------------
// Labels

function labelCandidates(poly, box, cfg) {
  const s = simplify(poly)
  const segments = []
  for (let i = 0; i + 1 < s.length; i++) {
    const horizontal = Math.abs(s[i][1] - s[i + 1][1]) < EPS
    const len = horizontal ? Math.abs(s[i + 1][0] - s[i][0]) : Math.abs(s[i + 1][1] - s[i][1])
    segments.push({ a: s[i], b: s[i + 1], horizontal, len })
  }
  segments.sort((p, q) => q.len - p.len)

  const out = []
  const slide = [0.5, 0.35, 0.65, 0.25, 0.75, 0.15, 0.85]
  for (const seg of segments) {
    const need = (seg.horizontal ? box.width : box.height) + 2 * cfg.cornerRadius
    if (seg.len < need) continue
    // Sides are tried in preference order: the conventional side of the line first, then the
    // opposite side. Without the far side, two closely spaced parallel runs have nowhere to put
    // their labels and end up stacked on top of each other.
    for (const far of [false, true]) {
      for (const t of slide) {
        if (seg.horizontal) {
          const mid = seg.a[0] + (seg.b[0] - seg.a[0]) * t
          const y = far ? seg.a[1] + 6 : seg.a[1] - cfg.labelOffset
          out.push({ x: Math.round(mid - box.width / 2), y: Math.round(y) })
        } else {
          const mid = seg.a[1] + (seg.b[1] - seg.a[1]) * t
          const x = far ? seg.a[0] + 6 : seg.a[0] - box.width - 2
          out.push({ x: Math.round(x), y: Math.round(mid - box.height / 2) })
        }
      }
    }
  }
  return out
}

function placeLabel(edge, poly, ctx) {
  const box = edge.labelBBox
  if (!box) return null
  const asRect = p => ({ x0: p.x, y0: p.y, x1: p.x + box.width, y1: p.y + box.height })
  // Pad the test so labels that merely abut still count as colliding — flush-stacked chips read
  // as one smudged block.
  const pad = 5
  const padded = r => ({ x0: r.x0 - pad, y0: r.y0 - pad, x1: r.x1 + pad, y1: r.y1 + pad })
  const blockers = [...ctx.allObstacles.map(o => o.raw), ...ctx.placedLabels.map(padded)]

  for (const cand of labelCandidates(poly, box, ctx.cfg)) {
    const r = asRect(cand)
    if (blockers.some(b => rectsOverlap(r, b))) continue
    ctx.placedLabels.push(r)
    return { ...box, x: cand.x, y: cand.y }
  }
  const fallback = labelCandidates(poly, box, ctx.cfg)[0]
  if (fallback) {
    ctx.placedLabels.push(asRect(fallback))
    return { ...box, x: fallback.x, y: fallback.y }
  }
  return null
}

// ---------------------------------------------------------------------------------------------

export function routeView(view, cfg) {
  const index = buildIndex(view, cfg)
  const margin = 80
  const bounds = {
    x0: view.bounds.x - margin,
    y0: view.bounds.y - margin,
    x1: view.bounds.x + view.bounds.width + margin,
    y1: view.bounds.y + view.bounds.height + margin,
  }

  const preferredExit = { LR: 'E', RL: 'W', TB: 'S', BT: 'N' }[view.autoLayout?.direction] ?? 'E'
  const preferredEntry = { E: 'W', W: 'E', S: 'N', N: 'S' }[preferredExit]

  const ctx = {
    cfg,
    bounds,
    byId: index.byId,
    ancestors: index.ancestors,
    descendants: index.descendants,
    allObstacles: index.obstacles,
    compounds: index.compounds,
    obstacles: index.obstacles,
    insideCompounds: new Set(),
    lanes: [],
    anchors: new Map(),
    placedLabels: [],
    sidePenalty: (side, isEntry = false) => (side === (isEntry ? preferredEntry : preferredExit) ? 0 : 600),
  }

  const edges = []
  const fallback = []
  const violations = []
  let routed = 0

  for (const edge of view.edges) {
    const best = routeEdge(edge, ctx)
    if (!best) {
      fallback.push(`${edge.id} (${edge.source} -> ${edge.target}): no orthogonal route found`)
      edges.push(edge)
      continue
    }

    const points = toRoundedBezierPoints(best.poly, cfg.cornerRadius)
    if (!points) {
      fallback.push(`${edge.id}: could not encode path`)
      edges.push(edge)
      continue
    }

    const problems = checkEdgeGeometry(points, ctx.obstacles)
    for (const p of problems) violations.push(`${edge.id} (${edge.source} -> ${edge.target}): ${p}`)

    recordRoute(best.poly, best.meta, ctx)
    const labelBBox = placeLabel(edge, best.poly, ctx)
    edges.push({ ...edge, points, ...(labelBBox ? { labelBBox } : {}) })
    routed++
  }

  const routedView = { ...view, edges, bounds: expandBounds(view, edges) }
  return { view: routedView, routed, fallback, violations }
}

/** Grow the view box so no route is clipped out of the export. */
function expandBounds(view, edges) {
  let { x, y, width, height } = view.bounds
  let x0 = x
  let y0 = y
  let x1 = x + width
  let y1 = y + height
  for (const e of edges) {
    for (const [px, py] of e.points) {
      x0 = Math.min(x0, px)
      y0 = Math.min(y0, py)
      x1 = Math.max(x1, px)
      y1 = Math.max(y1, py)
    }
    if (e.labelBBox) {
      x0 = Math.min(x0, e.labelBBox.x)
      y0 = Math.min(y0, e.labelBBox.y)
      x1 = Math.max(x1, e.labelBBox.x + e.labelBBox.width)
      y1 = Math.max(y1, e.labelBBox.y + e.labelBBox.height)
    }
  }
  return { x: x0, y: y0, width: x1 - x0, height: y1 - y0 }
}
