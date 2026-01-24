import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center p-8">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Blog Writer App</CardTitle>
          <CardDescription>
            shadcn/ui コンポーネントのセットアップが完了しました
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            以下のコンポーネントが利用可能です:
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li>Button</li>
            <li>Input</li>
            <li>Card</li>
            <li>Textarea</li>
            <li>Select</li>
            <li>Tabs</li>
            <li>Progress</li>
            <li>Scroll Area</li>
            <li>Dialog</li>
            <li>Alert Dialog</li>
            <li>Avatar</li>
            <li>Dropdown Menu</li>
          </ul>
          <div className="pt-4">
            <Button>サンプルボタン</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
