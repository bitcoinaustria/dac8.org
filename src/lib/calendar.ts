// One calendar entry in iCalendar format (RFC 5545), built in the browser and
// downloaded by the reader, so a reminder needs no calendar service. Times are
// written in UTC; calendars show them in the reader's own time zone.

export type CalendarEntry = {
  uid: string
  // When the file is created.
  stamp: Date
  start: Date
  minutes: number
  title: string
  description: string
  url: string
}

const utc = (date: Date) =>
  date
    .toISOString()
    .replace(/\.\d{3}/, "")
    .replace(/[-:]/g, "")

// Text values escape backslashes, semicolons, commas and line breaks.
const text = (value: string) =>
  value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n")

// Lines longer than 75 octets continue on the next line after a space. Count
// UTF-8 octets and never split a character, so umlauts survive.
const fold = (line: string) => {
  const encoder = new TextEncoder()
  const parts: string[] = []
  let part = ""
  let octets = 0
  for (const character of line) {
    const size = encoder.encode(character).length
    if (octets + size > (parts.length === 0 ? 75 : 74)) {
      parts.push(part)
      part = ""
      octets = 0
    }
    part += character
    octets += size
  }
  parts.push(part)
  return parts.join("\r\n ")
}

export const calendarFile = (entry: CalendarEntry) => {
  const end = new Date(entry.start.getTime() + entry.minutes * 60_000)
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//dac8.org//Reminder//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${entry.uid}`,
    `DTSTAMP:${utc(entry.stamp)}`,
    `DTSTART:${utc(entry.start)}`,
    `DTEND:${utc(end)}`,
    `SUMMARY:${text(entry.title)}`,
    `DESCRIPTION:${text(entry.description)}`,
    `URL:${entry.url}`,
    // A reminder, not an appointment: the slot stays free.
    "TRANSP:TRANSPARENT",
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    `DESCRIPTION:${text(entry.title)}`,
    "TRIGGER:PT0S",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ]
  return `${lines.map(fold).join("\r\n")}\r\n`
}
