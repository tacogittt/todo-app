"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { OutlineEditor } from "@/components/wizard/OutlineEditor"
import { OutlineItem } from "@/types/blog"
import { Loader2, RefreshCw } from "lucide-react"

interface OutlineStepProps {
  projectId: string
  onNext: (items: OutlineItem[]) => void
  onBack: () => void
}

export function OutlineStep({ projectId, onNext, onBack }: OutlineStepProps) {
  const [items, setItems] = useState<OutlineItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [title, setTitle] = useState("")
  const lastProjectIdRef = useRef<string | null>(null)

  const generateOutline = async () => {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/projects/${projectId}/outline`, {
        method: "POST",
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || "目次の生成に失敗しました")
      }

      const data = await res.json()
      setTitle(data.title || "")
      setItems(data.outline || [])
    } catch (error) {
      console.error("Failed to generate outline:", error)
      alert(`目次生成エラー: ${error}`)
      setItems([]) // エラー時は空配列を設定
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // 同じprojectIdでの2重実行を防ぐ（React Strict Mode対策）
    if (lastProjectIdRef.current === projectId) return
    lastProjectIdRef.current = projectId
    generateOutline()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>目次（構成）</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={generateOutline}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            再生成
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          ) : (
            <OutlineEditor items={items} onChange={setItems} />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>AI アドバイス</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            目次をドラッグ&ドロップで並べ替えできます。
            不要な項目は削除ボタンで削除してください。
          </p>
        </CardContent>
      </Card>

      <div className="lg:col-span-2 flex justify-between">
        <Button variant="outline" onClick={onBack}>
          戻る
        </Button>
        <Button onClick={() => onNext(items)} disabled={items.length === 0}>
          次へ: 執筆する
        </Button>
      </div>
    </div>
  )
}
