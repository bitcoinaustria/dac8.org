import type { Language } from "@/lib/i18n"

import emptyDe from "@/assets/network/target-plate-de-empty.webp"
import filledDe from "@/assets/network/target-plate-de.webp"
import emptyEn from "@/assets/network/target-plate-en-empty.webp"
import filledEn from "@/assets/network/target-plate-en.webp"
import wrench from "@/assets/network/target-wrench.webp"
import layout from "@/data/target-plate.json"

// The target list at the end of the data story's leak scene, rendered by
// artwork-lab's knowledge/build_dac8_target_plate.py: a plate with the
// ranks 06 to 08 and Max at 07, with his photo, home address and annual
// reports. The empty plate shows Max's parts as grey bars; each leak reveals
// its parts of the filled plate. The wrench is a layer of its own, rendered
// to the left of the plate. All
// layers share one frame, so they stack exactly; target-plate.json is the
// lab's regions.json: the frame's size in pixels and where each part sits,
// as shares of the frame (left, top, width, height). Re-export the images
// and the JSON together.
export type PlatePart = "rank" | "photo" | "name" | "address" | "reports"

type Box = [number, number, number, number]

export const plate = {
  aspect: layout.size[0] / layout.size[1],
  regions: layout.regions as Record<PlatePart | "plate" | "wrench", Box>,
  images: {
    de: { empty: emptyDe, filled: filledDe },
    en: { empty: emptyEn, filled: filledEn },
  } satisfies Record<Language, unknown>,
  wrench,
}
