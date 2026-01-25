export function getSectionPrompt(
  sectionTitle: string,
  previousContent: string,
  persona: string
): string {
  return `あなたは${persona === "teacher" ? "やさしい先生" : persona === "expert" ? "ビジネス専門家" : "ジャーナリスト"}として、ブログ記事のセクションを執筆してください。

${previousContent ? `これまでの記事内容:\n${previousContent}\n\n` : ""}

次のセクションを執筆してください：
セクションタイトル: ${sectionTitle}

要件:
- 500〜800文字程度で執筆
- 前のセクションとの一貫性を保つ
- 読者にとってわかりやすい表現を使う
- マークダウン形式で出力

セクションの本文のみを出力してください。タイトルは含めないでください。`
}
