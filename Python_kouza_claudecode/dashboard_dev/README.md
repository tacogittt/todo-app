# データ可視化ダッシュボード

Streamlitを使用した、インタラクティブなデータ可視化ダッシュボードのサンプルアプリケーションです。

## 機能

- 📊 **複数のチャートタイプ**
  - 折れ線グラフ（時系列データ）
  - 棒グラフ（カテゴリ別集計）
  - 散布図（相関分析）
  - ヒートマップ（2次元データ）
  - 円グラフ・ドーナツグラフ（構成比）

- 📈 **主要指標の表示**
  - 総売上、総利益、平均売上、利益率
  - 前期比較（デルタ表示）

- 🎛️ **インタラクティブな操作**
  - データポイント数の調整
  - チャート表示の切り替え
  - データテーブルの表示/非表示
  - CSVダウンロード機能

## 使用技術

- **Streamlit** 1.52.2 - Webアプリケーションフレームワーク
- **Plotly** 6.5.0 - インタラクティブなグラフライブラリ
- **Matplotlib** 3.10.8 - 静的なグラフライブラリ
- **Seaborn** 0.13.2 - 統計的可視化ライブラリ
- **Pandas** 2.3.3 - データ操作ライブラリ
- **NumPy** 2.4.0 - 数値計算ライブラリ

## セットアップ

### 1. 仮想環境の作成

```bash
python -m venv venv
```

### 2. 仮想環境の有効化

**Windows (Git Bash):**
```bash
source venv/Scripts/activate
```

**Windows (PowerShell):**
```powershell
venv\Scripts\Activate.ps1
```

**Windows (CMD):**
```cmd
venv\Scripts\activate.bat
```

**macOS/Linux:**
```bash
source venv/bin/activate
```

### 3. パッケージのインストール

```bash
pip install -r requirements.txt
```

## 実行方法

仮想環境を有効化した状態で、以下のコマンドを実行します：

```bash
streamlit run app.py
```

ブラウザが自動的に開き、`http://localhost:8501` でダッシュボードが表示されます。

## 使い方

1. **サイドバーで設定を調整**
   - データポイント数のスライダーを動かしてデータ量を変更
   - チェックボックスで表示するチャートを選択

2. **メトリクスの確認**
   - ページ上部に主要指標が表示されます

3. **データテーブルの確認**
   - 「データテーブルを表示」をクリックして展開
   - CSVダウンロードボタンでデータをエクスポート

4. **各種チャートの確認**
   - Plotlyのインタラクティブ機能を活用
   - ホバーで詳細データを表示
   - ズーム、パン、スクリーンショットなどの操作が可能

## プロジェクト構造

```
dashboard_dev/
├── venv/                 # 仮想環境（gitignoreされています）
├── app.py               # メインアプリケーション
├── requirements.txt     # 依存パッケージリスト
└── README.md           # このファイル
```

## カスタマイズ

### データソースの変更

`app.py` の `generate_data()` 関数を編集して、独自のデータソースを使用できます：

```python
@st.cache_data
def generate_data(n_points):
    # CSVファイルから読み込む例
    df = pd.read_csv('your_data.csv')
    return df
```

### チャートの追加

Streamlitは以下の可視化ライブラリをサポートしています：

- `st.plotly_chart()` - Plotly
- `st.pyplot()` - Matplotlib
- `st.altair_chart()` - Altair
- `st.vega_lite_chart()` - Vega-Lite
- `st.line_chart()` - Streamlit組み込み
- `st.bar_chart()` - Streamlit組み込み
- `st.area_chart()` - Streamlit組み込み
- `st.scatter_chart()` - Streamlit組み込み

### レイアウトのカスタマイズ

```python
# 2カラムレイアウト
col1, col2 = st.columns(2)

# 3カラムレイアウト（幅を指定）
col1, col2, col3 = st.columns([2, 1, 1])

# タブレイアウト
tab1, tab2, tab3 = st.tabs(["チャート", "データ", "設定"])
```

## トラブルシューティング

### ポートが既に使用されている場合

別のポートで実行：

```bash
streamlit run app.py --server.port 8502
```

### モジュールが見つからないエラー

仮想環境が有効化されているか確認し、再インストール：

```bash
pip install -r requirements.txt
```

### ブラウザが自動で開かない場合

手動でブラウザを開き、以下のURLにアクセス：

```
http://localhost:8501
```

## 参考リンク

- [Streamlit公式ドキュメント](https://docs.streamlit.io/)
- [Plotly公式ドキュメント](https://plotly.com/python/)
- [Matplotlib公式ドキュメント](https://matplotlib.org/)
- [Seaborn公式ドキュメント](https://seaborn.pydata.org/)
- [Pandas公式ドキュメント](https://pandas.pydata.org/)

## ライセンス

このプロジェクトは学習目的で作成されています。
