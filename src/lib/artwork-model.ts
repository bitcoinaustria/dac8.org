// Progressive enhancement for artworks with a glTF model: where WebGL works,
// the Blender scene is drawn live and sharp instead of the render, which
// stays as fallback. Three.js loads only once a model comes near the
// viewport.

const supportsWebGL = () => {
  try {
    return !!document.createElement("canvas").getContext("webgl2")
  } catch {
    return false
  }
}

export const mountModels = () => {
  const stages = document.querySelectorAll<HTMLElement>(
    ".artwork-stage[data-model]:not([data-state])",
  )
  if (!stages.length) return
  if (!supportsWebGL()) {
    for (const stage of stages) stage.dataset.state = "failed"
    return
  }
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        observer.unobserve(entry.target)
        const stage = entry.target as HTMLElement
        stage.dataset.state = "loading"
        import("@/lib/model-view")
          .then(({ createModelView }) => createModelView(stage))
          .then(() => {
            stage.dataset.state = "live"
          })
          .catch((error) => {
            console.warn("3D artwork unavailable, keeping the render", error)
            stage.dataset.state = "failed"
            stage.removeAttribute("role")
            stage.removeAttribute("aria-label")
          })
      }
    },
    { rootMargin: "75% 0px" },
  )
  for (const stage of stages) {
    // The hidden render no longer speaks for the picture.
    const alt = stage.querySelector("img")?.alt
    if (alt) {
      stage.setAttribute("role", "img")
      stage.setAttribute("aria-label", alt)
    }
    observer.observe(stage)
  }
}
