'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export type CalendarProps = {
  mode?: 'single' | 'multiple' | 'range';
  selected?: Date | Date[] | { from?: Date; to?: Date };
  onSelect?: (date: Date | undefined) => void;
  disabled?: (date: Date) => boolean;
  className?: string;
  showOutsideDays?: boolean;
  month?: Date;
  onMonthChange?: (month: Date) => void;
};

function Calendar({
  className,
  selected,
  onSelect,
  disabled,
  showOutsideDays = true,
  month: controlledMonth,
  onMonthChange,
}: CalendarProps) {
  const [internalMonth, setInternalMonth] = React.useState(new Date());
  const month = controlledMonth ?? internalMonth;

  const handleMonthChange = (newMonth: Date) => {
    if (onMonthChange) {
      onMonthChange(newMonth);
    } else {
      setInternalMonth(newMonth);
    }
  };

  const selectedDate = selected instanceof Date ? selected : undefined;

  const daysInMonth = new Date(
    month.getFullYear(),
    month.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    month.getFullYear(),
    month.getMonth(),
    1
  ).getDay();

  const prevMonth = () => {
    handleMonthChange(new Date(month.getFullYear(), month.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    handleMonthChange(new Date(month.getFullYear(), month.getMonth() + 1, 1));
  };

  const isSelected = (day: number) => {
    if (!selectedDate) return false;
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === month.getMonth() &&
      selectedDate.getFullYear() === month.getFullYear()
    );
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      today.getDate() === day &&
      today.getMonth() === month.getMonth() &&
      today.getFullYear() === month.getFullYear()
    );
  };

  const isDisabled = (day: number) => {
    if (!disabled) return false;
    return disabled(new Date(month.getFullYear(), month.getMonth(), day));
  };

  const handleDayClick = (day: number) => {
    if (isDisabled(day)) return;
    const date = new Date(month.getFullYear(), month.getMonth(), day);
    onSelect?.(date);
  };

  const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  const days: (number | null)[] = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  return (
    <div className={cn('p-3', className)}>
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7"
          onClick={prevMonth}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="text-sm font-medium">
          {month.toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric',
          })}
        </div>
        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7"
          onClick={nextMonth}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-medium text-muted-foreground py-1"
          >
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => (
          <div key={index} className="aspect-square">
            {day !== null ? (
              <button
                type="button"
                onClick={() => handleDayClick(day)}
                disabled={isDisabled(day)}
                className={cn(
                  'w-full h-full flex items-center justify-center text-sm rounded-md transition-colors',
                  'hover:bg-accent hover:text-accent-foreground',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  'disabled:pointer-events-none disabled:opacity-50',
                  isSelected(day) &&
                    'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground',
                  isToday(day) &&
                    !isSelected(day) &&
                    'bg-accent text-accent-foreground'
                )}
              >
                {day}
              </button>
            ) : showOutsideDays ? (
              <div className="w-full h-full" />
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

Calendar.displayName = 'Calendar';

export { Calendar };
