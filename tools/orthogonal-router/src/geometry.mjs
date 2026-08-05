// Rectangles, orthogonal polylines, and the polyline -> cubic-bezier encoding that likec4's
// renderer consumes.
//
// likec4 draws an edge with `bezierPath(points)`, which emits `M p0 C p1 p2 p3 C p4 p5 p6 …`.
// So the wire format is a flat array of 1 + 3n points. A straight run is a cubic whose control
// points are collinear with its ends; a rounded corner is a quarter arc approximated by a cubic
// with control points at kappa * r. Nothing in the renderer needs to change.

export const EPS = 0.75
const KAPPA = 0.5522847498307936

export const rectOf = node => ({
  x0: node.x,
  y0: node.y,
  x1: node.x + node.width,
  y1: node.y + node.height,
})

export const inflate = (r, m) => ({ x0: r.x0 - m, y0: r.y0 - m, x1: r.x1 + m, y1: r.y1 + m })

export const centerOf = r => ({ x: (r.x0 + r.x1) / 2, y: (r.y0 + r.y1) / 2 })

export const overlap1d = (a0, a1, b0, b1) => {
  const lo = Math.max(a0, b0)
  const hi = Math.min(a1, b1)
  return hi > lo ? [lo, hi] : null
}

/** Does an axis-aligned segment touch a rectangle's interior? Endpoints grazing a border are ok. */
export function segmentHitsRect(p, q, r) {
  const sx0 = Math.min(p[0], q[0])
  const sx1 = Math.max(p[0], q[0])
  const sy0 = Math.min(p[1], q[1])
  const sy1 = Math.max(p[1], q[1])
  return sx1 > r.x0 + EPS && sx0 < r.x1 - EPS && sy1 > r.y0 + EPS && sy0 < r.y1 - EPS
}

export function polylineHitsRect(points, r) {
  for (let i = 0; i + 1 < points.length; i++) {
    if (segmentHitsRect(points[i], points[i + 1], r)) return true
  }
  return false
}

export function polylineLength(points) {
  let total = 0
  for (let i = 0; i + 1 < points.length; i++) {
    total += Math.abs(points[i + 1][0] - points[i][0]) + Math.abs(points[i + 1][1] - points[i][1])
  }
  return total
}

/** Drop consecutive duplicates and collapse collinear runs into single segments. */
export function simplify(points) {
  const out = []
  for (const p of points) {
    const last = out[out.length - 1]
    if (last && Math.abs(last[0] - p[0]) < EPS && Math.abs(last[1] - p[1]) < EPS) continue
    out.push([p[0], p[1]])
  }
  for (let i = 1; i < out.length - 1; ) {
    const [a, b, c] = [out[i - 1], out[i], out[i + 1]]
    const collinear =
      (Math.abs(a[0] - b[0]) < EPS && Math.abs(b[0] - c[0]) < EPS) ||
      (Math.abs(a[1] - b[1]) < EPS && Math.abs(b[1] - c[1]) < EPS)
    if (collinear) out.splice(i, 1)
    else i++
  }
  return out
}

export function cornerCount(points) {
  return Math.max(0, simplify(points).length - 2)
}

/**
 * Round a polyline to integers and force every segment to be exactly axis-aligned.
 *
 * Candidate shapes are built from box centres and channel midpoints, so a segment can end up a
 * fraction of a pixel off true. Left alone, that sub-pixel slop rounds into a visible one-pixel
 * diagonal in the emitted path. Snapping first means every later step — collision checks,
 * scoring, encoding and verification — operates on the exact geometry that gets drawn.
 *
 * Only near-miss segments are snapped; a genuinely diagonal segment is left alone so the
 * orthogonality gate rejects it rather than silently straightening a wrong route.
 */
export function snapOrthogonal(polyline, tolerance = 2) {
  const pts = polyline.map(p => [Math.round(p[0]), Math.round(p[1])])
  for (let i = 0; i + 1 < pts.length; i++) {
    const dx = Math.abs(pts[i + 1][0] - pts[i][0])
    const dy = Math.abs(pts[i + 1][1] - pts[i][1])
    if (dx === 0 || dy === 0) continue
    if (Math.min(dx, dy) > tolerance) continue
    if (dx <= dy) pts[i + 1][0] = pts[i][0]
    else pts[i + 1][1] = pts[i][1]
  }
  return simplify(pts)
}

const sub = (a, b) => [a[0] - b[0], a[1] - b[1]]
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1])

function unit(a, b) {
  const d = sub(b, a)
  const len = Math.hypot(d[0], d[1])
  return len < EPS ? [0, 0] : [d[0] / len, d[1] / len]
}

const along = (p, dir, t) => [p[0] + dir[0] * t, p[1] + dir[1] * t]

/**
 * Encode an orthogonal polyline as the flat `1 + 3n` cubic point array likec4 renders,
 * rounding every interior corner.
 *
 * Each corner radius is clamped to half of the shorter adjacent segment, which guarantees two
 * neighbouring corners can never overlap.
 */
export function toRoundedBezierPoints(polyline, cornerRadius) {
  const pts = simplify(polyline)
  if (pts.length < 2) return null

  const radii = []
  for (let i = 1; i < pts.length - 1; i++) {
    const before = dist(pts[i - 1], pts[i])
    const after = dist(pts[i], pts[i + 1])
    radii[i] = Math.max(0, Math.min(cornerRadius, before / 2, after / 2))
  }

  const out = [pts[0]]
  let cursor = pts[0]

  const emitStraight = to => {
    if (dist(cursor, to) < EPS) return
    const d = sub(to, cursor)
    out.push(
      [cursor[0] + d[0] / 3, cursor[1] + d[1] / 3],
      [cursor[0] + (d[0] * 2) / 3, cursor[1] + (d[1] * 2) / 3],
      to,
    )
    cursor = to
  }

  for (let i = 1; i < pts.length - 1; i++) {
    const v = pts[i]
    const r = radii[i]
    const inDir = unit(pts[i - 1], v)
    const outDir = unit(v, pts[i + 1])
    if (r < EPS) {
      emitStraight(v)
      continue
    }
    const arcStart = along(v, inDir, -r)
    const arcEnd = along(v, outDir, r)
    emitStraight(arcStart)
    out.push(along(arcStart, inDir, KAPPA * r), along(arcEnd, outDir, -KAPPA * r), arcEnd)
    cursor = arcEnd
  }

  emitStraight(pts[pts.length - 1])
  if (out.length < 4) return null
  // likec4's renderer truncates coordinates to integers, so emit integers and keep what the
  // geometry checker inspects identical to what is drawn.
  return out.map(p => [Math.round(p[0]), Math.round(p[1])])
}

/** Split a flat `1 + 3n` array back into cubic segments for verification. */
export function toCubics(points) {
  const cubics = []
  for (let i = 0; i + 3 < points.length; i += 3) {
    cubics.push([points[i], points[i + 1], points[i + 2], points[i + 3]])
  }
  return cubics
}

export function cubicBBox(c) {
  const xs = c.map(p => p[0])
  const ys = c.map(p => p[1])
  return { x0: Math.min(...xs), y0: Math.min(...ys), x1: Math.max(...xs), y1: Math.max(...ys) }
}

export const rectsOverlap = (a, b) =>
  a.x1 > b.x0 + EPS && a.x0 < b.x1 - EPS && a.y1 > b.y0 + EPS && a.y0 < b.y1 - EPS

/**
 * Merge intervals and return the free gaps between them, bounded by [lo, hi].
 * This is how a routing channel is found: project every obstacle that overlaps the travel span
 * onto the perpendicular axis, then take what is left.
 */
export function freeGaps(intervals, lo, hi) {
  const sorted = intervals
    .map(([a, b]) => [Math.min(a, b), Math.max(a, b)])
    .sort((a, b) => a[0] - b[0])
  const merged = []
  for (const iv of sorted) {
    const last = merged[merged.length - 1]
    if (last && iv[0] <= last[1]) last[1] = Math.max(last[1], iv[1])
    else merged.push([iv[0], iv[1]])
  }
  const gaps = []
  let cursor = lo
  for (const [a, b] of merged) {
    if (a > cursor) gaps.push([cursor, Math.min(a, hi)])
    cursor = Math.max(cursor, b)
    if (cursor >= hi) break
  }
  if (cursor < hi) gaps.push([cursor, hi])
  return gaps.filter(([a, b]) => b > a)
}
