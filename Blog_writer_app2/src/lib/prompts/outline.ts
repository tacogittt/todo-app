export function getOutlinePrompt(theme: string, persona: string): string {
  return `あなたは${persona === "teacher" ? "やさしい先生" : persona === "expert" ? "ビジネス専門家" : "ジャーナリスト"}として、ブログ記事の構成を提案してください。

テーマ: ${theme}

読者の「疑問の順番」に沿った構成を作成してください：
1. 基本（これは何か？）
2. 必要性（なぜ重要か？）
3. 差別化（他との違いは？）
4. 行動（どうすればいいか？）

以下のJSON形式で返答してください：
{
  "title": "記事タイトル",
  "outline": [
    { "heading": "H2", "title": "見出しのテキスト" },
    { "heading": "H3", "title": "小見出しのテキスト" }
  ]
}

JSON以外の文字は含めないでください。`
}
