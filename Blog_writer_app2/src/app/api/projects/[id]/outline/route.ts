import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { anthropic, CLAUDE_MODEL } from "@/lib/claude"
import { getOutlinePrompt } from "@/lib/prompts/outline"
import { logger } from "@/lib/logger"

export async function POST(
  _req: NextRequest,
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

    // Claudeがmarkdown形式で返す場合があるため、```json ... ```を取り除く
    let jsonText = content.text.trim()
    const codeBlockMatch = jsonText.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/)
    if (codeBlockMatch) {
      jsonText = codeBlockMatch[1].trim()
    }

    const result = JSON.parse(jsonText)

    // 既存の目次を削除して新規作成
    await prisma.outlineItem.deleteMany({ where: { projectId: id } })

    // 並列処理ではなく順次処理に変更（Prisma Postgresの接続制限対策）
    const outlineItems = []
    for (let index = 0; index < result.outline.length; index++) {
      const item = result.outline[index]
      const created = await prisma.outlineItem.create({
        data: {
          projectId: id,
          heading: item.heading,
          title: item.title,
          order: index,
        },
      })
      outlineItems.push(created)
    }

    // タイトルを更新
    await prisma.blogProject.update({
      where: { id },
      data: { title: result.title },
    })

    return NextResponse.json({ title: result.title, outline: outlineItems })
  } catch (error) {
    logger.error("Outline generation error:", error)
    return NextResponse.json(
      { error: "目次の生成に失敗しました" },
      { status: 500 }
    )
  }
}
