// Verification that a routed edge really is strictly orthogonal.
//
// This is what makes "strictly orthogonal" an honest claim rather than an impression: every
// cubic in the emitted path must be either an axis-aligned straight run or a quarter-circle
// corner, and no part of the path may cross a node rectangle.
import { EPS, cubicBBox, rectsOverlap, toCubics } from './geometry.mjs'

const ARC_EPS = 1.5

const sameX = (a, b) => Math.abs(a[0] - b[0]) < EPS
const sameY = (a, b) => Math.abs(a[1] - b[1]) < EPS

function classifyCubic([p0, c1, c2, p3]) {
  const straightH = sameY(p0, p3) && sameY(p0, c1) && sameY(p0, c2)
  const straightV = sameX(p0, p3) && sameX(p0, c1) && sameX(p0, c2)
  if (straightH || straightV) return { kind: 'straight' }

  // A corner arc turns exactly 90 degrees: it leaves p0 on one axis and arrives at p3 on the
  // other, and its bounding box is square.
  const leavesH = sameY(p0, c1)
  const leavesV = sameX(p0, c1)
  const arrivesH = sameY(p3, c2)
  const arrivesV = sameX(p3, c2)
  const turns = (leavesH && arrivesV) || (leavesV && arrivesH)
  if (!turns) return { kind: 'invalid', why: 'neither axis-aligned nor a 90-degree turn' }

  const dx = Math.abs(p3[0] - p0[0])
  const dy = Math.abs(p3[1] - p0[1])
  if (Math.abs(dx - dy) > ARC_EPS) {
    return { kind: 'invalid', why: `corner is not a quarter arc (dx=${dx.toFixed(1)} dy=${dy.toFixed(1)})` }
  }
  return { kind: 'corner', radius: dx }
}

/**
 * @param {number[][]} points flat `1 + 3n` point array
 * @param {{id: string, rect: object}[]} obstacles rectangles the path must not cross
 * @returns {string[]} violation messages, empty when the path is clean
 */
export function checkEdgeGeometry(points, obstacles) {
  const problems = []
  if (!Array.isArray(points) || points.length < 4) {
    return ['path has fewer than 4 points']
  }
  if ((points.length - 1) % 3 !== 0) {
    problems.push(`path length ${points.length} is not 1 + 3n`)
  }

  const cubics = toCubics(points)
  for (const [i, cubic] of cubics.entries()) {
    const cls = classifyCubic(cubic)
    if (cls.kind === 'invalid') problems.push(`segment ${i}: ${cls.why}`)
  }

  for (const [i, cubic] of cubics.entries()) {
    const box = cubicBBox(cubic)
    for (const o of obstacles) {
      if (rectsOverlap(box, o.rect)) problems.push(`segment ${i} crosses ${o.id}`)
    }
  }

  return problems
}
