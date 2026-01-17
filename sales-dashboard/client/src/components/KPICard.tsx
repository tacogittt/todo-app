import { TrendingUp, TrendingDown, Info } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface KPICardProps {
  title: string;
  value: number;
  format?: 'currency' | 'number' | 'percent';
  trend?: number;
  description?: string;
  icon?: React.ReactNode;
  delay?: number;
}

export function KPICard({
  title,
  value,
  format = 'number',
  trend,
  description,
  icon,
  delay = 0,
}: KPICardProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const duration = 800;
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setDisplayValue(Math.floor(value * progress));
    }, 16);

    return () => clearInterval(interval);
  }, [value]);

  const formatValue = (val: number) => {
    switch (format) {
      case 'currency':
        return `¥${val.toLocaleString('ja-JP')}`;
      case 'percent':
        return `${val}%`;
      default:
        return val.toLocaleString('ja-JP');
    }
  };

  const isTrendPositive = trend && trend > 0;

  return (
    <div
      className="kpi-card animate-fade-in-up"
      style={{ animationDelay: `${delay * 100}ms` }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <p className="text-sm font-medium text-muted-foreground">
              {title}
            </p>
            {description && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="w-4 h-4 text-muted-foreground cursor-help hover:text-foreground transition-colors" />
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs">
                  <p className="text-sm">{description}</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
          <p className="text-3xl font-bold text-foreground">
            {formatValue(displayValue)}
          </p>
          {trend !== undefined && (
            <div className="flex items-center mt-3 gap-1">
              {isTrendPositive ? (
                <TrendingUp className="w-4 h-4 text-green-600" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-600" />
              )}
              <span
                className={`text-xs font-medium ${
                  isTrendPositive ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {Math.abs(trend)}% 前月比
              </span>
            </div>
          )}
        </div>
        {icon && (
          <div className="text-primary opacity-20 ml-4">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
