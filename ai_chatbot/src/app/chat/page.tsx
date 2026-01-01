"use client"

import { useState } from "react"
import { ChatHeader } from "@/components/chat/chat-header"
import { ChatMessages } from "@/components/chat/chat-messages"
import { ChatInput } from "@/components/chat/chat-input"
import type { Message } from "@/types/chat"

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSendMessage = async (content: string) => {
    // ユーザーメッセージを追加
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content,
      createdAt: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: content,
          conversationId,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to send message")
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) {
        throw new Error("No response body")
      }

      let assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "",
        createdAt: new Date(),
      }

      let buffer = ""

      while (true) {
        const { done, value } = await reader.read()

        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split("\n\n")
        buffer = lines.pop() || ""

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = JSON.parse(line.slice(6))

            if (data.type === "start") {
              if (!conversationId) {
                setConversationId(data.conversationId)
              }
            } else if (data.type === "content") {
              assistantMessage = {
                ...assistantMessage,
                content: assistantMessage.content + data.delta,
              }
              setMessages((prev) => {
                const newMessages = [...prev]
                const lastMessage = newMessages[newMessages.length - 1]
                if (lastMessage && lastMessage.role === "assistant") {
                  newMessages[newMessages.length - 1] = assistantMessage
                } else {
                  newMessages.push(assistantMessage)
                }
                return newMessages
              })
            } else if (data.type === "done") {
              setIsLoading(false)
            } else if (data.type === "error") {
              console.error("Error:", data.error)
              setIsLoading(false)
            }
          }
        }
      }
    } catch (error) {
      console.error("Error sending message:", error)
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-screen">
      <ChatHeader />
      <ChatMessages messages={messages} />
      <ChatInput onSend={handleSendMessage} disabled={isLoading} />
    </div>
  )
}
