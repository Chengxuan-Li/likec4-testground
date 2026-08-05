// Obstacle set and on-demand routing channels.
//
// Rather than precomputing a global corridor grid (which is too conservative — a band that is
// occupied somewhere is still free everywhere else), channels are computed per travel segment:
// project every obstacle that overlaps the segment's travel span onto the perpendicular axis,
// merge, and take what is left.
import { freeGaps, inflate, rectOf } from './geometry.mjs'

export const isCompound = node => Array.isArray(node.children) && node.children.length > 0

export function buildIndex(view, cfg) {
  const byId = new Map(view.nodes.map(n => [n.id, n]))

  const ancestors = id => {
    const out = []
    let cur = byId.get(id)
    while (cur?.parent) {
      out.push(cur.parent)
      cur = byId.get(cur.parent)
    }
    return out
  }

  const descendants = id => {
    const node = byId.get(id)
    if (!node) return []
    const out = []
    const stack = [...(node.children ?? [])]
    while (stack.length > 0) {
      const child = stack.pop()
      out.push(child)
      stack.push(...(byId.get(child)?.children ?? []))
    }
    return out
  }

  // Only leaves are hard obstacles. Compounds are pale structural frames; crossing one is
  // allowed but penalised when neither endpoint lives inside it.
  const obstacles = view.nodes
    .filter(n => !isCompound(n))
    .map(n => ({ id: n.id, raw: rectOf(n), rect: inflate(rectOf(n), cfg.nodeMargin) }))

  const compounds = view.nodes
    .filter(isCompound)
    .map(n => ({ id: n.id, raw: rectOf(n), rect: rectOf(n) }))

  return { byId, obstacles, compounds, ancestors, descendants }
}

/**
 * Free intervals on the axis perpendicular to travel.
 *
 * @param axis 'x' when the segment travels horizontally, 'y' when vertically
 * @param spanLo,spanHi extent of the travel along `axis`
 * @param rangeLo,rangeHi bounds of the perpendicular axis to search within
 */
export function freeChannels(obstacles, axis, spanLo, spanHi, rangeLo, rangeHi) {
  const lo = Math.min(spanLo, spanHi)
  const hi = Math.max(spanLo, spanHi)
  const blocked = []
  for (const o of obstacles) {
    if (axis === 'x') {
      if (o.rect.x1 > lo && o.rect.x0 < hi) blocked.push([o.rect.y0, o.rect.y1])
    } else {
      if (o.rect.y1 > lo && o.rect.y0 < hi) blocked.push([o.rect.x0, o.rect.x1])
    }
  }
  return freeGaps(blocked, rangeLo, rangeHi)
}

/** Candidate travel coordinates drawn from the free channels, widest and roomiest first. */
export function channelCandidates(gaps, laneSpacing, preferred = []) {
  const out = []
  for (const [a, b] of gaps) {
    const width = b - a
    if (width < 6) continue
    const mid = (a + b) / 2
    out.push(mid)
    if (width > laneSpacing * 3) out.push(mid - laneSpacing, mid + laneSpacing)
    if (width > laneSpacing * 6) out.push(mid - laneSpacing * 2, mid + laneSpacing * 2)
    for (const p of preferred) {
      if (p > a + 4 && p < b - 4) out.push(p)
    }
  }
  return [...new Set(out.map(v => Math.round(v * 2) / 2))]
}

/**
 * Distance from a segment to the nearest parallel border of any compound it runs alongside.
 *
 * Running a connector a few pixels from a group's frame reads as an accident. Crossing a border
 * perpendicularly is fine and unavoidable, so only the borders parallel to the segment count.
 */
export function borderClearance(p, q, compounds) {
  const horizontal = Math.abs(p[1] - q[1]) < Math.abs(p[0] - q[0])
  const lo = horizontal ? Math.min(p[0], q[0]) : Math.min(p[1], q[1])
  const hi = horizontal ? Math.max(p[0], q[0]) : Math.max(p[1], q[1])
  const coord = horizontal ? p[1] : p[0]
  let best = Infinity
  for (const c of compounds) {
    const r = c.raw
    const [sLo, sHi] = horizontal ? [r.x0, r.x1] : [r.y0, r.y1]
    if (sHi <= lo || sLo >= hi) continue
    const [bLo, bHi] = horizontal ? [r.y0, r.y1] : [r.x0, r.x1]
    best = Math.min(best, Math.abs(coord - bLo), Math.abs(coord - bHi))
  }
  return best
}

/** Lateral clearance between an axis-aligned segment and the obstacles alongside it. */
export function segmentClearance(p, q, obstacles) {
  const horizontal = Math.abs(p[1] - q[1]) < Math.abs(p[0] - q[0])
  const lo = horizontal ? Math.min(p[0], q[0]) : Math.min(p[1], q[1])
  const hi = horizontal ? Math.max(p[0], q[0]) : Math.max(p[1], q[1])
  const coord = horizontal ? p[1] : p[0]
  let best = Infinity
  for (const o of obstacles) {
    const r = o.raw
    const [sLo, sHi] = horizontal ? [r.x0, r.x1] : [r.y0, r.y1]
    if (sHi <= lo || sLo >= hi) continue
    const [cLo, cHi] = horizontal ? [r.y0, r.y1] : [r.x0, r.x1]
    const gap = coord < cLo ? cLo - coord : coord > cHi ? coord - cHi : 0
    best = Math.min(best, gap)
  }
  return best
}
