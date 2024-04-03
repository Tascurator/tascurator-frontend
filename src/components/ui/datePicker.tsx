'use client';

import { useState } from 'react';
import { format, startOfDay } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export function DatePicker() {
  const [date, setDate] = useState<Date>(() => startOfDay(new Date()));

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'w-[345px] px-3 py-[11px] justify-between text-left font-normal rounded-xl border-slate-400 flex text-gray-500 bg-white hover:bg-slate-50 hover:text-[#333333]',
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
          onSelect={setDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
