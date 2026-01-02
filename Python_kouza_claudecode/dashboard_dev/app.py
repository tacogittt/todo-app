import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px
import plotly.graph_objects as go
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime
import japanize_matplotlib  # 日本語フォント対応

# ページ設定
st.set_page_config(
    page_title="顧客購買分析ダッシュボード",
    page_icon="📊",
    layout="wide",
    initial_sidebar_state="expanded"
)

# カスタムCSS
st.markdown("""
    <style>
    .main {
        padding: 0rem 1rem;
    }
    .stMetric {
        background-color: #f0f2f6;
        padding: 10px;
        border-radius: 5px;
    }
    </style>
    """, unsafe_allow_html=True)

# タイトル
st.title("📊 顧客購買分析ダッシュボード")
st.markdown("---")

# データ読み込み
@st.cache_data
def load_data():
    """CSVファイルからデータを読み込む"""
    df = pd.read_csv('data/sample-data.csv')

    # 購入日を日付型に変換
    df['購入日'] = pd.to_datetime(df['購入日'])

    # 年齢層を追加
    df['年齢層'] = pd.cut(df['年齢'],
                           bins=[0, 29, 39, 49, 59, 100],
                           labels=['20代以下', '30代', '40代', '50代', '60代以上'])

    # 月を追加
    df['購入月'] = df['購入日'].dt.to_period('M').astype(str)

    return df

# ABC分析関数
def calculate_abc_segmentation(df):
    """ABC分析: 顧客を購入金額で分類

    Parameters:
    -----------
    df : pd.DataFrame
        フィルター済みの購入データ

    Returns:
    --------
    pd.DataFrame
        顧客ID、総購入金額、購入回数、ABCランク、累積売上比率を含むDataFrame
    """
    # 顧客別の総購入金額を計算
    customer_sales = df.groupby('顧客ID').agg({
        '購入金額': 'sum',
        '購入日': 'count'
    }).reset_index()
    customer_sales.columns = ['顧客ID', '総購入金額', '購入回数']

    # 購入金額でソート（降順）
    customer_sales = customer_sales.sort_values('総購入金額', ascending=False).reset_index(drop=True)

    # 累積売上を計算
    customer_sales['累積売上'] = customer_sales['総購入金額'].cumsum()
    total_sales = customer_sales['総購入金額'].sum()
    customer_sales['累積売上比率'] = customer_sales['累積売上'] / total_sales * 100

    # ABCランクの割り当て
    total_customers = len(customer_sales)
    customer_sales['ABCランク'] = 'C'
    customer_sales.loc[:int(total_customers * 0.2), 'ABCランク'] = 'A'
    customer_sales.loc[int(total_customers * 0.2):int(total_customers * 0.5), 'ABCランク'] = 'B'

    return customer_sales

# 購入回数分析関数
def calculate_frequency_segmentation(df):
    """購入回数分析: 購入頻度で顧客を分類

    Parameters:
    -----------
    df : pd.DataFrame
        フィルター済みの購入データ

    Returns:
    --------
    pd.DataFrame
        顧客ID、総購入金額、購入回数、顧客セグメントを含むDataFrame
    """
    customer_freq = df.groupby('顧客ID').agg({
        '購入金額': 'sum',
        '購入日': 'count'
    }).reset_index()
    customer_freq.columns = ['顧客ID', '総購入金額', '購入回数']

    # セグメント分類
    def classify_frequency(count):
        if count == 1:
            return '新規顧客'
        elif 2 <= count <= 4:
            return 'リピーター'
        else:
            return 'ロイヤル顧客'

    customer_freq['顧客セグメント'] = customer_freq['購入回数'].apply(classify_frequency)

    return customer_freq

# RFM分析関数
def calculate_rfm_segmentation(df):
    """RFM分析: 最新性、頻度、金額の3軸で顧客を評価

    Parameters:
    -----------
    df : pd.DataFrame
        フィルター済みの購入データ

    Returns:
    --------
    pd.DataFrame
        顧客ID、R/F/Mスコア、総合スコア、セグメントを含むDataFrame
    """
    # 最新の購入日を基準日とする
    snapshot_date = df['購入日'].max()

    # 顧客別のRFM値を計算
    rfm = df.groupby('顧客ID').agg(
        Recency=('購入日', lambda x: (snapshot_date - x.max()).days),
        Frequency=('購入日', 'count'),
        Monetary=('購入金額', 'sum')
    ).reset_index()

    # 四分位数でスコアリング（1-5）
    # Recencyは小さい方が良いので逆転
    try:
        rfm['R_Score'] = pd.qcut(rfm['Recency'], q=5, labels=[5, 4, 3, 2, 1], duplicates='drop').astype(int)
    except:
        # 重複値が多い場合はパーセンタイルベースで分類
        rfm['R_Score'] = pd.cut(rfm['Recency'], bins=5, labels=[5, 4, 3, 2, 1]).astype(int)

    try:
        rfm['F_Score'] = pd.qcut(rfm['Frequency'], q=5, labels=[1, 2, 3, 4, 5], duplicates='drop').astype(int)
    except:
        rfm['F_Score'] = pd.cut(rfm['Frequency'], bins=5, labels=[1, 2, 3, 4, 5]).astype(int)

    try:
        rfm['M_Score'] = pd.qcut(rfm['Monetary'], q=5, labels=[1, 2, 3, 4, 5], duplicates='drop').astype(int)
    except:
        rfm['M_Score'] = pd.cut(rfm['Monetary'], bins=5, labels=[1, 2, 3, 4, 5]).astype(int)

    # 総合スコア（平均）
    rfm['RFM_Score'] = (rfm['R_Score'] + rfm['F_Score'] + rfm['M_Score']) / 3

    # セグメント分類
    def classify_rfm(row):
        score = row['RFM_Score']
        r_score = row['R_Score']
        f_score = row['F_Score']
        m_score = row['M_Score']

        if score >= 4.5:
            return '優良顧客'
        elif score >= 3.5:
            return '有望顧客'
        elif r_score <= 2:
            return '休眠顧客'
        elif f_score == 1 and m_score >= 4:
            return '新規優良顧客'
        elif f_score == 1:
            return '新規顧客'
        else:
            return '一般顧客'

    rfm['顧客セグメント'] = rfm.apply(classify_rfm, axis=1)

    return rfm

try:
    df = load_data()
    data_loaded = True
except FileNotFoundError:
    st.error("⚠️ データファイル 'data/sample-data.csv' が見つかりません。")
    data_loaded = False
except Exception as e:
    st.error(f"⚠️ データの読み込み中にエラーが発生しました: {str(e)}")
    data_loaded = False

if data_loaded:
    # サイドバー
    with st.sidebar:
        st.header("⚙️ フィルター設定")

        # 地域フィルター
        regions = ['全て'] + sorted(df['地域'].unique().tolist())
        selected_region = st.selectbox("地域", regions,
                                       help="特定の地域に絞り込んでデータを表示します")

        # カテゴリーフィルター
        categories = ['全て'] + sorted(df['購入カテゴリー'].unique().tolist())
        selected_category = st.selectbox("購入カテゴリー", categories,
                                        help="特定の購入カテゴリーに絞り込んでデータを表示します")

        # 性別フィルター
        genders = ['全て'] + sorted(df['性別'].unique().tolist())
        selected_gender = st.selectbox("性別", genders,
                                      help="特定の性別に絞り込んでデータを表示します")

        # 期間フィルター
        st.subheader("期間")
        date_range = st.date_input(
            "購入日の範囲",
            value=(df['購入日'].min(), df['購入日'].max()),
            min_value=df['購入日'].min(),
            max_value=df['購入日'].max(),
            help="分析対象とする期間を指定します"
        )

        st.markdown("---")

        # 分析モード選択
        st.subheader("📊 分析モード")
        analysis_mode = st.selectbox(
            "分析タイプを選択",
            options=["通常分析", "ABC分析", "購入回数分析", "RFM分析"],
            index=0,
            help="""顧客セグメントの分類方法を選択します。

• 通常分析：基本的な売上・顧客指標を表示
• ABC分析：購入金額で顧客を3段階に分類（パレートの法則）
• 購入回数分析：購入頻度で顧客ロイヤルティを評価
• RFM分析：最新性・頻度・金額の3軸で総合評価"""
        )

        st.markdown("---")

        # チャート表示設定
        st.subheader("表示するチャート")
        show_timeseries = st.checkbox("時系列推移", value=True,
                                      help="日別・月別の購入金額の推移を表示します")
        show_category = st.checkbox("カテゴリー別分析", value=True,
                                   help="購入カテゴリー別の売上と構成比を表示します")
        show_region = st.checkbox("地域別分析", value=True,
                                 help="地域別の売上分布とヒートマップを表示します")
        show_age = st.checkbox("年齢層別分析", value=True,
                              help="年齢層別の売上傾向を分析します")
        show_payment = st.checkbox("支払方法別分析", value=True,
                                  help="支払方法別の利用状況を表示します")

        st.markdown("---")
        st.info("📁 データソース: sample-data.csv")

    # データフィルタリング
    filtered_df = df.copy()

    if selected_region != '全て':
        filtered_df = filtered_df[filtered_df['地域'] == selected_region]

    if selected_category != '全て':
        filtered_df = filtered_df[filtered_df['購入カテゴリー'] == selected_category]

    if selected_gender != '全て':
        filtered_df = filtered_df[filtered_df['性別'] == selected_gender]

    if len(date_range) == 2:
        start_date = pd.Timestamp(date_range[0])
        end_date = pd.Timestamp(date_range[1])
        filtered_df = filtered_df[(filtered_df['購入日'] >= start_date) & (filtered_df['購入日'] <= end_date)]

    # メトリクス表示（モード別）
    if analysis_mode == "通常分析":
        st.subheader("📈 主要指標")
        col1, col2, col3, col4 = st.columns(4)

        with col1:
            total_sales = filtered_df['購入金額'].sum()
            st.metric("総購入金額", f"¥{total_sales:,}")

        with col2:
            total_customers = filtered_df['顧客ID'].nunique()
            st.metric("顧客数", f"{total_customers:,}人")

        with col3:
            avg_purchase = filtered_df['購入金額'].mean()
            st.metric("平均購入金額", f"¥{avg_purchase:,.0f}")

        with col4:
            total_transactions = len(filtered_df)
            st.metric("取引件数", f"{total_transactions:,}件")

        st.info("ℹ️ **通常分析**: 基本的な購買指標を表示します。総購入金額、顧客数、平均購入金額、取引件数を確認できます。")

    elif analysis_mode == "ABC分析":
        st.subheader("📈 ABC分析 - 主要指標")
        abc_data = calculate_abc_segmentation(filtered_df)

        col1, col2, col3, col4 = st.columns(4)

        with col1:
            a_customers = len(abc_data[abc_data['ABCランク'] == 'A'])
            st.metric("Aランク顧客", f"{a_customers:,}人",
                      delta=f"{a_customers/len(abc_data)*100:.1f}%")

        with col2:
            a_sales = abc_data[abc_data['ABCランク'] == 'A']['総購入金額'].sum()
            st.metric("Aランク売上", f"¥{a_sales:,.0f}",
                      delta=f"{a_sales/abc_data['総購入金額'].sum()*100:.1f}%")

        with col3:
            b_customers = len(abc_data[abc_data['ABCランク'] == 'B'])
            st.metric("Bランク顧客", f"{b_customers:,}人")

        with col4:
            c_customers = len(abc_data[abc_data['ABCランク'] == 'C'])
            st.metric("Cランク顧客", f"{c_customers:,}人")

        st.info("ℹ️ **ABC分析**: パレートの法則（80:20の法則）に基づき、顧客を購入金額で分類します。Aランク（上位20%）が売上の大部分を占める傾向があります。")

    elif analysis_mode == "購入回数分析":
        st.subheader("📈 購入回数分析 - 主要指標")
        freq_data = calculate_frequency_segmentation(filtered_df)
        segment_summary = freq_data.groupby('顧客セグメント').agg({
            '顧客ID': 'count',
            '総購入金額': 'sum'
        }).reset_index()

        col1, col2, col3, col4 = st.columns(4)

        # 各セグメントの顧客数と売上を表示
        segments = ['新規顧客', 'リピーター', 'ロイヤル顧客']
        for i, (col, segment) in enumerate(zip([col1, col2, col3], segments)):
            with col:
                seg_data = segment_summary[segment_summary['顧客セグメント'] == segment]
                if len(seg_data) > 0:
                    count = seg_data['顧客ID'].values[0]
                    sales = seg_data['総購入金額'].values[0]
                    st.metric(f"{segment}", f"{count:,}人",
                             delta=f"¥{sales:,.0f}")
                else:
                    st.metric(f"{segment}", "0人", delta="¥0")

        with col4:
            total_customers = len(freq_data)
            st.metric("総顧客数", f"{total_customers:,}人")

        st.info("ℹ️ **購入回数分析**: 購入頻度により顧客を分類します。新規顧客（1回）、リピーター（2-4回）、ロイヤル顧客（5回以上）に分けて、顧客のロイヤルティを評価します。")

    elif analysis_mode == "RFM分析":
        st.subheader("📈 RFM分析 - 主要指標")
        rfm_data = calculate_rfm_segmentation(filtered_df)

        # 上位セグメントを表示
        segment_summary = rfm_data.groupby('顧客セグメント').agg({
            '顧客ID': 'count',
            'Monetary': 'sum',
            'RFM_Score': 'mean'
        }).reset_index().sort_values('RFM_Score', ascending=False)

        cols = st.columns(min(4, len(segment_summary)))
        for i, (col, row) in enumerate(zip(cols, segment_summary.head(4).itertuples())):
            with col:
                st.metric(
                    row.顧客セグメント,
                    f"{row.顧客ID:,}人",
                    delta=f"平均: {row.RFM_Score:.2f}"
                )

        st.info("ℹ️ **RFM分析**: 3つの指標で顧客を評価します。**R**ecency（最新性：最後の購入からの経過日数）、**F**requency（頻度：購入回数）、**M**onetary（金額：総購入金額）を1-5段階でスコアリングし、総合的に顧客を分類します。")

    st.markdown("---")

    # データテーブル
    with st.expander(f"📋 データテーブルを表示（{len(filtered_df):,}件）"):
        st.caption("フィルター条件に一致するデータを表形式で表示しています")
        st.dataframe(filtered_df, width='stretch', height=300)

        # ダウンロードボタン
        csv = filtered_df.to_csv(index=False).encode('utf-8-sig')
        st.download_button(
            label="📥 CSVファイルとしてダウンロード",
            data=csv,
            file_name="filtered_data.csv",
            mime="text/csv",
            help="現在表示されているフィルター済みデータをCSVファイルでダウンロードします"
        )

    # ABC分析チャート
    if analysis_mode == "ABC分析":
        st.subheader("📊 ABC分析チャート")
        abc_data = calculate_abc_segmentation(filtered_df)

        # チャート1: ABCランク別顧客数・売上（2列レイアウト）
        col1, col2 = st.columns(2)

        with col1:
            # ABCランク別顧客数
            abc_count = abc_data.groupby('ABCランク').size().reset_index(name='顧客数')
            abc_count = abc_count.sort_values('ABCランク')

            fig = px.bar(
                abc_count,
                x='ABCランク',
                y='顧客数',
                title="ABCランク別顧客数",
                color='ABCランク',
                color_discrete_map={'A': '#FF6B6B', 'B': '#4ECDC4', 'C': '#95E1D3'}
            )
            st.plotly_chart(fig, width='stretch')

        with col2:
            # ABCランク別売上
            abc_sales = abc_data.groupby('ABCランク')['総購入金額'].sum().reset_index()
            abc_sales = abc_sales.sort_values('ABCランク')
            abc_sales['売上（万円）'] = abc_sales['総購入金額'] / 10000

            fig = px.bar(
                abc_sales,
                x='ABCランク',
                y='売上（万円）',
                title="ABCランク別売上金額",
                color='ABCランク',
                color_discrete_map={'A': '#FF6B6B', 'B': '#4ECDC4', 'C': '#95E1D3'}
            )
            st.plotly_chart(fig, width='stretch')

        # チャート2: パレート図（累積売上比率）
        fig = go.Figure()

        # 棒グラフ（個別売上）
        fig.add_trace(go.Bar(
            x=list(range(1, len(abc_data) + 1)),
            y=abc_data['総購入金額'] / 10000,
            name='個別売上',
            marker_color='lightblue',
            yaxis='y'
        ))

        # 折れ線グラフ（累積売上比率）
        fig.add_trace(go.Scatter(
            x=list(range(1, len(abc_data) + 1)),
            y=abc_data['累積売上比率'],
            name='累積売上比率',
            line=dict(color='red', width=2),
            yaxis='y2'
        ))

        # 80%ラインを追加
        fig.add_hline(y=80, line_dash="dash", line_color="green",
                      annotation_text="80%ライン", yref='y2')

        fig.update_layout(
            title='パレート図（ABC分析）',
            xaxis_title='顧客ランク',
            yaxis=dict(title='売上金額（万円）'),
            yaxis2=dict(title='累積売上比率（%）', overlaying='y', side='right', range=[0, 100]),
            hovermode='x unified',
            height=500
        )

        st.plotly_chart(fig, width='stretch')

        # チャート3: ABCランク別詳細統計テーブル
        st.subheader("📊 ABCランク別詳細統計")

        abc_summary = abc_data.groupby('ABCランク').agg({
            '顧客ID': 'count',
            '総購入金額': ['sum', 'mean', 'median']
        }).reset_index()

        abc_summary.columns = ['ABCランク', '顧客数', '総売上', '平均購入金額', '中央値']
        abc_summary['総売上（万円）'] = abc_summary['総売上'] / 10000
        abc_summary['売上構成比（%）'] = abc_summary['総売上'] / abc_summary['総売上'].sum() * 100

        st.dataframe(
            abc_summary[['ABCランク', '顧客数', '総売上（万円）', '売上構成比（%）', '平均購入金額', '中央値']],
            width='stretch'
        )

        # データの特性に関する情報メッセージ
        st.info("💡 ABC分析は購入金額による分類のため、単一購買データでも正確に機能します。Aランク顧客は売上の大部分を占める重要顧客層です。")

        st.markdown("---")

    # 購入回数分析チャート
    if analysis_mode == "購入回数分析":
        st.subheader("📊 購入回数分析チャート")
        freq_data = calculate_frequency_segmentation(filtered_df)

        # チャート1: セグメント別顧客数・売上（2列レイアウト）
        col1, col2 = st.columns(2)

        with col1:
            # セグメント別顧客数（円グラフ）
            segment_count = freq_data.groupby('顧客セグメント').size().reset_index(name='顧客数')

            fig = px.pie(
                segment_count,
                values='顧客数',
                names='顧客セグメント',
                title='顧客セグメント別構成比',
                color_discrete_sequence=['#FFD93D', '#6BCB77', '#4D96FF']
            )
            fig.update_traces(textposition='inside', textinfo='percent+label')
            st.plotly_chart(fig, width='stretch')

        with col2:
            # セグメント別売上
            segment_sales = freq_data.groupby('顧客セグメント')['総購入金額'].sum().reset_index()
            segment_sales['売上（万円）'] = segment_sales['総購入金額'] / 10000

            fig = px.bar(
                segment_sales,
                x='顧客セグメント',
                y='売上（万円）',
                title='セグメント別売上金額',
                color='顧客セグメント',
                color_discrete_sequence=['#FFD93D', '#6BCB77', '#4D96FF']
            )
            st.plotly_chart(fig, width='stretch')

        # チャート2: 購入回数分布ヒストグラム
        fig = px.histogram(
            freq_data,
            x='購入回数',
            nbins=30,
            title='購入回数の分布',
            labels={'購入回数': '購入回数', 'count': '顧客数'},
            color_discrete_sequence=['#667BC6']
        )
        fig.update_layout(
            xaxis_title='購入回数',
            yaxis_title='顧客数',
            height=400
        )
        st.plotly_chart(fig, width='stretch')

        # チャート3: セグメント別詳細統計テーブル
        st.subheader("📊 セグメント別詳細統計")

        segment_summary = freq_data.groupby('顧客セグメント').agg({
            '顧客ID': 'count',
            '総購入金額': ['sum', 'mean'],
            '購入回数': 'mean'
        }).reset_index()

        segment_summary.columns = ['顧客セグメント', '顧客数', '総売上', '平均購入金額', '平均購入回数']
        segment_summary['総売上（万円）'] = segment_summary['総売上'] / 10000
        segment_summary['売上構成比（%）'] = segment_summary['総売上'] / segment_summary['総売上'].sum() * 100

        st.dataframe(
            segment_summary[['顧客セグメント', '顧客数', '総売上（万円）', '売上構成比（%）', '平均購入金額', '平均購入回数']],
            width='stretch'
        )

        # データの特性に関する情報メッセージ
        if len(segment_count[segment_count['顧客セグメント'] == '新規顧客']) > 0:
            new_customer_ratio = segment_count[segment_count['顧客セグメント'] == '新規顧客']['顧客数'].values[0] / len(freq_data) * 100
            if new_customer_ratio == 100:
                st.info("ℹ️ 現在のデータでは全顧客が1回のみの購入です。リピート購入データが追加されると、より詳細な分析が可能になります。")

        st.markdown("---")

    # RFM分析チャート
    if analysis_mode == "RFM分析":
        st.subheader("📊 RFM分析チャート")
        rfm_data = calculate_rfm_segmentation(filtered_df)

        # チャート1: 3Dスコア分布
        fig = px.scatter_3d(
            rfm_data,
            x='R_Score',
            y='F_Score',
            z='M_Score',
            color='顧客セグメント',
            size='Monetary',
            hover_data=['顧客ID', 'RFM_Score'],
            title='RFM 3Dスコア分布',
            labels={
                'R_Score': 'Recency (最新性)',
                'F_Score': 'Frequency (頻度)',
                'M_Score': 'Monetary (金額)'
            },
            height=600
        )
        st.plotly_chart(fig, width='stretch')

        # チャート2: セグメント別RFMヒートマップ
        segment_rfm = rfm_data.groupby('顧客セグメント').agg({
            'R_Score': 'mean',
            'F_Score': 'mean',
            'M_Score': 'mean',
            '顧客ID': 'count'
        }).reset_index()

        # ヒートマップ用にデータを整形
        heatmap_data = segment_rfm.set_index('顧客セグメント')[['R_Score', 'F_Score', 'M_Score']].T

        fig, ax = plt.subplots(figsize=(10, 4))
        sns.heatmap(
            heatmap_data,
            annot=True,
            fmt='.2f',
            cmap='RdYlGn',
            ax=ax,
            cbar_kws={'label': 'スコア'}
        )
        ax.set_title('セグメント別RFM平均スコア')
        ax.set_ylabel('指標')
        ax.set_xlabel('顧客セグメント')
        plt.tight_layout()
        st.pyplot(fig)

        # チャート3: セグメント別顧客数と売上
        col1, col2 = st.columns(2)

        with col1:
            segment_count = rfm_data.groupby('顧客セグメント').size().reset_index(name='顧客数')
            segment_count = segment_count.sort_values('顧客数', ascending=False)

            fig = px.bar(
                segment_count,
                x='顧客セグメント',
                y='顧客数',
                title='RFMセグメント別顧客数',
                color='顧客数',
                color_continuous_scale='Blues'
            )
            fig.update_layout(xaxis={'categoryorder': 'total descending'})
            st.plotly_chart(fig, width='stretch')

        with col2:
            segment_monetary = rfm_data.groupby('顧客セグメント')['Monetary'].sum().reset_index()
            segment_monetary['売上（万円）'] = segment_monetary['Monetary'] / 10000
            segment_monetary = segment_monetary.sort_values('売上（万円）', ascending=False)

            fig = px.bar(
                segment_monetary,
                x='顧客セグメント',
                y='売上（万円）',
                title='RFMセグメント別売上',
                color='売上（万円）',
                color_continuous_scale='Oranges'
            )
            fig.update_layout(xaxis={'categoryorder': 'total descending'})
            st.plotly_chart(fig, width='stretch')

        # データの特性に関する情報メッセージ
        avg_frequency = rfm_data['Frequency'].mean()
        if avg_frequency <= 1.1:  # ほぼ全員が1回購入
            st.info("ℹ️ 現在のデータでは全顧客の購入回数が1回のため、F（頻度）スコアが均一になっています。リピート購入データが追加されると、より多様なRFMセグメント分析が可能になります。")

        st.markdown("---")

    # 時系列推移
    if show_timeseries:
        st.subheader("📉 購入金額の時系列推移")

        # 日別集計（万円単位）
        daily_sales = filtered_df.groupby('購入日')['購入金額'].sum().reset_index()
        daily_sales['購入金額（万円）'] = daily_sales['購入金額'] / 10000

        fig = px.line(
            daily_sales,
            x='購入日',
            y='購入金額（万円）',
            title='日別購入金額の推移',
            markers=True
        )

        fig.update_layout(
            xaxis_title="購入日",
            yaxis_title="購入金額 (万円)",
            hovermode='x unified',
            height=400,
            yaxis=dict(tickformat=',.1f')
        )

        st.plotly_chart(fig, width='stretch')

        # 月別集計（万円単位）
        monthly_sales = filtered_df.groupby('購入月')['購入金額'].sum().reset_index()
        monthly_sales['購入金額（万円）'] = monthly_sales['購入金額'] / 10000

        fig = px.bar(
            monthly_sales,
            x='購入月',
            y='購入金額（万円）',
            title='月別購入金額',
            color='購入金額（万円）',
            color_continuous_scale='Blues'
        )

        fig.update_layout(
            xaxis_title="月",
            yaxis_title="購入金額 (万円)",
            height=400,
            yaxis=dict(tickformat=',.0f')
        )

        st.plotly_chart(fig, width='stretch')

    # カテゴリー別分析
    if show_category:
        st.subheader("📊 購入カテゴリー別分析")

        col1, col2 = st.columns(2)

        with col1:
            # カテゴリー別売上（万円単位）
            category_sales = filtered_df.groupby('購入カテゴリー')['購入金額'].sum().reset_index()
            category_sales = category_sales.sort_values('購入金額', ascending=False)
            category_sales['購入金額（万円）'] = category_sales['購入金額'] / 10000

            fig = px.bar(
                category_sales,
                x='購入カテゴリー',
                y='購入金額（万円）',
                title="カテゴリー別購入金額",
                color='購入金額（万円）',
                color_continuous_scale='Blues'
            )

            fig.update_layout(
                xaxis_title="カテゴリー",
                yaxis_title="購入金額 (万円)",
                height=400,
                yaxis=dict(tickformat=',.0f')
            )

            st.plotly_chart(fig, width='stretch')

        with col2:
            # カテゴリー別構成比
            fig = px.pie(
                category_sales,
                values='購入金額',
                names='購入カテゴリー',
                title="カテゴリー別構成比",
                color_discrete_sequence=px.colors.qualitative.Set3
            )

            fig.update_traces(textposition='inside', textinfo='percent+label')
            fig.update_layout(height=400)

            st.plotly_chart(fig, width='stretch')

    # 地域別分析
    if show_region:
        st.subheader("🗺️ 地域別分析")

        col1, col2 = st.columns(2)

        with col1:
            # 地域別売上（万円単位）
            region_sales = filtered_df.groupby('地域')['購入金額'].sum().reset_index()
            region_sales = region_sales.sort_values('購入金額', ascending=False)
            region_sales['購入金額（万円）'] = region_sales['購入金額'] / 10000

            fig = px.bar(
                region_sales,
                x='地域',
                y='購入金額（万円）',
                title="地域別購入金額",
                color='購入金額（万円）',
                color_continuous_scale='RdYlGn'
            )

            fig.update_layout(
                xaxis_title="地域",
                yaxis_title="購入金額 (万円)",
                height=400,
                yaxis=dict(tickformat=',.0f')
            )

            st.plotly_chart(fig, width='stretch')

        with col2:
            # 地域別平均購入金額（万円単位）
            region_avg = filtered_df.groupby('地域')['購入金額'].mean().reset_index()
            region_avg = region_avg.sort_values('購入金額', ascending=False)
            region_avg['平均購入金額（万円）'] = region_avg['購入金額'] / 10000

            fig = px.bar(
                region_avg,
                x='地域',
                y='平均購入金額（万円）',
                title="地域別平均購入金額",
                color='平均購入金額（万円）',
                color_continuous_scale='Blues'
            )

            fig.update_layout(
                xaxis_title="地域",
                yaxis_title="平均購入金額 (万円)",
                height=400,
                yaxis=dict(tickformat=',.1f')
            )

            st.plotly_chart(fig, width='stretch')

        # 地域×カテゴリーのヒートマップ（万円単位）
        st.subheader("🌡️ 地域×カテゴリーのヒートマップ")

        pivot_data = filtered_df.pivot_table(
            values='購入金額',
            index='地域',
            columns='購入カテゴリー',
            aggfunc='sum',
            fill_value=0
        )
        # 万円単位に変換
        pivot_data = pivot_data / 10000

        fig, ax = plt.subplots(figsize=(12, 6))
        sns.heatmap(
            pivot_data,
            annot=True,
            fmt='.1f',
            cmap='YlOrRd',
            ax=ax,
            cbar_kws={'label': '購入金額 (万円)'}
        )
        ax.set_title('地域×カテゴリーの購入金額ヒートマップ')
        plt.tight_layout()

        st.pyplot(fig)

    # 年齢層別分析
    if show_age:
        st.subheader("👥 年齢層別分析")

        col1, col2 = st.columns(2)

        with col1:
            # 年齢層別購入金額（万円単位）
            age_sales = filtered_df.groupby('年齢層')['購入金額'].sum().reset_index()
            age_sales['購入金額（万円）'] = age_sales['購入金額'] / 10000

            fig = px.bar(
                age_sales,
                x='年齢層',
                y='購入金額（万円）',
                title="年齢層別購入金額",
                color='購入金額（万円）',
                color_continuous_scale='Purples'
            )

            fig.update_layout(
                xaxis_title="年齢層",
                yaxis_title="購入金額 (万円)",
                height=400,
                yaxis=dict(tickformat=',.0f')
            )

            st.plotly_chart(fig, width='stretch')

        with col2:
            # 性別×年齢層別購入金額（万円単位）
            gender_age_sales = filtered_df.groupby(['性別', '年齢層'])['購入金額'].sum().reset_index()
            gender_age_sales['購入金額（万円）'] = gender_age_sales['購入金額'] / 10000

            fig = px.bar(
                gender_age_sales,
                x='年齢層',
                y='購入金額（万円）',
                color='性別',
                title="性別×年齢層別購入金額",
                barmode='group',
                color_discrete_map={'男性': '#4A90E2', '女性': '#E24A90'}
            )

            fig.update_layout(
                xaxis_title="年齢層",
                yaxis_title="購入金額 (万円)",
                height=400,
                yaxis=dict(tickformat=',.0f')
            )

            st.plotly_chart(fig, width='stretch')

        # 年齢分布
        st.subheader("📊 年齢分布")

        fig = px.histogram(
            filtered_df,
            x='年齢',
            color='性別',
            title="年齢分布（性別）",
            nbins=30,
            barmode='overlay',
            opacity=0.7,
            color_discrete_map={'男性': '#4A90E2', '女性': '#E24A90'}
        )

        fig.update_layout(
            xaxis_title="年齢",
            yaxis_title="件数",
            height=400
        )

        st.plotly_chart(fig, width='stretch')

    # 支払方法別分析
    if show_payment:
        st.subheader("💳 支払方法別分析")

        col1, col2 = st.columns(2)

        with col1:
            # 支払方法別購入金額（万円単位）
            payment_sales = filtered_df.groupby('支払方法')['購入金額'].sum().reset_index()
            payment_sales = payment_sales.sort_values('購入金額', ascending=False)
            payment_sales['購入金額（万円）'] = payment_sales['購入金額'] / 10000

            fig = px.bar(
                payment_sales,
                x='支払方法',
                y='購入金額（万円）',
                title="支払方法別購入金額",
                color='購入金額（万円）',
                color_continuous_scale='Oranges'
            )

            fig.update_layout(
                xaxis_title="支払方法",
                yaxis_title="購入金額 (万円)",
                height=400,
                yaxis=dict(tickformat=',.0f')
            )

            st.plotly_chart(fig, width='stretch')

        with col2:
            # 支払方法別件数
            payment_count = filtered_df.groupby('支払方法').size().reset_index(name='件数')
            payment_count = payment_count.sort_values('件数', ascending=False)

            fig = px.pie(
                payment_count,
                values='件数',
                names='支払方法',
                title="支払方法別取引件数",
                color_discrete_sequence=px.colors.qualitative.Pastel
            )

            fig.update_traces(textposition='inside', textinfo='percent+label')
            fig.update_layout(height=400)

            st.plotly_chart(fig, width='stretch')

    # フッター
    st.markdown("---")
    st.markdown(f"""
        <div style='text-align: center; color: #666;'>
            <p>顧客購買分析ダッシュボード | データ件数: {len(filtered_df):,}件 | 最終更新: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}</p>
        </div>
        """, unsafe_allow_html=True)
