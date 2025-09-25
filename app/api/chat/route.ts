import { type NextRequest, NextResponse } from "next/server"

const OPENAI_API_KEY = process.env.OPENAI_API_KEY

const SYSTEM_PROMPT = `You are a helpful property management assistant. You ONLY assist with property management related topics.

You specialize in helping tenants and property managers with:
- Maintenance requests and procedures
- Property policies and rules
- Tenant services and amenities
- Building information and facilities
- Emergency procedures
- Lease and rental information
- Utility and service issues
- Property management best practices
- Tenant rights and responsibilities
- Building safety and security

IMPORTANT: If a user asks about topics unrelated to property management (such as general knowledge, entertainment, cooking, sports, politics, etc.), you MUST respond with: "I'm sorry, but I can only assist with property management queries."

Keep your responses concise, helpful, and friendly. Always prioritize safety and proper procedures in your advice.`

interface ChatMessage {
  role: "user" | "assistant" | "system"
  content: string
}

export async function POST(request: NextRequest) {
  try {
    if (!OPENAI_API_KEY) {
      return NextResponse.json({ error: "OpenAI API key not configured" }, { status: 500 })
    }

    const body = await request.json()
    const userMessage = body.message || body.newMessage
    const previousMessages = body.messages || []

    if (!userMessage) {
      return NextResponse.json({ error: "No message provided" }, { status: 400 })
    }

    // Prepare messages for OpenAI
    const chatMessages: ChatMessage[] = [
      { role: "system", content: SYSTEM_PROMPT },
      ...previousMessages.slice(-10), // Keep last 10 messages for context
      { role: "user", content: userMessage },
    ]

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: chatMessages,
        max_tokens: 500,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error("OpenAI API error:", errorData)
      throw new Error(`OpenAI API request failed: ${response.status}`)
    }

    const data = await response.json()
    const assistantMessage =
      data.choices[0]?.message?.content || "I'm sorry, I couldn't process your request. Please try again."

    return NextResponse.json({ message: assistantMessage })
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json({ error: "Failed to process chat request" }, { status: 500 })
  }
}
