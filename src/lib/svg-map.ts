import { feature, mesh } from "topojson-client"
import type { GeometryCollection, Topology } from "topojson-specification"
import countries from "world-atlas/countries-50m.json"

// Static maps drawn at build time from Natural Earth outlines, so a page
// loads no map library and no tiles. Shapes are cut to the frame plus a
// margin, so the page carries only what is visible, and rounded to whole
// units with short steps dropped: at the sizes used a unit is about a
// pixel. Two projections: Web Mercator like the interactive map at
// /angriffe/, for its previews, and the Lambert azimuthal equal-area
// projection the EU uses for its own maps of Europe (ETRS89-LAEA), which
// keeps the north from swelling.
export interface Bounds {
  west: number
  east: number
  south: number
  north: number
}

export type Point = [number, number]

type Polygonal = GeoJSON.Polygon | GeoJSON.MultiPolygon

interface Projection {
  width: number
  height: number
  project: (position: number[]) => Point
  // Whether a position lies on the visible side of the globe; rings with no
  // such point are left out, so a far-off continent cannot wrap the frame.
  near?: (position: number[]) => boolean
}

export const topology = countries as unknown as Topology
export const countryShapes = topology.objects.countries as GeometryCollection

const radians = (degrees: number) => (degrees * Math.PI) / 180
const mercator = (latitude: number) =>
  Math.log(Math.tan(Math.PI / 4 + radians(latitude) / 2))

// A frame in longitude and latitude, in Web Mercator.
export function svgMap(bounds: Bounds, width: number, margin = 6) {
  const scale = width / radians(bounds.east - bounds.west)
  const height = Math.round(
    scale * (mercator(bounds.north) - mercator(bounds.south)),
  )
  const project = ([longitude, latitude]: number[]): Point => [
    scale * radians(longitude - bounds.west),
    scale *
      (mercator(bounds.north) -
        mercator(Math.max(-80, Math.min(80, latitude)))),
  ]
  return draw({ width, height, project }, margin)
}

// Lambert azimuthal equal-area around `center`, framed tightly around the
// countries in `fit` (only their parts inside `within`, so overseas
// territories do not stretch the frame), with a little room on every side,
// then widened or heightened to `aspect` (width over height).
export function svgMapEqualArea(
  options: {
    center: [number, number]
    fit: Iterable<string>
    within: Bounds
    width: number
    aspect: number
  },
  margin = 6,
) {
  const { center, fit, within, width, aspect } = options
  const phi0 = radians(center[1])
  const lambda0 = radians(center[0])
  const cosine = ([longitude, latitude]: number[]) =>
    Math.sin(phi0) * Math.sin(radians(latitude)) +
    Math.cos(phi0) *
      Math.cos(radians(latitude)) *
      Math.cos(radians(longitude) - lambda0)
  const raw = (position: number[]): Point => {
    const phi = radians(position[1])
    const lambda = radians(position[0]) - lambda0
    const k = Math.sqrt(2 / (1 + Math.max(-0.999, cosine(position))))
    return [
      k * Math.cos(phi) * Math.sin(lambda),
      -k *
        (Math.cos(phi0) * Math.sin(phi) -
          Math.sin(phi0) * Math.cos(phi) * Math.cos(lambda)),
    ]
  }

  const wanted = new Set(fit)
  const outline = countryShapes.geometries
    .filter((shape) => wanted.has(String(shape.id)))
    .flatMap((shape) => {
      const { geometry } = feature(
        topology,
        shape,
      ) as unknown as GeoJSON.Feature<Polygonal>
      return (
        geometry.type === "Polygon"
          ? [geometry.coordinates]
          : geometry.coordinates
      ).flat(2)
    })
    .filter(
      ([longitude, latitude]) =>
        longitude >= within.west &&
        longitude <= within.east &&
        latitude >= within.south &&
        latitude <= within.north,
    )
    .map(raw)
  let left = Math.min(...outline.map(([x]) => x))
  let right = Math.max(...outline.map(([x]) => x))
  let top = Math.min(...outline.map(([, y]) => y))
  let bottom = Math.max(...outline.map(([, y]) => y))
  const room = Math.max(right - left, bottom - top) * 0.02
  left -= room
  right += room
  top -= room
  bottom += room
  const grow = (right - left) / (bottom - top) / aspect
  if (grow < 1) {
    const extra = ((right - left) / grow - (right - left)) / 2
    left -= extra
    right += extra
  } else {
    const extra = ((bottom - top) * grow - (bottom - top)) / 2
    top -= extra
    bottom += extra
  }
  const scale = width / (right - left)
  const height = Math.round(width / aspect)
  const project = (position: number[]): Point => {
    const [x, y] = raw(position)
    return [(x - left) * scale, (y - top) * scale]
  }
  return draw(
    { width, height, project, near: (position) => cosine(position) > 0 },
    margin,
  )
}

function draw({ width, height, project, near }: Projection, margin: number) {
  const frame = {
    left: -margin,
    top: -margin,
    right: width + margin,
    bottom: height + margin,
  }
  const inside = ([x, y]: Point) =>
    x >= frame.left && x <= frame.right && y >= frame.top && y <= frame.bottom
  const clip = (ring: Point[]) => {
    const sides: [(point: Point) => boolean, (a: Point, b: Point) => Point][] =
      [
        [
          ([x]) => x >= frame.left,
          (a, b) => [
            frame.left,
            a[1] + ((frame.left - a[0]) / (b[0] - a[0])) * (b[1] - a[1]),
          ],
        ],
        [
          ([x]) => x <= frame.right,
          (a, b) => [
            frame.right,
            a[1] + ((frame.right - a[0]) / (b[0] - a[0])) * (b[1] - a[1]),
          ],
        ],
        [
          ([, y]) => y >= frame.top,
          (a, b) => [
            a[0] + ((frame.top - a[1]) / (b[1] - a[1])) * (b[0] - a[0]),
            frame.top,
          ],
        ],
        [
          ([, y]) => y <= frame.bottom,
          (a, b) => [
            a[0] + ((frame.bottom - a[1]) / (b[1] - a[1])) * (b[0] - a[0]),
            frame.bottom,
          ],
        ],
      ]
    let points = ring
    for (const [keep, cut] of sides) {
      const input = points
      points = []
      input.forEach((current, index) => {
        const previous = input.at(index - 1) ?? current
        if (keep(current)) {
          if (!keep(previous)) points.push(cut(previous, current))
          points.push(current)
        } else if (keep(previous)) points.push(cut(previous, current))
      })
      if (points.length === 0) break
    }
    return points
  }
  const step = 1.5
  const path = (points: Point[], closed: boolean) => {
    let d = ""
    let last: Point | undefined
    for (const point of points) {
      const rounded: Point = [Math.round(point[0]), Math.round(point[1])]
      if (last && Math.hypot(rounded[0] - last[0], rounded[1] - last[1]) < step)
        continue
      d += last
        ? `l${rounded[0] - last[0]} ${rounded[1] - last[1]}`
        : `M${rounded[0]} ${rounded[1]}`
      last = rounded
    }
    return closed && d.includes("l") ? `${d}z` : closed ? "" : d
  }

  // A ring that crosses the 180th meridian, like Eurasia's, jumps from one
  // side of the world to the other and would cut a band across the frame.
  // Walking it continuously carries such points past ±180°, where the clip
  // cuts them off; the ring then shifts back so its middle lies on the map.
  const unwrap = (ring: GeoJSON.Position[]) => {
    let offset = 0
    let jumps = 0
    let previous: number | undefined
    const points = ring.map(([longitude, latitude]) => {
      if (previous !== undefined && Math.abs(longitude - previous) > 180) {
        offset += longitude < previous ? 360 : -360
        jumps++
      }
      previous = longitude
      return [longitude + offset, latitude]
    })
    if (!jumps) return ring
    const middle =
      points.reduce((sum, [longitude]) => sum + longitude, 0) / points.length
    const shift = Math.round(middle / 360) * 360
    return points.map(([longitude, latitude]) => [longitude - shift, latitude])
  }

  // Filled areas from polygon geometries, clipped to the frame.
  const area = (geometries: GeoJSON.Geometry[]) =>
    geometries
      .flatMap((geometry) =>
        geometry.type === "Polygon"
          ? [geometry.coordinates]
          : geometry.type === "MultiPolygon"
            ? geometry.coordinates
            : [],
      )
      .flat()
      .filter((ring) => !near || ring.some(near))
      .map((ring) => path(clip(unwrap(ring).map(project)), true))
      .join("")

  // All land in the frame.
  const land = () => {
    const shape = feature(topology, topology.objects.land) as unknown as {
      features?: GeoJSON.Feature[]
      geometry?: GeoJSON.Geometry
    }
    const geometries = (shape.features ?? []).map((item) => item.geometry)
    if (shape.geometry) geometries.push(shape.geometry)
    return area(geometries)
  }

  // Countries by their ISO 3166 numeric code, as world-atlas names them.
  const countriesArea = (ids: Iterable<string>) => {
    const wanted = new Set(ids)
    return area(
      countryShapes.geometries
        .filter((shape) => wanted.has(String(shape.id)))
        .map(
          (shape) =>
            (feature(topology, shape) as unknown as GeoJSON.Feature<Polygonal>)
              .geometry,
        ),
    )
  }

  // Borders between countries, as open lines.
  const borders = () =>
    mesh(topology, countryShapes, (a, b) => a !== b)
      .coordinates.map((line) => line.map(project))
      .filter((line) => line.some(inside))
      .map((line) => path(line, false))
      .join("")

  return { width, height, project, land, countries: countriesArea, borders }
}
