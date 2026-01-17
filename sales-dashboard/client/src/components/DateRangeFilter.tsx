import { useState } from 'react';
import { Calendar, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface DateRangeFilterProps {
  onDateRangeChange: (startDate: Date | null, endDate: Date | null) => void;
  minDate: Date;
  maxDate: Date;
}

export function DateRangeFilter({
  onDateRangeChange,
  minDate,
  maxDate,
}: DateRangeFilterProps) {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStartDate = e.target.value;
    setStartDate(newStartDate);
    const start = newStartDate ? new Date(newStartDate) : null;
    const end = endDate ? new Date(endDate) : null;
    onDateRangeChange(start, end);
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEndDate = e.target.value;
    setEndDate(newEndDate);
    const start = startDate ? new Date(startDate) : null;
    const end = newEndDate ? new Date(newEndDate) : null;
    onDateRangeChange(start, end);
  };

  const handleReset = () => {
    setStartDate('');
    setEndDate('');
    onDateRangeChange(null, null);
  };

  const formatDateForInput = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  const hasFilter = startDate || endDate;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={hasFilter ? 'default' : 'outline'}
          size="sm"
          className="gap-2"
        >
          <Calendar className="w-4 h-4" />
          期間フィルター
          {hasFilter && <span className="ml-1 text-xs">✓</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              開始日
            </label>
            <input
              type="date"
              value={startDate}
              onChange={handleStartDateChange}
              min={formatDateForInput(minDate)}
              max={formatDateForInput(maxDate)}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              終了日
            </label>
            <input
              type="date"
              value={endDate}
              onChange={handleEndDateChange}
              min={formatDateForInput(minDate)}
              max={formatDateForInput(maxDate)}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="flex gap-2 pt-2">
            <Button
              onClick={handleReset}
              variant="outline"
              size="sm"
              className="flex-1 gap-1"
            >
              <X className="w-4 h-4" />
              リセット
            </Button>
          </div>
          {(startDate || endDate) && (
            <div className="text-xs text-muted-foreground pt-2 border-t border-border">
              {startDate && <p>開始日: {startDate}</p>}
              {endDate && <p>終了日: {endDate}</p>}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
