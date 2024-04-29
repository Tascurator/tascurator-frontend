'use client';

import { forwardRef, ElementRef, ComponentPropsWithoutRef } from 'react';
import {
  Root,
  Trigger,
  Item,
  Header,
  Content,
} from '@radix-ui/react-accordion';
import { ChevronDown } from 'lucide-react';

import { cn } from '@/lib/utils';

/**
   * display date on the right side of the accordion trigger
   *
   * @example
   * for example, the schedule is from 12/31 to 01/07
   * props.scheduleDate = "12/31-01/07"
   * 
   *  <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger scheduleDate={"12/31-01/07"}>Bathroom
          <CircleEllipsis className='ml-4'/> 
          </AccordionTrigger >
          <AccordionContent>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
   */
const Accordion = Root;

type AccordionTriggerProps = {
  scheduleDate?: string;
} & ComponentPropsWithoutRef<typeof Trigger>;

const AccordionItem = forwardRef<
  ElementRef<typeof Item>,
  ComponentPropsWithoutRef<typeof Item>
>(({ className, ...props }, ref) => (
  <Item
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
  ElementRef<typeof Trigger>,
  AccordionTriggerProps
>(({ className, children, scheduleDate, ...props }, ref) => (
  <Header className="flex">
    <Trigger
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
        <p className="text-base leading-7 text-black">{scheduleDate}</p>
      )}
      <ChevronDown className="h-4 w-4 ml-1.5 shrink-0 transition-transform duration-200" />
    </Trigger>
  </Header>
));
AccordionTrigger.displayName = Trigger.displayName;

const AccordionContent = forwardRef<
  ElementRef<typeof Content>,
  ComponentPropsWithoutRef<typeof Content>
>(({ className, children, ...props }, ref) => (
  <Content
    ref={ref}
    className="overflow-hidden transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down bg-white rounded-xl mt-2"
    {...props}
  >
    <div className={cn('p-4', className)}>{children}</div>
  </Content>
));

AccordionContent.displayName = Content.displayName;

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
