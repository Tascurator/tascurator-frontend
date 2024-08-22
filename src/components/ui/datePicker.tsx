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
import {
  addDays,
  convertToPacificTime,
  formatDate,
  getToday,
  VANCOUVER_TIMEZONE,
} from '@/utils/dates';
import dayjs from 'dayjs';

interface IDatePickerProps {
  onChange: (date: Date) => void;
  selectedDate: Date;
}
/**
 * The DatePicker component is used to create a date picker component.
 *
 * @example
 * <DatePicker />
 */

export function DatePicker({ onChange, selectedDate }: IDatePickerProps) {
  const [date, setDate] = useState<Date>(selectedDate);

  const handleDateChange = (date: Date | undefined) => {
    /**
     * Landlord always needs to select a date.
     */
    if (!date) return;

    /**
     * Convert the date to the Vancouver timezone, since the DayPicker uses the local timezone.
     *
     * @credit https://github.com/gpbl/react-day-picker/discussions/1149#discussioncomment-9500300
     */
    const manipulated = dayjs(date)
      .local()
      .tz(VANCOUVER_TIMEZONE, true)
      .toDate();

    setDate(manipulated);
    onChange(manipulated);
  };

  const today = () => getToday();

  const yesterday = () => addDays(today(), -1);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'w-full px-3 py-[11px] justify-between text-left font-normal rounded-xl border-slate-400 border flex text-gray-500 bg-white hover:bg-slate-50 hover:text-black',
            !date && 'text-muted-foreground',
          )}
        >
          {date ? (
            formatDate(convertToPacificTime(date))
          ) : (
            <span className="text-gray-500">Pick a date</span>
          )}
          <CalendarIcon className="h-[17.6px] w-4 text-gray-500" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date && dayjs(date).tz(VANCOUVER_TIMEZONE).local().toDate()}
          onSelect={handleDateChange}
          initialFocus
          disabled={(date) => date <= yesterday() || date > today()}
          today={today()}
        />
      </PopoverContent>
    </Popover>
  );
}
