// src/lib/claude.ts
import Anthropic from "@anthropic-ai/sdk"

// Only check on server side
if (typeof window === "undefined" && !process.env.ANTHROPIC_API_KEY) {
  throw new Error("ANTHROPIC_API_KEY が設定されていません")
}

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export const CLAUDE_MODEL = "claude-sonnet-4-5-20250929"
