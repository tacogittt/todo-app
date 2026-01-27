import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { logger } from "@/lib/logger"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const project = await prisma.blogProject.findUnique({
      where: { id },
      include: {
        outlineItems: { orderBy: { order: "asc" } },
        sections: { orderBy: { createdAt: "asc" } },
      },
    })

    if (!project) {
      return NextResponse.json(
        { error: "プロジェクトが見つかりません" },
        { status: 404 }
      )
    }

    return NextResponse.json(project)
  } catch (error) {
    logger.error("Failed to fetch project:", error)
    return NextResponse.json(
      { error: "プロジェクトの取得に失敗しました" },
      { status: 500 }
    )
  }
}
