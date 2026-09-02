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

const copyUrl = async (url: string) => {
  try {
    if (!navigator.clipboard?.writeText) throw new Error()
    await navigator.clipboard.writeText(url)
    return true
  } catch {
    return fallbackCopy(url)
  }
}

export const initializeShareButtons = () => {
  const buttons = document.querySelectorAll<HTMLButtonElement>("[data-share]")
  const status = document.querySelector<HTMLElement>("[data-share-status]")

  for (const button of buttons) {
    button.addEventListener("click", async () => {
      const data = {
        title: "DAC8: Keine Finanzüberwachung auf Vorrat",
        text: "Warum wir uns gegen anlasslose Erfassung von Finanzaktivität wehren.",
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

      const copied = await copyUrl(data.url)
      if (status) {
        status.textContent = copied
          ? "Link kopiert. Danke fürs Teilen."
          : "Kopieren nicht möglich. Bitte die URL aus der Adresszeile kopieren."
      }
    })
  }
}
