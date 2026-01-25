// src/app/api/projects/route.ts
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  try {
    const { theme, persona, tone } = await req.json()

    if (!theme || !persona || !tone) {
      return NextResponse.json(
        { error: "theme, persona, tone は必須です" },
        { status: 400 }
      )
    }

    const project = await prisma.blogProject.create({
      data: {
        title: theme.substring(0, 100),
        theme,
        persona,
        tone,
        status: "outline",
      },
    })

    return NextResponse.json(project)
  } catch (error) {
    console.error("Project creation error:", error)
    return NextResponse.json(
      { error: "プロジェクトの作成に失敗しました" },
      { status: 500 }
    )
  }
}
