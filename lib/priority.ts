interface PriorityCalculationInput {
  requestType: string
  title: string
  description: string
  category: string
  photoCount: number
}

const criticalKeywords = ["fire", "gas", "electric spark", "exposed wire", "major leak", "flood"]
const highKeywords = ["leak", "no water", "no power", "elevator stuck"]

export function calculatePriority({
  requestType,
  title,
  description,
  category,
  photoCount,
}: PriorityCalculationInput): "Low" | "Medium" | "High" | "Critical" {
  const combinedText = `${title} ${description}`.toLowerCase()

  // Check for critical keywords
  if (criticalKeywords.some((keyword) => combinedText.includes(keyword))) {
    return "Critical"
  }

  // Incident reports are at least High priority
  if (requestType === "Incident Report") {
    return "Critical" // Escalate incident reports to critical
  }

  // Check for high priority keywords
  if (highKeywords.some((keyword) => combinedText.includes(keyword))) {
    let priority: "Low" | "Medium" | "High" | "Critical" = "High"

    // Bump priority if multiple photos or plumbing with leak
    if (photoCount >= 3 || (category === "Plumbing" && combinedText.includes("leak"))) {
      priority = "Critical"
    }

    return priority
  }

  // Service requests default to Low
  if (requestType === "Service Request") {
    return "Low"
  }

  // Bump priority for multiple photos
  if (photoCount >= 3) {
    return "High"
  }

  // Default to Medium
  return "Medium"
}
