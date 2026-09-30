// One-off: turns Natural Earth's public-domain 1:110m land polygons into the
// rounded outlines behind the attack map. Rerun only to change the base map.
import { writeFile } from "node:fs/promises"

const source =
  "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_land.geojson"
const target = new URL("../src/data/world-land.json", import.meta.url)

const response = await fetch(source)
if (!response.ok) throw new Error(`${source}: HTTP ${response.status}`)
const { features } = await response.json()

const rings = features
  .flatMap(({ geometry }) =>
    geometry.type === "Polygon"
      ? [geometry.coordinates[0]]
      : geometry.coordinates.map((polygon) => polygon[0]),
  )
  // Antarctica carries no cases and would only take space.
  .filter((ring) => ring.some(([, lat]) => lat > -60))
  .map((ring) =>
    ring
      .map(([lng, lat]) => [
        Math.round(lng * 10) / 10,
        Math.round(lat * 10) / 10,
      ])
      .filter(
        (point, index, all) =>
          index === 0 ||
          point[0] !== all[index - 1][0] ||
          point[1] !== all[index - 1][1],
      ),
  )

await writeFile(target, `${JSON.stringify(rings)}\n`)
console.log(`Wrote ${rings.length} land outlines to src/data/world-land.json`)
