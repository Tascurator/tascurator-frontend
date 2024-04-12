'use client';

import { forwardRef, ElementRef, ComponentPropsWithoutRef } from 'react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';

import { cn } from '@/lib/utils';

const Accordion = AccordionPrimitive.Root;

type AccordionTriggerProps = {
  scheduleDate?: string;
} & ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>;

const AccordionItem = forwardRef<
  ElementRef<typeof AccordionPrimitive.Item>,
  ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn(
      'border-b bg-primary-lightest rounded-xl p-4 shadow-md m-3',
      className,
    )}
    {...props}
  />
));
AccordionItem.displayName = 'AccordionItem';

const AccordionTrigger = forwardRef<
  ElementRef<typeof AccordionPrimitive.Trigger>,
  AccordionTriggerProps
>(({ className, children, scheduleDate, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        'flex flex-1 items-center font-medium transition-all [&[data-state=open]>svg]:rotate-180',
        className,
      )}
      {...props}
    >
      {children}
      <div className="flex-1" />
      {/* display only scheduleDate is set*/}
      {scheduleDate && (
        <p className="text-sm leading-7 text-gray-500">{scheduleDate}</p>
      )}
      <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 ml-auto" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

const AccordionContent = forwardRef<
  ElementRef<typeof AccordionPrimitive.Content>,
  ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="overflow-hidden transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down bg-white rounded-xl mt-2"
    {...props}
  >
    <div className={cn('p-4', className)}>{children}</div>
  </AccordionPrimitive.Content>
));

AccordionContent.displayName = AccordionPrimitive.Content.displayName;
/**
   * display date on the right side of the accordion trigger
   *
   * @example
   * for example, the schedule is from 12/31 to 01/07
   * props.scheduleDate = "12/31-01/07"
   * 
   * for example, the schedule is not set
   * props.scheduleDate = ""
   * 
   *  <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger scheduleDate={""}>Bathroom
          <CircleEllipsis className='ml-4'/> 
          </AccordionTrigger >
          <AccordionContent>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
   */
export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
