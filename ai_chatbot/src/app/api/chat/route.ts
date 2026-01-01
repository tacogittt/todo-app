import { NextRequest } from "next/server"
import { anthropic, CLAUDE_MODEL } from "@/lib/claude"
import { prisma } from "@/lib/prisma"

export const runtime = "nodejs"

export async function POST(req: NextRequest) {
  try {
    const { message, conversationId } = await req.json()

    if (!message || typeof message !== "string") {
      return new Response("Invalid message", { status: 400 })
    }

    // 会話の取得または作成
    let conversation
    if (conversationId) {
      conversation = await prisma.conversation.findUnique({
        where: { id: conversationId },
        include: { messages: { orderBy: { createdAt: "asc" } } },
      })
    }

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          title: message.substring(0, 50),
          messages: {
            create: {
              role: "user",
              content: message,
            },
          },
        },
        include: { messages: true },
      })
    } else {
      await prisma.message.create({
        data: {
          conversationId: conversation.id,
          role: "user",
          content: message,
        },
      })
    }

    // Claude APIへのメッセージ履歴を構築
    const messages = conversation.messages.map((msg) => ({
      role: msg.role as "user" | "assistant",
      content: msg.content,
    }))

    // 新しいユーザーメッセージを追加
    messages.push({
      role: "user" as const,
      content: message,
    })

    // ストリーミングレスポンスの設定
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Claude APIのストリーミングリクエスト
          const response = await anthropic.messages.create({
            model: CLAUDE_MODEL,
            max_tokens: 4096,
            messages: messages,
            stream: true,
          })

          let fullResponse = ""

          // ストリーミング開始
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                type: "start",
                conversationId: conversation.id,
              })}\n\n`
            )
          )

          // ストリームからデータを読み取る
          for await (const event of response) {
            if (
              event.type === "content_block_delta" &&
              event.delta.type === "text_delta"
            ) {
              const text = event.delta.text
              fullResponse += text
              controller.enqueue(
                encoder.encode(
                  `data: ${JSON.stringify({
                    type: "content",
                    delta: text,
                  })}\n\n`
                )
              )
            }
          }

          // アシスタントの応答をデータベースに保存
          await prisma.message.create({
            data: {
              conversationId: conversation.id,
              role: "assistant",
              content: fullResponse,
            },
          })

          // ストリーミング終了
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type: "done" })}\n\n`)
          )

          controller.close()
        } catch (error) {
          console.error("Streaming error:", error)
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                type: "error",
                error: "エラーが発生しました",
              })}\n\n`
            )
          )
          controller.close()
        }
      },
    })

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    })
  } catch (error) {
    console.error("API error:", error)
    return new Response("Internal server error", { status: 500 })
  }
}
