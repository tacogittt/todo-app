import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { GripVertical, Trash2, RotateCcw, Zap } from "lucide-react";

interface Section {
  id: string;
  heading: string;
  level: number;
  order: number;
}

interface Step3Props {
  initialSections: Section[];
  onNext: (sections: Section[]) => void;
  onBack: () => void;
}

export default function BlogWriterStep3({
  initialSections,
  onNext,
  onBack,
}: Step3Props) {
  const [sections, setSections] = useState<Section[]>(initialSections);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(
    initialSections[0]?.id || null
  );
  const [aiInstructions, setAiInstructions] = useState("");

  const selectedSection = sections.find((s) => s.id === selectedSectionId);

  const handleDeleteSection = (id: string) => {
    const newSections = sections.filter((s) => s.id !== id);
    setSections(newSections);
    if (selectedSectionId === id) {
      setSelectedSectionId(newSections[0]?.id || null);
    }
  };

  const handleUpdateSection = (id: string, heading: string) => {
    setSections(
      sections.map((s) => (s.id === id ? { ...s, heading } : s))
    );
  };

  const handleMoveUp = (index: number) => {
    if (index > 0) {
      const newSections = [...sections];
      [newSections[index], newSections[index - 1]] = [
        newSections[index - 1],
        newSections[index],
      ];
      newSections.forEach((s, i) => (s.order = i));
      setSections(newSections);
    }
  };

  const handleMoveDown = (index: number) => {
    if (index < sections.length - 1) {
      const newSections = [...sections];
      [newSections[index], newSections[index + 1]] = [
        newSections[index + 1],
        newSections[index],
      ];
      newSections.forEach((s, i) => (s.order = i));
      setSections(newSections);
    }
  };

  const handleRegenerate = () => {
    if (selectedSection && aiInstructions) {
      // TODO: Call AI regeneration API
      console.log("Regenerating section:", selectedSection.id, aiInstructions);
      setAiInstructions("");
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>ステップ3：目次構成ワークスペース</CardTitle>
          <CardDescription>
            左側で見出しを並び替え、右側でAIアシスタントに指示を出します
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Left: Sections list */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">目次（H2/H3）</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {sections.map((section, index) => (
                  <div
                    key={section.id}
                    onClick={() => setSelectedSectionId(section.id)}
                    className={`p-3 rounded-lg border-2 cursor-move transition-all flex items-center gap-3 ${
                      selectedSectionId === section.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <GripVertical className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {section.heading}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {"  ".repeat(section.level - 2)}H{section.level}
                      </p>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMoveUp(index);
                        }}
                        disabled={index === 0}
                        className="p-1 hover:bg-secondary disabled:opacity-50 rounded"
                      >
                        ↑
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMoveDown(index);
                        }}
                        disabled={index === sections.length - 1}
                        className="p-1 hover:bg-secondary disabled:opacity-50 rounded"
                      >
                        ↓
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteSection(section.id);
                        }}
                        className="p-1 hover:bg-destructive/10 text-destructive rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: AI Assistant */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">AI相談窓口</h3>
              {selectedSection ? (
                <div className="space-y-4 p-4 rounded-lg border border-border bg-card">
                  <div>
                    <Label className="text-sm">選択中の見出し</Label>
                    <p className="text-foreground font-medium mt-1">
                      {selectedSection.heading}
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="instructions">具体的な指示</Label>
                    <Textarea
                      id="instructions"
                      placeholder="例：「もっと詳しく説明してください」「300文字以内に短縮してください」「具体例を3つ追加してください」"
                      value={aiInstructions}
                      onChange={(e) => setAiInstructions(e.target.value)}
                      className="min-h-24 mt-2"
                    />
                  </div>

                  {/* Quick buttons */}
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setAiInstructions("もっと詳しく説明してください")}
                      className="text-xs"
                    >
                      詳しく
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setAiInstructions("300文字以内に短縮してください")}
                      className="text-xs"
                    >
                      短く
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setAiInstructions("具体例を3つ追加してください")}
                      className="text-xs"
                    >
                      例を追加
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setAiInstructions("初心者向けに説明し直してください")}
                      className="text-xs"
                    >
                      簡潔に
                    </Button>
                  </div>

                  <Button
                    onClick={handleRegenerate}
                    disabled={!aiInstructions}
                    className="w-full gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    この指示で再生成
                  </Button>
                </div>
              ) : (
                <div className="p-4 rounded-lg border border-border bg-muted text-center">
                  <p className="text-muted-foreground text-sm">
                    左側から見出しを選択してください
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 pt-6 border-t border-border mt-6">
            <Button variant="outline" onClick={onBack} className="flex-1">
              戻る
            </Button>
            <Button onClick={() => onNext(sections)} className="flex-1">
              次へ進む
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
