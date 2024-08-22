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
 * Display date on the right side of the accordion trigger
 *
 * @example
 * // for example, the schedule is from 12/31 to 01/07
 * props.scheduleDate = "12/31-01/07"
 *
 * <Accordion type="single" collapsible className="w-full">
 *   <AccordionItem value="item-1">
 *
 *     // ScheduleDate
 *     <AccordionTrigger scheduleDate={"12/31-01/07"}>
 *        Bathroom
 *     </AccordionTrigger>
 *
 *     // CircleEllipsis
 *     <div className="flex items-center w-full">
 *       <AccordionTrigger>Bathroom</AccordionTrigger>
 *         <div className="flex justify-center items-center p-4 cursor-pointer">
 *           <CircleEllipsis />
 *         </div>
 *     </div>

 *     <AccordionContent>
 *        // content
 *     </AccordionContent>
 *   </AccordionItem>
 * </Accordion>
 */
const Accordion = Root;

type AccordionTriggerProps = {
  scheduleDate?: string;
} & ComponentPropsWithoutRef<typeof Trigger>;

/**
 * The AccordionItem component is used to create the container for the accordion trigger and content.
 * It should be used to wrap the AccordionTrigger and AccordionContent components.
 *
 * @example
 * <AccordionItem value="item-1">
 *   <AccordionTrigger>Bathroom</AccordionTrigger>
 *   <AccordionContent>
 *     // content
 *   </AccordionContent>
 * </AccordionItem>
 */
const AccordionItem = forwardRef<
  ElementRef<typeof Item>,
  ComponentPropsWithoutRef<typeof Item>
>(({ className, ...props }, ref) => (
  <Item
    ref={ref}
    className={cn(
      'border-b bg-primary-lightest rounded-xl shadow-md my-6',
      className,
    )}
    {...props}
  />
));
AccordionItem.displayName = 'AccordionItem';

/**
 * The AccordionTrigger component is used to create an accordion trigger.
 *
 * @example
 * <AccordionTrigger>Bathroom</AccordionTrigger>
 */
const AccordionTrigger = forwardRef<
  ElementRef<typeof Trigger>,
  AccordionTriggerProps
>(({ className, children, scheduleDate, ...props }, ref) => (
  <Header className="flex justify-center items-center w-full">
    <Trigger
      ref={ref}
      className={cn(
        'flex flex-1 justify-between items-center font-medium text-left p-4 transition-all [&[data-state=open]>svg]:rotate-180',
        className,
      )}
      {...props}
    >
      <ChevronDown className="h-4 w-4 mr-2 shrink-0 transition-transform duration-200" />
      {children}
      <div className="flex-1" />
      {/* display only scheduleDate is set*/}
      {scheduleDate && (
        <p className="text-sm leading-7 text-black">{scheduleDate}</p>
      )}
    </Trigger>
  </Header>
));
AccordionTrigger.displayName = Trigger.displayName;

/**
 * The AccordionContent component is used to place the content of the accordion that will be displayed when the trigger is clicked.
 *
 * @example
 * <AccordionContent>
 *   // content
 * </AccordionContent>
 */
const AccordionContent = forwardRef<
  ElementRef<typeof Content>,
  ComponentPropsWithoutRef<typeof Content>
>(({ className, children, ...props }, ref) => (
  <Content
    ref={ref}
    className="overflow-hidden transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down rounded-xl mt-2 mb-4 mx-4"
    {...props}
  >
    <div className={cn('p-4', className)}>{children}</div>
  </Content>
));

AccordionContent.displayName = Content.displayName;

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
