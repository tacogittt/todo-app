export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  createdAt: Date
}

export interface Conversation {
  id: string
  title?: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
}

export interface ChatResponse {
  type: 'start' | 'content' | 'done' | 'error'
  conversationId?: string
  delta?: string
  error?: string
}
