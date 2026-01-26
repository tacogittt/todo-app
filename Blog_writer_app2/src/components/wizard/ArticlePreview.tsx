"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BlogSection } from "@/types/blog"

interface ArticlePreviewProps {
  title: string
  sections: BlogSection[]
}

export function ArticlePreview({ title, sections }: ArticlePreviewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">{title}</CardTitle>
      </CardHeader>
      <CardContent className="prose prose-slate max-w-none">
        {sections.map((section) => (
          <div key={section.id} className="mb-8">
            <h2 className="text-xl font-bold mb-3">{section.sectionTitle}</h2>
            <div className="whitespace-pre-wrap text-muted-foreground leading-relaxed">
              {section.content}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
