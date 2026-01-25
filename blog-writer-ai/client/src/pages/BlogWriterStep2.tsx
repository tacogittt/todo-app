import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Zap } from "lucide-react";

interface OutlineProposal {
  id: number;
  title: string;
  headings: string[];
  reasoning: string;
  seoScore: number;
}

interface Step2Props {
  onSelect: (proposal: OutlineProposal) => void;
  onBack: () => void;
}

// Mock outline proposals
const MOCK_PROPOSALS: OutlineProposal[] = [
  {
    id: 1,
    title: "初心者向けガイド",
    headings: [
      "はじめに",
      "基本概念",
      "実装方法",
      "よくある質問",
      "まとめ",
    ],
    reasoning: "初心者向けに基本から実装まで段階的に説明する構成",
    seoScore: 85,
  },
  {
    id: 2,
    title: "実践的アプローチ",
    headings: [
      "問題の背景",
      "従来の方法と課題",
      "新しいアプローチ",
      "実装例",
      "パフォーマンス比較",
      "ベストプラクティス",
    ],
    reasoning: "実務的な観点から問題解決策を提示する構成",
    seoScore: 92,
  },
  {
    id: 3,
    title: "深掘り解説",
    headings: [
      "概要",
      "理論的背景",
      "アーキテクチャ",
      "詳細な実装",
      "トラブルシューティング",
      "応用例",
      "参考資料",
    ],
    reasoning: "技術的な深さを重視した詳細な解説構成",
    seoScore: 88,
  },
];

export default function BlogWriterStep2({ onSelect, onBack }: Step2Props) {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const handleSelect = () => {
    if (selectedId !== null) {
      const selected = MOCK_PROPOSALS.find((p) => p.id === selectedId);
      if (selected) {
        onSelect(selected);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>ステップ2：見出し提案</CardTitle>
          <CardDescription>
            AIが提案する複数の記事構成から最適なものを選択してください。各提案はSEOスコアと推奨理由付きです。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Proposals grid */}
          <div className="space-y-4">
            {MOCK_PROPOSALS.map((proposal) => (
              <button
                key={proposal.id}
                onClick={() => setSelectedId(proposal.id)}
                className={`w-full p-6 rounded-lg border-2 transition-all text-left ${
                  selectedId === proposal.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground">
                      {proposal.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {proposal.reasoning}
                    </p>
                  </div>
                  <div className="ml-4 flex items-center gap-2">
                    {selectedId === proposal.id && (
                      <CheckCircle2 className="w-6 h-6 text-primary" />
                    )}
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      SEO {proposal.seoScore}
                    </Badge>
                  </div>
                </div>

                {/* Headings preview */}
                <div className="mt-4 space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">
                    提案される見出し構成：
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {proposal.headings.map((heading, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-sm"
                      >
                        {heading}
                      </span>
                    ))}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 pt-4 border-t border-border">
            <Button variant="outline" onClick={onBack} className="flex-1">
              戻る
            </Button>
            <Button
              onClick={handleSelect}
              disabled={selectedId === null}
              className="flex-1"
            >
              この構成で進める
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
