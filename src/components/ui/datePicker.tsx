'use client';

import { useState } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { formatDate } from '@/utils/dates';

interface IDatePickerProps {
  onChange: (date: Date) => void;
  selectedDate: Date | undefined;
}
/**
 * The DatePicker component is used to create a date picker component.
 *
 * @example
 * <DatePicker />
 */

export function DatePicker({ onChange, selectedDate }: IDatePickerProps) {
  const [date, setDate] = useState<Date | undefined>(selectedDate);

  const handleDateChange = (date: Date | undefined) => {
    if (!date) {
      return;
    }
    setDate(date);
    onChange(date);
  };

  /**
   * todo: disable past days and after one month
   * disable dates before yesterday and after today for now
   */

  const today = () => {
    return new Date();
  };

  const yesterday = () => {
    const today = new Date();
    return new Date(today.setDate(today.getDate() - 1));
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'w-full px-3 py-[11px] justify-between text-left font-normal rounded-xl border-slate-400 border flex text-gray-500 bg-white hover:bg-slate-50 hover:text-black',
            !date && 'text-muted-foreground ',
          )}
        >
          {date ? (
            formatDate(date)
          ) : (
            <span className="text-gray-500">Pick a date</span>
          )}
          <CalendarIcon className="h-[17.6px] w-4 text-gray-500" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateChange}
          initialFocus
          disabled={(date) => date < yesterday() || date > today()}
        />
      </PopoverContent>
    </Popover>
  );
}
