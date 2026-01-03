import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import { DataProvider } from '@/contexts/DataContext';
import { FilterProvider } from '@/contexts/FilterContext';

export const metadata: Metadata = {
  title: '顧客購買データ分析ダッシュボード',
  description: 'データ分析ダッシュボード - ABC分析・RFM分析対応',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <ThemeProvider>
          <DataProvider>
            <FilterProvider>{children}</FilterProvider>
          </DataProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
