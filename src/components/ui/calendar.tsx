'use client';

import { ComponentProps } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DayPicker } from 'react-day-picker';

import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

export type CalendarProps = ComponentProps<typeof DayPicker>;

/**
 * The Calendar component is used to create a calendar component.
 * The usage is the same as the official documentation of shadcn/ui.
 *
 * @example
 * const [date, setDate] = useState<Date | undefined>(new Date());
 * <Calendar mode="single" selected={date} onSelect={setDate} lassName="rounded-md border" />
 * @see {@link https://ui.shadcn.com/docs/components/calendar | Calendar}
 */
/*eslint no-empty-pattern: ["error", { "allowObjectPatternsAsParameters": true }]*/
function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn('p-3 bg-white rounded-lg', className)}
      classNames={{
        months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
        month: 'space-y-4',
        caption: 'flex justify-center pt-1 relative items-center',
        caption_label: 'text-sm font-medium',
        nav: 'space-x-1 flex items-center',
        nav_button: cn(
          buttonVariants({ variant: 'outline' }),
          'h-7 w-7 bg-transparent p-0 opacity-50 rounded-md hover:opacity-100 hover:bg-primary-lightest',
        ),
        nav_button_previous: 'absolute left-1 border-slate-200 text-slate-500',
        nav_button_next: 'absolute right-1 border-slate-200 text-slate-500',
        table: 'w-full border-collapse space-y-1',
        head_row: 'flex text-slate-500',
        head_cell:
          'text-muted-foreground rounded-md w-9 font-normal text-sm text-slate-400',
        row: 'flex w-full mt-2',
        cell: 'h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-primary-lightest/90 [&:has([aria-selected])]:bg-primary-lightest first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
        day: cn(
          buttonVariants({ variant: 'ghost' }),
          'h-9 w-9 p-0 font-normal text-sm aria-selected:opacity-100 rounded-md hover:bg-primary-lightest',
        ),
        day_range_end: 'day-range-end',
        day_selected:
          'bg-primary text-white text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
        day_today: 'bg-primary-lightest rounded-md text-accent-foreground',
        day_outside:
          'day-outside text-muted-foreground opacity-50 aria-selected:bg-primary rounded-md',
        day_disabled: 'text-muted-foreground opacity-50',
        day_range_middle:
          'aria-selected:bg-primary-lightest aria-selected:text-accent-foreground rounded-md',
        day_hidden: 'invisible',
        ...classNames,
      }}
      components={{
        IconLeft: ({}) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({}) => <ChevronRight className="h-4 w-4" />,
      }}
      {...props}
    />
  );
}
Calendar.displayName = 'Calendar';

export { Calendar };
