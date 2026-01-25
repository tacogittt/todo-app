import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Zap, BookOpen, Sparkles } from "lucide-react";
import { getLoginUrl } from "@/const";
import { useLocation } from "wouter";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  const handleStartWriting = () => {
    if (isAuthenticated) {
      navigate("/blog-writer");
    } else {
      window.location.href = getLoginUrl();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="border-b border-border bg-gradient-to-br from-primary/5 via-background to-background">
        <div className="container py-20 md:py-32">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">AI-Powered Writing Assistant</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-foreground tracking-tight">
              完璧なブログ記事を、5ステップで
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              AIをパートナーとして、テーマ入力から見出し提案、セクション執筆、WordPress投稿まで一貫してサポート。初心者も迷わず、プロフェッショナルな記事を完成させられます。
            </p>
            <Button
              size="lg"
              onClick={handleStartWriting}
              className="gap-2 text-base h-12"
            >
              {isAuthenticated ? "ブログを書き始める" : "ログインして始める"}
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">5つのステップで完成</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            複雑なブログ執筆プロセスを、シンプルで直感的な5ステップに分解しました
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            {
              number: 1,
              title: "テーマ入力",
              description: "ペルソナとトーンを選択",
              icon: BookOpen,
            },
            {
              number: 2,
              title: "見出し提案",
              description: "SEO最適化された構成",
              icon: Zap,
            },
            {
              number: 3,
              title: "目次構成",
              description: "ドラッグ&ドロップで編集",
              icon: BookOpen,
            },
            {
              number: 4,
              title: "セクション執筆",
              description: "1項目ずつ丁寧に作成",
              icon: Sparkles,
            },
            {
              number: 5,
              title: "WordPress投稿",
              description: "ワンクリック公開",
              icon: ArrowRight,
            },
          ].map((step) => {
            const Icon = step.icon;
            return (
              <Card key={step.number} className="border-border hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <span className="font-bold text-primary">{step.number}</span>
                  </div>
                  <CardTitle className="text-lg">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* CTA Section */}
      <div className="border-t border-border bg-card">
        <div className="container py-16 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            {isAuthenticated
              ? "さあ、ブログを書きましょう"
              : "今すぐ始めましょう"}
          </h2>
          <Button
            size="lg"
            onClick={handleStartWriting}
            className="gap-2"
          >
            {isAuthenticated ? "ブログを書き始める" : "ログインして始める"}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
