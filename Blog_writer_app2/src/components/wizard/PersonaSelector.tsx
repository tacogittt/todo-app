// src/components/wizard/PersonaSelector.tsx
"use client"

import { cn } from "@/lib/utils"
import { PersonaType } from "@/types/blog"
import { GraduationCap, Briefcase, Newspaper } from "lucide-react"

interface PersonaSelectorProps {
  value: PersonaType | null
  onChange: (persona: PersonaType) => void
}

const PERSONAS = [
  {
    id: "teacher" as PersonaType,
    label: "やさしい先生風",
    description: "初心者にもわかりやすく、丁寧に説明します",
    icon: GraduationCap,
  },
  {
    id: "expert" as PersonaType,
    label: "ビジネス専門家",
    description: "専門的な知識を持ち、信頼性の高い情報を提供します",
    icon: Briefcase,
  },
  {
    id: "journalist" as PersonaType,
    label: "ジャーナリスト",
    description: "客観的な視点で、事実に基づいた記事を書きます",
    icon: Newspaper,
  },
]

export function PersonaSelector({ value, onChange }: PersonaSelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {PERSONAS.map((persona) => {
        const Icon = persona.icon
        return (
          <button
            key={persona.id}
            onClick={() => onChange(persona.id)}
            className={cn(
              "p-4 rounded-lg border-2 text-left transition-all",
              value === persona.id
                ? "border-primary bg-primary/5"
                : "border-muted hover:border-primary/50"
            )}
          >
            <Icon className="w-8 h-8 mb-2" />
            <h3 className="font-semibold">{persona.label}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {persona.description}
            </p>
          </button>
        )
      })}
    </div>
  )
}
