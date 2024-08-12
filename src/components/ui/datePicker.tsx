'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

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
    setDate(date);
    onChange(date as Date);
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
            format(date, 'yyyy/MM/dd')
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
        />
      </PopoverContent>
    </Popover>
  );
}
