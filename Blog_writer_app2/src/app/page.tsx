import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">ブログ執筆アシスタント</CardTitle>
          <CardDescription>
            AIと一緒に、質の高いブログ記事を作成しましょう
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Link href="/wizard">
            <Button size="lg">新しい記事を作成</Button>
          </Link>
        </CardContent>
      </Card>
    </main>
  )
}
