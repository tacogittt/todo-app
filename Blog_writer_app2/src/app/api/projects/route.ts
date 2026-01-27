// src/app/api/projects/route.ts
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { logger } from "@/lib/logger"

export async function POST(req: NextRequest) {
  logger.debug("=== Layer 4: API /projects POST called ===")
  try {
    const { theme, persona, tone } = await req.json()
    logger.debug("=== Layer 5: Request data ===", { theme, persona, tone })

    if (!theme || !persona || !tone) {
      logger.debug("=== Layer 6: Validation failed ===")
      return NextResponse.json(
        { error: "theme, persona, tone は必須です" },
        { status: 400 }
      )
    }

    logger.debug("=== Layer 7: Calling Prisma ===")
    const project = await prisma.blogProject.create({
      data: {
        title: theme.substring(0, 100),
        theme,
        persona,
        tone,
        status: "outline",
      },
    })
    logger.debug("=== Layer 8: Prisma success ===", project)

    return NextResponse.json(project)
  } catch (error) {
    logger.error("=== Layer 9: Project creation error ===", error)
    return NextResponse.json(
      { error: "プロジェクトの作成に失敗しました" },
      { status: 500 }
    )
  }
}
