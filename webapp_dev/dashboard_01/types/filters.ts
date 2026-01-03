import { Region, Category, Gender } from './purchase';

export interface FilterState {
  地域: Region[];
  購入カテゴリー: Category[];
  性別: Gender[];
  期間: {
    start: Date;
    end: Date;
  };
}

export type AnalysisMode = '通常分析' | 'ABC分析' | '購入回数分析' | 'RFM分析';

export const DEFAULT_FILTER_STATE: FilterState = {
  地域: [],
  購入カテゴリー: [],
  性別: [],
  期間: {
    start: new Date('2023-01-01'),
    end: new Date('2024-12-31'),
  },
};
