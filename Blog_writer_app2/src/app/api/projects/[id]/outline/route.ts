import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { anthropic, CLAUDE_MODEL } from "@/lib/claude"
import { getOutlinePrompt } from "@/lib/prompts/outline"

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    const project = await prisma.blogProject.findUnique({
      where: { id },
    })

    if (!project) {
      return NextResponse.json({ error: "プロジェクトが見つかりません" }, { status: 404 })
    }

    const prompt = getOutlinePrompt(project.theme, project.persona)

    const response = await anthropic.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 2048,
      messages: [{ role: "user", content: prompt }],
    })

    const content = response.content[0]
    if (content.type !== "text") {
      throw new Error("Unexpected response type")
    }

    const result = JSON.parse(content.text)

    // 既存の目次を削除して新規作成
    await prisma.outlineItem.deleteMany({ where: { projectId: id } })

    const outlineItems = await Promise.all(
      result.outline.map((item: { heading: string; title: string }, index: number) =>
        prisma.outlineItem.create({
          data: {
            projectId: id,
            heading: item.heading,
            title: item.title,
            order: index,
          },
        })
      )
    )

    // タイトルを更新
    await prisma.blogProject.update({
      where: { id },
      data: { title: result.title },
    })

    return NextResponse.json({ title: result.title, outline: outlineItems })
  } catch (error) {
    console.error("Outline generation error:", error)
    return NextResponse.json(
      { error: "目次の生成に失敗しました" },
      { status: 500 }
    )
  }
}
