import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"
import { anthropic, CLAUDE_MODEL } from "@/lib/claude"
import { getSectionPrompt } from "@/lib/prompts/section"

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const { sectionTitle, outlineItemId } = await req.json()

  const project = await prisma.blogProject.findUnique({
    where: { id },
    include: { sections: { orderBy: { createdAt: "asc" } } },
  })

  if (!project) {
    return new Response("Project not found", { status: 404 })
  }

  const previousContent = project.sections
    .map((s) => `## ${s.sectionTitle}\n${s.content}`)
    .join("\n\n")

  const prompt = getSectionPrompt(sectionTitle, previousContent, project.persona)

  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      let fullContent = ""

      try {
        const response = await anthropic.messages.create({
          model: CLAUDE_MODEL,
          max_tokens: 2048,
          messages: [{ role: "user", content: prompt }],
          stream: true,
        })

        for await (const event of response) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            fullContent += event.delta.text
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({
                  type: "content",
                  delta: event.delta.text,
                })}\n\n`
              )
            )
          }
        }

        // DBに保存
        const section = await prisma.blogSection.create({
          data: {
            projectId: id,
            outlineItemId,
            sectionTitle,
            content: fullContent,
            wordCount: fullContent.length,
          },
        })

        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({
              type: "done",
              sectionId: section.id,
            })}\n\n`
          )
        )
      } catch (error) {
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({
              type: "error",
              error: "生成に失敗しました",
            })}\n\n`
          )
        )
      }

      controller.close()
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  })
}
