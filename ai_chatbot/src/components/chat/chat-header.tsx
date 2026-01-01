"use client"

import { ThemeToggle } from "@/components/theme/theme-toggle"
import { Bot } from "lucide-react"

export function ChatHeader() {
  return (
    <header className="border-b p-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <Bot className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold">AI Chatbot</h1>
        </div>
        <ThemeToggle />
      </div>
    </header>
  )
}
