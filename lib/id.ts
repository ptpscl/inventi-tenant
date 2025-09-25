import { nanoid } from "nanoid"

function simpleHash(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16).padStart(8, "0").slice(0, 12)
}

export function generateTicketId(floor: number, unit: string): { ticketId: string; hashId: string } {
  const today = new Date()
  const dateStr = today.toISOString().slice(0, 10).replace(/-/g, "")
  const shortId = nanoid(6)

  const ticketId = `${floor}-${unit}-${dateStr}-${shortId}`

  const hashInput = `${floor}#${unit}+${dateStr}`
  const hashId = simpleHash(hashInput)

  return { ticketId, hashId }
}
