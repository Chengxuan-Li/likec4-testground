// Per-view routing configuration. Orthogonal routing is on by default for every view.
import { readFileSync, existsSync } from 'node:fs'
import JSON5 from 'json5'

export const BUILTIN_DEFAULTS = {
  /** Route this view's edges orthogonally. */
  orthogonal: true,
  /** Corner arc radius in px, clamped to half the shorter adjacent segment. */
  cornerRadius: 14,
  /** Separation between parallel edges sharing a corridor. */
  laneSpacing: 16,
  /** Obstacle inflation around node rectangles. */
  nodeMargin: 10,
  /** Gap left between a route's last point and the target border, for the arrowhead. */
  arrowGap: 11,
  /** Minimum stub length leaving a node border before the first corner. */
  stub: 20,
  /** Vertical offset of an edge label above its path. */
  labelOffset: 22,
}

export function loadConfig(configPath) {
  let file = { default: {}, views: {} }
  if (configPath && existsSync(configPath)) {
    file = JSON5.parse(readFileSync(configPath, 'utf-8'))
  }
  const base = { ...BUILTIN_DEFAULTS, ...(file.default ?? {}) }
  const views = file.views ?? {}
  return {
    forView(viewId) {
      return { ...base, ...(views[viewId] ?? {}) }
    },
  }
}
