/**
 * 環境変数ベースのロガーユーティリティ
 *
 * 開発環境では詳細なデバッグログを出力
 * 本番環境では重要なログ（エラー、警告）のみを出力
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development'

  /**
   * デバッグログ（開発環境のみ）
   * Layer別の詳細なトレースやデバッグ情報に使用
   */
  debug(...args: any[]): void {
    if (this.isDevelopment) {
      console.log(...args)
    }
  }

  /**
   * 情報ログ（開発環境のみ）
   * 通常の動作フローの記録に使用
   */
  info(...args: any[]): void {
    if (this.isDevelopment) {
      console.info(...args)
    }
  }

  /**
   * 警告ログ（全環境）
   * 問題になる可能性のある状態の記録に使用
   */
  warn(...args: any[]): void {
    console.warn(...args)
  }

  /**
   * エラーログ（全環境）
   * エラーハンドリングとトラブルシューティングに使用
   */
  error(...args: any[]): void {
    console.error(...args)
  }

  /**
   * グループ化されたログの開始（開発環境のみ）
   */
  group(label: string): void {
    if (this.isDevelopment && console.group) {
      console.group(label)
    }
  }

  /**
   * グループ化されたログの終了（開発環境のみ）
   */
  groupEnd(): void {
    if (this.isDevelopment && console.groupEnd) {
      console.groupEnd()
    }
  }
}

export const logger = new Logger()
