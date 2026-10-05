const fallbackCopy = (text: string) => {
  const helper = document.createElement("textarea")
  helper.value = text
  helper.setAttribute("readonly", "")
  helper.style.position = "fixed"
  helper.style.opacity = "0"
  document.body.append(helper)
  helper.select()
  const copied = document.execCommand("copy")
  helper.remove()
  return copied
}

export const copyText = async (url: string) => {
  try {
    if (!navigator.clipboard?.writeText) throw new Error()
    await navigator.clipboard.writeText(url)
    return true
  } catch {
    return fallbackCopy(url)
  }
}

// Called once per page from the layout. Each share button reports into the
// status line of its own container ([data-share-scope]).
export const initializeShareButtons = () => {
  const en = document.documentElement.lang.startsWith("en")
  const buttons = document.querySelectorAll<HTMLButtonElement>("[data-share]")
  const timers = new Map<HTMLButtonElement, ReturnType<typeof setTimeout>>()

  for (const button of buttons) {
    const status =
      button
        .closest("[data-share-scope]")
        ?.querySelector<HTMLElement>("[data-share-status]") ??
      document.querySelector<HTMLElement>("[data-share-status]")
    button.addEventListener("click", async () => {
      const data = {
        title: en
          ? "DAC8: Defend financial privacy"
          : "DAC8: Keine Finanzüberwachung auf Vorrat",
        text: en
          ? "Why we challenge indiscriminate collection of financial data."
          : "Warum wir uns gegen anlasslose Erfassung von Finanzaktivität wehren.",
        url: window.location.href,
      }

      if (navigator.share) {
        try {
          await navigator.share(data)
          return
        } catch (error) {
          if (error instanceof DOMException && error.name === "AbortError")
            return
        }
      }

      const copied = await copyText(data.url)
      if (copied) {
        // The button itself confirms, like a copy button in the system: a
        // check mark and a short label above it. The status line only speaks
        // to screen readers.
        clearTimeout(timers.get(button))
        button.dataset.copied = en ? "Link copied" : "Link kopiert"
        timers.set(
          button,
          setTimeout(() => delete button.dataset.copied, 2400),
        )
      }
      if (status) {
        status.toggleAttribute("data-quiet", copied)
        status.textContent = copied
          ? en
            ? "Link copied. Thank you for sharing."
            : "Link kopiert. Danke fürs Teilen."
          : en
            ? "Could not copy. Please copy the URL from the address bar."
            : "Kopieren nicht möglich. Bitte die URL aus der Adresszeile kopieren."
      }
    })
  }
}
