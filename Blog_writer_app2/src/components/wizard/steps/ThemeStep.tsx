// src/components/wizard/steps/ThemeStep.tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PersonaSelector } from "@/components/wizard/PersonaSelector"
import { PersonaType, ToneType } from "@/types/blog"

interface ThemeStepProps {
  onNext: (data: { theme: string; persona: PersonaType; tone: ToneType }) => void
}

export function ThemeStep({ onNext }: ThemeStepProps) {
  const [theme, setTheme] = useState("")
  const [persona, setPersona] = useState<PersonaType | null>(null)
  const [tone, setTone] = useState<ToneType>("professional")

  const handleSubmit = () => {
    if (theme && persona) {
      onNext({ theme, persona, tone })
    }
  }

  const isValid = theme.length > 0 && persona !== null

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>記事のテーマを入力してください</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="例: プログラミング初心者がPythonを学ぶべき理由"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            rows={3}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>ペルソナ（語り口）を選択</CardTitle>
        </CardHeader>
        <CardContent>
          <PersonaSelector value={persona} onChange={setPersona} />
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSubmit} disabled={!isValid} size="lg">
          次へ: 構成を設計する
        </Button>
      </div>
    </div>
  )
}
