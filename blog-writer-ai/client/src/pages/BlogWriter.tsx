import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import StepProgress from "@/components/StepProgress";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Loader2 } from "lucide-react";

type Step = 1 | 2 | 3 | 4 | 5;

interface PersonaOption {
  id: string;
  label: string;
  description: string;
}

interface ToneOption {
  id: string;
  label: string;
  description: string;
}

const PERSONA_OPTIONS: PersonaOption[] = [
  {
    id: "gentle_teacher",
    label: "やさしい先生風",
    description: "初心者向けに丁寧に説明するスタイル",
  },
  {
    id: "business_expert",
    label: "ビジネス専門家",
    description: "実務的で信頼感のあるスタイル",
  },
  {
    id: "casual_friend",
    label: "気軽な友人風",
    description: "親しみやすく会話的なスタイル",
  },
  {
    id: "technical_expert",
    label: "技術専門家",
    description: "詳細で正確な技術情報を提供するスタイル",
  },
];

const TONE_OPTIONS: ToneOption[] = [
  {
    id: "casual",
    label: "カジュアル",
    description: "親しみやすく、読みやすい",
  },
  {
    id: "professional",
    label: "プロフェッショナル",
    description: "フォーマルで信頼感がある",
  },
  {
    id: "inspiring",
    label: "インスピレーション",
    description: "モチベーションを高める",
  },
  {
    id: "educational",
    label: "教育的",
    description: "学習を重視した構成",
  },
];

export default function BlogWriter() {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState<Step>(1);

  // Step 1 state
  const [theme, setTheme] = useState("");
  const [selectedPersona, setSelectedPersona] = useState<string>("");
  const [selectedTone, setSelectedTone] = useState<string>("");
  const [articleTitle, setArticleTitle] = useState("");

  const createArticleMutation = trpc.blog.createArticle.useMutation();

  const handleCreateArticle = async () => {
    if (!theme || !articleTitle || !selectedPersona || !selectedTone) {
      alert("すべてのフィールドを入力してください");
      return;
    }

    try {
      const result = await createArticleMutation.mutateAsync({
        theme,
        title: articleTitle,
        persona: selectedPersona,
        tone: selectedTone,
      });
      console.log("Article created:", result);
      // Move to next step
      setCurrentStep(2);
    } catch (error) {
      console.error("Error creating article:", error);
      alert("記事の作成に失敗しました");
    }
  };

  const stepLabels = [
    "テーマ入力",
    "見出し提案",
    "目次構成",
    "セクション執筆",
    "WordPress投稿",
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container py-6">
          <h1 className="text-3xl font-bold text-foreground">BlogWriter AI</h1>
          <p className="text-muted-foreground mt-1">
            AIをパートナーとして、5ステップで完璧なブログ記事を執筆
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="container py-8">
        {/* Progress */}
        <div className="mb-12">
          <StepProgress
            currentStep={currentStep}
            totalSteps={5}
            stepLabels={stepLabels}
          />
        </div>

        {/* Step 1: Theme Input */}
        {currentStep === 1 && (
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>ステップ1：テーマ入力</CardTitle>
                <CardDescription>
                  ブログ記事のテーマを入力し、ペルソナとトーンを選択してください
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Theme input */}
                <div className="space-y-2">
                  <Label htmlFor="theme">記事のテーマ *</Label>
                  <Textarea
                    id="theme"
                    placeholder="例：「Reactの状態管理ベストプラクティス」"
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    className="min-h-24"
                  />
                  <p className="text-xs text-muted-foreground">
                    書きたい記事の主題を詳しく説明してください
                  </p>
                </div>

                {/* Article title */}
                <div className="space-y-2">
                  <Label htmlFor="title">記事のタイトル（仮） *</Label>
                  <Input
                    id="title"
                    placeholder="例：「Reactの状態管理ベストプラクティス 2024年版」"
                    value={articleTitle}
                    onChange={(e) => setArticleTitle(e.target.value)}
                  />
                </div>

                {/* Persona selection */}
                <div className="space-y-3">
                  <Label>ペルソナ（読者像）を選択 *</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {PERSONA_OPTIONS.map((persona) => (
                      <button
                        key={persona.id}
                        onClick={() => setSelectedPersona(persona.id)}
                        className={`p-4 rounded-lg border-2 transition-all text-left ${
                          selectedPersona === persona.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <div className="font-semibold text-foreground">
                          {persona.label}
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {persona.description}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tone selection */}
                <div className="space-y-3">
                  <Label>トーン（文体）を選択 *</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {TONE_OPTIONS.map((tone) => (
                      <button
                        key={tone.id}
                        onClick={() => setSelectedTone(tone.id)}
                        className={`p-4 rounded-lg border-2 transition-all text-left ${
                          selectedTone === tone.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <div className="font-semibold text-foreground">
                          {tone.label}
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {tone.description}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handleCreateArticle}
                    disabled={
                      !theme ||
                      !articleTitle ||
                      !selectedPersona ||
                      !selectedTone ||
                      createArticleMutation.isPending
                    }
                    className="flex-1"
                  >
                    {createArticleMutation.isPending && (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    )}
                    次へ進む
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 2: Outline Proposals */}
        {currentStep === 2 && (
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>ステップ2：見出し提案</CardTitle>
                <CardDescription>
                  AIが提案する複数の記事構成から最適なものを選択してください
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                  <p className="text-muted-foreground mt-4">
                    見出し提案を生成中...
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 3-5: Placeholder */}
        {currentStep > 2 && (
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>ステップ{currentStep}</CardTitle>
                <CardDescription>
                  このステップはまだ実装中です
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  機能を準備中です。お待ちください。
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
